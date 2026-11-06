// Tính tiền, phí ship, mã giảm giá và kiểm tra đơn. Dùng chung cho trình duyệt và API (server tính lại, không tin số từ client).
import { formatVND as fmt } from "./format";
import { getProduct, isValidVariant, maxQtyOf, priceOf, variantLabel } from "./products";

export type CartLine = { slug: string; size: string; grade: string; qty: number };
export type CartItem = CartLine & { key: string; name: string; ph: string; variant: string; unit: number; total: number; max: number };

export const keyOf = (l: Pick<CartLine, "slug" | "size" | "grade">) => `${l.slug}|${l.size}|${l.grade}`;

export function toItems(lines: CartLine[], customProducts?: import("./products").Product[]): CartItem[] {
  return lines.flatMap((l) => {
    const p = customProducts ? customProducts.find((x) => x.slug === l.slug) : getProduct(l.slug);
    if (!p || !isValidVariant(p, l.size, l.grade)) return [];
    const unit = priceOf(p, l.size, l.grade);
    const max = maxQtyOf(p, l.size, l.grade);
    const qty = Math.max(0, Math.min(max, Math.floor(l.qty)));
    if (qty < 1) return [];
    return [{ ...l, qty, key: keyOf(l), name: p.name, ph: p.ph, variant: variantLabel(p, l.size, l.grade), unit, total: unit * qty, max }];
  });
}

/* ---------- Vận chuyển ---------- */

export type Region = "noi-tinh" | "bac" | "trung" | "nam";

// 34 tỉnh, thành sau sắp xếp đơn vị hành chính 2025. Phí tính từ kho Tân Cương, Thái Nguyên.
export const PROVINCES: { name: string; region: Region }[] = [
  { name: "Thái Nguyên", region: "noi-tinh" },
  ...["Hà Nội", "Hải Phòng", "Quảng Ninh", "Bắc Ninh", "Hưng Yên", "Ninh Bình", "Phú Thọ", "Tuyên Quang", "Lào Cai", "Lạng Sơn", "Cao Bằng", "Điện Biên", "Lai Châu", "Sơn La"].map((name) => ({ name, region: "bac" as const })),
  ...["Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Trị", "Huế", "Đà Nẵng", "Quảng Ngãi", "Gia Lai", "Khánh Hòa", "Đắk Lắk", "Lâm Đồng"].map((name) => ({ name, region: "trung" as const })),
  ...["TP. Hồ Chí Minh", "Đồng Nai", "Tây Ninh", "Cần Thơ", "Vĩnh Long", "Đồng Tháp", "An Giang", "Cà Mau"].map((name) => ({ name, region: "nam" as const })),
];

export const SHIPPING_FEE: Record<Region, number> = { "noi-tinh": 15000, bac: 25000, trung: 30000, nam: 35000 };
export const SHIPPING_DAYS: Record<Region, string> = { "noi-tinh": "1 ngày", bac: "1 – 2 ngày", trung: "2 – 4 ngày", nam: "3 – 5 ngày" };
export const EXPRESS_FEE = 25000;
export const FREE_SHIP_MIN = 500000;
export const GIFT_WRAP_FEE = 20000;
export const GIFT_WRAP_FREE_MIN = 500000;

export const regionOf = (province?: string) => PROVINCES.find((p) => p.name === province)?.region;

/* ---------- Mã giảm giá ---------- */

type Coupon = { kind: "percent" | "amount" | "freeship"; value: number; min?: number; label: string };

// TODO GĐ3: chuyển sang quản lý trong trang admin (hạn dùng, số lượt).
export const COUPONS: Record<string, Coupon> = {
  LAMTRA10: { kind: "percent", value: 10, label: "Giảm 10% cho đơn đầu tiên" },
  CHAOBAN50: { kind: "amount", value: 50000, min: 400000, label: "Giảm 50.000₫ cho đơn từ 400.000₫" },
  MIENPHISHIP: { kind: "freeship", value: 0, min: 250000, label: "Miễn phí vận chuyển cho đơn từ 250.000₫" },
};

export const normalizeCode = (code: string) => code.trim().toUpperCase().replace(/\s+/g, "");

