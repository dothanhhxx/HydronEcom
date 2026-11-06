// Danh mục sản phẩm phía trình duyệt. Dữ liệu thật lấy từ backend (/api/products);
// DEFAULT_PRODUCTS chỉ là bản dự phòng khi backend chưa chạy.
import { DEFAULT_PRODUCTS } from "@/shared/default-products";
import type { Category, Product } from "@/shared/types/product.types";

export * from "@/shared/catalog";
export type { Category, ColorOption, Customization, FontId, Product, Shape, Spec } from "@/shared/types/product.types";

export const PRODUCTS: Product[] = DEFAULT_PRODUCTS;

export const CATEGORIES: Category[] = [
  { slug: "binh", name: "Bình giữ nhiệt", desc: "Dung tích 500 – 900ml, in tên riêng theo ý bạn." },
  { slug: "phu-kien", name: "Phụ kiện", desc: "Túi xách ly, túi canvas, quai đeo cho mọi bình Hydron." },
  { slug: "moc-khoa", name: "Móc khóa", desc: "Linh vật Hydron móc vào quai bình, ba lô hay chùm chìa khóa." },
];

/** Ảnh đã tải lên. Trả về "" khi sản phẩm chưa có ảnh chụp: giao diện dựng ảnh theo màu. */
export const photo = (ph?: string) => {
  if (!ph) return "";
  if (/^(https?:|\/|data:)/.test(ph)) return ph;
  return `/uploads/${ph}`;
};

export const findProduct = (list: Product[], slug: string) => list.find((p) => p.slug === slug);
export const getProduct = (slug: string) => findProduct(PRODUCTS, slug);
export const getCategory = (slug?: string) => CATEGORIES.find((c) => c.slug === slug);

export const bestSellers = (list: Product[] = PRODUCTS, n = 4) => [...list].filter((p) => p.category === "binh").sort((a, b) => b.sold - a.sold).slice(0, n);

export function related(p: Product, list: Product[] = PRODUCTS, n = 4) {
  // Xem bình: ưu tiên phụ kiện đi kèm, sau đó các mẫu bình khác kiểu nắp.
  const score = (o: Product) => (p.category === "binh" && o.category !== "binh" ? 4 : 0) + (o.category === p.category ? 2 : 0) + (o.shape !== p.shape ? 1 : 0);
  return list.filter((o) => o.slug !== p.slug && o.active !== false).sort((a, b) => score(b) - score(a) || b.sold - a.sold).slice(0, n);
}

export function badgeOf(p: Product): { label: string; tone: "sale" | "new" | "accent" } | undefined {
  if (p.compareAt && p.compareAt > p.base) return { label: `−${Math.round((1 - p.base / p.compareAt) * 100)}%`, tone: "sale" };
  if (p.isNew) return { label: "Mới", tone: "new" };
  if (p.sold > 500) return { label: "Bán chạy", tone: "accent" };
  return undefined;
}
