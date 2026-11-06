"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Icon, IconButton, OptionPicker, Price, ProductImage, Rating } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { DEFAULT_GRADE, DEFAULT_SIZE, GRADE_OPTIONS, PRODUCTS as STATIC_TEAS, SIZE_OPTIONS, photo, priceOf, variantLabel, type Product } from "@/lib/products";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Landing({ products }: { products?: Product[] } = {}) {
  const TEAS = products && products.length > 0 ? products : STATIC_TEAS;
  const router = useRouter();
  const { add } = useCart();
  const [idx, setIdx] = useState(0);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [grade, setGrade] = useState(DEFAULT_GRADE);
  const [added, setAdded] = useState(false);
  const [fading, setFading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [w, setW] = useState(1280);
  const stageRef = useRef<HTMLElement>(null);
  const t1 = useRef<ReturnType<typeof setTimeout>>(undefined);
  const t2 = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    const t0 = setTimeout(() => setLoaded(true), 60);
    TEAS.forEach((t) => {
      const i = new Image();
      i.src = photo(t.ph);
    });
    return () => {
      window.removeEventListener("resize", onResize);
      [t0, t1.current, t2.current].forEach(clearTimeout);
    };
  }, []);

  const scrollToStage = () => {
    const el = stageRef.current;
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
  };

  const pick = (i: number) => {
    const n = (i + TEAS.length) % TEAS.length;
    if (n === idx) return;
    clearTimeout(t1.current);
    setFading(true);
    setAdded(false);
    t1.current = setTimeout(() => {
      setIdx(n);
      setFading(false);
    }, 160);
  };

  const go = (i: number | null) => (e?: MouseEvent) => {
    e?.preventDefault();
    if (i != null) pick(i);
    scrollToStage();
  };

  const addToCart = () => {
    clearTimeout(t2.current);
    add(tea.slug, size, grade);
    setAdded(true);
    t2.current = setTimeout(() => setAdded(false), 2200);
  };
  const buyNow = () => {
    if (add(tea.slug, size, grade)) router.push("/gio-hang");
  };

  const safeIdx = Math.min(idx, Math.max(0, TEAS.length - 1));
  const tea = TEAS[safeIdx] || TEAS[0];
  const isDesktop = w >= 1000;
  const mobile = w < 720;
  const price = tea ? priceOf(tea, size, grade) : 0;

  const trust = [
    { icon: "leaf", a: "Búp chè Tân Cương", b: "hái tay sáng sớm", divider: true },
    { icon: "scale", a: "Rõ khối lượng", b: "và phân hạng", divider: !mobile },
    { icon: "qr-code", a: "Thanh toán VietQR", b: "hoặc COD", divider: false },
  ];

  return (
    <div>

      <section
        style={{
          position: "relative", overflow: "hidden", background: "var(--reu-900)",
          minHeight: mobile ? 620 : "min(640px, 82vh)", display: "flex", alignItems: mobile ? "flex-end" : "center",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0, backgroundImage: "url('/assets/photos/hero.jpg')", backgroundSize: "cover",
            backgroundPosition: mobile ? "30% center" : "center", transform: `scale(${loaded ? 1 : 1.04})`,
            transition: "transform 1600ms cubic-bezier(.2,.7,.2,1)",
          }}
        />
        <div
          style={{
            position: "absolute", inset: 0,
            background: mobile
              ? "linear-gradient(0deg, rgba(25,36,26,.96) 0%, rgba(36,52,31,.82) 50%, rgba(36,52,31,.35) 100%)"
              : "linear-gradient(90deg, rgba(25,36,26,.94) 0%, rgba(36,52,31,.82) 38%, rgba(36,52,31,.25) 72%, rgba(36,52,31,.1) 100%), linear-gradient(0deg, rgba(25,36,26,.6) 0%, transparent 30%)",
          }}
        />
        <div style={{ position: "relative", width: "100%", maxWidth: 1240, margin: "0 auto", padding: mobile ? "88px 20px 112px" : "72px clamp(24px,3vw,40px) 150px" }}>
          <div
            style={{
              maxWidth: 580, opacity: loaded ? 1 : 0, transform: `translateY(${loaded ? "0px" : "8px"})`,
              transition: "opacity 600ms cubic-bezier(.2,.7,.2,1),transform 600ms cubic-bezier(.2,.7,.2,1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <span style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", fontWeight: 500, color: "var(--tra-300)", whiteSpace: "nowrap", flexShrink: 0 }}>Tân Cương · Thái Nguyên</span>
              <span style={{ flex: "0 0 64px", height: 1, background: "var(--tra-400)", opacity: 0.7 }} />
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(40px, 4.8vw, 62px)",
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: "0.015em",
                fontFamily: "var(--font-display)",
                color: "var(--logo-cream)",
                textWrap: "balance",
              }}
            >
              Trọn vị trà Việt,
              <br />
              <span style={{ color: "var(--tra-300)" }}>trọn tấm lòng trao gửi.</span>
            </h1>
            <p style={{ margin: "18px 0 0", maxWidth: 460, fontSize: "clamp(15px,1.1vw,16px)", lineHeight: 1.65, color: "var(--reu-100)", textWrap: "pretty" }}>
              Búp chè Tân Cương hái sáng sớm, sao tay trên chảo gang. Mỗi gói trà ghi rõ khối lượng và phân hạng, để bạn chọn đúng vị cho mình hay cho người thân.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 24px", marginTop: 26 }}>
              <Button variant="accent" iconRight="arrow-right" onClick={go(null)}>
                Mua ngay
              </Button>
              <a href="#tra-noi-bat" onClick={go(TEAS.findIndex((t) => t.category === "qua-tang"))} className="lt-gift-link">
                <Icon name="gift" size={18} />
                Xem hộp quà biếu
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 0", marginTop: 34 }}>
              {trust.map((t) => (
                <div key={t.icon} style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 18, marginRight: 18, borderRight: t.divider ? "1px solid rgba(188,154,108,.3)" : 0 }}>
                  <span style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 999, border: "1px solid rgba(188,154,108,.6)", color: "var(--tra-300)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={t.icon} size={16} />
                  </span>
                  <span style={{ fontSize: 12.5, lineHeight: 1.4, color: "var(--logo-cream)" }}>
                    {t.a}
                    <br />
                    <span style={{ color: "var(--reu-200)" }}>{t.b}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="tra-noi-bat" aria-label="Trà nổi bật" ref={stageRef} style={{ position: "relative", zIndex: 2, padding: "0 clamp(12px,3vw,40px) clamp(40px,5vw,64px)", marginTop: mobile ? -72 : -96 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", background: "var(--surface-card)", border: "1px solid var(--border-hairline)", borderRadius: 10, boxShadow: "var(--shadow-lg)", overflow: "hidden", display: "flex", flexWrap: "wrap" }}>
          {isDesktop ? (
            <div style={{ flex: "0 0 220px", padding: "16px 12px", background: "var(--logo-green)", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--tra-300)", padding: "4px 10px 12px" }}>Trà nổi bật</div>
              {TEAS.map((t, i) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => pick(i)}
                  className={i === idx ? "lt-tea-item" : "lt-tea-item lt-tea-idle"}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "6px 8px", borderRadius: 6,
                    border: "1px solid " + (i === idx ? "rgba(188,154,108,.7)" : "rgba(253,237,216,.1)"),
                    background: i === idx ? "rgba(188,154,108,.16)" : undefined,
                    color: "var(--logo-cream)", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                    transition: "background 200ms,border-color 200ms",
                  }}
                >
                  <span style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 4, backgroundImage: `url('${photo(t.ph)}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 11, color: "var(--tra-300)", fontVariantNumeric: "tabular-nums" }}>{pad(i + 1)}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.25 }}>{t.name}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ flex: "1 1 100%", display: "flex", gap: 8, overflowX: "auto", padding: 12, background: "var(--logo-green)", scrollbarWidth: "none" }}>
              {TEAS.map((t, i) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => pick(i)}
                  style={{
                    flexShrink: 0, display: "flex", alignItems: "center", gap: 8, height: 44, padding: "0 14px 0 6px", borderRadius: 999,
                    border: "1px solid " + (i === idx ? "rgba(188,154,108,.7)" : "rgba(253,237,216,.1)"),
                    background: i === idx ? "rgba(188,154,108,.16)" : "transparent",
                    color: "var(--logo-cream)", fontFamily: "inherit", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer",
                  }}
                >
                  <span style={{ width: 32, height: 32, borderRadius: 999, backgroundImage: `url('${photo(t.ph)}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  {t.name}
                </button>
              ))}
            </div>
          )}

          <div style={{ flex: "999 1 420px", minWidth: 0, padding: "clamp(12px,1.6vw,20px)", display: "flex" }}>
            <div style={{ position: "relative", flex: 1, alignSelf: isDesktop ? "stretch" : "flex-start", opacity: fading ? 0 : 1, transition: "opacity 200ms cubic-bezier(.2,.7,.2,1)" }}>
              {isDesktop ? (
                // Desktop: ảnh cao bằng cột thông tin bên cạnh, không để khoảng trắng
                <div style={{ position: "relative", height: "100%", minHeight: 420, borderRadius: 6, overflow: "hidden", background: "var(--surface-photo)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo(tea.ph)} alt={tea.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <ProductImage src={photo(tea.ph)} alt={tea.name} ratio={mobile ? "4 / 3" : "5 / 4"} radius="6px" />
              )}
              <span style={{ position: "absolute", left: 14, top: 14, padding: "6px 12px", borderRadius: 999, background: "rgba(252,248,241,.88)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", fontSize: 12, color: "var(--text-strong)", whiteSpace: "nowrap" }}>
                {tea.origin}
              </span>
              <div style={{ position: "absolute", right: 14, bottom: 14, display: "flex", gap: 8 }}>
                <IconButton icon="chevron-left" label="Trà trước" variant="surface" onClick={() => pick(idx - 1)} />
                <IconButton icon="chevron-right" label="Trà tiếp theo" variant="surface" onClick={() => pick(idx + 1)} />
              </div>
            </div>
          </div>

          <div style={{ flex: "1 1 320px", minWidth: 0, padding: "clamp(20px,2.4vw,32px) clamp(20px,2.4vw,32px) clamp(20px,2.4vw,28px) clamp(20px,1vw,12px)", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>
                {pad(idx + 1)} / {pad(TEAS.length)} · {tea.kind}
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(26px, 2.6vw, 34px)",
                  lineHeight: 1.16,
                  fontWeight: 600,
                  letterSpacing: "0.015em",
                  fontFamily: "var(--font-display)",
                  color: "var(--text-strong)",
                }}
              >
                <Link href={`/san-pham/${tea.slug}`} className="lt-card-name" style={{ color: "inherit", textDecoration: "none" }}>{tea.name}</Link>
              </h2>
              <div style={{ fontSize: 15, color: "var(--tra-500)" }}>{tea.note}</div>
              <Rating value={tea.rating} count={tea.reviews} />
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)", textWrap: "pretty" }}>{tea.desc}</p>
            {tea.fixed ? (
              <div style={{ padding: "14px 16px", border: "1px solid var(--border-hairline)", borderRadius: 6, background: "var(--bg-page)", fontSize: 13, lineHeight: 1.55, color: "var(--text-body)" }}>
                Bộ quà gói sẵn trong hộp sơn mài. Bạn ghi lời nhắn ở bước đặt hàng, Lam Trà sẽ viết tay vào thiệp.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <OptionPicker label="Khối lượng" options={SIZE_OPTIONS} value={size} onChange={(v) => { setSize(v); setAdded(false); }} />
                <OptionPicker label="Phân hạng" options={GRADE_OPTIONS} value={grade} onChange={(v) => { setGrade(v); setAdded(false); }} />
              </div>
            )}
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, paddingTop: 16, borderTop: "1px solid var(--border-hairline)", marginTop: "auto" }}>
              <Price value={price} compareAt={tea.compareAt && size === DEFAULT_SIZE && grade === DEFAULT_GRADE ? tea.compareAt : undefined} size="lg" />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{variantLabel(tea, size, grade)}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <div style={{ flex: "1 1 150px", minWidth: 0 }}>
                <Button variant="secondary" fullWidth iconLeft={added ? "check" : "shopping-bag"} onClick={addToCart}>
                  {added ? "Đã thêm" : "Thêm vào giỏ"}
                </Button>
              </div>
              <div style={{ flex: "1 1 150px", minWidth: 0 }}>
                <Button fullWidth iconRight="arrow-right" onClick={buyNow}>
                  Mua ngay
                </Button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Thanh toán VietQR hoặc COD · Lam Trà xác nhận qua Zalo trong 30 phút</div>
          </div>
        </div>
      </section>
    </div>
  );
}
