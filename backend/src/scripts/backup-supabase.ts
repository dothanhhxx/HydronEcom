/**
 * Sao lưu dữ liệu Supabase về máy (gói free không có bản sao lưu tải về được).
 *
 *   npm run backup:supabase --workspace backend
 *
 * Ghi ra backend/backups/<YYYY-MM-DD>/ đúng định dạng cũ (products.json, orders.jsonl, …), nên khôi phục vào
 * một project trống bằng: DATA_DIR=backups/<ngày> npm run migrate:supabase --workspace backend
 * Ảnh vẫn nằm trong Supabase Storage (bucket products), script này không tải ảnh về.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ENV } from "../config/env.js";
import { getSupabase, supabaseEnabled } from "../infrastructure/supabase/client.js";

const PAGE = 1000;

async function main() {
  if (!supabaseEnabled) {
    console.error("✖ Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong backend/.env");
    process.exitCode = 1;
    return;
  }
  const db = getSupabase();
  const dir = path.join(ENV.BACKEND_ROOT, "backups", new Date().toISOString().slice(0, 10));
  await mkdir(dir, { recursive: true });

  const { data: docs, error: docErr } = await db.from("documents").select("name, data");
  if (docErr) throw new Error(`documents: ${docErr.message}`);
  for (const d of docs ?? []) {
    await writeFile(path.join(dir, d.name), JSON.stringify(d.data, null, 2), "utf8");
    console.log(`  json  ${d.name}`);
  }

  const streams = new Map<string, string[]>();
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db.from("records").select("stream, data").order("id", { ascending: true }).range(from, from + PAGE - 1);
    if (error) throw new Error(`records: ${error.message}`);
    for (const r of data ?? []) {
      if (!streams.has(r.stream)) streams.set(r.stream, []);
      streams.get(r.stream)!.push(JSON.stringify(r.data));
    }
    if (!data || data.length < PAGE) break;
  }
  for (const [name, lines] of streams) {
    await writeFile(path.join(dir, name), lines.join("\n") + "\n", "utf8");
    console.log(`  jsonl ${name} (${lines.length} bản ghi)`);
  }

  console.log(`✔ Đã sao lưu vào ${dir}`);
}

main().catch((err) => {
  console.error("✖", err.message);
  process.exitCode = 1;
});
