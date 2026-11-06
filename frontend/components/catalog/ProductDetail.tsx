"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Button, Icon, OptionPicker, Price, ProductImage, QuantityStepper, Rating, SectionTitle, WishButton } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { FREE_SHIP_MIN, GIFT_WRAP_FREE_MIN } from "@/lib/checkout";
import { DEFAULT_GRADE, DEFAULT_SIZE, GRADE_OPTIONS, LOW_STOCK, SIZE_OPTIONS, maxQtyOf, photo, priceOf, related, stockOf, variantLabel, type Product } from "@/lib/products";
import { formatVND } from "@/components/ds";
import ProductReviews from "./ProductReviews";
import { TeaGrid } from "./TeaCard";

function Gallery({ p }: { p: Product }) {
  const shots = [{ ph: p.ph, alt: p.name }, ...p.gallery];
  const [i, setI] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <ProductImage src={photo(shots[i].ph)} alt={shots[i].alt} ratio="4 / 5" />
      {shots.length > 1 && (
        <div role="tablist" aria-label="Ảnh sản phẩm" style={{ display: "flex", gap: 8 }}>
          {shots.map((s, j) => (
            <button
              key={s.ph + j}
              type="button"
              role="tab"
              aria-selected={i === j}
              aria-label={s.alt}
              onClick={() => setI(j)}
              style={{
                width: 72, height: 72, padding: 0, borderRadius: 4, cursor: "pointer", backgroundImage: `url('${photo(s.ph)}')`, backgroundSize: "cover", backgroundPosition: "center",
                border: i === j ? "1.5px solid var(--text-strong)" : "1px solid var(--border-hairline)", opacity: i === j ? 1 : 0.75,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const POLICIES = [
  { icon: "truck", title: "Giao hàng", text: `Giao toàn quốc từ Tân Cương, 1 – 5 ngày tùy tỉnh. Miễn phí vận chuyển cho đơn từ ${formatVND(FREE_SHIP_MIN)}.` },
  { icon: "rotate-ccw", title: "Đổi trả", text: "Đổi mới trong 7 ngày nếu trà bị ẩm, hở túi, sai loại hoặc sai khối lượng. Lam Trà chịu phí gửi lại." },
  { icon: "shield-check", title: "Cam kết", text: "Trà sao tay, không hương liệu, không phẩm màu. Hoàn tiền nếu bạn không hài lòng với gói đầu tiên." },
  { icon: "gift", title: "Gói quà", text: `Gói quà kèm thiệp viết tay miễn phí cho đơn từ ${formatVND(GIFT_WRAP_FREE_MIN)}. Có thể giao thẳng tới người nhận, không kèm hóa đơn.` },
];

export default function ProductDetail({ product: p }: { product: Product }) {
  const router = useRouter();
  const { add, isWished, toggleWish } = useCart();
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [grade, setGrade] = useState(DEFAULT_GRADE);
  const [qty, setQty] = useState(1);
  const unit = priceOf(p, size, grade);
  const onDefault = size === DEFAULT_SIZE && grade === DEFAULT_GRADE;
  const stock = stockOf(p, size, grade);
  const max = maxQtyOf(p, size, grade);
  const soldOut = max < 1;
  const q = Math.min(qty, Math.max(1, max));

  const sizeOpts = SIZE_OPTIONS.map((o) => (maxQtyOf(p, o.value, grade) < 1 ? { ...o, sub: "Tạm hết" } : o));
  const gradeOpts = GRADE_OPTIONS.map((o) => (maxQtyOf(p, size, o.value) < 1 ? { ...o, sub: "Tạm hết" } : o));

  return (
    <div className="lt-container" style={{ paddingTop: 16, paddingBottom: 80 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "28px clamp(28px,4vw,56px)", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 360px", minWidth: 0, maxWidth: 620 }}>
          <Gallery p={p} />
        </div>

        <div style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--accent)" }}>{p.kind}</span>
              {p.isNew && <Badge tone="new">Mới</Badge>}
              {p.compareAt && <Badge tone="sale">Ưu đãi</Badge>}
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: "space-between" }}>
              <h1 style={{ margin: 0, fontSize: "clamp(28px,3vw,38px)", lineHeight: 1.2, fontWeight: 500, letterSpacing: "-.01em", color: "var(--text-strong)" }}>{p.name}</h1>
              <WishButton on={isWished(p.slug)} name={p.name} onClick={() => toggleWish(p.slug)} />
            </div>
            <div style={{ fontSize: 15, color: "var(--tra-500)" }}>{p.note}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 13, color: "var(--text-muted)" }}>
              <a href="#danh-gia" style={{ color: "inherit", textDecoration: "none" }}><Rating value={p.rating} count={p.reviews} /></a>
              <span>·</span>
              <span>Đã bán {p.sold}</span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--text-body)" }}>{p.desc}</p>

          {p.fixed ? (
            <div style={{ padding: "14px 16px", border: "1px solid var(--border-hairline)", borderRadius: 6, background: "var(--surface-card)", fontSize: 13, lineHeight: 1.55 }}>
              Bộ quà gói sẵn trong hộp sơn mài. Bạn ghi lời nhắn ở bước đặt hàng, Lam Trà sẽ viết tay vào thiệp.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <OptionPicker label="Khối lượng" options={sizeOpts} value={size} onChange={setSize} />
              <OptionPicker label="Phân hạng" options={gradeOpts} value={grade} onChange={setGrade} />
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, paddingTop: 16, borderTop: "1px solid var(--border-hairline)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Price value={unit * q} compareAt={p.compareAt && onDefault ? p.compareAt * q : undefined} size="lg" />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {variantLabel(p, size, grade)}
                {q > 1 ? ` · ${q} gói` : ""}
              </span>
              {soldOut ? (
                <span style={{ fontSize: 13, color: "var(--danger)" }}>Bản này tạm hết hàng. Bạn chọn khối lượng hoặc hạng khác nhé.</span>
              ) : stock != null && stock <= LOW_STOCK ? (
                <span style={{ fontSize: 13, color: "var(--warning)" }}>Chỉ còn {stock} {p.fixed ? "hộp" : "gói"}</span>
              ) : null}
            </div>
            {!soldOut && <QuantityStepper value={q} onChange={setQty} max={max} />}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <div style={{ flex: "1 1 160px" }}>
              <Button variant="secondary" size="lg" fullWidth iconLeft="shopping-bag" disabled={soldOut} onClick={() => add(p.slug, size, grade, q)}>Thêm vào giỏ</Button>
            </div>
            <div style={{ flex: "1 1 160px" }}>
              <Button size="lg" fullWidth iconRight="arrow-right" disabled={soldOut} onClick={() => add(p.slug, size, grade, q) && router.push("/gio-hang")}>Mua ngay</Button>
            </div>
          </div>

          <ul style={{ listStyle: "none", margin: 0, padding: "16px 0 0", borderTop: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--text-body)" }}>
            <li style={{ display: "flex", gap: 10 }}><Icon name="map-pin" size={18} color="var(--accent)" />Nguồn gốc: {p.origin}</li>
            <li style={{ display: "flex", gap: 10 }}><Icon name="qr-code" size={18} color="var(--accent)" />Thanh toán VietQR hoặc COD</li>
            <li style={{ display: "flex", gap: 10 }}><Icon name="truck" size={18} color="var(--accent)" />Lam Trà xác nhận qua Zalo trong 30 phút</li>
          </ul>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px clamp(28px,4vw,56px)", marginTop: "clamp(56px,7vw,88px)" }}>
        <section aria-labelledby="thong-so" style={{ flex: "1 1 360px", minWidth: 0 }}>
          <SectionTitle id="thong-so" title="Thông tin trà" />
          <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "minmax(96px, 130px) 1fr", fontSize: 14 }}>
            {p.specs.map((s) => (
              <div key={s.label} style={{ display: "contents" }}>
                <dt style={{ padding: "12px 0", borderBottom: "1px solid var(--border-hairline)", color: "var(--text-muted)" }}>{s.label}</dt>
                <dd style={{ margin: 0, padding: "12px 0 12px 16px", borderBottom: "1px solid var(--border-hairline)", color: "var(--text-strong)", lineHeight: 1.5 }}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div style={{ flex: "1 1 360px", minWidth: 0, display: "flex", flexDirection: "column", gap: 40 }}>
          {p.brew && (
            <section aria-labelledby="cach-pha">
              <SectionTitle id="cach-pha" title="Cách pha" action={<Link href="/tra-dam/cach-pha-tra-thai-nguyen" style={{ fontSize: 14 }}>Đọc hướng dẫn đầy đủ</Link>} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }}>
                {[
                  { icon: "thermometer", k: "Nhiệt độ nước", v: p.brew.temp },
                  { icon: "leaf", k: "Lượng trà", v: p.brew.amount },
                  { icon: "timer", k: "Thời gian hãm", v: p.brew.time },
                  { icon: "repeat", k: "Số lần pha", v: p.brew.infusions },
                ].map((b) => (
                  <div key={b.k} style={{ padding: "14px 16px", border: "1px solid var(--border-hairline)", borderRadius: 6, background: "var(--surface-card)", display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}><Icon name={b.icon} size={16} color="var(--accent)" />{b.k}</span>
                    <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-strong)" }}>{b.v}</span>
                  </div>
                ))}
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-body)" }}>{p.brew.tip}</p>
            </section>
          )}

          <section aria-labelledby="chinh-sach">
            <SectionTitle id="chinh-sach" title="Giao hàng và đổi trả" action={<Link href="/chinh-sach" style={{ fontSize: 14 }}>Xem chính sách</Link>} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              {POLICIES.map((x) => (
                <details key={x.title} className="lt-details">
                  <summary><Icon name={x.icon} size={18} color="var(--accent)" />{x.title}</summary>
                  <p>{x.text}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>

      <ProductReviews p={p} />

      <section aria-labelledby="lien-quan" style={{ marginTop: "clamp(56px,7vw,88px)" }}>
        <SectionTitle id="lien-quan" eyebrow="Có thể bạn thích" title="Trà cùng gu" action={<Link href="/san-pham" style={{ fontSize: 14 }}>Xem tất cả</Link>} />
        <TeaGrid products={related(p)} />
      </section>
    </div>
  );
}
