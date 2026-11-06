// Tính tiền, phí ship, mã giảm giá, kiểm tra đơn: dùng chung với backend qua @/shared.
export * from "@/shared/checkout";
export { keyOf, toItems } from "@/shared/catalog";
export type { CartItem, CartLine, Order, OrderInput, PaymentMethod as Payment } from "@/shared/types/order.types";

export const ORDER_STEPS = ["Đã đặt hàng", "Đã xác nhận", "Đang giao", "Hoàn thành"] as const;

export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())} · ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};
