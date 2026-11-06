import { ENV } from "../../config/env.js";
import { getSupabase, supabaseEnabled } from "../supabase/client.js";
import { LocalDiskStorage } from "./local-disk.js";

const MIME: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" };

/** Lưu ảnh sản phẩm: lên Supabase Storage (link CDN công khai) nếu đã cấu hình, ngược lại vào thư mục uploads/. */
export class FileStorage {
  static async saveFile(buffer: Buffer, originalName: string): Promise<{ url: string; filename: string }> {
    if (!supabaseEnabled) return LocalDiskStorage.saveFile(buffer, originalName);

    const ext = (originalName.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const filename = `product_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    return { url: await this.putObject(filename, buffer, MIME[ext] || "application/octet-stream"), filename };
  }

  /** Đẩy 1 file lên bucket và trả về URL công khai. */
  static async putObject(filename: string, buffer: Buffer, contentType: string): Promise<string> {
    const bucket = getSupabase().storage.from(ENV.SUPABASE_BUCKET);
    const { error } = await bucket.upload(filename, buffer, { contentType, cacheControl: "31536000", upsert: true });
    if (error) throw new Error(`[FileStorage] tải ${filename}: ${error.message}`);
    return bucket.getPublicUrl(filename).data.publicUrl;
  }
}
