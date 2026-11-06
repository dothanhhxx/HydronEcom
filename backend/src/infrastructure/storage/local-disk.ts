import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ENV } from "../../config/env.js";

export class LocalDiskStorage {
  private static async ensureDir(): Promise<void> {
    await mkdir(ENV.UPLOADS_DIR, { recursive: true }).catch(() => {});
  }

  static async saveFile(buffer: Buffer, originalName: string): Promise<{ url: string; filename: string }> {
    await this.ensureDir();
    const ext = (originalName.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `product_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const targetPath = path.join(ENV.UPLOADS_DIR, filename);

    await writeFile(targetPath, buffer);
    return {
      url: `/uploads/${filename}`,
      filename,
    };
  }
}