export function checkCoupon(code: string, subtotal: number): { ok: true; coupon: Coupon } | { ok: false; error: string } {
  const c = COUPONS[normalizeCode(code)];
  if (!c) return { ok: false, error: "Mã không hợp lệ hoặc đã hết hạn." };
  if (c.min && subtotal < c.min) return { ok: false, error: `Mã áp dụng cho đơn từ ${fmt(c.min)}.` };
  return { ok: true, coupon: c };
}

/* ---------- Tổng đơn ---------- */

export type QuoteInput = { items: CartItem[]; coupon?: string; province?: string; express?: boolean; giftWrap?: boolean };
export type Quote = {
  subtotal: number;
  discount: number;
  shipping: number;
  /** false khi chưa chọn tỉnh nên phí ship chưa xác định */
  shippingKnown: boolean;
  giftWrap: number;
  total: number;
  coupon?: string;
  couponError?: string;
};

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
  const base = region ? SHIPPING_FEE[region] : SHIPPING_FEE.bac;
  const shipping = subtotal === 0 ? 0 : (freeShip ? 0 : base) + (express ? EXPRESS_FEE : 0);
  const wrap = giftWrap && subtotal < GIFT_WRAP_FREE_MIN ? GIFT_WRAP_FEE : 0;
  return {
    subtotal, discount, shipping, shippingKnown: !!region || freeShip, giftWrap: wrap,
    total: Math.max(0, subtotal - discount + shipping + wrap), coupon: applied, couponError,
  };
}

/* ---------- Đơn hàng ---------- */

export type Payment = "vietqr" | "cod";

export type OrderInput = {
  /** Mã đơn tạo sẵn ở trang đặt hàng để khách ghi vào nội dung chuyển khoản */
  code?: string;
  lines: CartLine[];
  buyer: { name: string; phone: string; email?: string };
  /** Người nhận khác người mua (đơn quà tặng) */
  recipient?: { name: string; phone: string };
  province: string;
  address: string;
  express: boolean;
  gift?: { wrap: boolean; message?: string; hidePrice: boolean };
  payment: Payment;
  coupon?: string;
  note?: string;
};

// Không có I, O, 0, 1 để khách đọc mã qua điện thoại không nhầm.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const newOrderCode = () => "LT" + Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
export const isOrderCode = (s: string) => /^LT[A-HJ-NP-Z2-9]{6}$/.test(s);

export const ORDER_STEPS = ["Đã đặt hàng", "Đã xác nhận", "Đang giao", "Hoàn thành"] as const;

export type Order = OrderInput & {
  code: string;
  createdAt: string;
  items: CartItem[];
  totals: Quote;
  /** Chỉ số trong ORDER_STEPS; -1 = đã hủy */
  status: number;
  paidClaimedAt?: string;
};

export const normalizePhone = (s: string) => s.replace(/[\s.\-()]/g, "").replace(/^\+84/, "0");
export const isPhone = (s: string) => /^0(3|5|7|8|9)\d{8}$/.test(normalizePhone(s));
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export function validateOrder(o: OrderInput, customProducts?: import("./products").Product[]): Record<string, string> {
  const e: Record<string, string> = {};
  if (!o.buyer?.name?.trim()) e["buyer.name"] = "Bạn cho Lam Trà xin họ tên.";
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
  if (!toItems(o.lines ?? [], customProducts).length) e.lines = "Giỏ hàng đang trống.";
  else {
    // Không âm thầm bỏ hoặc bớt sản phẩm: báo rõ món nào hết hàng / không đủ số lượng.
    const short = (o.lines ?? []).flatMap((l) => {
      const p = customProducts ? customProducts.find((x) => x.slug === l.slug) : getProduct(l.slug);
      if (!p || !isValidVariant(p, l.size, l.grade)) return ["một sản phẩm không còn bán"];
      const max = maxQtyOf(p, l.size, l.grade);
      if (max < 1) return [`${p.name} ${variantLabel(p, l.size, l.grade)} đã hết hàng`];
      if (l.qty > max) return [`${p.name} ${variantLabel(p, l.size, l.grade)} chỉ còn ${max}`];
      return [];
    });
    if (short.length) e.lines = `${short.join("; ")}. Bạn sửa lại giỏ hàng giúp Lam Trà nhé.`;
  }
  return e;
}

export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())} · ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};
