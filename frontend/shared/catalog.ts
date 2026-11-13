// Giá, biến thể (dung tích × màu) và phần tự thiết kế.
// Dùng chung cho trình duyệt và backend (backend/src/shared/catalog.ts là bản sao, chỉ khác đuôi import).
import type { ColorOption, Customization, FontId, Product } from "./types/product.types";
import type { CartItem, CartLine } from "./types/order.types";

export const MAX_QTY = 99;
export const LOW_STOCK = 5;

/** Chênh lệch giá chuẩn so với dung tích nhỏ nhất, dùng khi sản phẩm không đặt giá riêng. */
export const SIZE_DELTA: Record<string, number> = { "500": 0, "700": 20000, "900": 40000 };

/** Bảng dung tích hiển thị ở trang sản phẩm. */
export const SIZE_INFO: Record<string, { height: string; diameter: string; weight: string; fits: string }> = {
  "500": { height: "22,5 cm", diameter: "7,2 cm", weight: "320 g", fits: "Túi xách, hộc xe máy, bàn học" },
  "700": { height: "25,8 cm", diameter: "7,8 cm", weight: "390 g", fits: "Ba lô đi làm, đi học cả ngày" },
  "900": { height: "28,6 cm", diameter: "8,6 cm", weight: "460 g", fits: "Phòng gym, đi phượt, dùng chung" },
};

export const sizeLabel = (s: string) => (s === "-" ? "Một cỡ" : `${s}ml`);

/* ---------- Tự thiết kế ---------- */

export const CUSTOM_TEXT_FEE = 30000;
export const CUSTOM_STICKER_FEE = 20000;
export const CUSTOM_TEXT_MAX = 14;

export const FONTS: { id: FontId; label: string }[] = [
  { id: "block", label: "Khối" },
  { id: "round", label: "Tròn" },
  { id: "script", label: "Viết tay" },
];

export const INKS: { id: string; label: string }[] = [
  { id: "#FFFFFF", label: "Trắng" },
  { id: "#0B2A36", label: "Đen mực" },
  { id: "#C8A15A", label: "Nhũ vàng" },
  { id: "#0688AE", label: "Xanh Hydron" },
  { id: "#E0603A", label: "Cam san hô" },
];

/** id sticker hợp lệ (hình vẽ nằm ở frontend/components/bottle/stickers.ts). */
export const STICKERS: { id: string; label: string }[] = [
  // Cổ điển & Tối giản
  { id: "song", label: "Sóng" },
  { id: "la", label: "Lá" },
  { id: "nui", label: "Núi" },
  { id: "sao", label: "Sao" },
  { id: "tim", label: "Tim" },
  { id: "set", label: "Tia sét" },
  { id: "mat-troi", label: "Mặt trời" },
  { id: "giot", label: "Giọt nước" },
  { id: "hinh-hoc", label: "Vòm cong" },
  // Linh vật & Thú cưng
  { id: "cho", label: "Cún cưng" },
  { id: "meo", label: "Mèo" },
  { id: "gau", label: "Gấu" },
  { id: "tho", label: "Thỏ" },
  { id: "capybara", label: "Capybara" },
  { id: "gau-truc", label: "Gấu trúc" },
  { id: "ho", label: "Hổ" },
  { id: "chim-canh-cut", label: "Chim cánh cụt" },
  { id: "khung-long", label: "Khủng long" },
  // Thể thao & Bóng đá
  { id: "bong-da", label: "Bóng đá" },
  { id: "cup", label: "Cúp" },
  { id: "ao-dau", label: "Áo đấu" },
  { id: "giay-da-bong", label: "Giày đinh" },
  { id: "khung-thanh", label: "Khung thành" },
  { id: "bong-ro", label: "Bóng rổ" },
  { id: "bong-chuyen", label: "Bóng chuyền" },
  { id: "tennis", label: "Tennis" },
  { id: "chay-bo", label: "Chạy bộ" },
  { id: "dap-xe", label: "Đạp xe" },
  { id: "gym", label: "Gym" },
  // Gaming
  { id: "tay-cam", label: "Tay cầm" },
  { id: "ban-phim", label: "Bàn phím" },
  { id: "chuot", label: "Chuột" },
  { id: "pixel-heart", label: "Tim 8-bit" },
  { id: "level-up", label: "Level Up" },
  // Ẩm thực
  { id: "ca-phe", label: "Cà phê" },
  { id: "tra-sua", label: "Trà sữa" },
  { id: "burger", label: "Burger" },
  { id: "pizza", label: "Pizza" },
  { id: "donut", label: "Donut" },
  { id: "kem", label: "Kem" },
  // Cute
  { id: "hoa", label: "Hoa" },
  { id: "may", label: "Mây" },
  { id: "cau-vong", label: "Cầu vồng" },
  { id: "mat-cuoi", label: "Mặt cười" },
  { id: "lap-lanh", label: "Lấp lánh" },
  // Cool
  { id: "lua", label: "Ngọn lửa" },
  { id: "dau-lau", label: "Đầu lâu" },
  { id: "doi-canh", label: "Đôi cánh" },
  { id: "vuong-mien", label: "Vương miện" },
  // Âm nhạc
  { id: "tai-nghe", label: "Tai nghe" },
  { id: "micro", label: "Micro" },
  { id: "guitar", label: "Guitar" },
  { id: "not-nhac", label: "Nốt nhạc" },
  { id: "loa", label: "Loa" },
  // Du lịch
  { id: "may-bay", label: "Máy bay" },
  { id: "may-anh", label: "Máy ảnh" },
  { id: "bai-bien", label: "Bãi biển" },
  { id: "la-ban", label: "La bàn" },
  // Vũ trụ
  { id: "hanh-tinh", label: "Hành tinh" },
  { id: "mat-trang", label: "Mặt trăng" },
  { id: "ten-lua", label: "Tên lửa" },
  { id: "phi-hanh-gia", label: "Phi hành gia" },
];

