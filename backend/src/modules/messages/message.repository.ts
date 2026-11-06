import { JsonStore } from "../../infrastructure/persistence/json-store.js";
import type { ContactMessage, MessageStatus } from "../../shared/types/contact.types.js";

export class MessageRepository {
  static async findAll(): Promise<ContactMessage[]> {
    const rawMessages = await JsonStore.readJsonl<ContactMessage>("messages.jsonl");
    const statusUpdates = await JsonStore.readJsonl<{
      id: string;
      status: MessageStatus;
      adminNote?: string;
      at: string;
    }>("messages-status.jsonl");

    const statusMap = new Map<string, { status: MessageStatus; adminNote?: string; at: string }>();
    for (const u of statusUpdates) {
      statusMap.set(u.id, { status: u.status, adminNote: u.adminNote, at: u.at });
    }

    return rawMessages
      .map((msg, index) => {
        const id = msg.id || `MSG-${msg.createdAt.replace(/[-:T.Z]/g, "").slice(0, 14)}-${index + 1}`;
        const update = statusMap.get(id);

        return {
          ...msg,
          id,
          status: update?.status || msg.status || "pending",
          adminNote: update?.adminNote !== undefined ? update.adminNote : msg.adminNote,
          updatedAt: update?.at || msg.updatedAt,
        };
      })
      .reverse();
  }

  static async updateStatus(id: string, status: MessageStatus, adminNote?: string): Promise<void> {
    await JsonStore.appendJsonl("messages-status.jsonl", {
      id,
      status,
      adminNote,
      at: new Date().toISOString(),
    });
  }

  static async create(msg: ContactMessage): Promise<void> {
    await JsonStore.appendJsonl("messages.jsonl", msg);
  }
}
