"use client";

// Các section giới thiệu sản phẩm có ảnh chụp thật: Hydron Dune, túi xách ly, móc khóa linh vật.
// Nền dùng lớp kính mờ (.hd-glass) đặt trên ảnh hoặc các mảng màu loang để thấy nội dung phía sau.
import Link from "next/link";
import { useState } from "react";
import { photoFor } from "@/components/bottle/ProductVisual";
import { StickerIcon } from "@/components/bottle/stickers";
import { Icon, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { CUSTOM_STICKER_FEE, STICKERS, photo, priceRange, type Product } from "@/lib/products";

const MASCOT_STICKERS = ["gau", "tho", "capybara", "meo", "gau-truc"];

export function DuneSpotlight({ products }: { products: Product[] }) {
  const p = products.find((x) => x.slug === "hydron-dune");
  if (!p) return null;
  const [from] = priceRange(p);
  return (
    <section className="hd-spot" aria-labelledby="dune-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hd-spot-photo" src="/assets/products/dune-wide.webp" alt="Bình Hydron Dune màu kem cát, nắp xanh rêu, in tên MINH ANH số 07" width={2100} height={911} loading="lazy" />
      <div className="lt-container hd-spot-inner">
        <div className="hd-glass hd-spot-panel">
          <span className="hd-chip">Mẫu mới</span>
          <h2 id="dune-title">Hydron Dune, in tên và số như áo đấu</h2>
          <p>Thân kem cát, nắp xanh rêu, ống hút gập gọn vào nắp khi bỏ túi. Gõ tên và số của bạn, Hydron in UV ngay giữa thân bình.</p>
          <dl className="hd-spot-facts">
            <div><dt>Dung tích</dt><dd>{p.sizes.map((s) => `${s}ml`).join(", ")}</dd></div>
            <div><dt>Giá từ</dt><dd>{formatVND(from)}</dd></div>
            <div>
              <dt>Màu</dt>
              <dd className="hd-spot-colors">
                {p.colors.map((c) => <span key={c.id} title={c.name} style={{ background: c.hex }} />)}
                <span className="sr-only">{p.colors.map((c) => c.name).join(", ")}</span>
              </dd>
            </div>
          </dl>
          <div className="hd-spot-actions">
            <Link href={`/thiet-ke-3d?sp=${p.slug}`} className="hd-btn hd-btn-primary"><Icon name="pencil" size={18} />In tên lên Dune</Link>
            <Link href={`/san-pham/${p.slug}`} className="hd-btn hd-btn-line">Xem chi tiết</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SleeveShowcase({ products }: { products: Product[] }) {
  const p = products.find((x) => x.slug === "tui-xach-ly-canvas");
  const { add } = useCart();
  const [colorId, setColorId] = useState(p?.colors[0]?.id ?? "");
  if (!p || !p.colors.length) return null;
  const color = p.colors.find((c) => c.id === colorId) ?? p.colors[0];
  return (
    <section className="hd-section hd-sleeve" style={{ ["--sleeve" as string]: color.hex }} aria-labelledby="tui-xach-ly">
      <span className="hd-blob hd-blob-a" aria-hidden />
      <span className="hd-blob hd-blob-b" aria-hidden />
      <div className="lt-container hd-sleeve-grid">
        <div className="hd-glass hd-sleeve-stage">
          <span className="hd-sleeve-frame">
            {p.colors.map((c) => {
              const src = photoFor(p, c.id);
              // eslint-disable-next-line @next/next/no-img-element
              return src ? <img key={c.id} src={src} alt={c.id === color.id ? `${p.name} màu ${c.name}` : ""} data-on={c.id === color.id} loading="lazy" width={800} height={1000} /> : null;
            })}
          </span>
        </div>
        <div className="hd-sleeve-copy">
          <h2 id="tui-xach-ly">Túi xách ly canvas, xách bình đi cà phê</h2>
          <p>Ống túi canvas dày ôm sát ly giữ nhiệt hoặc bình Hydron 500 – 900ml. Ngăn da bên hông giữ ống hút inox đứng thẳng, quai xách một tay.</p>
          <fieldset className="hd-sleeve-colors">
            <legend>Màu túi: <strong>{color.name}</strong></legend>
            <div role="radiogroup" aria-label="Màu túi">
              {p.colors.map((c) => (
                <button key={c.id} type="button" role="radio" aria-checked={c.id === color.id} aria-label={c.name} title={c.name} style={{ background: c.hex }} onClick={() => setColorId(c.id)} />
              ))}
            </div>
          </fieldset>
          <p className="hd-sleeve-price">{formatVND(p.base)}</p>
          <div className="hd-spot-actions">
            <button type="button" className="hd-btn hd-btn-primary" onClick={() => add({ slug: p.slug, size: "-", color: color.id })}><Icon name="shopping-bag" size={18} />Thêm vào giỏ</button>
            <Link href={`/san-pham/${p.slug}`} className="hd-btn hd-btn-line">Xem chi tiết</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MascotShowcase({ products }: { products: Product[] }) {
  const charms = products.filter((p) => p.category === "moc-khoa");
  if (!charms.length) return null;
  const from = Math.min(...charms.map((c) => c.base));
  const names = MASCOT_STICKERS.map((id) => STICKERS.find((s) => s.id === id)?.label.toLowerCase()).filter(Boolean);
  return (
    <section className="hd-section hd-mascot" aria-labelledby="linh-vat">
      <span className="hd-blob hd-blob-c" aria-hidden />
      <span className="hd-blob hd-blob-d" aria-hidden />
      <div className="lt-container">
        <div className="hd-section-head">
          <div>
            <h2 id="linh-vat">Linh vật Hydron móc vào quai bình</h2>
            <p>Năm bạn nhỏ bằng silicon và bông, móc càng cua bấm vào quai bình, ba lô hay chùm chìa khóa. Giá từ {formatVND(from)}.</p>
          </div>
          <Link href="/san-pham?danh-muc=moc-khoa" className="hd-link">Xem cả bộ móc khóa <Icon name="arrow-right" size={16} /></Link>
        </div>
        <ul className="hd-mascots">
          {charms.map((m) => (
            <li key={m.slug}>
              <Link href={`/san-pham/${m.slug}`} className="hd-glass hd-mascot-card">
                <span className="hd-mascot-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo(m.ph)} alt={m.name} loading="lazy" width={640} height={800} />
                </span>
                <span className="hd-mascot-name">{m.name.replace(/^Móc khóa /, "")}</span>
                <span className="hd-mascot-price">{formatVND(m.base)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="hd-glass hd-mascot-studio">
          <div className="hd-mascot-stickers" aria-hidden>
            {MASCOT_STICKERS.map((id) => <span key={id}><StickerIcon id={id} size={30} /></span>)}
          </div>
          <p><strong>In linh vật lên bình.</strong> Sticker {names.join(", ")} có sẵn trong trình thiết kế 3D, in cạnh tên của bạn với giá {formatVND(CUSTOM_STICKER_FEE)}.</p>
          <Link href="/thiet-ke-3d" className="hd-btn hd-btn-primary">Chọn sticker linh vật</Link>
        </div>
      </div>
    </section>
  );
}
