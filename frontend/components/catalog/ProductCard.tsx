"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProductVisual, { tintFor } from "@/components/bottle/ProductVisual";
import { Badge, Button, Dialog, Icon, Price, QuantityStepper, Rating, WishButton, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { badgeOf, compareAtOf, defaultColor, defaultSize, maxQtyOf, priceOf, priceRange, type Product } from "@/lib/products";
import { ColorPicker, SizePicker } from "./VariantPicker";

export function QuickView({ product: p, initialColor, open, onClose }: { product: Product; initialColor?: string; open: boolean; onClose: () => void }) {
  const { add } = useCart();
  const [size, setSize] = useState(defaultSize(p));
  const [color, setColor] = useState(initialColor ?? defaultColor(p));
  const [qty, setQty] = useState(1);
  const max = maxQtyOf(p, size, color);
  return (
    <Dialog open={open} onClose={onClose} title={p.name} maxWidth={860}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, padding: 20 }}>
        <div style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: "var(--radius-card)", overflow: "hidden", background: tintFor(p, color) }}>
          <ProductVisual product={p} size={size} color={color} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{p.kind}</div>
            <div style={{ marginTop: 6 }}><Price value={priceOf(p, size)} compareAt={compareAtOf(p, size)} size="lg" /></div>
            <p style={{ marginTop: 10, fontSize: 14.5, lineHeight: 1.6, color: "var(--text-body)" }}>{p.desc}</p>
          </div>
          <SizePicker product={p} value={size} color={color} onChange={setSize} />
          <ColorPicker product={p} value={color} size={size} onChange={setColor} />
          <div className="hd-buy-row">
            <QuantityStepper value={Math.min(qty, Math.max(max, 1))} max={Math.max(max, 1)} onChange={setQty} />
            <Button size="lg" disabled={max < 1} onClick={() => add({ slug: p.slug, size, color, qty }) && onClose()} iconLeft="shopping-bag">
              {max < 1 ? "Tạm hết hàng" : "Thêm vào giỏ"}
            </Button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 14 }}>
            {p.customizable && (
              <Link className="hd-link" href={`/thiet-ke-3d?sp=${p.slug}&size=${size}&mau=${color}`} onClick={onClose}>
                <Icon name="pencil" size={16} /> In tên lên bình này
              </Link>
            )}
            <Link className="hd-link" href={`/san-pham/${p.slug}`} onClick={onClose}>
              Xem chi tiết <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export function ProductCard({ product: p, priority }: { product: Product; priority?: boolean }) {
  const { add, isWished, toggleWish } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(defaultColor(p));
  const [quick, setQuick] = useState(false);
  const badge = badgeOf(p);
  const [lo, hi] = priceRange(p);
  const href = `/san-pham/${p.slug}`;
  const size = p.sizes.length > 1 ? p.sizes[1] : defaultSize(p);
  const outAll = p.sizes.length ? p.sizes.every((s) => maxQtyOf(p, s, color) < 1) : maxQtyOf(p, "-", color) < 1;
  const addFirst = () => add({ slug: p.slug, size: p.sizes.find((s) => maxQtyOf(p, s, color) > 0), color });

  return (
    <article className="hd-card" data-priority={priority ? "" : undefined}>
      <div style={{ position: "relative" }}>
        <Link href={`${href}?mau=${color}`} className="hd-card-media" aria-label={p.name} style={{ ["--card-tint" as string]: tintFor(p, color) }}>
          <ProductVisual product={p} size={size} color={color} />
        </Link>
        {badge && (
          <span className="hd-card-badge">
            <Badge tone={badge.tone}>{badge.label}</Badge>
          </span>
        )}
        <span className="hd-card-wish">
          <WishButton on={isWished(p.slug)} name={p.name} onClick={() => toggleWish(p.slug)} size={38} />
        </span>
        <div className="hd-card-quick">
          <button type="button" className="hd-quick" onClick={() => setQuick(true)} aria-label={`Xem nhanh ${p.name}`}>
            <Icon name="eye" size={16} />
            <span className="hd-quick-text">Xem nhanh</span>
          </button>
        </div>
      </div>
      <div className="hd-card-body">
        {p.colors.length > 1 && (
          <div className="hd-swatches" role="group" aria-label={`Màu của ${p.name}`}>
            {p.colors.map((c) => (
              <button key={c.id} type="button" className="hd-swatch-dot" data-on={c.id === color} aria-pressed={c.id === color} aria-label={c.name} title={c.name} style={{ background: c.hex }} onClick={() => setColor(c.id)} onMouseEnter={() => setColor(c.id)} />
            ))}
          </div>
        )}
        <Link href={href} className="hd-card-name">{p.name}</Link>
        <span className="hd-card-note">{p.note}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--text-muted)" }}>
          {p.reviews > 0 && <><Rating value={p.rating} size={12} />{p.reviews} đánh giá ·</>}
          {p.sizes.length ? p.sizes.join("/") + "ml" : "Một cỡ"}
        </span>
        <div className="hd-card-price">
          {lo === hi || !p.sizes.length ? (
            <Price value={lo} compareAt={compareAtOf(p)} />
          ) : (
            <>
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>từ</span>
              <Price value={lo} compareAt={compareAtOf(p)} />
              <span className="hd-card-price-hi" style={{ fontSize: 13, color: "var(--text-subtle)" }}>– {formatVND(hi)}</span>
            </>
          )}
        </div>
      </div>
      <div className="hd-card-actions">
        <button type="button" className="hd-btn hd-btn-soft" disabled={outAll} onClick={addFirst} aria-label={`Thêm ${p.name} vào giỏ`}>
          <Icon name="shopping-bag" size={16} />
          {outAll ? "Tạm hết hàng" : "Thêm vào giỏ"}
        </button>
        <button type="button" className="hd-btn hd-btn-primary" disabled={outAll} onClick={() => addFirst() && router.push("/thanh-toan")}>
          Mua ngay
        </button>
      </div>
      {quick && <QuickView product={p} initialColor={color} open={quick} onClose={() => setQuick(false)} />}
    </article>
  );
}

export function ProductGridList({ products, four }: { products: Product[]; four?: boolean }) {
  return (
    <div className={`hd-grid${four ? " hd-grid-4" : ""}`}>
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
