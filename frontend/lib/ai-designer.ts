// AI Design for Me - Trợ lý thông minh tự động bố cục thiết kế bình 3D
import type { Customization, CustomLayer, FontId, Product } from "@/shared/types/product.types";
import { INKS } from "@/shared/catalog";

export type DesignThemeId =
  | "football"
  | "gym"
  | "gaming"
  | "pets"
  | "cute"
  | "coffee"
  | "music"
  | "travel"
  | "space"
  | "minimal";

export type DesignThemeOption = {
  id: DesignThemeId;
  name: string;
  icon: string;
  desc: string;
  suggestedStickers: string[];
  defaultFont: FontId;
  preferredColorHex: string;
};

export const DESIGN_THEMES: DesignThemeOption[] = [
  {
    id: "football",
    name: "Bóng đá & Thể thao",
    icon: "⚽",
    desc: "Số áo đấu thể thao năng động, cúp vô địch và trái bóng",
    suggestedStickers: ["bong-da", "cup", "ao-dau", "giay-da-bong"],
    defaultFont: "block",
    preferredColorHex: "#0688AE", // Xanh Hydron
  },
  {
    id: "gym",
    name: "Gym & Fitness",
    icon: "🏋️",
    desc: "Tạ đơn, sấm sét quyết tâm và năng lượng bứt phá",
    suggestedStickers: ["gym", "set", "lua", "chay-bo"],
    defaultFont: "block",
    preferredColorHex: "#262B2E", // Đen nhám
  },
  {
    id: "gaming",
    name: "Gaming & Esports",
    icon: "🎮",
    desc: "Tay cầm game, bàn phím cơ, tim 8-bit và level up",
    suggestedStickers: ["tay-cam", "pixel-heart", "level-up", "ban-phim"],
    defaultFont: "block",
    preferredColorHex: "#0B2A36",
  },
  {
    id: "pets",
    name: "Thú cưng & Động vật",
    icon: "🐶",
    desc: "Cún cưng, mèo con, capybara và linh vật đáng yêu",
    suggestedStickers: ["cho", "meo", "capybara", "gau-truc"],
    defaultFont: "round",
    preferredColorHex: "#E6D8BF", // Cát sa mạc
  },
  {
    id: "cute",
    name: "Cute & Dễ thương",
    icon: "🌸",
    desc: "Trái tim, ngôi sao, cầu vồng và nụ cười rạng rỡ",
    suggestedStickers: ["tim", "sao", "hoa", "lap-lanh", "cau-vong"],
    defaultFont: "round",
    preferredColorHex: "#F1EEE8", // Trắng sữa
  },
  {
    id: "coffee",
    name: "Cà phê & Chill",
    icon: "☕",
    desc: "Ly cà phê nồng nàn, trà sữa thơm béo và nhịp sống nhẹ nhàng",
    suggestedStickers: ["ca-phe", "tra-sua", "donut", "may"],
    defaultFont: "round",
    preferredColorHex: "#C8A15A",
  },
  {
    id: "music",
    name: "Âm nhạc & Streetwear",
    icon: "🎵",
    desc: "Tai nghe DJ, nốt nhạc, guitar và ngọn lửa cá tính",
    suggestedStickers: ["tai-nghe", "not-nhac", "guitar", "lua"],
    defaultFont: "block",
    preferredColorHex: "#262B2E",
  },
  {
    id: "travel",
    name: "Du lịch & Phượt",
    icon: "✈️",
    desc: "Máy bay, đỉnh núi cao, máy ảnh và la bàn dẫn lối",
    suggestedStickers: ["may-bay", "nui", "may-anh", "la-ban"],
    defaultFont: "block",
    preferredColorHex: "#5B6C55", // Xanh rêu
  },
  {
    id: "space",
    name: "Vũ trụ & Khám phá",
    icon: "🌌",
    desc: "Hành tinh, mặt trăng, tên lửa và phi hành gia",
    suggestedStickers: ["hanh-tinh", "mat-trang", "ten-lua", "phi-hanh-gia"],
    defaultFont: "block",
    preferredColorHex: "#0B2A36",
  },
  {
    id: "minimal",
    name: "Tối giản sang trọng",
    icon: "✨",
    desc: "Đường lượn sóng, vòm cong nghệ thuật, chữ ký tinh xảo",
    suggestedStickers: ["song", "la", "mat-troi", "giot", "hinh-hoc"],
    defaultFont: "script",
    preferredColorHex: "#F1EEE8",
  },
];

export type AiDesignPrompt = {
  name: string;
  number?: string;
  themeId: DesignThemeId;
  style: "cute" | "bold" | "minimal" | "sport";
  preferredColorId?: string;
};

export type AiDesignResult = {
  custom: Customization;
  recommendedColorId?: string;
  recommendedSize: string;
  description: string;
};

/**
 * Thuật toán AI Auto-Layout:
 * Cân đối tỷ lệ vàng trên thân bình trụ 3D (Cylinder Texture Space)
 * - Nếu có Số áo (VD: "10"): Đặt số lớn đậm phong cách thể thao, tên bên dưới
 * - Nếu chỉ có Tên: Đặt tên chính giữa hoặc trên cao, dàn sticker vây quanh cân xứng
 * - Chọn màu mực ink tương phản hoàn hảo với màu bình
 */
