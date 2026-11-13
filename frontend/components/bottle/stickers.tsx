// Hình sticker in lên bình, khung 24×24. Dùng chung cho ảnh dựng SVG, canvas 3D và nút chọn.
// id phải khớp với STICKERS trong shared/catalog.ts.
export type StickerArt = { d: string; mode: "fill" | "stroke" };

const el = (cx: number, cy: number, rx: number, ry = rx) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

export const STICKER_ART: Record<string, StickerArt> = {
  // --- Thể thao (Sports) ---
  "bong-ro": {
    mode: "stroke",
    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0v20M2 12h20M4.93 4.93a10 10 0 0 1 14.14 14.14M4.93 19.07a10 10 0 0 0 14.14-14.14",
  },
  "bong-chuyen": {
    mode: "stroke",
    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0c3 3 4 7 4 10s-1 7-4 10M2 12c3-3 7-4 10-4s7 1 10 4M6.3 6.3c4 1 8 4 10 8",
  },
  tennis: {
    mode: "stroke",
    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-6.5 3.5a10 10 0 0 1 13 13M18.5 5.5a10 10 0 0 0-13 13",
  },
  "chay-bo": {
    mode: "fill",
    d: "M2 17h14l4-3 2 1-3 4H2zm3-4c1-3 3-5 6-5h4l3 3h-5l-3 2z",
  },
  "dap-xe": {
    mode: "stroke",
    d: "M5.5 17.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm13 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 14h6.5l3-5H9M12 9l2.5 5h4M14 6h3",
  },
  gym: {
    mode: "fill",
    d: "M6 5h2v14H6zm10 0h2v14h-2zM3 8h2v8H3zm16 0h2v8h-2zM8 11h8v2H8z",
  },

  // --- Bóng đá (Football) ---
  "bong-da": {
    mode: "stroke",
    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 6 3 2.2-1.2 3.8h-3.6L9 10.2zm0-6v4M12 22v-4M2.5 9l3.8 1.2M21.5 9l-3.8 1.2M5 18l3-2M19 18l-3-2",
  },
  cup: {
    mode: "fill",
    d: "M5 3h14v3a7 7 0 0 1-6 6.9V17h4v2H7v-2h4v-4.1A7 7 0 0 1 5 6zm-2 2h2v4a3 3 0 0 1-2-2.8zm18 0h-2v4a3 3 0 0 0 2-2.8z",
  },
  "ao-dau": {
    mode: "fill",
    d: "M9 2 6 5 2 4l2 6 3-1v11h10V9l3 1 2-6-4 1-3-3a4 4 0 0 1-6 0z",
  },
  "giay-da-bong": {
    mode: "fill",
    d: "M3 15h14l4-3 1 1-3 4H3zm1 3h2v2H4zm5 0h2v2H9zm5 0h2v2h-2z",
  },
  "khung-thanh": {
    mode: "stroke",
    d: "M3 6h18v14M3 11h18M3 16h18M7 6v14M12 6v14M17 6v14",
  },

  // --- Động vật (Animals & Mascots) ---
  cho: {
    mode: "fill",
    d: "M12 4a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v2l3-1v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3l3 1v-2a2 2 0 0 0-2-2h-2V9a5 5 0 0 0-5-5zm-2 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-2 4a2 1 0 0 1 0-2 2 1 0 0 1 0 2z",
  },
  meo: {
    mode: "fill",
    d: "M4 21C2.5 17 3 12.5 4.5 10L4 2.5l5.5 4.3c1.7-.4 3.3-.4 5 0L20 2.5l-.5 7.5c1.5 2.5 2 7 .5 11-4 1.6-12 1.6-16 0ZM7.2 14q1.8 1.8 3.6 0-1.8 1-3.6 0ZM13.2 14q1.8 1.8 3.6 0-1.8 1-3.6 0ZM11 16.6h2l-1 1.1Z",
  },
  gau: {
    mode: "fill",
    d: [el(12, 13.6, 7.4), el(5, 5.6, 2.7), el(19, 5.6, 2.7), el(9.2, 12.4, 1.05), el(14.8, 12.4, 1.05), el(12, 16.3, 2.9, 2.2), el(12, 15.5, 1.1, 0.8)].join(""),
  },
  tho: {
    mode: "fill",
    d: [el(12, 16, 6.4), el(8.8, 5.6, 1.9, 4.4), el(15.2, 5.6, 1.9, 4.4), el(8.8, 6, 0.8, 2.8), el(15.2, 6, 0.8, 2.8), el(9.6, 15.4, 0.95), el(14.4, 15.4, 0.95), el(12, 17.6, 0.8, 0.6)].join(""),
  },
  capybara: {
    mode: "fill",
    d: ["M8.5 6.5h7a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5h-7a5 5 0 0 1-5-5v-4a5 5 0 0 1 5-5Z", el(6.4, 4.6, 1.7), el(17.6, 4.6, 1.7), el(8.4, 11.5, 1), el(15.6, 11.5, 1), el(10.3, 16.5, 0.7, 1), el(13.7, 16.5, 0.7, 1)].join(""),
  },
  "gau-truc": {
    mode: "fill",
    d: [el(12, 13.4, 7.6), el(5.2, 5.4, 2.6), el(18.8, 5.4, 2.6), el(8.8, 12.8, 2.3, 2.9), el(15.2, 12.8, 2.3, 2.9), el(9.1, 12.4, 0.9), el(14.9, 12.4, 0.9), el(12, 17, 1.2, 0.85)].join(""),
  },
  ho: {
    mode: "stroke",
    d: "M12 4a7 7 0 0 0-7 7v4a7 7 0 0 0 14 0v-4a7 7 0 0 0-7-7zM3 8a3 3 0 0 1 3-3M21 8a3 3 0 0 0-3-3M12 4v4M9 6l2 3M15 6l-2 3M9 13h.01M15 13h.01M12 15l-1 2h2z",
  },
  "chim-canh-cut": {
    mode: "fill",
    d: "M12 2C8 2 6 6 6 12c0 4 1 8 6 8s6-4 6-8c0-6-2-10-6-10zm-2 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-2 3 2 1-2 1zM4 14l2-3v4zm16 0-2-3v4zM8 21h3v1H8zm5 0h3v1h-3z",
  },
  "khung-long": {
    mode: "fill",
    d: "M20 5h-4a4 4 0 0 0-4 4v2H7a4 4 0 0 0-4 4v2h2v4h2v-4h4v4h2v-5l5-3h2V9a4 4 0 0 0-2-4zm-4 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z",
  },

  // --- Gaming ---
  "tay-cam": {
    mode: "stroke",
    d: "M6 12h4M8 10v4M15 11h.01M18 13h.01M6.5 19H4a2 2 0 0 1-2-2V9a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a2 2 0 0 1-2 2h-2.5L15 15H9z",
  },
  "ban-phim": {
    mode: "stroke",
    d: "M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm2 4h.01M10 9h.01M14 9h.01M18 9h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 15h8",
  },
  chuot: {
    mode: "stroke",
    d: "M12 3a6 6 0 0 0-6 6v6a6 6 0 0 0 12 0V9a6 6 0 0 0-6-6zm0 0v5",
  },
  "pixel-heart": {
    mode: "fill",
    d: "M5 4h4v2H5zm10 0h4v2h-4zM3 6h8v2H3zm10 0h8v2h-8zM1 8h22v6H1zm2 6h18v2H3zm2 2h14v2H5zm2 2h10v2H7zm2 2h6v2H9zm2 2h2v2h-2z",
  },
  "level-up": {
    mode: "stroke",
    d: "M12 19V5M5 12l7-7 7 7M5 21h14",
  },

  // --- Đồ ăn & Đồ uống (Food & Drink) ---
  "ca-phe": {
    mode: "stroke",
    d: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 2v3M10 2v3M14 2v3",
  },
  "tra-sua": {
    mode: "stroke",
    d: "M7 8h10l-1.5 12a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2L7 8zM5 8h14M13 2l-2 6M9 16h.01M12 17h.01M14 15h.01M10 19h.01M13 19h.01",
  },
  burger: {
    mode: "fill",
    d: "M12 3C6.5 3 4 6 4 8h16c0-2-2.5-5-8-5zM3 10h18v2H3zm1 4c0 1 1 2 2 2h12c1 0 2-1 2-2H4zm-1 4h18v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2z",
  },
  pizza: {
    mode: "stroke",
    d: "M12 2 2 20a15 15 0 0 0 20 0zM8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  },
  donut: {
    mode: "stroke",
    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 7a3 3 0 1 0 3 3 3 3 0 0 0-3-3z",
  },
  kem: {
    mode: "stroke",
    d: "M12 2a5 5 0 0 0-5 5c0 1 .5 2 1 3l4 12 4-12c.5-1 1-2 1-3a5 5 0 0 0-5-5z",
  },

  // --- Dễ thương (Cute) ---
  tim: {
    mode: "fill",
    d: "M12 21.2 3.6 12.9A5.4 5.4 0 0 1 11.2 5.3l.8.8.8-.8a5.4 5.4 0 0 1 7.6 7.6Z",
  },
  sao: {
    mode: "fill",
    d: "M12 1.8l3.1 6.5 7.1.9-5.2 4.9 1.3 7.1L12 17.8l-6.3 3.4L7 14.1 1.8 9.2l7.1-.9Z",
  },
  hoa: {
    mode: "fill",
    d: "M12 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-4 4a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm8 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm-4 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  },
  may: {
    mode: "fill",
    d: "M19 18H6a4 4 0 0 1-.5-8 5 5 0 0 1 9.5-2 4.5 4.5 0 0 1 4 4.5 3.5 3.5 0 0 1 0 5.5z",
  },
  "cau-vong": {
    mode: "stroke",
    d: "M4 19a8 8 0 0 1 16 0M7 19a5 5 0 0 1 10 0M10 19a2 2 0 0 1 4 0",
  },
  "mat-cuoi": {
    mode: "stroke",
    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-3 7h.01M15 9h.01M8 14a5 5 0 0 0 8 0",
  },
  "lap-lanh": {
    mode: "fill",
    d: "M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2zm6 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z",
  },

  // --- Cực chất (Cool) ---
  lua: {
    mode: "fill",
    d: "M12 2c-.5 3-3 5-3 8a5 5 0 0 0 10 0c0-4-3-6-4-8a1 1 0 0 0-3 0zm0 10a2 2 0 0 1 2 2 2 2 0 0 1-4 0c0-1.2 1-1.8 2-2z",
  },
  set: {
    mode: "fill",
    d: "M13.6 1.5 3.8 13.6h6.6l-1.6 8.9 10.4-12.6h-6.8Z",
  },
  "dau-lau": {
    mode: "fill",
    d: "M12 2a8 8 0 0 0-8 8c0 3 1.5 5.5 4 6.8V20h8v-3.2c2.5-1.3 4-3.8 4-6.8a8 8 0 0 0-8-8zm-3 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-4 5h2v2h-2z",
  },
  "doi-canh": {
    mode: "stroke",
    d: "M2 10c4-6 12-6 20 0-4 2-8 3-10 8-2-5-6-6-10-8zm5 1c3-3 8-3 10 0",
  },
  "vuong-mien": {
    mode: "fill",
    d: "M3 18h18l-2-12-5 5-2-7-2 7-5-5zM3 20h18v2H3z",
  },

  // --- Âm nhạc (Music) ---
  "tai-nghe": {
    mode: "stroke",
    d: "M3 14h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1v-6a10 10 0 0 1 20 0v6a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2",
  },
  micro: {
    mode: "stroke",
    d: "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm7 9a7 7 0 0 1-14 0M12 18v4m-4 0h8",
  },
  guitar: {
    mode: "stroke",
    d: "M18 2l4 4-3 3-4-4zm-2 2-7 7M9 13a4 4 0 1 0 4 4l-4-4z",
  },
  "not-nhac": {
    mode: "fill",
    d: "M9 3v11.5A3.5 3.5 0 1 0 12 18V7l7-2v6.5a3.5 3.5 0 1 0 3 3.5V2z",
  },
  loa: {
    mode: "stroke",
    d: "M11 5 6 9H2v6h4l5 4V5zm4.5 4a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12",
  },

  // --- Du lịch (Travel) ---
  "may-bay": {
    mode: "fill",
    d: "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z",
  },
  "may-anh": {
    mode: "stroke",
    d: "M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  },
  nui: {
    mode: "fill",
    d: "M1.5 20.5 8.6 7.6l3.7 6.3 2.3-3.6 7.9 10.2Z M8.6 7.6l1.7 2.9-1.7-.9-1.6.9Z",
  },
  "bai-bien": {
    mode: "stroke",
    d: "M13 18c0-5 3-9 7-10-3 0-6 2-7 5M13 18c0-5-3-9-7-10 3 0 6 2 7 5M13 8V22M2 22c4-1 8-1 12 0s8 1 8 0",
  },
  "la-ban": {
    mode: "stroke",
    d: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.5 5.5-3 7-7 3 3-7z",
  },

  // --- Vũ trụ (Space) ---
  "hanh-tinh": {
    mode: "stroke",
    d: "M12 4a8 8 0 1 0 8 8 8 8 0 0 0-8-8zM2 12c3-4 17-4 20 0s-17 4-20 0z",
  },
  "mat-trang": {
    mode: "fill",
    d: "M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a7 7 0 0 1-7.54-7.54A8.9 8.9 0 0 0 12 3z",
  },
  "ten-lua": {
    mode: "fill",
    d: "M12 2.5s4 4 4 10.5l3 3.5-3 1.5-2-1.5-2 4-2-4-2 1.5-3-1.5 3-3.5C8 6.5 12 2.5 12 2.5zM12 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z",
  },
  "phi-hanh-gia": {
    mode: "stroke",
    d: "M12 3a6 6 0 0 0-6 6v3a6 6 0 0 0 12 0V9a6 6 0 0 0-6-6zm-3 6h6a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2zm-3 8v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3",
  },

  // --- Phong cách tối giản / Nghệ thuật (Aesthetic & Minimal) ---
  song: {
    mode: "stroke",
    d: "M2 8c2.5-2.5 4.5-2.5 7 0s4.5 2.5 7 0 4.5-2.5 6 0M2 13c2.5-2.5 4.5-2.5 7 0s4.5 2.5 7 0 4.5-2.5 6 0M2 18c2.5-2.5 4.5-2.5 7 0s4.5 2.5 7 0 4.5-2.5 6 0",
  },
  la: {
    mode: "fill",
    d: "M20.5 3.5C12 3.2 5.2 6.8 4.4 14.2c-.2 1.7.1 3.3.8 4.6L3 21l1.4 1 2.2-2.2c1.4.8 3 1.1 4.7.9 7.4-.8 9.6-8.5 9.2-17.2Zm-11 13.3c2.1-3.3 4.6-5.7 7.6-7.4-2.6 2.2-4.8 4.8-6.4 7.9Z",
  },
  "mat-troi": {
    mode: "stroke",
    d: "M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 1 0 0-9.6ZM12 1.5v2.6M12 19.9v2.6M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12h2.6M19.9 12h2.6M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8",
  },
  giot: {
    mode: "fill",
    d: "M12 1.8C9.2 6 5.2 10.2 5.2 14.8a6.8 6.8 0 0 0 13.6 0C18.8 10.2 14.8 6 12 1.8Zm-3.2 13.4c0 1.8 1.2 3.2 2.9 3.6l-.3 1.4c-2.4-.5-4.1-2.6-4.1-5Z",
  },
  "hinh-hoc": {
    mode: "stroke",
    d: "M4 20V10a8 8 0 0 1 16 0v10M8 20v-7a4 4 0 0 1 8 0v7",
  },
};

export type StickerCategory = {
  id: string;
  name: string;
  icon: string;
  items: { id: string; label: string }[];
};

export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    id: "sports",
    name: "Thể thao",
    icon: "🏀",
    items: [
      { id: "bong-ro", label: "Bóng rổ" },
      { id: "bong-chuyen", label: "Bóng chuyền" },
      { id: "tennis", label: "Tennis" },
      { id: "chay-bo", label: "Chạy bộ" },
      { id: "dap-xe", label: "Đạp xe" },
      { id: "gym", label: "Gym & Tạ" },
    ],
  },
  {
    id: "football",
    name: "Bóng đá",
    icon: "⚽",
    items: [
      { id: "bong-da", label: "Quả bóng đá" },
      { id: "cup", label: "Cúp vô địch" },
      { id: "ao-dau", label: "Áo đấu" },
      { id: "giay-da-bong", label: "Giày đinh" },
      { id: "khung-thanh", label: "Khung thành" },
    ],
  },
  {
    id: "animals",
    name: "Động vật",
    icon: "🐶",
    items: [
      { id: "cho", label: "Cún cưng" },
      { id: "meo", label: "Mèo con" },
      { id: "gau", label: "Gấu nâu" },
      { id: "tho", label: "Thỏ trắng" },
      { id: "capybara", label: "Capybara" },
      { id: "gau-truc", label: "Gấu trúc" },
      { id: "ho", label: "Hổ vằn" },
      { id: "chim-canh-cut", label: "Chim cánh cụt" },
      { id: "khung-long", label: "Khủng long" },
    ],
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "🎮",
    items: [
      { id: "tay-cam", label: "Tay cầm" },
      { id: "ban-phim", label: "Bàn phím cơ" },
      { id: "chuot", label: "Chuột Gaming" },
      { id: "pixel-heart", label: "Tim 8-bit" },
      { id: "level-up", label: "Level Up" },
    ],
  },
  {
    id: "food",
    name: "Ẩm thực",
    icon: "🍔",
    items: [
      { id: "ca-phe", label: "Cà phê" },
      { id: "tra-sua", label: "Trà sữa" },
      { id: "burger", label: "Burger" },
      { id: "pizza", label: "Pizza" },
      { id: "donut", label: "Donut" },
      { id: "kem", label: "Kem ốc quế" },
    ],
  },
  {
    id: "cute",
    name: "Cute",
    icon: "🌸",
    items: [
      { id: "tim", label: "Trái tim" },
      { id: "sao", label: "Ngôi sao" },
      { id: "hoa", label: "Bông hoa" },
      { id: "may", label: "Đám mây" },
      { id: "cau-vong", label: "Cầu vồng" },
      { id: "mat-cuoi", label: "Mặt cười" },
      { id: "lap-lanh", label: "Lấp lánh" },
    ],
  },
  {
    id: "cool",
    name: "Cool Ngầu",
    icon: "🔥",
    items: [
      { id: "lua", label: "Ngọn lửa" },
      { id: "set", label: "Tia sét" },
      { id: "dau-lau", label: "Đầu lâu" },
      { id: "doi-canh", label: "Đôi cánh" },
      { id: "vuong-mien", label: "Vương miện" },
    ],
  },
  {
    id: "music",
    name: "Âm nhạc",
    icon: "🎵",
    items: [
      { id: "tai-nghe", label: "Tai nghe" },
      { id: "micro", label: "Micro" },
      { id: "guitar", label: "Guitar" },
      { id: "not-nhac", label: "Nốt nhạc" },
      { id: "loa", label: "Loa nhạc" },
    ],
  },
  {
    id: "travel",
    name: "Du lịch",
    icon: "✈️",
    items: [
      { id: "may-bay", label: "Máy bay" },
      { id: "may-anh", label: "Máy ảnh" },
      { id: "nui", label: "Dãy núi" },
      { id: "bai-bien", label: "Bãi biển" },
      { id: "la-ban", label: "La bàn" },
    ],
  },
  {
    id: "space",
    name: "Vũ trụ",
    icon: "🌌",
    items: [
      { id: "hanh-tinh", label: "Hành tinh" },
      { id: "mat-trang", label: "Mặt trăng" },
      { id: "ten-lua", label: "Tên lửa" },
      { id: "phi-hanh-gia", label: "Phi hành gia" },
    ],
  },
  {
    id: "aesthetic",
    name: "Tối giản",
    icon: "🎨",
    items: [
      { id: "song", label: "Lượn sóng" },
      { id: "la", label: "Chiếc lá" },
      { id: "mat-troi", label: "Mặt trời" },
      { id: "giot", label: "Giọt nước" },
      { id: "hinh-hoc", label: "Vòm cong" },
    ],
  },
];

export const ALL_STICKERS = STICKER_CATEGORIES.flatMap((c) => c.items);

export function StickerIcon({
  id,
  size = 24,
  color = "currentColor",
}: {
  id: string;
  size?: number;
  color?: string;
}) {
  const art = STICKER_ART[id];
  if (!art) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      style={{ display: "block" }}
    >
      <path
        d={art.d}
        fill={art.mode === "fill" ? color : "none"}
        stroke={art.mode === "stroke" ? color : "none"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fillRule="evenodd"
      />
    </svg>
  );
}
