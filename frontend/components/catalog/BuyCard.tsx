"use client";

// Thẻ mua nhanh cho trang Sản phẩm: chọn số lượng, thêm giỏ hoặc mua ngay ngay trên thẻ.
// Sản phẩm có nhiều khối lượng/phân hạng được thêm theo bản mặc định (150g · Hạng 1); muốn đổi thì vào trang chi tiết.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { DEFAULT_GRADE, DEFAULT_SIZE, badgeOf, maxQtyOf, photo, priceOf, type Product } from "@/lib/products";

const unitOf = (p: Product) => (p.fixed ? "hộp" : `gói ${DEFAULT_SIZE}g`);

function Stepper({ value, onChange, max, label }: { value: number; onChange: (v: number) => void; max: number; label: string }) {
  return (
    <div className="lt-buy-stepper" role="group" aria-label={`Số lượng ${label}`}>
      <button type="button" aria-label="Giảm số lượng" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Icon name="minus" size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" aria-label="Tăng số lượng" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

/** Trạng thái dùng chung cho thẻ và khối nổi bật. */
function useBuy(p: Product) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const max = maxQtyOf(p);
  const soldOut = max < 1;
  return {
    qty, setQty: (v: number) => setQty(Math.max(1, Math.min(max, v))), max, soldOut,
    addToCart: () => add(p.slug, DEFAULT_SIZE, DEFAULT_GRADE, qty),
    buyNow: () => add(p.slug, DEFAULT_SIZE, DEFAULT_GRADE, qty) && router.push("/gio-hang"),
  };
}

export function BuyCard({ p }: { p: Product }) {
  const b = useBuy(p);
  const badge = b.soldOut ? { label: "Tạm hết bản 150g" } : badgeOf(p);
  const href = `/san-pham/${p.slug}`;
  return (
    <article className="lt-buy-card">
      <Link href={href} className="lt-buy-photo" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(p.ph)} alt="" loading="lazy" decoding="async" />
        {badge && <span className="lt-buy-badge">{badge.label}</span>}
      </Link>
      <div className="lt-buy-body">
        <h3 className="lt-buy-name"><Link href={href}>{p.name}</Link></h3>
        <div className="lt-buy-price">
          <strong>{formatVND(priceOf(p))}</strong>
          <span>/ {unitOf(p)}</span>
          {p.compareAt && <s>{formatVND(p.compareAt)}</s>}
        </div>
        {!p.fixed && <span className="lt-buy-variant">Bản mặc định 150g · Hạng 1 · <Link href={href}>đổi khối lượng</Link></span>}
        {!b.soldOut && (
          <div className="lt-buy-qty">
            <span>Số lượng</span>
            <Stepper value={b.qty} onChange={b.setQty} max={b.max} label={p.name} />
          </div>
        )}
        <p className="lt-buy-note">“{p.note}”</p>
        <p className="lt-buy-desc">{p.desc}</p>
        <div className="lt-buy-actions">
          <button type="button" className="lt-buy-btn lt-buy-btn-gold" disabled={b.soldOut} onClick={b.addToCart}>
            <Icon name="shopping-bag" size={16} />Thêm vào giỏ
          </button>
          <button type="button" className="lt-buy-btn lt-buy-btn-line" disabled={b.soldOut} onClick={b.buyNow}>Mua ngay</button>
        </div>
      </div>
    </article>
  );
}

export function BuyGrid({ products }: { products: Product[] }) {
  return (
    <div className="lt-buy-grid">
      {products.map((p) => <BuyCard key={p.slug} p={p} />)}
    </div>
  );
}

/** Khối sản phẩm nổi bật ở đầu trang Sản phẩm. */
export function FeaturedProduct({ p }: { p: Product }) {
  const b = useBuy(p);
  const href = `/san-pham/${p.slug}`;
  return (
    <section aria-labelledby="sp-noi-bat" className="lt-feature">
      <Link href={href} className="lt-feature-photo" tabIndex={-1} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo(p.ph)} alt="" decoding="async" fetchPriority="high" />
      </Link>
      <div className="lt-feature-info">
        <span className="lt-feature-eyebrow">{p.kind} · Được mua nhiều nhất</span>
        <h2 id="sp-noi-bat" className="lt-feature-name">{p.name}</h2>
        <p className="lt-feature-note">“{p.note}”</p>
        <p className="lt-feature-desc">{p.desc}</p>
        <div className="lt-feature-buy">
          <div className="lt-buy-price lt-feature-price">
            <strong>{formatVND(priceOf(p))}</strong>
            <span>/ {unitOf(p)}</span>
            {p.compareAt && <s>{formatVND(p.compareAt)}</s>}
          </div>
          {!b.soldOut && <Stepper value={b.qty} onChange={b.setQty} max={b.max} label={p.name} />}
        </div>
        <div className="lt-feature-actions">
          <button type="button" className="lt-buy-btn lt-feature-btn-line" disabled={b.soldOut} onClick={b.addToCart}>
            <Icon name="shopping-bag" size={16} />Thêm vào giỏ hàng
          </button>
          <button type="button" className="lt-buy-btn lt-feature-btn-solid" disabled={b.soldOut} onClick={b.buyNow}>
            {b.soldOut ? "Tạm hết hàng" : "Mua ngay"}
          </button>
        </div>
        <Link href={href} className="lt-feature-more">Chi tiết sản phẩm</Link>
      </div>
    </section>
  );
}
