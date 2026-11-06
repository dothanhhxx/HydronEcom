"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Bottle3D from "@/components/bottle/Bottle3D";
import ProductVisual, { tintFor } from "@/components/bottle/ProductVisual";
import BottleRender from "@/components/bottle/BottleRender";
import { Badge, Button, Dialog, Icon, Price, QuantityStepper, WishButton, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { FREE_SHIP_MIN } from "@/lib/checkout";
import { CUSTOM_STICKER_FEE, CUSTOM_TEXT_FEE, LOW_STOCK, SIZE_INFO, badgeOf, colorOf, compareAtOf, defaultColor, defaultSize, findProduct, maxQtyOf, priceOf, related, sizeLabel, stockOf, variantLabel, type Product } from "@/lib/products";
import { SITE, telLink, zaloLink } from "@/lib/site";
import { ProductGridList } from "./ProductCard";
import { ColorPicker, SizePicker } from "./VariantPicker";

const photoUrl = (ph: string) => (/^(https?:|\/|data:)/.test(ph) ? ph : `/uploads/${ph}`);

function Gallery({ p, size, color }: { p: Product; size: string; color: string }) {
  const [view, setView] = useState<string>("render");
  const [zoom, setZoom] = useState(false);
  const c = colorOf(p, color);
  const photos = [...(p.ph ? [{ ph: p.ph, alt: p.name }] : []), ...p.gallery];
  const can3d = p.customizable;
  useEffect(() => setView((v) => (v === "3d" ? v : "render")), [color, size]);

  const main =
    view === "3d" ? (
      <Bottle3D shape={p.shape} hex={c?.hex ?? "#0688AE"} lid={c?.lid} size={size} label={`Mô hình 3D ${p.name}, kéo để xoay`} />
    ) : view === "video" && p.video ? (
      /\.(mp4|webm)$/i.test(p.video) ? (
        <video src={p.video} controls playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: "#000" }} />
      ) : (
        <iframe src={p.video} title={`Video ${p.name}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
      )
    ) : view.startsWith("photo:") ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoUrl(view.slice(6))} alt={photos.find((x) => x.ph === view.slice(6))?.alt ?? p.name} />
    ) : (
      <ProductVisual product={p} size={size} color={color} />
    );

  return (
    <div className="hd-gallery">
      <div className="hd-gallery-main" style={{ ["--card-tint" as string]: tintFor(p, color), cursor: view === "3d" || view === "video" ? "grab" : "zoom-in" }} onClick={() => view !== "3d" && view !== "video" && setZoom(true)}>
        {main}
        {view === "3d" && <span className="hd-studio-hint"><Icon name="rotate-ccw" size={14} />Kéo để xoay bình</span>}
      </div>
      <div className="hd-gallery-thumbs" role="group" aria-label="Chọn ảnh">
        <button type="button" aria-pressed={view === "render"} aria-label="Ảnh sản phẩm theo màu đã chọn" onClick={() => setView("render")} style={{ background: tintFor(p, color) }}>
          <BottleRender shape={p.shape} hex={c?.hex ?? "#0688AE"} lid={c?.lid} size={size} label="" />
        </button>
        {can3d && (
          <button type="button" aria-pressed={view === "3d"} aria-label="Xem mô hình 3D" onClick={() => setView("3d")} style={{ background: "var(--ink-900)", color: "var(--cream-100)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4, font: "600 12px var(--font-ui)" }}>
            <Icon name="rotate-ccw" size={20} />
            3D
          </button>
        )}
        {photos.map((x) => (
          <button key={x.ph} type="button" aria-pressed={view === "photo:" + x.ph} aria-label={x.alt || "Ảnh sản phẩm"} onClick={() => setView("photo:" + x.ph)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl(x.ph)} alt="" loading="lazy" />
          </button>
        ))}
        {p.video && (
          <button type="button" aria-pressed={view === "video"} aria-label="Xem video" onClick={() => setView("video")} style={{ background: "var(--blue-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="play" size={22} />
          </button>
        )}
      </div>
      <Dialog open={zoom} onClose={() => setZoom(false)} title={`${p.name} · ${variantLabel(p, size, color)}`} maxWidth={900}>
        <div style={{ position: "relative", aspectRatio: "4 / 5", maxHeight: "78vh", margin: "0 auto", background: tintFor(p, color) }}>
          {view.startsWith("photo:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl(view.slice(6))} alt={p.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
          ) : (
            <ProductVisual product={p} size={size} color={color} />
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default function ProductDetail({ product: initial, initialColor, products }: { product: Product; initialColor?: string; products: Product[] }) {
  const { add, isWished, toggleWish, products: live } = useCart();
  const p = findProduct(live, initial.slug) ?? initial;
  const router = useRouter();
  const [size, setSize] = useState(defaultSize(p));
  const [color, setColor] = useState(initialColor && p.colors.some((c) => c.id === initialColor) ? initialColor : defaultColor(p));
  const [qty, setQty] = useState(1);
  const [stickyShow, setStickyShow] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const max = maxQtyOf(p, size, color);
  const left = stockOf(p, size, color);
  const badge = badgeOf(p);
  const unit = priceOf(p, size);

  // Đổi dung tích làm màu đang chọn hết hàng: nhảy sang màu còn hàng
  useEffect(() => {
    if (maxQtyOf(p, size, color) < 1) {
      const ok = p.colors.find((c) => maxQtyOf(p, size, c.id) > 0);
      if (ok) setColor(ok.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  useEffect(() => {
    const el = buyRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStickyShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const addToCart = () => add({ slug: p.slug, size, color, qty });
  const buyNow = () => {
    if (add({ slug: p.slug, size, color, qty })) router.push("/thanh-toan");
  };
  const studioHref = `/thiet-ke-3d?sp=${p.slug}&size=${size}&mau=${color}`;
  const zaloText = encodeURIComponent(`Chào Hydron, mình muốn đặt ${p.name} ${variantLabel(p, size, color)} x${qty}.`);

  return (
    <>
      <div className="lt-container hd-pdp">
        <Gallery p={p} size={size} color={color} />

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{p.kind}</span>
              {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
            </div>
            <h1 style={{ marginTop: 10, fontSize: "clamp(30px, 3.6vw, 46px)" }}>{p.name}</h1>
            <p style={{ marginTop: 10, fontSize: 16, color: "var(--text-body)" }}>{p.note}</p>
            <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <Price value={unit} compareAt={compareAtOf(p, size)} size="lg" />
              {p.sizes.length > 0 && <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{sizeLabel(size)}</span>}
            </div>
          </div>

          <SizePicker product={p} value={size} color={color} onChange={setSize} />
          <ColorPicker product={p} value={color} size={size} onChange={setColor} />

          {p.customizable && (
            <Link href={studioHref} className="hd-custom-cta">
              <span style={{ position: "relative", width: 56, height: 68, flexShrink: 0, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                <BottleRender shape={p.shape} hex={colorOf(p, color)?.hex ?? "#0688AE"} lid={colorOf(p, color)?.lid} size={size} custom={{ text: "MINH", font: "block", ink: "#FFFFFF", sticker: "song" }} label="" noShadow />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ display: "block", fontSize: 15.5, color: "var(--text-strong)" }}>In tên, số hoặc sticker lên bình</strong>
                <span style={{ fontSize: 13.5, color: "var(--text-muted)" }}>Xem trước trên mô hình 3D · in tên +{formatVND(CUSTOM_TEXT_FEE)}, sticker +{formatVND(CUSTOM_STICKER_FEE)}</span>
              </span>
              <Icon name="arrow-right" size={20} color="var(--primary)" />
            </Link>
          )}

          <div ref={buyRef} style={{ display: "grid", gap: 10 }}>
            <div className="hd-buy-row">
              <QuantityStepper value={Math.min(qty, Math.max(max, 1))} max={Math.max(max, 1)} onChange={setQty} />
              <Button size="lg" variant="secondary" disabled={max < 1} onClick={addToCart} iconLeft="shopping-bag">
                {max < 1 ? "Tạm hết hàng" : "Thêm vào giỏ"}
              </Button>
            </div>
            <Button size="lg" fullWidth disabled={max < 1} onClick={buyNow}>Mua ngay · {formatVND(unit * qty)}</Button>
            {left !== undefined && left > 0 && left <= LOW_STOCK && (
              <span style={{ fontSize: 13.5, color: "var(--warning)", display: "flex", alignItems: "center", gap: 6 }}><Icon name="info" size={16} />Chỉ còn {left} bình {variantLabel(p, size, color)}</span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 14, color: "var(--text-muted)" }}>
              Đặt nhanh qua
              <a className="hd-link" href={`${zaloLink()}?text=${zaloText}`} target="_blank" rel="noopener noreferrer">Zalo</a>·
              <a className="hd-link" href={SITE.messenger} target="_blank" rel="noopener noreferrer">Messenger</a>·
              <a className="hd-link" href={telLink()}>gọi {SITE.phone}</a>
              <span style={{ marginLeft: "auto" }}>
                <WishButton on={isWished(p.slug)} name={p.name} onClick={() => toggleWish(p.slug)} size={40} />
              </span>
            </div>
          </div>

          <ul style={{ listStyle: "none", margin: 0, padding: "18px 0 0", borderTop: "1px solid var(--border-hairline)", display: "grid", gap: 12, fontSize: 14.5 }}>
            {[
              ["truck", `Miễn phí giao hàng cho đơn từ ${formatVND(FREE_SHIP_MIN)}`],
              ["rotate-ccw", "Đổi trả trong 7 ngày nếu lỗi hoặc giao sai"],
              ["shield-check", "Bảo hành giữ nhiệt 12 tháng, đổi bình mới"],
              ["banknote", "Thanh toán VietQR hoặc tiền mặt khi nhận"],
            ].map(([icon, text]) => (
              <li key={text} style={{ display: "flex", gap: 12, alignItems: "center", color: "var(--text-body)" }}>
                <Icon name={icon} size={20} color="var(--blue-600)" />
                {text}
              </li>
            ))}
          </ul>
          {p.sku && <span style={{ fontSize: 12.5, color: "var(--text-subtle)" }}>Mã sản phẩm: {p.sku}{p.sizes.length ? `-${size}` : ""}-{color.toUpperCase()}</span>}
        </div>
      </div>

      <div style={{ background: "var(--cream-50)", borderTop: "1px solid var(--border-hairline)" }}>
        <div className="lt-container" style={{ display: "grid", gap: "clamp(40px, 6vw, 64px)", paddingTop: "clamp(48px, 7vw, 88px)", paddingBottom: "clamp(48px, 7vw, 88px)" }}>
          <section aria-labelledby="mo-ta" className="hd-split" style={{ alignItems: "start" }}>
            <div>
              <h2 id="mo-ta" style={{ fontSize: "clamp(24px, 2.6vw, 32px)" }}>Mô tả</h2>
              <p style={{ marginTop: 14, fontSize: 16.5, lineHeight: 1.75, color: "var(--text-body)", maxWidth: 560 }}>{p.desc}</p>
            </div>
            <div>
              <h2 id="thong-so" style={{ fontSize: "clamp(24px, 2.6vw, 32px)" }}>Thông số</h2>
              <table className="hd-spec" style={{ marginTop: 10 }}>
                <tbody>
                  {p.specs.map((s) => (
                    <tr key={s.label}>
                      <th scope="row">{s.label}</th>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {p.sizes.length > 0 && (
            <section aria-labelledby="bang-size">
              <h2 id="bang-size" style={{ fontSize: "clamp(24px, 2.6vw, 32px)" }}>Bảng dung tích</h2>
              <p style={{ marginTop: 10, color: "var(--text-muted)" }}>Hình vẽ cùng tỉ lệ để bạn so chiều cao các dung tích.</p>
              <div className="hd-sizes" style={{ marginTop: 28, gridTemplateColumns: `repeat(${p.sizes.length}, minmax(0, 1fr))`, maxWidth: p.sizes.length < 3 ? 640 : undefined }}>
                {p.sizes.map((s) => {
                  const info = SIZE_INFO[s];
                  return (
                    <button key={s} type="button" className="hd-size" onClick={() => setSize(s)} aria-pressed={s === size} style={{ border: 0, background: "transparent", cursor: "pointer", font: "inherit", color: "inherit", padding: 0 }}>
                      <span className="hd-size-vis" style={{ height: "clamp(180px, 24vw, 300px)" }}>
                        <BottleRender shape={p.shape} hex={s === size ? colorOf(p, color)?.hex ?? "#0688AE" : "#D5C4A6"} size={s} label="" viewBox="100 48 200 412" noShadow />
                      </span>
                      <h3 style={{ color: s === size ? "var(--primary)" : undefined }}>{s}ml</h3>
                      {info && (
                        <>
                          <dl>
                            <dd>Cao {info.height} · Ø {info.diameter}</dd>
                            <dd>Nặng {info.weight}</dd>
                          </dl>
                          <p>{info.fits}</p>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section aria-labelledby="bao-quan" style={{ maxWidth: 760 }}>
            <h2 id="bao-quan" style={{ fontSize: "clamp(24px, 2.6vw, 32px)" }}>Hướng dẫn sử dụng và bảo quản</h2>
            <ol style={{ margin: "18px 0 0", paddingLeft: 22, display: "grid", gap: 10, fontSize: 16, lineHeight: 1.65, color: "var(--text-body)" }}>
              {p.care.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <section className="hd-section" aria-labelledby="lien-quan">
        <div className="lt-container">
          <div className="hd-section-head">
            <h2 id="lien-quan">Thường mua cùng</h2>
            <Link href="/san-pham" className="hd-link">Tất cả sản phẩm <Icon name="arrow-right" size={16} /></Link>
          </div>
          <ProductGridList products={related(p, products)} four />
        </div>
      </section>

      <div className="hd-sticky-buy" data-show={stickyShow} aria-hidden={!stickyShow}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: "block", fontSize: 14, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</strong>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{variantLabel(p, size, color)} · {formatVND(unit)}</span>
        </span>
        <Button disabled={max < 1} onClick={addToCart} iconLeft="shopping-bag">Thêm</Button>
      </div>
    </>
  );
}
