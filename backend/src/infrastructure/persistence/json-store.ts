import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ENV } from "../../config/env.js";
import { AppwriteException, ID, Query } from "node-appwrite";
import { getSupabase, supabaseEnabled } from "../supabase/client.js";
import { appwriteEnabled, AW_TABLES, getAppwrite, toRowId } from "../appwrite/client.js";

/**
 * Kho dữ liệu dạng tài liệu JSON. Giữ nguyên API cũ cho các repository:
 * - Khi có Appwrite (ưu tiên): file `.json` → bảng `documents` (ID dòng = tên file, cột `data` là chuỗi JSON),
 *   file `.jsonl` → bảng `records` (cột `stream` + `data`, giữ thứ tự thêm vào). Tạo bảng: `npm run setup:appwrite`.
 * - Khi có Supabase: file `.json` → bảng `documents` (1 dòng/file), file `.jsonl` → bảng `records` (1 dòng/bản ghi, theo thứ tự thêm).
 * - Khi không có: đọc/ghi file trong DATA_DIR như trước (tiện chạy local).
 * Lược đồ bảng: backend/supabase/schema.sql
 */
const PAGE = 1000; // PostgREST trả tối đa 1000 dòng mỗi lần
const AW_PAGE = 500;

const isNotFound = (err: unknown) => err instanceof AppwriteException && err.code === 404;
const awDb = () => ({ db: getAppwrite().db, databaseId: ENV.APPWRITE_DATABASE_ID });

function fail(action: string, error: { message: string }): never {
  throw new Error(`[JsonStore] ${action}: ${error.message}`);
}

export class JsonStore {
  private static async ensureDir(): Promise<void> {
    await mkdir(ENV.DATA_DIR, { recursive: true }).catch(() => {});
  }

  static getFilePath(filename: string): string {
    return path.join(ENV.DATA_DIR, filename);
  }

  static async readJson<T>(filename: string, fallback: T): Promise<T> {
    if (appwriteEnabled) {
      const { db, databaseId } = awDb();
      try {
        const row = await db.getRow({ databaseId, tableId: AW_TABLES.documents, rowId: toRowId(filename) });
        return JSON.parse(row.data as string) as T;
      } catch (err) {
        if (isNotFound(err)) return fallback;
        throw new Error(`[JsonStore] đọc ${filename}: ${(err as Error).message}`);
      }
    }
    if (supabaseEnabled) {
      const { data, error } = await getSupabase().from("documents").select("data").eq("name", filename).maybeSingle();
      if (error) fail(`đọc ${filename}`, error);
      return data ? (data.data as T) : fallback;
    }
    await this.ensureDir();
    try {
      const content = await readFile(this.getFilePath(filename), "utf8");
      return JSON.parse(content) as T;
    } catch {
      return fallback;
    }
  }

  static async writeJson<T>(filename: string, data: T): Promise<void> {
    if (appwriteEnabled) {
      const { db, databaseId } = awDb();
      await db
        .upsertRow({ databaseId, tableId: AW_TABLES.documents, rowId: toRowId(filename), data: { data: JSON.stringify(data) } })
        .catch((err: Error) => fail(`ghi ${filename}`, err));
      return;
    }
    if (supabaseEnabled) {
      const { error } = await getSupabase()
        .from("documents")
        .upsert({ name: filename, data, updated_at: new Date().toISOString() });
      if (error) fail(`ghi ${filename}`, error);
      return;
    }
    await this.ensureDir();
    const content = JSON.stringify(data, null, 2);
    await writeFile(this.getFilePath(filename), content, "utf8");
  }

  static async readJsonl<T>(filename: string): Promise<T[]> {
    if (appwriteEnabled) {
      const { db, databaseId } = awDb();
      const rows: T[] = [];
      let cursor: string | undefined;
      try {
        for (;;) {
          // Không sắp xếp riêng: Appwrite trả theo thứ tự thêm vào ($sequence), phân trang bằng con trỏ.
          const queries = [Query.equal("stream", filename), Query.limit(AW_PAGE)];
          if (cursor) queries.push(Query.cursorAfter(cursor));
          const page = await db.listRows({ databaseId, tableId: AW_TABLES.records, queries, total: false });
          rows.push(...page.rows.map((r) => JSON.parse(r.data as string) as T));
          if (page.rows.length < AW_PAGE) break;
          cursor = page.rows[page.rows.length - 1].$id;
        }
      } catch (err) {
        fail(`đọc ${filename}`, err as Error);
      }
      return rows;
    }
    if (supabaseEnabled) {
      const rows: T[] = [];
      for (let from = 0; ; from += PAGE) {
        const { data, error } = await getSupabase()
          .from("records")
          .select("data")
          .eq("stream", filename)
          .order("id", { ascending: true })
          .range(from, from + PAGE - 1);
        if (error) fail(`đọc ${filename}`, error);
        rows.push(...(data ?? []).map((r) => r.data as T));
        if (!data || data.length < PAGE) break;
      }
      return rows;
    }
    await this.ensureDir();
    try {
      const raw = await readFile(this.getFilePath(filename), "utf8");
      return raw
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line) as T);
    } catch {
      return [];
    }
  }

  static async appendJsonl(filename: string, record: object): Promise<void> {
    if (appwriteEnabled) {
      const { db, databaseId } = awDb();
      await db
        .createRow({ databaseId, tableId: AW_TABLES.records, rowId: ID.unique(), data: { stream: filename, data: JSON.stringify(record) } })
        .catch((err: Error) => fail(`ghi ${filename}`, err));
      return;
    }
    if (supabaseEnabled) {
      const { error } = await getSupabase().from("records").insert({ stream: filename, data: record });
      if (error) fail(`ghi ${filename}`, error);
      return;
    }
    await this.ensureDir();
    await appendFile(this.getFilePath(filename), JSON.stringify(record) + "\n", "utf8");
  }

  /** Truy vấn nhẹ để kiểm tra kết nối (dùng cho /api/health, giữ database không bị tạm dừng). */
  static async ping(): Promise<"appwrite" | "supabase" | "file"> {
    if (appwriteEnabled) {
      const { db, databaseId } = awDb();
      await db
        .listRows({ databaseId, tableId: AW_TABLES.documents, queries: [Query.limit(1)], total: false })
        .catch((err: Error) => fail("ping", err));
      return "appwrite";
    }
    if (!supabaseEnabled) return "file";
    const { error } = await getSupabase().from("documents").select("name", { head: true, count: "exact" }).limit(1);
    if (error) fail("ping", error);
    return "supabase";
  }
}
