// Shared Product Types - bình giữ nhiệt Hydron: dung tích × màu, tuỳ biến in tên / sticker

export type Category = {
  slug: string;
  name: string;
  desc: string;
};

export type Spec = {
  label: string;
  value: string;
};

/** Một màu sơn tĩnh điện của sản phẩm. `id` dùng trong khóa tồn kho và giỏ hàng. */
export type ColorOption = {
  id: string;
  name: string;
  hex: string;
  /** Màu nắp riêng (bình hai tông màu). Thiếu = nắp tự tính theo màu thân. */
  lid?: string;
};

/** Kiểu dáng dùng để dựng hình 2D/3D khi chưa có ảnh chụp thật. */
export type Shape = "classic" | "sport" | "flip" | "bag" | "strap";

export type FontId = "block" | "round" | "script";

export type LayerType = "text" | "number" | "sticker" | "image";

export type CustomLayer = {
  id: string;
  type: LayerType;
  content: string; // text string, sticker id, or image data URL
  font?: FontId;
  color?: string; // ink color or tint
  style?: string; // sticker style (cute, bold, minimal, cartoon, anime, pixel, graffiti, sport, vintage, 3d)
  x?: number; // horizontal placement on bottle circumference [-1 to 1] or [0 to 1], default 0.5 (center)
  y?: number; // vertical height along cylinder [0 to 1], 0.5 is middle
  scale?: number; // scale multiplier, default 1
  rotation?: number; // rotation degrees, default 0
};

/** Phần khách tự thiết kế: chữ/số in quanh thân bình, sticker và ảnh upload. */
export type Customization = {
  text: string;
  font: FontId;
  ink: string;
  sticker?: string;
  number?: string;
  numberFont?: FontId;
  uploadedImage?: string;
  uploadedImageStyle?: string;
  layers?: CustomLayer[];
};

export type Product = {
  slug: string;
  name: string;
  /** "binh" | "phu-kien" */
  category: string;
  /** Nhóm hiển thị ngắn: "Nắp vặn", "Nắp ống hút", "Túi đựng bình"… */
  kind: string;
  /** Một dòng mô tả dưới tên trên thẻ sản phẩm */
  note: string;
  /** Giá dung tích nhỏ nhất (hoặc giá duy nhất với phụ kiện) */
  base: number;
  /** Giá gốc trước khuyến mãi của dung tích nhỏ nhất */
  compareAt?: number;
  /** Dung tích bán, ví dụ ["500","700","900"]. Rỗng = phụ kiện một cỡ. */
  sizes: string[];
  /** Giá riêng từng dung tích; thiếu thì tính base + chênh lệch chuẩn */
  sizePrices?: Record<string, number>;
  colors: ColorOption[];
  shape: Shape;
  /** Cho phép tự thiết kế 3D (in tên, số, sticker) */
  customizable: boolean;
  rating: number;
  reviews: number;
  sold: number;
  isNew?: boolean;
  /** Ngày lên kệ, dùng để sắp xếp "Mới nhất" */
  addedAt: string;
  /** Ảnh chính đã tải lên. Rỗng = dùng ảnh dựng theo màu */
  ph: string;
  gallery: { ph: string; alt: string }[];
  /** Video giới thiệu (YouTube/MP4), nếu có */
  video?: string;
  desc: string;
  specs: Spec[];
  /** Hướng dẫn sử dụng & bảo quản, mỗi dòng một ý */
  care: string[];
  /** Tồn kho theo biến thể, khóa `${size}|${color}`. Không có khóa = còn nhiều. */
  stock?: Record<string, number>;
  sku?: string;
  active?: boolean;
  deleted?: boolean;
};

export type ProductOverride = {
  base?: number;
  compareAt?: number;
  active?: boolean;
  stock?: Record<string, number>;
  updatedAt?: string;
};
