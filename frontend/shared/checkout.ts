// Phí ship, mã giảm giá, tổng đơn và kiểm tra đơn. Server tính lại toàn bộ, không tin số từ trình duyệt.
// backend/src/shared/checkout.ts là bản sao, chỉ khác đuôi import.
import { isValidVariant, maxQtyOf, toItems, variantLabel } from "./catalog";
import type { Product } from "./types/product.types";
import type { CartItem, OrderInput, OrderTotals } from "./types/order.types";

export const formatVND = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";

/* ---------- Vận chuyển ---------- */

export type Region = "noi-tinh" | "bac" | "trung" | "nam";

// 34 tỉnh, thành sau sắp xếp đơn vị hành chính 2025. Phí tính từ kho Hà Nội.
export const PROVINCES: { name: string; region: Region }[] = [
  { name: "Hà Nội", region: "noi-tinh" },
  ...["Hải Phòng", "Quảng Ninh", "Bắc Ninh", "Hưng Yên", "Ninh Bình", "Phú Thọ", "Thái Nguyên", "Tuyên Quang", "Lào Cai", "Lạng Sơn", "Cao Bằng", "Điện Biên", "Lai Châu", "Sơn La"].map((name) => ({ name, region: "bac" as const })),
  ...["Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Trị", "Huế", "Đà Nẵng", "Quảng Ngãi", "Gia Lai", "Khánh Hòa", "Đắk Lắk", "Lâm Đồng"].map((name) => ({ name, region: "trung" as const })),
  ...["TP. Hồ Chí Minh", "Đồng Nai", "Tây Ninh", "Cần Thơ", "Vĩnh Long", "Đồng Tháp", "An Giang", "Cà Mau"].map((name) => ({ name, region: "nam" as const })),
];

export const SHIPPING_FEE: Record<Region, number> = { "noi-tinh": 20000, bac: 30000, trung: 35000, nam: 38000 };
export const SHIPPING_DAYS: Record<Region, string> = { "noi-tinh": "1 ngày", bac: "1 – 3 ngày", trung: "2 – 4 ngày", nam: "3 – 5 ngày" };
export const EXPRESS_FEE = 25000;
export const FREE_SHIP_MIN = 350000;
export const GIFT_WRAP_FEE = 25000;
export const GIFT_WRAP_FREE_MIN = 500000;
/** Đơn có in tên/sticker cần thêm thời gian in trước khi gửi */
export const CUSTOM_LEAD_TIME = "1 – 2 ngày";

export const regionOf = (province?: string) => PROVINCES.find((p) => p.name === province)?.region;

/* ---------- Mã giảm giá ---------- */

export type Coupon = { kind: "percent" | "amount" | "freeship"; value: number; min?: number; label: string };

export const COUPONS: Record<string, Coupon> = {
  HYDRON10: { kind: "percent", value: 10, label: "Giảm 10% cho đơn đầu tiên" },
  CHAOBAN30: { kind: "amount", value: 30000, min: 300000, label: "Giảm 30.000₫ cho đơn từ 300.000₫" },
  FREESHIP: { kind: "freeship", value: 0, min: 150000, label: "Miễn phí vận chuyển cho đơn từ 150.000₫" },
};

export const normalizeCode = (code: string) => code.trim().toUpperCase().replace(/\s+/g, "");

export function checkCoupon(code: string, subtotal: number): { ok: true; coupon: Coupon } | { ok: false; error: string } {
  const c = COUPONS[normalizeCode(code)];
  if (!c) return { ok: false, error: "Mã không hợp lệ hoặc đã hết hạn." };
  if (c.min && subtotal < c.min) return { ok: false, error: `Mã áp dụng cho đơn từ ${formatVND(c.min)}.` };
  return { ok: true, coupon: c };
}

/* ---------- Tổng đơn ---------- */

export type QuoteInput = { items: CartItem[]; coupon?: string; province?: string; express?: boolean; giftWrap?: boolean };
export type Quote = OrderTotals;

