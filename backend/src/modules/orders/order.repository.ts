import { JsonStore } from "../../infrastructure/persistence/json-store.js";
import type { Order, OrderStatus } from "../../shared/types/order.types.js";

export class OrderRepository {
  static async findAll(): Promise<Order[]> {
    const rawOrders = await JsonStore.readJsonl<Order>("orders.jsonl");
    const statusUpdates = await JsonStore.readJsonl<{
      code: string;
      status: OrderStatus;
      at: string;
      note?: string;
    }>("orders-status.jsonl");

    // Lấy trạng thái và ghi chú cập nhật mới nhất cho mỗi mã đơn
    const latestStatusMap = new Map<string, { status: OrderStatus; note?: string; at: string }>();
    for (const update of statusUpdates) {
      latestStatusMap.set(update.code, { status: update.status, note: update.note, at: update.at });
    }

    return rawOrders
      .map((order) => {
        const update = latestStatusMap.get(order.code);
        if (update) {
          return {
            ...order,
            status: update.status,
            internalNote: update.note || order.internalNote,
            updatedAt: update.at,
          };
        }
        return order;
      })
      .reverse(); // Đơn mới nhất lên đầu
  }

  static async findByCode(code: string): Promise<Order | null> {
    const all = await this.findAll();
    return all.find((o) => o.code === code) || null;
  }

  static async create(order: Order): Promise<void> {
    await JsonStore.appendJsonl("orders.jsonl", order);
  }

  static async updateStatus(code: string, status: OrderStatus, note?: string): Promise<void> {
    await JsonStore.appendJsonl("orders-status.jsonl", {
      code,
      status,
      note,
      at: new Date().toISOString(),
    });
  }

  static async recordPaymentClaim(code: string, phone: string): Promise<void> {
    await JsonStore.appendJsonl("payments.jsonl", {
      code,
      phone,
      paidClaimedAt: new Date().toISOString(),
    });
  }
}
