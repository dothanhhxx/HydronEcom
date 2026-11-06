"use client";

import { useState } from "react";
import { Button, Icon, Input, Panel, QuantityStepper, Skeleton, formatVND } from "@/components/ds";
import { TeaGrid } from "@/components/catalog/TeaCard";
import { useCart } from "@/lib/cart";
import { COUPONS, FREE_SHIP_MIN, checkCoupon, quote } from "@/lib/checkout";
import { bestSellers } from "@/lib/products";
import { ItemRow, Totals } from "./Summary";

function CouponBox() {
  const { coupon, setCoupon, subtotal } = useCart();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string>();
  const apply = () => {
    const r = checkCoupon(draft, subtotal);
    if (r.ok) {
      setCoupon(draft);
      setDraft("");
      setError(undefined);
    } else setError(r.error);
  };
  if (coupon) {
    const c = COUPONS[coupon];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1px dashed var(--accent)", borderRadius: 6, background: "var(--accent-soft)", fontSize: 14 }}>
        <Icon name="ticket-percent" size={20} color="var(--accent)" />
        <span style={{ flex: 1 }}>
          <strong style={{ fontWeight: 700 }}>{coupon}</strong>
          {c && <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>{c.label}</span>}
        </span>
        <button type="button" onClick={() => setCoupon("")} style={{ border: 0, background: "transparent", color: "var(--text-link)", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Bỏ mã</button>
      </div>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); apply(); }} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <Input aria-label="Mã giảm giá" placeholder="Nhập mã, ví dụ LAMTRA10" value={draft} onChange={(e) => { setDraft(e.target.value); setError(undefined); }} error={error} style={{ textTransform: "uppercase" }} />
      </div>
      <Button type="submit" variant="secondary" disabled={!draft.trim()} style={{ height: 48 }}>Áp dụng</Button>
    </form>
  );
}

export default function CartPage() {
  const { items, ready, setQty, remove, coupon } = useCart();
  const q = quote({ items, coupon });

  if (!ready)
    return (
      <div className="lt-container" style={{ paddingTop: "16px", paddingBottom: "80px", display: "flex", flexDirection: "column", gap: 16, maxWidth: 720 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ display: "flex", gap: 14 }}>
            <Skeleton w={72} h={88} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}><Skeleton w="60%" h={18} /><Skeleton w="40%" /><Skeleton w={120} h={36} /></div>
          </div>
        ))}
      </div>
    );

  if (!items.length)
    return (
      <div className="lt-container" style={{ paddingTop: "16px", paddingBottom: "80px" }}>
        <Panel style={{ padding: "36px 28px", maxWidth: 560, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <Icon name="shopping-bag" size={32} color="var(--accent)" />
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--text-body)" }}>Giỏ trà của bạn đang trống. Bạn ghé qua vài loại trà Lam Trà đang có nhé.</p>
          <Button href="/san-pham" iconRight="arrow-right">Xem các loại trà</Button>
        </Panel>
        <h2 style={{ margin: "56px 0 24px", fontSize: 24, fontWeight: 500, color: "var(--text-strong)" }}>Được mua nhiều</h2>
        <TeaGrid products={bestSellers()} />
      </div>
    );

  const toFree = FREE_SHIP_MIN - (q.subtotal - q.discount);
  return (
    <div className="lt-container" style={{ paddingTop: "8px", paddingBottom: "80px", display: "flex", flexWrap: "wrap", gap: "32px clamp(28px,4vw,56px)", alignItems: "flex-start" }}>
      <div style={{ flex: "1 1 460px", minWidth: 0 }}>
        {toFree > 0 ? (
          <Panel tone="info" style={{ padding: "12px 16px", fontSize: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="truck" size={20} color="var(--primary)" />
            Mua thêm {formatVND(toFree)} để được miễn phí vận chuyển.
          </Panel>
        ) : (
          <Panel tone="info" style={{ padding: "12px 16px", fontSize: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="circle-check" size={20} color="var(--primary)" />
            Đơn của bạn được miễn phí vận chuyển và gói quà.
          </Panel>
        )}
        <div style={{ marginTop: 8 }}>
          {items.map((it) => (
            <ItemRow key={it.key} item={it}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 6 }}>
                <QuantityStepper size="sm" value={it.qty} max={it.max} onChange={(n) => setQty(it.key, n)} />
                <button type="button" onClick={() => remove(it.key)} aria-label={`Xóa ${it.name} khỏi giỏ`} style={{ display: "flex", alignItems: "center", gap: 6, border: 0, background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: 6 }}>
                  <Icon name="trash-2" size={16} />
                  Xóa
                </button>
              </div>
              {it.max <= 5 && <span style={{ fontSize: 12, color: "var(--warning)" }}>Chỉ còn {it.max} trong kho</span>}
            </ItemRow>
          ))}
        </div>
      </div>

      <aside style={{ flex: "1 1 320px", maxWidth: 440, minWidth: 0, position: "sticky", top: 88 }}>
        <Panel style={{ padding: 20, display: "flex", flexDirection: "column", gap: 18 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: "var(--text-strong)" }}>Tóm tắt đơn</h2>
          <CouponBox />
          <Totals q={q} shippingNote="Phí từ 15.000₫ tùy tỉnh. Miễn phí cho đơn từ 500.000₫." />
          <Button href="/thanh-toan" size="lg" fullWidth iconRight="arrow-right">Đặt hàng</Button>
          <span style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>Thanh toán VietQR hoặc COD · Không cần tạo tài khoản</span>
        </Panel>
      </aside>
    </div>
  );
}
