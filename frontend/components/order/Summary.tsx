"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { formatVND } from "@/components/ds";
import type { CartItem, Quote } from "@/lib/checkout";
import { photo } from "@/lib/products";

export function ItemRow({ item, children, link = true }: { item: CartItem; children?: ReactNode; link?: boolean }) {
  const name = <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-strong)" }}>{item.name}</span>;
  return (
    <div style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--border-hairline)" }}>
      <span aria-hidden style={{ width: 72, height: 88, flexShrink: 0, borderRadius: 4, backgroundColor: "var(--surface-photo)", backgroundImage: `url('${photo(item.ph)}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          {link ? <Link href={`/san-pham/${item.slug}`} className="lt-card-name" style={{ textDecoration: "none" }}>{name}</Link> : name}
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-price)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{formatVND(item.total)}</span>
        </div>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {item.variant} · {formatVND(item.unit)}
          {children ? "" : ` × ${item.qty}`}
        </span>
        {children}
      </div>
    </div>
  );
}

const Row = ({ k, v, strong, tone }: { k: ReactNode; v: ReactNode; strong?: boolean; tone?: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: strong ? 17 : 14, fontWeight: strong ? 700 : 400, color: tone ?? (strong ? "var(--text-strong)" : "var(--text-body)") }}>
    <span>{k}</span>
    <span style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{v}</span>
  </div>
);

export function Totals({ q, shippingNote }: { q: Quote; shippingNote?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Row k="Tạm tính" v={formatVND(q.subtotal)} />
      {q.discount > 0 && <Row k={`Giảm giá (${q.coupon})`} v={"−" + formatVND(q.discount)} tone="var(--success)" />}
      <Row k="Phí vận chuyển" v={q.shipping === 0 ? (q.shippingKnown ? "Miễn phí" : "Tính ở bước sau") : (q.shippingKnown ? "" : "từ ") + formatVND(q.shipping)} />
      {shippingNote && <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: -4 }}>{shippingNote}</span>}
      {q.giftWrap > 0 && <Row k="Gói quà + thiệp" v={formatVND(q.giftWrap)} />}
      <div style={{ height: 1, background: "var(--border-hairline)", margin: "4px 0" }} />
      <Row k="Tổng cộng" v={formatVND(q.total)} strong />
    </div>
  );
}
