import { ENV } from "../../config/env.js";

export class NotificationService {
  /** Gửi thông báo sự kiện qua Webhook tới Google Sheet, Telegram Bot, Zalo OA */
  static async notify(type: string, payload: object): Promise<boolean> {
    const url = ENV.LAMTRA_WEBHOOK_URL;
    if (!url) return false;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          at: new Date().toISOString(),
          payload,
        }),
        signal: AbortSignal.timeout(6000),
      });
      return res.ok;
    } catch (e) {
      console.error("[NotificationService] Webhook error:", e);
      return false;
    }
  }
}
