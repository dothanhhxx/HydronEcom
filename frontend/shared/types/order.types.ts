// Shared Order Types - Dùng chung cho cả Client Storefront, Admin và Server Services
import type { Customization, Shape } from "./product.types";

export type CartLine = {
  slug: string;
  /** Dung tích "500" | "700" | "900", hoặc "-" với phụ kiện một cỡ */
  size: string;
  /** id màu, hoặc "-" nếu sản phẩm không có màu */
  color: string;
  qty: number;
  /** Thiết kế riêng của khách (in tên/số, sticker) */
  custom?: Customization;
};

export type CartItem = CartLine & {
  key: string;
  name: string;
  ph: string;
  variant: string;
  /** Mã màu để dựng ảnh khi chưa có ảnh chụp */
  hex: string;
  shape: Shape;
  customLabel?: string;
  unit: number;
  total: number;
  max: number;
};

export type PaymentMethod = "vietqr" | "cod";

export type BuyerInfo = {
  name: string;
  phone: string;
  email?: string;
};

export type RecipientInfo = {
  name: string;
  phone: string;
};

export type GiftOption = {
  wrap: boolean;
  message?: string;
  hidePrice: boolean;
};

export type OrderInput = {
  code?: string;
  lines: CartLine[];
  buyer: BuyerInfo;
  recipient?: RecipientInfo;
  province: string;
  address: string;
  express: boolean;
  gift?: GiftOption;
  payment: PaymentMethod;
  coupon?: string;
  note?: string;
};

export type OrderTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  shippingKnown: boolean;
  giftWrap: number;
  total: number;
  coupon?: string;
  couponError?: string;
};

export type OrderStatus = 0 | 1 | 2 | 3 | -1;

export type Order = OrderInput & {
  code: string;
  createdAt: string;
  updatedAt?: string;
  items: CartItem[];
  totals: OrderTotals;
  /**
   * 0: Mới đặt (Chờ xác nhận)
   * 1: Đã xác nhận (Đã nhận tiền VietQR / chốt đơn COD) — với đơn in tên: bắt đầu in
   * 2: Đang giao hàng
   * 3: Hoàn thành (Đã nhận hàng)
   * -1: Đã hủy
   */
  status: OrderStatus;
  paidClaimedAt?: string;
  internalNote?: string;
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
