/**
 * Chuyển dữ liệu đang có trong backend/data + ảnh trong backend/uploads lên Supabase (chạy 1 lần).
 *
 *   npm run migrate:supabase --workspace backend            # bỏ qua luồng .jsonl đã có dữ liệu
 *   npm run migrate:supabase --workspace backend -- --force # nạp lại cả luồng đã có (có thể trùng bản ghi)
 *
 * Cần SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY trong backend/.env và đã chạy backend/supabase/schema.sql.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { ENV } from "../config/env.js";
import { getSupabase, supabaseEnabled } from "../infrastructure/supabase/client.js";
import { FileStorage } from "../infrastructure/storage/file-storage.js";

const force = process.argv.includes("--force");
const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" };

async function listFiles(dir: string): Promise<string[]> {
  try {
    return (await readdir(dir, { withFileTypes: true })).filter((d) => d.isFile()).map((d) => d.name);
  } catch {
    return [];
  }
}

async function main() {
  if (!supabaseEnabled) {
    console.error("✖ Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong backend/.env");
    process.exitCode = 1;
    return;
  }
  const db = getSupabase();

  // 1. Ảnh: /uploads/<file> → URL công khai trên Supabase Storage
  const urlMap = new Map<string, string>();
  for (const name of await listFiles(ENV.UPLOADS_DIR)) {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (!MIME[ext]) continue;
    const buf = await readFile(path.join(ENV.UPLOADS_DIR, name));
    urlMap.set(`/uploads/${name}`, await FileStorage.putObject(name, buf, MIME[ext]));
    console.log(`  ảnh  ${name}`);
  }
  const rewrite = (text: string) => {
    for (const [from, to] of urlMap) text = text.split(from).join(to);
    return text;
  };

  const files = await listFiles(ENV.DATA_DIR);

  // 2. File .json → bảng documents (ghi đè theo tên)
  for (const name of files.filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(rewrite(await readFile(path.join(ENV.DATA_DIR, name), "utf8")));
    const { error } = await db.from("documents").upsert({ name, data, updated_at: new Date().toISOString() });
    if (error) throw new Error(`${name}: ${error.message}`);
    console.log(`  json  ${name}`);
  }

  // 3. File .jsonl → bảng records (giữ thứ tự dòng)
  for (const name of files.filter((f) => f.endsWith(".jsonl"))) {
    const { count, error: countErr } = await db.from("records").select("id", { head: true, count: "exact" }).eq("stream", name);
    if (countErr) throw new Error(`${name}: ${countErr.message}`);
    if (count && !force) {
      console.log(`  bỏ qua ${name} (đã có ${count} bản ghi, thêm --force để nạp lại)`);
      continue;
    }
    const rows = rewrite(await readFile(path.join(ENV.DATA_DIR, name), "utf8"))
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => ({ stream: name, data: JSON.parse(l) }));
    for (let i = 0; i < rows.length; i += 500) {
      const { error } = await db.from("records").insert(rows.slice(i, i + 500));
      if (error) throw new Error(`${name}: ${error.message}`);
    }
    console.log(`  jsonl ${name} (${rows.length} bản ghi)`);
  }

  console.log("✔ Xong. Khởi động lại backend để dùng Supabase.");
}

// Đặt exitCode thay vì process.exit(): trên Windows (Node 24) thoát cứng khi còn kết nối mở sẽ crash libuv.
main().catch((err) => {
  console.error("✖", err.message);
  process.exitCode = 1;
});
