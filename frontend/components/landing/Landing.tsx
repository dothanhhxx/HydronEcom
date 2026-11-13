"use client";

import Link from "next/link";
import { useState } from "react";
import Bottle3D from "@/components/bottle/Bottle3D";
import BottleRender from "@/components/bottle/BottleRender";
import { ProductGridList } from "@/components/catalog/ProductCard";
import { Icon, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { CUSTOM_LEAD_TIME, FREE_SHIP_MIN } from "@/lib/checkout";
import type { Post } from "@/lib/posts";
import { CATEGORIES, CUSTOM_TEXT_FEE, SIZE_INFO, priceRange, type Product } from "@/lib/products";
import PostCover from "./PostCover";
import Process from "./Process";
import { DuneSpotlight, MascotShowcase, SleeveShowcase } from "./Showcase";

function Hero({ products }: { products: Product[] }) {
  const hero = products.find((p) => p.slug === "hydron-classic") ?? products.find((p) => p.customizable) ?? products[0];
  const [colorId, setColorId] = useState(hero?.colors[0]?.id ?? "");
  const color = hero?.colors.find((c) => c.id === colorId) ?? hero?.colors[0];
  const lows = products.filter((p) => p.category === "binh").map((p) => priceRange(p)[0]);
  const from = lows.length ? Math.min(...lows) : 150000;

  return (
    <section className="hd-hero" aria-labelledby="hero-title">
      <div className="lt-container hd-hero-grid">
        <div>
          <h1 id="hero-title">
            Bình giữ nhiệt in tên riêng, thiết kế 3D ngay trên web
          </h1>
          <p className="hd-hero-lead">
            Thép 304 hai lớp, giữ lạnh 24 giờ. Chọn dung tích 500 – 900ml, chọn màu, gõ tên của bạn rồi xoay xem trước trước khi đặt.
          </p>
          <ul className="hd-hero-facts">
            <li><strong>{formatVND(from)}</strong><span>giá từ, bình 500ml</span></li>
            <li><strong>24 giờ</strong><span>giữ lạnh, 12 giờ giữ nóng</span></li>
            <li><strong>{CUSTOM_LEAD_TIME}</strong><span>in tên và gửi đi</span></li>
          </ul>
          <div className="hd-hero-actions">
            <Link href="/thiet-ke-3d" className="hd-btn hd-btn-primary"><Icon name="pencil" size={18} />Thiết kế bình của bạn</Link>
            <Link href="/san-pham?danh-muc=binh" className="hd-btn hd-btn-line">Xem các mẫu bình</Link>
          </div>
        </div>
        {hero && color && (
          <div className="hd-hero-stage">
            <span className="hd-hero-disc" aria-hidden />
            <span className="hd-hero-ring" aria-hidden />
            <span className="hd-hero-hint" aria-hidden><Icon name="rotate-ccw" size={13} />Kéo để xoay 360°</span>
            <Bottle3D showcase shape={hero.shape} hex={color.hex} size="700" custom={{ text: "MINH ANH", font: "block", ink: color.hex === "#F1EEE8" || color.hex === "#E6D8BF" ? "#0B2A36" : "#FFFFFF", sticker: "giot" }} label={`Bình ${hero.name} màu ${color.name} in tên MINH ANH, xoay 3D`} />
            <div className="hd-hero-tag" style={{ left: "-2%", top: "24%" }}>
              <strong>In tên +{formatVND(CUSTOM_TEXT_FEE)}</strong>
              Tối đa 14 ký tự, 3 kiểu chữ
            </div>
            <div className="hd-hero-tag" style={{ right: "-2%", top: "54%" }}>
              <strong>Thép 304</strong>
              Hai lớp hút chân không
            </div>
            <div className="hd-hero-swatches" role="group" aria-label="Đổi màu bình">
              {hero.colors.map((c) => (
                <button key={c.id} type="button" aria-pressed={c.id === color.id} aria-label={c.name} title={c.name} style={{ background: c.hex }} onClick={() => setColorId(c.id)} />
              ))}
              <span aria-live="polite">{color.name}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Promises() {
  const items = [
    { icon: "truck", t: "Giao toàn quốc", d: `Miễn phí cho đơn từ ${formatVND(FREE_SHIP_MIN)}` },
    { icon: "pencil", t: "In tên theo ý bạn", d: "Xem trước 3D, in UV bền màu" },
    { icon: "rotate-ccw", t: "Đổi trả 7 ngày", d: "Lỗi hoặc giao sai, Hydron chịu phí" },
    { icon: "shield-check", t: "Bảo hành 12 tháng", d: "Mất giữ nhiệt, đổi bình mới" },
  ];
  return (
    <div className="lt-container" style={{ marginTop: "clamp(24px, 4vw, 48px)" }}>
      <div className="hd-promises">
        {items.map((i) => (
          <div key={i.t} className="hd-promise">
            <span className="hd-promise-icon"><Icon name={i.icon} size={22} /></span>
            <span><strong>{i.t}</strong><span>{i.d}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Collection({ products }: { products: Product[] }) {
  const [tab, setTab] = useState("binh");
  const list = products.filter((p) => !tab || p.category === tab);
  return (
    <section className="hd-section" aria-labelledby="bo-suu-tap">
      <div className="lt-container">
        <div className="hd-section-head">
          <div>
            <h2 id="bo-suu-tap">Chọn bình theo nhịp ngày của bạn</h2>
            <p>Nắp vặn quai xách cho dân văn phòng, nắp ống hút cho phòng gym, bình nhỏ cho bé đi học. Mẫu nào cũng in tên được.</p>
          </div>
          <div className="hd-tabs" role="group" aria-label="Lọc theo loại">
            {[{ slug: "", name: "Tất cả" }, ...CATEGORIES].map((c) => (
              <button key={c.slug} type="button" className="hd-tab" aria-pressed={tab === c.slug} onClick={() => setTab(c.slug)}>{c.name}</button>
            ))}
          </div>
        </div>
        <ProductGridList products={list.slice(0, 4)} four />
        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <Link href={tab ? `/san-pham?danh-muc=${tab}` : "/san-pham"} className="hd-btn hd-btn-line">Xem tất cả {(CATEGORIES.find((c) => c.slug === tab)?.name ?? "sản phẩm").toLowerCase()}<Icon name="arrow-right" size={18} /></Link>
        </div>
      </div>
    </section>
  );
}

function SizeGuide() {
  const sizes = ["500", "700", "900"];
  const colors = ["#0688AE", "#5B6C55", "#262B2E"];
  return (
    <section className="hd-section" aria-labelledby="dung-tich">
      <div className="lt-container">
        <div className="hd-section-head">
          <div>
            <h2 id="dung-tich">500, 700 hay 900ml?</h2>
            <p>Vẽ cùng tỉ lệ. Một người uống khoảng 2 lít nước mỗi ngày: bình 700ml rót đầy ba lần là đủ.</p>
          </div>
        </div>
        <div className="hd-sizes">
          {sizes.map((s, i) => (
            <Link key={s} href={`/san-pham?dung-tich=${s}`} className="hd-size" style={{ textDecoration: "none", color: "inherit" }}>
              <span className="hd-size-vis">
                <BottleRender shape="classic" hex={colors[i]} size={s} label={`Bình ${s}ml`} viewBox="100 48 200 412" noShadow />
              </span>
              <h3>{s}ml</h3>
              <dl>
                <dd>Cao {SIZE_INFO[s].height} · Ø {SIZE_INFO[s].diameter}</dd>
              </dl>
              <p>{SIZE_INFO[s].fits}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Bulk() {
  const names = ["An", "Bình", "Châu", "Dũng", "Hà", "Khoa"];
  return (
    <section className="hd-section" style={{ background: "var(--cream-100)" }} aria-labelledby="so-luong-lon">
      <div className="lt-container hd-split">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", alignItems: "end", gap: 4, order: 2 }} aria-hidden>
          {names.map((n) => (
            <BottleRender key={n} shape="classic" hex="#1F3A5C" size="700" custom={{ text: n, font: "round", ink: "#FFFFFF", sticker: "nui" }} label="" viewBox="130 40 140 430" />
          ))}
        </div>
        <div>
          <h2 id="so-luong-lon" style={{ fontSize: "clamp(28px, 3.4vw, 42px)" }}>In logo công ty, tên từng thành viên</h2>
          <p style={{ marginTop: 16, fontSize: 16.5, lineHeight: 1.7, color: "var(--text-body)", maxWidth: 520 }}>
            Quà tặng nhân viên, đồng phục đội bóng, kỷ niệm lớp học: cùng một mẫu bình, mỗi chiếc một tên. Đơn từ 20 bình có giá riêng và bản in thử trước khi sản xuất.
          </p>
          <ul style={{ margin: "20px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 10, fontSize: 15, color: "var(--text-body)" }}>
            {["Gửi file logo, Hydron dàn trang miễn phí", "Báo giá trong một ngày làm việc", "Giao nhiều địa chỉ trong một đơn"].map((t) => (
              <li key={t} style={{ display: "flex", gap: 10, alignItems: "center" }}><Icon name="check" size={18} color="var(--blue-600)" />{t}</li>
            ))}
          </ul>
          <Link href="/lien-he#dat-so-luong" className="hd-btn hd-btn-primary" style={{ marginTop: 28 }}>Nhận báo giá in số lượng lớn</Link>
        </div>
      </div>
    </section>
  );
}

function Journal({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="hd-section" aria-labelledby="cam-nang">
      <div className="lt-container">
        <div className="hd-section-head">
          <h2 id="cam-nang">Cẩm nang dùng bình</h2>
          <Link href="/cam-nang" className="hd-link">Tất cả bài viết <Icon name="arrow-right" size={16} /></Link>
        </div>
        <div className="hd-posts">
          {posts.slice(0, 3).map((p) => (
            <Link key={p.slug} href={`/cam-nang/${p.slug}`} className="hd-post">
              <span className="hd-post-cover"><PostCover post={p} /></span>
              <time dateTime={p.date}>{p.date.split("-").reverse().join("/")} · {p.minutes} phút đọc</time>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing({ products: initial, posts }: { products: Product[]; posts: Post[] }) {
  const { products: live } = useCart();
  const products = (live.length ? live : initial).filter((p) => p.active !== false && !p.deleted);
  return (
    <>
      <Hero products={products} />
      <Promises />
      <Collection products={products} />
      <DuneSpotlight products={products} />
      <Process models={products.filter((p) => p.customizable).length} />
      <MascotShowcase products={products} />
      <SleeveShowcase products={products} />
      <SizeGuide />
      <Bulk />
      <Journal posts={posts} />
    </>
  );
}
