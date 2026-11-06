import type { FastifyPluginAsync } from "fastify";
import { adminAuthGuard } from "../../middleware/auth-guard.js";
import { MessageService } from "./message.service.js";
import type { ContactType, MessageStatus } from "../../shared/types/contact.types.js";
import { isEmail, isPhone, normalizePhone } from "../../shared/checkout.js";

const TYPES = ["lien-he", "bao-gia", "danh-gia"] as const;
type Kind = (typeof TYPES)[number];

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const messagesRoutes: FastifyPluginAsync = async (fastify) => {
  // Public: Gửi liên hệ, yêu cầu báo giá hoặc đánh giá sản phẩm
  fastify.post("/api/contact", async (request, reply) => {
    const b = (request.body as Record<string, any>) || {};
    if (b.website) {
      return reply.status(400).send({ error: "Bị chặn." });
    }

    const type = (TYPES as readonly string[]).includes(b.type) ? (b.type as Kind) : "lien-he";
    const rec = {
      type,
      name: str(b.name, 80),
      phone: normalizePhone(str(b.phone, 20)),
      email: str(b.email, 120),
      company: str(b.company, 120),
      quantity: str(b.quantity, 40),
      budget: str(b.budget, 40),
      date: str(b.date, 40),
      product: str(b.product, 80),
      stars: Math.max(1, Math.min(5, Number(b.stars) || 5)),
      message: str(b.message, 2000),
      createdAt: new Date().toISOString(),
    };

    const errors: Record<string, string> = {};
    if (!rec.name) errors.name = "Bạn cho Lam Trà xin tên.";
    if (type === "danh-gia") {
      if (rec.message.length < 10) errors.message = "Bạn viết thêm vài dòng cảm nhận nhé.";
    } else {
      if (!isPhone(rec.phone) && !isEmail(rec.email)) {
        errors.phone = "Bạn để lại số điện thoại hoặc email để Lam Trà liên lạc.";
      }
      if (type === "lien-he" && rec.message.length < 5) {
        errors.message = "Bạn ghi nội dung cần hỏi nhé.";
      }
    }

    if (Object.keys(errors).length > 0) {
      return reply.status(422).send({ errors });
    }

    await MessageService.createMessage(rec as any);
    return { ok: true };
  });

  // Admin: Lấy danh sách tin nhắn và thống kê
  fastify.get("/api/admin/messages", { preHandler: [adminAuthGuard] }, async (request) => {
    const query = (request.query as Record<string, string>) || {};
    const typeParam = query.type;
    const statusParam = query.status;
    const search = query.search || undefined;

    const type = typeParam ? (typeParam as ContactType) : undefined;
    const status = statusParam ? (statusParam as MessageStatus) : undefined;

    const [messages, metrics] = await Promise.all([
      MessageService.getMessages({ type, status, search }),
      MessageService.getMetrics(),
    ]);

    return {
      ok: true,
      messages,
      metrics,
    };
  });

  // Admin: Cập nhật trạng thái tin nhắn
  fastify.patch("/api/admin/messages", { preHandler: [adminAuthGuard] }, async (request, reply) => {
    const body = (request.body as { id?: string; status?: MessageStatus; adminNote?: string }) || {};
    const { id, status, adminNote } = body;

    if (!id || !status) {
      return reply.status(400).send({ ok: false, error: "Thiếu ID hoặc trạng thái mới." });
    }

    const result = await MessageService.updateStatus(id, status, adminNote);
    if (!result.ok) {
      return reply.status(400).send({ ok: false, error: result.error });
    }

    return { ok: true };
  });
};
