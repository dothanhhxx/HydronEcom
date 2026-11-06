import { OrderRepository } from "./order.repository.js";
import { NotificationService } from "../notifications/notification.service.js";
import { ProductService } from "../products/product.service.js";
import type { Order, OrderInput, OrderStatus } from "../../shared/types/order.types.js";
import {
  isOrderCode,
  newOrderCode,
  normalizePhone,
  quote,
  toItems,
  validateOrder,
} from "../../shared/checkout.js";

export type OrderListFilter = {
  status?: OrderStatus;
  search?: string;
  limit?: number;
};

export type OrderMetrics = {
  totalOrders: number;
  totalRevenue: number;
  pendingCount: number;
  confirmedCount: number;
  shippingCount: number;
  completedCount: number;
  cancelledCount: number;
};

export class OrderService {
  /** Tạo đơn hàng mới từ Storefront */
  static async createOrder(
    input: OrderInput
  ): Promise<{ ok: true; order: Order } | { ok: false; errors: Record<string, string> }> {
    const liveProducts = await ProductService.getAllProducts(true);
    const errors = validateOrder(input, liveProducts);
    if (Object.keys(errors).length > 0) {
      return { ok: false, errors };
    }

    const items = toItems(input.lines, liveProducts);
    const totals = quote({
      items,
      coupon: input.coupon,
      province: input.province,
      express: input.express,
      giftWrap: input.gift?.wrap,
    });

    const allOrders = await OrderRepository.findAll();
    const takenCodes = new Set(allOrders.map((o) => o.code));

    // Đảm bảo mã đơn duy nhất
    const code =
      input.code && isOrderCode(input.code) && !takenCodes.has(input.code)
        ? input.code
        : newOrderCode();

    const order: Order = {
      ...input,
      lines: items.map(({ slug, size, grade, qty }) => ({ slug, size, grade, qty })),
      coupon: totals.coupon,
      code,
      createdAt: new Date().toISOString(),
      items,
      totals,
      status: 0, // Mới đặt
    };

    await OrderRepository.create(order);
    await NotificationService.notify("order.created", order);

    return { ok: true, order };
  }

  /** Khách tra cứu đơn hàng bằng Mã + Số điện thoại */
  static async lookupOrder(code: string, phone: string): Promise<Order | null> {
    const cleanCode = code.trim().toUpperCase();
    const cleanPhone = normalizePhone(phone.trim());

    const all = await OrderRepository.findAll();
    return (
      all.find(
        (o) =>
          o.code === cleanCode &&
          (normalizePhone(o.buyer.phone) === cleanPhone ||
            (o.recipient && normalizePhone(o.recipient.phone) === cleanPhone))
      ) || null
    );
  }

  /** Khách báo đã chuyển khoản VietQR */
  static async claimPayment(code: string, phone: string): Promise<boolean> {
    const cleanCode = code.trim().toUpperCase();
    const cleanPhone = normalizePhone(phone.trim());

    await OrderRepository.recordPaymentClaim(cleanCode, cleanPhone);
    await NotificationService.notify("payment.claimed", { code: cleanCode, phone: cleanPhone });
    return true;
  }

  /** Admin: Lấy danh sách đơn hàng có lọc và tìm kiếm */
  static async getOrdersForAdmin(filter?: OrderListFilter): Promise<Order[]> {
    let orders = await OrderRepository.findAll();

    if (filter?.status !== undefined) {
      orders = orders.filter((o) => o.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o.code.toLowerCase().includes(q) ||
          o.buyer.name.toLowerCase().includes(q) ||
          o.buyer.phone.includes(q) ||
          (o.recipient && o.recipient.name.toLowerCase().includes(q)) ||
          (o.recipient && o.recipient.phone.includes(q))
      );
    }

    if (filter?.limit && filter.limit > 0) {
      orders = orders.slice(0, filter.limit);
    }

    return orders;
  }

  /** Admin: Cập nhật trạng thái và ghi chú nội bộ */
  static async updateOrderStatusByAdmin(
    code: string,
    status: OrderStatus,
    note?: string
  ): Promise<{ ok: boolean; order?: Order; error?: string }> {
    const order = await OrderRepository.findByCode(code);
    if (!order) {
      return { ok: false, error: "Không tìm thấy đơn hàng." };
    }

    await OrderRepository.updateStatus(code, status, note);
    const updated = await OrderRepository.findByCode(code);

    await NotificationService.notify("order.status_updated", {
      code,
      previousStatus: order.status,
      newStatus: status,
      note,
    });

    return { ok: true, order: updated || undefined };
  }

  /** Admin: Thống kê số liệu đơn hàng và doanh thu */
  static async getMetrics(): Promise<OrderMetrics> {
    const all = await OrderRepository.findAll();

    let totalRevenue = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let shippingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;

    for (const o of all) {
      if (o.status !== -1) {
        totalRevenue += o.totals.total || 0;
      }
      if (o.status === 0) pendingCount++;
      else if (o.status === 1) confirmedCount++;
      else if (o.status === 2) shippingCount++;
      else if (o.status === 3) completedCount++;
      else if (o.status === -1) cancelledCount++;
    }

    return {
      totalOrders: all.length,
      totalRevenue,
      pendingCount,
      confirmedCount,
      shippingCount,
      completedCount,
      cancelledCount,
    };
  }
}
