import { Client, Storage, TablesDB } from "node-appwrite";
import { ENV } from "../../config/env.js";

/** Bật khi đã cấu hình APPWRITE_PROJECT_ID + APPWRITE_API_KEY (ưu tiên hơn Supabase). */
export const appwriteEnabled = Boolean(ENV.APPWRITE_PROJECT_ID && ENV.APPWRITE_API_KEY);

/** Tên bảng trong database Appwrite (tạo bằng `npm run setup:appwrite`). */
export const AW_TABLES = { documents: "documents", records: "records" } as const;

let cached: { client: Client; db: TablesDB; storage: Storage } | null = null;

/** Client dùng API key (chỉ chạy ở backend, bỏ qua phân quyền). */
export function getAppwrite() {
  if (!appwriteEnabled) throw new Error("Appwrite chưa được cấu hình (APPWRITE_PROJECT_ID, APPWRITE_API_KEY).");
  if (!cached) {
    const client = new Client().setEndpoint(ENV.APPWRITE_ENDPOINT).setProject(ENV.APPWRITE_PROJECT_ID).setKey(ENV.APPWRITE_API_KEY);
    cached = { client, db: new TablesDB(client), storage: new Storage(client) };
  }
  return cached;
}

/** URL công khai xem ảnh trong bucket (bucket cấp quyền đọc cho mọi người). */
export function appwriteFileUrl(fileId: string): string {
  return `${ENV.APPWRITE_ENDPOINT}/storage/buckets/${ENV.APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${ENV.APPWRITE_PROJECT_ID}`;
}

/** ID dòng Appwrite: chỉ a-z A-Z 0-9 . - _, tối đa 36 ký tự, không bắt đầu bằng ký tự đặc biệt. */
export function toRowId(name: string): string {
  const id = name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^[^a-zA-Z0-9]+/, "");
  if (!id || id.length > 36) throw new Error(`Tên "${name}" không dùng làm ID Appwrite được`);
  return id;
}
