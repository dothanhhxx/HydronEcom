import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ENV } from "../../config/env.js";
import { getSupabase, supabaseEnabled } from "../supabase/client.js";

/**
 * Kho dữ liệu dạng tài liệu JSON. Giữ nguyên API cũ cho các repository:
 * - Khi có Supabase: file `.json` → bảng `documents` (1 dòng/file), file `.jsonl` → bảng `records` (1 dòng/bản ghi, theo thứ tự thêm).
 * - Khi không có: đọc/ghi file trong DATA_DIR như trước (tiện chạy local).
 * Lược đồ bảng: backend/supabase/schema.sql
 */
const PAGE = 1000; // PostgREST trả tối đa 1000 dòng mỗi lần

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
    if (supabaseEnabled) {
      const { error } = await getSupabase().from("records").insert({ stream: filename, data: record });
      if (error) fail(`ghi ${filename}`, error);
      return;
    }
    await this.ensureDir();
    await appendFile(this.getFilePath(filename), JSON.stringify(record) + "\n", "utf8");
  }

  /** Truy vấn nhẹ để kiểm tra kết nối (dùng cho /api/health, giữ Supabase không bị tạm dừng). */
  static async ping(): Promise<"supabase" | "file"> {
    if (!supabaseEnabled) return "file";
    const { error } = await getSupabase().from("documents").select("name", { head: true, count: "exact" }).limit(1);
    if (error) fail("ping", error);
    return "supabase";
  }
}
