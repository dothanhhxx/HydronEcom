// Ảnh sản phẩm: ưu tiên ảnh chụp đã tải lên, chưa có thì dựng theo màu/dung tích.
import type { CartItem } from "@/shared/types/order.types";
import type { Customization, Product } from "@/shared/types/product.types";
import { colorOf, defaultColor, defaultSize } from "@/shared/catalog";
import BottleRender from "./BottleRender";
import { tintOf } from "./color";

const photoUrl = (ph?: string) => (!ph ? "" : /^(https?:|\/|data:)/.test(ph) ? ph : `/uploads/${ph}`);

/** Ảnh chụp theo màu: ảnh phụ có chú thích chứa tên màu, hoặc ảnh chính cho màu mặc định. */
export function photoFor(p: Product, color: string) {
  const c = colorOf(p, color);
  const byColor = c && p.gallery.find((g) => g.alt?.toLowerCase().includes(c.name.toLowerCase()));
  if (byColor) return photoUrl(byColor.ph);
  if (color === defaultColor(p) && p.ph) return photoUrl(p.ph);
  return "";
}

export function tintFor(p: Product, color = defaultColor(p)) {
  return tintOf(colorOf(p, color)?.hex ?? "#0688AE");
}

export default function ProductVisual({ product: p, size = defaultSize(p), color = defaultColor(p), custom, alt }: { product: Product; size?: string; color?: string; custom?: Customization; alt?: string }) {
  const src = custom ? "" : photoFor(p, color);
  const c = colorOf(p, color);
  const label = alt ?? `${p.name}${c ? ` màu ${c.name}` : ""}${size !== "-" ? ` ${size}ml` : ""}`;
  // eslint-disable-next-line @next/next/no-img-element
  if (src) return <img src={src} alt={label} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />;
  return <BottleRender shape={p.shape} hex={c?.hex ?? "#0688AE"} lid={c?.lid} size={size} custom={custom} label={label} />;
}

/** Ảnh nhỏ cho dòng giỏ hàng / đơn hàng. */
export function ItemVisual({ item, size = 72 }: { item: CartItem; size?: number }) {
  const src = item.custom ? "" : photoUrl(item.ph);
  return (
    <span aria-hidden style={{ position: "relative", width: size, height: Math.round(size * 1.2), flexShrink: 0, borderRadius: 10, overflow: "hidden", background: tintOf(item.hex), display: "block" }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <BottleRender shape={item.shape} hex={item.hex} size={item.size} custom={item.custom} label="" className="hd-render" />
      )}
    </span>
  );
}
