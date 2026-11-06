import type { FastifyPluginAsync } from "fastify";
import { adminAuthGuard } from "../../middleware/auth-guard.js";
import { OrderService } from "./order.service.js";
import type { OrderInput, OrderStatus } from "../../shared/types/order.types.js";
import { normalizePhone } from "../../shared/checkout.js";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function sanitizeOrderInput(b: Record<string, any>): OrderInput {
  const lines = Array.isArray(b.lines) ? b.lines.slice(0, 50) : [];
  return {
    code: str(b.code, 12).toUpperCase() || undefined,
    lines: lines.map((l: any) => ({
      slug: str(l?.slug, 80),
      size: str(l?.size, 4),
      grade: str(l?.grade, 4),
      qty: Number(l?.qty) || 0,
    })),
    buyer: {
      name: str(b.buyer?.name, 80),
      phone: normalizePhone(str(b.buyer?.phone, 20)),
      email: str(b.buyer?.email, 120) || undefined,
    },
    recipient: b.recipient
      ? { name: str(b.recipient.name, 80), phone: normalizePhone(str(b.recipient.phone, 20)) }
      : undefined,
    province: str(b.province, 40),
    address: str(b.address, 300),
    express: !!b.express,
    gift: b.gift
      ? { wrap: !!b.gift.wrap, message: str(b.gift.message, 300) || undefined, hidePrice: !!b.gift.hidePrice }
      : undefined,
    payment: b.payment === "cod" ? "cod" : "vietqr",
    coupon: str(b.coupon, 30) || undefined,
    note: str(b.note, 500) || undefined,
  };
}

export const ordersRoutes: FastifyPluginAsync = async (fastify) => {
  // Public: Đặt hàng mới
  fastify.post("/api/orders", async (request, reply) => {
    const body = (request.body as Record<string, any>) || {};
    if (body.website) {
      return reply.status(400).send({ error: "Bị chặn." });
    }

    const input = sanitizeOrderInput(body);
    const result = await OrderService.createOrder(input);

    if (!result.ok) {
      return reply.status(422).send({ errors: result.errors });
    }

    return { order: result.order };
  });

  // Public: Tra cứu đơn hàng (hỗ trợ cả /api/orders và /api/orders/lookup, hỗ trợ tham số ma/sdt hoặc code/phone)
  const lookupHandler = async (request: any, reply: any) => {
    const query = (request.query as Record<string, string>) || {};
    const code = str(query.ma || query.code, 20).toUpperCase();
    const phone = normalizePhone(str(query.sdt || query.phone, 20));

    if (!code || !phone) {
      return reply.status(400).send({ error: "Thiếu mã đơn hoặc số điện thoại." });
    }

    const order = await OrderService.lookupOrder(code, phone);
    if (!order) {
      return reply.status(404).send({ error: "Không tìm thấy đơn hàng." });
    }

    return { order };
  };

  fastify.get("/api/orders", lookupHandler);
  fastify.get("/api/orders/lookup", lookupHandler);

  // Public: Khách xác nhận đã thanh toán VietQR
  fastify.patch("/api/orders", async (request, reply) => {
    const body = (request.body as Record<string, any>) || {};
    const code = str(body.code, 20).toUpperCase();
    const phone = normalizePhone(str(body.phone, 20));

    if (!code || !phone) {
      return reply.status(400).send({ error: "Thiếu thông tin xác nhận." });
    }

    await OrderService.claimPayment(code, phone);
    return { ok: true, code, phone, paidClaimedAt: new Date().toISOString() };
  });

  // Admin: Lấy danh sách đơn hàng và thống kê
  fastify.get("/api/admin/orders", { preHandler: [adminAuthGuard] }, async (request) => {
    const query = (request.query as Record<string, string>) || {};
    const statusParam = query.status;
    const search = query.search || undefined;
    const status = statusParam !== undefined && statusParam !== "" ? (Number(statusParam) as OrderStatus) : undefined;

    const [orders, metrics] = await Promise.all([
      OrderService.getOrdersForAdmin({ status, search }),
      OrderService.getMetrics(),
    ]);

    return {
      ok: true,
      orders,
      metrics,
    };
  });

  // Admin: Cập nhật trạng thái đơn hàng
  fastify.patch("/api/admin/orders", { preHandler: [adminAuthGuard] }, async (request, reply) => {
    const body = (request.body as { code?: string; status?: number; note?: string }) || {};
    const { code, status, note } = body;

    if (!code || status === undefined) {
      return reply.status(400).send({ ok: false, error: "Thiếu mã đơn hoặc trạng thái mới." });
    }

    const result = await OrderService.updateOrderStatusByAdmin(code, status as OrderStatus, note);
    if (!result.ok) {
      return reply.status(404).send({ ok: false, error: result.error });
    }

    return { ok: true, order: result.order };
  });
};
