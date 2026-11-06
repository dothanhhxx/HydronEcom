import Link from "next/link";
import { Button, Icon, ProductImage, Rating, SectionTitle } from "@/components/ds";
import { TeaGrid } from "@/components/catalog/TeaCard";
import { POSTS, formatDate } from "@/lib/posts";
import { CATEGORIES, PRODUCTS, getProduct, photo, type Product } from "@/lib/products";
import { TESTIMONIALS } from "@/lib/reviews";
import { PhotoBand, TeaSprig } from "@/components/shell/PhotoBand";

const section = { paddingTop: "clamp(40px,5vw,64px)", paddingBottom: "clamp(40px,5vw,64px)" } as const;

export default function HomeSections({ products }: { products?: Product[] } = {}) {
  const allProducts = products && products.length > 0 ? products : PRODUCTS;
  const reviewTotal = allProducts.reduce((s, p) => s + p.reviews, 0) || 1;
  const avg = allProducts.reduce((s, p) => s + p.rating * p.reviews, 0) / reviewTotal;
  const sellers = [...allProducts].sort((a, b) => b.sold - a.sold).slice(0, 4);

  return (
    <>
      <section aria-labelledby="danh-muc" className="lt-container" style={{ ...section, paddingTop: 0 }}>
        <SectionTitle id="danh-muc" eyebrow="Danh mục" title="Chọn theo gu trà" action={<Link href="/san-pham" style={{ fontSize: 14 }}>Xem tất cả</Link>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/san-pham?danh-muc=${c.slug}`} className="lt-card" style={{ position: "relative", display: "block", borderRadius: 6, overflow: "hidden", textDecoration: "none" }}>
              <span className="lt-card-photo" style={{ display: "block" }}>
                <ProductImage src={photo(c.ph)} alt="" ratio="4 / 3" />
              </span>
              <span style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(25,36,26,.82) 0%, rgba(25,36,26,.1) 60%)" }} />
              <span style={{ position: "absolute", left: 18, right: 18, bottom: 16, display: "flex", flexDirection: "column", gap: 4, color: "var(--logo-cream)" }}>
                <span
                  style={{
                    fontSize: "clamp(21px, 2vw, 25px)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {c.name}
                  <Icon name="arrow-right" size={16} />
                </span>
                <span style={{ fontSize: 13, lineHeight: 1.45, color: "var(--reu-100)" }}>{c.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="ban-chay" className="lt-bg-veil">
        <div className="lt-container" style={section}>
          <SectionTitle id="ban-chay" eyebrow="Được mua nhiều" title="Trà bán chạy" action={<Link href="/san-pham?sap-xep=ban-chay" style={{ fontSize: 14 }}>Xem thêm</Link>} />
          <TeaGrid products={sellers} />
        </div>
      </section>

      <section aria-labelledby="khach-noi" className="lt-bg-ink">
      <div className="lt-container" style={section}>
        <SectionTitle
          id="khach-noi"
          eyebrow="Khách nói về Lam Trà"
          title={`${avg.toFixed(1)} trên 5 từ ${reviewTotal} đánh giá`}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 16 }}>
          {TESTIMONIALS.map((r) => {
            const p = getProduct(r.slug);
            return (
              <figure key={r.name} style={{ margin: 0, padding: 24, border: "1px solid var(--border-hairline)", borderRadius: 6, background: "var(--surface-card)", display: "flex", flexDirection: "column", gap: 14 }}>
                <Rating value={r.stars} />
                <blockquote style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--text-strong)" }}>“{r.text}”</blockquote>
                <figcaption style={{ marginTop: "auto", fontSize: 13, color: "var(--text-muted)" }}>
                  <strong style={{ fontWeight: 500, color: "var(--text-body)" }}>{r.name}</strong>
                  {r.verified && " · Đã mua hàng"}
                  {p && (
                    <>
                      {" · "}
                      <Link href={`/san-pham/${p.slug}`}>{p.name}</Link>
                    </>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
      </section>

      <section aria-labelledby="tra-dam">
      <div className="lt-container" style={{ ...section, paddingBottom: "clamp(64px,7vw,104px)" }}>
        <SectionTitle id="tra-dam" eyebrow="Trà đàm" title="Hiểu trà để thưởng trà" action={<Link href="/tra-dam" style={{ fontSize: 14 }}>Đọc thêm</Link>} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 24 }}>
          {POSTS.slice(0, 6).map((p) => (
            <Link key={p.slug} href={`/tra-dam/${p.slug}`} className="lt-card" style={{ display: "flex", gap: 16, alignItems: "center", textDecoration: "none" }}>
              <span className="lt-card-photo" style={{ flex: "0 0 112px", borderRadius: 6, overflow: "hidden" }}>
                <ProductImage src={photo(p.ph)} alt="" ratio="1 / 1" />
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span className="lt-card-name" style={{ fontSize: 16, lineHeight: 1.35, fontWeight: 500, color: "var(--text-strong)" }}>{p.title}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(p.date)} · {p.readMin} phút đọc</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
      </section>

      <TeaSprig side="right" />
      <PhotoBand
        id="ve-tan-cuong"
        image="/assets/bg/tea-hills-mist.webp"
        title="Từ đồi chè sương sớm đến chén trà nhà bạn."
        desc="Búp chè Tân Cương hái tay khi còn đọng sương, sao trên chảo gang trong ngày. Lam Trà gửi đi khắp Việt Nam, xác nhận đơn qua Zalo trong 30 phút."
        actions={
          <>
            <Button href="/san-pham" variant="accent" iconRight="arrow-right">Chọn trà</Button>
            <Link href="/cau-chuyen" className="lt-gift-link">Đọc câu chuyện Lam Trà</Link>
          </>
        }
      />
    </>
  );
}
