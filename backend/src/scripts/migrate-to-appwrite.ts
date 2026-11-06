/**
 * Chuyển dữ liệu đang có trong backend/data + ảnh trong backend/uploads lên Appwrite (chạy 1 lần).
 *
 *   npm run migrate:appwrite --workspace backend            # bỏ qua luồng .jsonl đã có dữ liệu
 *   npm run migrate:appwrite --workspace backend -- --force # nạp lại cả luồng đã có (có thể trùng bản ghi)
 *
 * Cần cấu hình Appwrite trong backend/.env và đã chạy `npm run setup:appwrite`.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { ENV } from "../config/env.js";
import { appwriteEnabled } from "../infrastructure/appwrite/client.js";
import { JsonStore } from "../infrastructure/persistence/json-store.js";
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
  if (!appwriteEnabled) {
    console.error("✖ Thiếu APPWRITE_PROJECT_ID hoặc APPWRITE_API_KEY trong backend/.env");
    process.exitCode = 1;
    return;
  }

  // 1. Ảnh: /uploads/<file> → URL công khai trên Appwrite Storage
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
    await JsonStore.writeJson(name, JSON.parse(rewrite(await readFile(path.join(ENV.DATA_DIR, name), "utf8"))));
    console.log(`  json  ${name}`);
  }

  // 3. File .jsonl → bảng records (giữ thứ tự dòng)
  for (const name of files.filter((f) => f.endsWith(".jsonl"))) {
    const existing = (await JsonStore.readJsonl(name)).length;
    if (existing && !force) {
      console.log(`  bỏ qua ${name} (đã có ${existing} bản ghi, thêm --force để nạp lại)`);
      continue;
    }
    const lines = rewrite(await readFile(path.join(ENV.DATA_DIR, name), "utf8"))
      .split("\n")
      .filter((l) => l.trim());
    // Ghi tuần tự để giữ đúng thứ tự thêm vào.
    for (const line of lines) await JsonStore.appendJsonl(name, JSON.parse(line));
    console.log(`  jsonl ${name} (${lines.length} bản ghi)`);
  }

  console.log("✔ Xong. Khởi động lại backend để dùng Appwrite.");
}

// Đặt exitCode thay vì process.exit(): trên Windows (Node 24) thoát cứng khi còn kết nối mở sẽ crash libuv.
main().catch((err) => {
  console.error("✖", err.message);
  process.exitCode = 1;
});
