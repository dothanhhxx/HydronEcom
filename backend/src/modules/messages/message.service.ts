import { MessageRepository } from "./message.repository.js";
import { NotificationService } from "../notifications/notification.service.js";
import type { ContactMessage, ContactType, MessageMetrics, MessageStatus } from "../../shared/types/contact.types.js";

export type MessageFilter = {
  type?: ContactType;
  status?: MessageStatus;
  search?: string;
};

export class MessageService {
  static async createMessage(msg: ContactMessage): Promise<void> {
    await MessageRepository.create(msg);
    await NotificationService.notify(msg.type, msg);
  }

  static async getMessages(filter?: MessageFilter): Promise<ContactMessage[]> {
    let list = await MessageRepository.findAll();

    if (filter?.type) {
      list = list.filter((m) => m.type === filter.type);
    }

    if (filter?.status) {
      list = list.filter((m) => m.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.phone.includes(q) ||
          (m.email && m.email.toLowerCase().includes(q)) ||
          (m.company && m.company.toLowerCase().includes(q)) ||
          m.message.toLowerCase().includes(q)
      );
    }

    return list;
  }

  static async updateStatus(
    id: string,
    status: MessageStatus,
    adminNote?: string
  ): Promise<{ ok: boolean; error?: string }> {
    if (!id) return { ok: false, error: "Thiếu ID tin nhắn." };
    await MessageRepository.updateStatus(id, status, adminNote);
    return { ok: true };
  }

  static async getMetrics(): Promise<MessageMetrics> {
    const list = await MessageRepository.findAll();

    let pendingCount = 0;
    let quoteCount = 0;
    let reviewCount = 0;
    let contactedCount = 0;

    for (const m of list) {
      if (m.status === "pending") pendingCount++;
      if (m.status === "contacted") contactedCount++;
      if (m.type === "bao-gia") quoteCount++;
      if (m.type === "danh-gia") reviewCount++;
    }

    return {
      totalMessages: list.length,
      pendingCount,
      quoteCount,
      reviewCount,
      contactedCount,
    };
  }
}
