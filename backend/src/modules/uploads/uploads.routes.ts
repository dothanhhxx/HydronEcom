import type { FastifyPluginAsync } from "fastify";
import { adminAuthGuard } from "../../middleware/auth-guard.js";
import { FileStorage } from "../../infrastructure/storage/file-storage.js";

export const uploadsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/api/admin/upload", { preHandler: [adminAuthGuard] }, async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ ok: false, error: "Không tìm thấy file ảnh tải lên." });
      }

      if (!data.mimetype.startsWith("image/")) {
        return reply.status(400).send({
          ok: false,
          error: "File phải là định dạng hình ảnh (PNG, JPG, WEBP, ...).",
        });
      }

      const buffer = await data.toBuffer();
      if (buffer.length > 10 * 1024 * 1024) {
        return reply.status(400).send({ ok: false, error: "Dung lượng ảnh tối đa là 10MB." });
      }

      const { url, filename } = await FileStorage.saveFile(buffer, data.filename);
      return { ok: true, url, filename };
    } catch (err: any) {
      return reply.status(500).send({ ok: false, error: `Lỗi khi lưu ảnh: ${err.message}` });
    }
  });
};
