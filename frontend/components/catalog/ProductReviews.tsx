"use client";

import { useState } from "react";
import { Badge, Button, Dialog, Icon, Input, Rating, SectionTitle } from "@/components/ds";
import { postJSON } from "@/lib/api";
import type { Product } from "@/lib/products";
import { reviewsOf } from "@/lib/reviews";

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Số sao" style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} sao`} onClick={() => onChange(n)} style={{ border: 0, background: "transparent", padding: 4, cursor: "pointer", color: n <= value ? "var(--rating)" : "var(--paper-400)" }}>
          <Icon name="star" size={28} style={{ fill: n <= value ? "currentColor" : "none" }} />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ p, onDone }: { p: Product; onDone: () => void }) {
  const [stars, setStars] = useState(5);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    setBusy(true);
    const r = await postJSON("/api/contact", { type: "danh-gia", product: p.slug, stars, name, phone, message });
    setBusy(false);
    if (r.ok) setSent(true);
    else setErrors(r.errors ?? { message: r.error ?? "Chưa gửi được, bạn thử lại sau nhé." });
  };

  if (sent)
    return (
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>Cảm ơn bạn đã chia sẻ. Lam Trà sẽ đọc và đăng đánh giá sau khi đối chiếu với đơn hàng, thường trong một ngày.</p>
        <Button onClick={onDone}>Đóng</Button>
      </div>
    );

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <StarInput value={stars} onChange={setStars} />
      <Input label="Tên hiển thị" required value={name} onChange={(e) => setName(e.target.value)} error={errors.name} placeholder="Ví dụ: Chị Hạnh" />
      <Input label="Số điện thoại đặt hàng" value={phone} onChange={(e) => setPhone(e.target.value)} hint="Không hiển thị. Dùng để gắn nhãn “Đã mua hàng”." inputMode="tel" />
      <Input label="Cảm nhận của bạn" required textarea value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} placeholder="Hương, vị, cách đóng gói, người nhận quà thấy thế nào…" />
      <Button type="submit" disabled={busy}>{busy ? "Đang gửi…" : "Gửi đánh giá"}</Button>
    </form>
  );
}

export default function ProductReviews({ p }: { p: Product }) {
  const list = reviewsOf(p.slug);
  const [open, setOpen] = useState(false);
  return (
    <section id="danh-gia" aria-labelledby="danh-gia-h" style={{ marginTop: "clamp(56px,7vw,88px)", scrollMarginTop: 90 }}>
      <SectionTitle id="danh-gia-h" title="Khách nói về trà" action={<Button variant="secondary" size="sm" iconLeft="pencil" onClick={() => setOpen(true)}>Viết đánh giá</Button>} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px 48px" }}>
        <div style={{ flex: "0 0 200px", display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 44, fontWeight: 500, lineHeight: 1, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{p.rating.toFixed(1)}</span>
          <Rating value={p.rating} />
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{p.reviews} đánh giá · {p.sold} đã bán</span>
        </div>
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          {list.length === 0 ? (
            <p style={{ margin: 0, fontSize: 15, color: "var(--text-body)" }}>Chưa có đánh giá nào được đăng. Bạn là người đầu tiên chia sẻ nhé.</p>
          ) : (
            list.map((r) => (
              <article key={r.name + r.date} style={{ padding: "16px 0", borderBottom: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                  <strong style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)" }}>{r.name}</strong>
                  {r.verified && <Badge tone="success">Đã mua hàng</Badge>}
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{r.date}{r.variant ? ` · ${r.variant}` : ""}</span>
                </div>
                <Rating value={r.stars} size={13} />
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--text-body)" }}>{r.text}</p>
              </article>
            ))
          )}
        </div>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title={`Đánh giá ${p.name}`}>
        <ReviewForm p={p} onDone={() => setOpen(false)} />
      </Dialog>
    </section>
  );
}