/** Làm sạch phần thiết kế: cắt độ dài, chỉ nhận font/màu mực/sticker có trong danh sách. */
export function normalizeCustom(c: Partial<Customization> | undefined, p?: Pick<Product, "customizable">): Customization | undefined {
  if (!c || (p && !p.customizable)) return undefined;
  const text = String(c.text ?? "")
    .replace(/[\u0000-\u001F\u007F<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, CUSTOM_TEXT_MAX);
  const number = String(c.number ?? "")
    .replace(/[^0-9A-Za-z#]/g, "")
    .trim()
    .slice(0, 4);
  const sticker = c.sticker && STICKERS.some((s) => s.id === c.sticker) ? c.sticker : undefined;
  const uploadedImage = c.uploadedImage && typeof c.uploadedImage === "string" ? c.uploadedImage : undefined;
  const layers = Array.isArray(c.layers) && c.layers.length > 0 ? c.layers : undefined;

  if (!text && !number && !sticker && !uploadedImage && (!layers || layers.length === 0)) return undefined;

  const font = FONTS.some((f) => f.id === c.font) ? (c.font as FontId) : "block";
  const numberFont = FONTS.some((f) => f.id === c.numberFont) ? (c.numberFont as FontId) : font;
  const ink = INKS.some((i) => i.id === c.ink) ? (c.ink as string) : (c.ink || INKS[0].id);

  return {
    text,
    font,
    ink,
    ...(number ? { number, numberFont } : {}),
    ...(sticker ? { sticker } : {}),
    ...(uploadedImage ? { uploadedImage, uploadedImageStyle: c.uploadedImageStyle } : {}),
    ...(layers ? { layers } : {}),
  };
}

export const customFee = (c?: Customization) => {
  if (!c) return 0;
  let fee = 0;
  if (c.text || c.number) fee += CUSTOM_TEXT_FEE;
  if (c.sticker || c.uploadedImage || (c.layers && c.layers.length > 0)) fee += CUSTOM_STICKER_FEE;
  return fee;
};

export function customLabel(c?: Customization) {
  if (!c) return undefined;
  const parts: string[] = [];
  if (c.text) parts.push(`In “${c.text}” (${FONTS.find((f) => f.id === c.font)?.label ?? "Khối"}, ${INKS.find((i) => i.id === c.ink)?.label ?? "Trắng"})`);
  if (c.number) parts.push(`Số “${c.number}”`);
  if (c.sticker) parts.push(`Sticker ${STICKERS.find((s) => s.id === c.sticker)?.label ?? c.sticker}`);
  if (c.uploadedImage) parts.push(`Ảnh riêng (${c.uploadedImageStyle ?? "AI Sticker"})`);
  if (c.layers && c.layers.length > 0) parts.push(`${c.layers.length} chi tiết`);
  return parts.join(" · ");
}

const customKey = (c?: Customization) =>
  c ? [c.text, c.font, c.ink, c.sticker ?? "", c.number ?? "", c.uploadedImageStyle ?? "", c.layers?.length ?? 0].join("~") : "";

/* ---------- Biến thể ---------- */

export const defaultSize = (p: Pick<Product, "sizes">) => p.sizes[0] ?? "-";
export const defaultColor = (p: Pick<Product, "colors">) => p.colors[0]?.id ?? "-";
export const colorOf = (p: Pick<Product, "colors">, id: string): ColorOption | undefined => p.colors.find((c) => c.id === id);

export function sizePrice(p: Pick<Product, "base" | "sizes" | "sizePrices">, size: string) {
  if (!p.sizes.length) return p.base;
  return p.sizePrices?.[size] ?? p.base + (SIZE_DELTA[size] ?? 0);
}

/** Đơn giá một biến thể, đã cộng phí tự thiết kế. */
export function priceOf(p: Product, size = defaultSize(p), custom?: Customization) {
  return sizePrice(p, size) + customFee(custom);
}

/** Giá trước khuyến mãi của một dung tích, nếu sản phẩm đang giảm giá. */
export function compareAtOf(p: Product, size = defaultSize(p)) {
  if (!p.compareAt || p.compareAt <= p.base) return undefined;
  return p.compareAt + (sizePrice(p, size) - p.base);
}

/** Giá thấp nhất – cao nhất trên các dung tích, để hiển thị "từ …". */
export function priceRange(p: Product): [number, number] {
  const all = (p.sizes.length ? p.sizes : ["-"]).map((s) => sizePrice(p, s));
  return [Math.min(...all), Math.max(...all)];
}

export const variantKey = (size: string, color: string) => `${size}|${color}`;

export function variantLabel(p: Product, size: string, color: string) {
  const parts: string[] = [];
  if (p.sizes.length) parts.push(sizeLabel(size));
  const c = colorOf(p, color);
  if (c) parts.push(c.name);
  return parts.join(" · ") || "Một cỡ";
}

/** Số lượng còn lại, hoặc undefined nếu còn nhiều. */
export const stockOf = (p: Product, size: string, color: string) => p.stock?.[variantKey(size, color)];

/** Số lượng tối đa được đặt cho một biến thể. */
export const maxQtyOf = (p: Product, size = defaultSize(p), color = defaultColor(p)) => Math.min(MAX_QTY, stockOf(p, size, color) ?? MAX_QTY);

export const isValidVariant = (p: Product, size: string, color: string) =>
  (p.sizes.length ? p.sizes.includes(size) : size === "-") && (p.colors.length ? p.colors.some((c) => c.id === color) : color === "-");

export const keyOf = (l: Pick<CartLine, "slug" | "size" | "color" | "custom">) => `${l.slug}|${l.size}|${l.color}|${customKey(l.custom)}`;

export function toItems(lines: CartLine[], products: Product[]): CartItem[] {
  return lines.flatMap((l) => {
    const p = products.find((x) => x.slug === l.slug);
    if (!p || p.deleted || !isValidVariant(p, l.size, l.color)) return [];
    const custom = normalizeCustom(l.custom, p);
    const unit = priceOf(p, l.size, custom);
    const max = maxQtyOf(p, l.size, l.color);
    const qty = Math.max(0, Math.min(max, Math.floor(l.qty)));
    if (qty < 1) return [];
    const line: CartLine = { slug: l.slug, size: l.size, color: l.color, qty, ...(custom ? { custom } : {}) };
    return [
      {
        ...line,
        key: keyOf(line),
        name: p.name,
        ph: p.ph,
        variant: variantLabel(p, l.size, l.color),
        hex: colorOf(p, l.color)?.hex ?? "#0688AE",
        shape: p.shape,
        customLabel: customLabel(custom),
        unit,
        total: unit * qty,
        max,
      },
    ];
  });
}

/** Số lượng còn lại thấp nhất trên mọi biến thể, để hiện "Sắp hết". */
export function totalStockLow(p: Product) {
  const vals = Object.values(p.stock ?? {});
  return vals.length > 0 && vals.every((v) => v <= LOW_STOCK);
}
