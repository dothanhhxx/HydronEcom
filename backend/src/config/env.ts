import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(BACKEND_ROOT, ".env") });

export const ENV = {
  BACKEND_ROOT,
  PORT: Number(process.env.PORT) || 4000,
  HOST: process.env.HOST || "0.0.0.0",
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  WEBHOOK_URL: process.env.HYDRON_WEBHOOK_URL || process.env.LAMTRA_WEBHOOK_URL || "",
  DATA_DIR: process.env.DATA_DIR || path.resolve(BACKEND_ROOT, "data"),
  UPLOADS_DIR: process.env.UPLOADS_DIR || path.resolve(BACKEND_ROOT, "uploads"),
  // Có đủ 2 biến này thì dữ liệu + ảnh lưu lên Supabase; thiếu thì dùng file trong DATA_DIR / UPLOADS_DIR như cũ.
  // Chỉ lấy gốc https://<id>.supabase.co: bỏ "/rest/v1" (hay bị copy nhầm từ trang Data API) và "/" cuối,
  // vì client tự nối /rest/v1, /storage/v1 — dư đường dẫn sẽ báo "Invalid path specified in request URL".
  SUPABASE_URL: (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "").replace(/\/(rest|storage|auth)\/v1$/, ""),
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET || "products",
  // Appwrite Cloud: có PROJECT_ID + API_KEY thì dùng Appwrite (ưu tiên hơn Supabase).
  // Endpoint lấy ở Appwrite Console → Settings, vd. https://sgp.cloud.appwrite.io/v1 (bỏ "/" cuối).
  APPWRITE_ENDPOINT: (process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1").trim().replace(/\/+$/, ""),
  APPWRITE_PROJECT_ID: (process.env.APPWRITE_PROJECT_ID || "").trim(),
  APPWRITE_API_KEY: (process.env.APPWRITE_API_KEY || "").trim(),
  APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID || "hydron",
  APPWRITE_BUCKET_ID: process.env.APPWRITE_BUCKET_ID || "products",
};