export function quote({ items, coupon, province, express, giftWrap }: QuoteInput): Quote {
  const subtotal = items.reduce((s, i) => s + i.total, 0);
  let discount = 0;
  let freeShip = subtotal >= FREE_SHIP_MIN;
  let couponError: string | undefined;
  let applied: string | undefined;
  if (coupon) {
    const r = checkCoupon(coupon, subtotal);
    if (r.ok) {
      applied = normalizeCode(coupon);
      if (r.coupon.kind === "percent") discount = Math.round((subtotal * r.coupon.value) / 100 / 1000) * 1000;
      else if (r.coupon.kind === "amount") discount = Math.min(subtotal, r.coupon.value);
      else freeShip = true;
    } else couponError = r.error;
  }
  const region = regionOf(province);
  const base = region ? SHIPPING_FEE[region] : SHIPPING_FEE["noi-tinh"];
  const shipping = subtotal === 0 ? 0 : (freeShip ? 0 : base) + (express ? EXPRESS_FEE : 0);
  const wrap = giftWrap && subtotal < GIFT_WRAP_FREE_MIN ? GIFT_WRAP_FEE : 0;
  return {
    subtotal,
    discount,
    shipping,
    shippingKnown: !!region || freeShip,
    giftWrap: wrap,
    total: Math.max(0, subtotal - discount + shipping + wrap),
    coupon: applied,
    couponError,
  };
}

/* ---------- Mã đơn & liên hệ ---------- */

// Không có I, O, 0, 1 để khách đọc mã qua điện thoại không nhầm.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const newOrderCode = () => "HD" + Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
export const isOrderCode = (s: string) => /^HD[A-HJ-NP-Z2-9]{6}$/.test(s);

export const normalizePhone = (s: string) => s.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0");
export const isPhone = (s: string) => /^0(3|5|7|8|9)\d{8}$/.test(normalizePhone(s));
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

/* ---------- Kiểm tra đơn ---------- */

export function validateOrder(o: OrderInput, products: Product[]): Record<string, string> {
  const e: Record<string, string> = {};
  if (!o.buyer?.name?.trim()) e["buyer.name"] = "Bạn cho Hydron xin họ tên.";
  if (!isPhone(o.buyer?.phone ?? "")) e["buyer.phone"] = "Số điện thoại chưa đúng, ví dụ 0912 345 678.";
  if (o.buyer?.email && !isEmail(o.buyer.email)) e["buyer.email"] = "Email chưa đúng định dạng.";
  if (o.recipient) {
    if (!o.recipient.name?.trim()) e["recipient.name"] = "Bạn cho xin tên người nhận.";
    if (!isPhone(o.recipient.phone ?? "")) e["recipient.phone"] = "Số điện thoại người nhận chưa đúng.";
  }
  if (!regionOf(o.province)) e.province = "Bạn chọn tỉnh, thành phố nhận hàng.";
  if ((o.address ?? "").trim().length < 8) e.address = "Bạn ghi rõ số nhà, đường, phường/xã.";
  if (o.payment !== "vietqr" && o.payment !== "cod") e.payment = "Bạn chọn cách thanh toán.";
  if ((o.gift?.message ?? "").length > 300) e["gift.message"] = "Lời nhắn tối đa 300 ký tự.";
  if ((o.note ?? "").length > 500) e.note = "Ghi chú tối đa 500 ký tự.";
  if (!toItems(o.lines ?? [], products).length) e.lines = "Giỏ hàng đang trống.";
  else {
    // Không âm thầm bỏ hoặc bớt sản phẩm: báo rõ món nào hết hàng / không đủ số lượng.
    const short = (o.lines ?? []).flatMap((l) => {
      const p = products.find((x) => x.slug === l.slug);
      if (!p || p.deleted || !isValidVariant(p, l.size, l.color)) return ["một sản phẩm không còn bán"];
      const max = maxQtyOf(p, l.size, l.color);
      if (max < 1) return [`${p.name} ${variantLabel(p, l.size, l.color)} đã hết hàng`];
      if (l.qty > max) return [`${p.name} ${variantLabel(p, l.size, l.color)} chỉ còn ${max}`];
      return [];
    });
    if (short.length) e.lines = `${short.join("; ")}. Bạn sửa lại giỏ hàng giúp Hydron nhé.`;
  }
  return e;
}