export function generateAiDesign(
  prompt: AiDesignPrompt,
  products: Product[],
  currentProduct?: Product
): AiDesignResult {
  const p = currentProduct ?? products.find((item) => item.customizable) ?? products[0];
  const theme = DESIGN_THEMES.find((t) => t.id === prompt.themeId) ?? DESIGN_THEMES[0];

  const cleanName = prompt.name.trim().toUpperCase().slice(0, 14);
  const cleanNumber = (prompt.number ?? "").trim().slice(0, 4);

  // Tìm màu bình phù hợp nhất trong danh sách màu của sản phẩm
  let targetColor = p.colors.find((c) => c.hex.toLowerCase() === theme.preferredColorHex.toLowerCase()) ?? p.colors[0];
  if (prompt.preferredColorId) {
    const found = p.colors.find((c) => c.id === prompt.preferredColorId);
    if (found) targetColor = found;
  }

  // Xác định màu mực tương phản cao (Light vs Dark)
  const isLightColor =
    targetColor.hex === "#F1EEE8" ||
    targetColor.hex === "#E6D8BF" ||
    targetColor.hex === "#C8A15A" ||
    targetColor.hex.toLowerCase() === "#ffffff";
  const ink = isLightColor ? "#0B2A36" : "#FFFFFF";

  // Kiểu chữ theo phong cách
  let font: FontId = theme.defaultFont;
  if (prompt.style === "cute") font = "round";
  else if (prompt.style === "minimal") font = "script";
  else if (prompt.style === "sport" || prompt.style === "bold") font = "block";

  const layers: CustomLayer[] = [];

  // 1. Nếu có số áo đấu (VD: 10, 07)
  if (cleanNumber) {
    layers.push({
      id: `layer-num-${Date.now()}`,
      type: "number",
      content: cleanNumber,
      font: "block",
      color: ink,
      x: 0.5,
      y: 0.64, // Vị trí cao trên thân
      scale: 1.45,
      rotation: 0,
    });
  }

  // 2. Tên in
  if (cleanName) {
    layers.push({
      id: `layer-name-${Date.now()}`,
      type: "text",
      content: cleanName,
      font: font,
      color: ink,
      x: 0.5,
      y: cleanNumber ? 0.44 : 0.54, // Nếu có số thì tên nằm dưới số
      scale: cleanNumber ? 1.05 : 1.25,
      rotation: 0,
    });
  }

  // 3. Sticker chính và phụ theo bố cục chủ đề
  const stList = theme.suggestedStickers;
  const primarySticker = stList[0];
  const secondarySticker = stList[1] ?? stList[0];

  if (primarySticker) {
    if (cleanNumber && cleanName) {
      // Bố cục số + tên + sticker đôi (giống hình mẫu)
      layers.push({
        id: `layer-st1-${Date.now()}`,
        type: "sticker",
        content: primarySticker,
        color: ink,
        x: 0.38,
        y: 0.28,
        scale: 0.95,
        rotation: -6,
      });
      if (secondarySticker) {
        layers.push({
          id: `layer-st2-${Date.now() + 1}`,
          type: "sticker",
          content: secondarySticker,
          color: ink,
          x: 0.62,
          y: 0.28,
          scale: 0.95,
          rotation: 8,
        });
      }
    } else if (cleanName) {
      // Tên ở giữa, 1 sticker nổi bật phía trên, 1 sticker nhỏ phía dưới
      layers.push({
        id: `layer-st1-${Date.now()}`,
        type: "sticker",
        content: primarySticker,
        color: ink,
        x: 0.5,
        y: 0.72,
        scale: 1.2,
        rotation: 0,
      });
      if (secondarySticker) {
        layers.push({
          id: `layer-st2-${Date.now() + 1}`,
          type: "sticker",
          content: secondarySticker,
          color: ink,
          x: 0.5,
          y: 0.32,
          scale: 0.85,
          rotation: 0,
        });
      }
    } else {
      // Chỉ có sticker: đặt to ở chính tâm
      layers.push({
        id: `layer-st-main-${Date.now()}`,
        type: "sticker",
        content: primarySticker,
        color: ink,
        x: 0.5,
        y: 0.5,
        scale: 1.5,
        rotation: 0,
      });
    }
  }

  const custom: Customization = {
    text: cleanName,
    font,
    ink,
    number: cleanNumber || undefined,
    numberFont: "block",
    sticker: primarySticker,
    layers,
  };

  return {
    custom,
    recommendedColorId: targetColor.id,
    recommendedSize: p.sizes.includes("700") ? "700" : p.sizes[0],
    description: `Bố cục phong cách ${theme.name} với tên ${cleanName || "bạn"}, ${cleanNumber ? `số ${cleanNumber}, ` : ""}kết hợp sticker ${primarySticker} trên nền ${targetColor.name}.`,
  };
}

