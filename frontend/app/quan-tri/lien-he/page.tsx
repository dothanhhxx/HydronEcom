import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { MessageManager } from "@/components/admin/MessageManager";

export const metadata: Metadata = {
  title: "Tin nhắn & Báo giá · Lam Trà Admin",
  description: "Quản lý liên hệ, yêu cầu báo giá quà doanh nghiệp và đánh giá sản phẩm",
};

export default function AdminMessagesPage() {
  return (
    <AdminShell>
      <MessageManager />
    </AdminShell>
  );
}
