"use client";

import { ProductCard } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { badgeOf, maxQtyOf, photo, priceOf, type Product } from "@/lib/products";

/** ProductCard đã nối giỏ hàng + yêu thích. Dùng ở danh mục, trang chủ, sản phẩm liên quan, yêu thích, quà biếu. */
export default function TeaCard({ p }: { p: Product }) {
  const { add, isWished, toggleWish } = useCart();
  const soldOut = maxQtyOf(p) < 1;
  return (
    <ProductCard
      href={`/san-pham/${p.slug}`}
      name={p.name}
      note={p.note}
      image={photo(p.ph)}
      price={priceOf(p)}
      compareAt={p.compareAt}
      rating={p.rating}
      reviews={p.reviews}
      badge={soldOut ? { label: "Tạm hết bản 150g", tone: "neutral" } : badgeOf(p)}
      onQuickAdd={soldOut ? undefined : () => add(p.slug)}
      wished={isWished(p.slug)}
      onWish={() => toggleWish(p.slug)}
    />
  );
}

export function TeaGrid({ products, cols = 4 }: { products: Product[]; cols?: 3 | 4 }) {
  return (
    <div className={cols === 4 ? "lt-grid lt-grid-4" : "lt-grid"}>
      {products.map((p) => (
        <TeaCard key={p.slug} p={p} />
      ))}
    </div>
  );
}
