"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Dialog, Icon, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { PRODUCTS, photo, priceOf } from "@/lib/products";
import { NAV } from "@/lib/site";
import { fold } from "@/lib/text";

const roundBtn = {
  width: 44,
  height: 44,
  border: 0,
  borderRadius: 999,
  background: "transparent",
  color: "#F5EEDB",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  position: "relative",
  transition: "all 180ms ease",
} as const;

function NavLinks({ onNavigate, vertical }: { onNavigate?: () => void; vertical?: boolean }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const isActive = (href: string) => {
    const [p, q] = href.split("?");
    if (pathname !== p) return false;
    if (!q) return true;
    const [k, v] = q.split("=");
    return params.get(k) === v;
  };
  return (
    <>
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          onClick={onNavigate}
          aria-current={isActive(n.href) ? "page" : undefined}
          className={vertical ? undefined : "lt-nav-link"}
          style={
            vertical
              ? {
                  fontSize: 15,
                  fontWeight: 500,
                  color: isActive(n.href) ? "var(--tra-300)" : "#F5EEDB",
                  textDecoration: "none",
                  padding: "13px 0",
                  borderBottom: "1px solid rgba(188, 154, 108, 0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }
              : undefined
          }
        >
          <span>{n.label}</span>
          {vertical && isActive(n.href) && (
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--tra-300)" }} />
          )}
        </Link>
      ))}
    </>
  );
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [liveProducts, setLiveProducts] = useState(PRODUCTS);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQ("");
      fetch("/api/products")
        .then((r) => r.json())
        .then((d) => {
          if (d.ok && Array.isArray(d.products) && d.products.length > 0) {
            setLiveProducts(d.products);
          }
        })
        .catch(() => {});
    }
  }, [open]);

  const results = useMemo(() => {
    const k = fold(q.trim());
    if (!k) return liveProducts.slice(0, 4);
    return liveProducts.filter((p) => fold(`${p.name} ${p.kind} ${p.note}`).includes(k));
  }, [q, liveProducts]);
  const submit = () => {
    onClose();
    router.push(`/san-pham${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };
  return (
    <Dialog open={open} onClose={onClose} title="Tìm kiếm trà">
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ padding: "16px 20px 8px" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 48,
            padding: "0 14px",
            border: "1.2px solid rgba(36, 52, 31, 0.22)",
            borderRadius: "var(--radius-input)",
            background: "#FAF8F5",
            color: "var(--text-muted)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <Icon name="search" size={20} color="var(--primary)" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Móc Câu, trà sen, trà nõn tôm, hộp quà…"
            aria-label="Từ khóa tìm kiếm"
            style={{
              flex: 1,
              border: 0,
              outline: "none",
              background: "transparent",
              fontFamily: "inherit",
              fontSize: 15,
              color: "var(--text-strong)",
            }}
          />
        </label>
      </form>
      <div style={{ padding: "4px 20px 20px" }}>
        <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--text-muted)", padding: "10px 0 6px" }}>
          {q.trim() ? `${results.length} kết quả` : "Gợi ý chọn trà"}
        </div>
        {results.length === 0 ? (
          <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--text-body)" }}>
            Lam Trà chưa tìm thấy loại trà này. Bạn có thể thử từ khóa khác hoặc liên hệ hotline để được tư vấn hương vị phù hợp.
          </p>
        ) : (
          results.map((p) => (
            <Link
              key={p.slug}
              href={`/san-pham/${p.slug}`}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid var(--border-hairline)",
                textDecoration: "none",
                color: "var(--text-strong)",
              }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 6,
                  backgroundImage: `url('${photo(p.ph)}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 500 }}>{p.name}</span>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{p.kind} · {p.note}</span>
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{formatVND(priceOf(p))}</span>
            </Link>
          ))
        )}
      </div>
    </Dialog>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  return (
    <>
      <header className={`lt-site-header ${scrolled ? "lt-scrolled" : ""}`}>
        <div className="lt-header-frame">
          {/* Royal Corner Brackets for Luxury Frame */}
          <span className="lt-frame-corner lt-frame-corner-tl" />
          <span className="lt-frame-corner lt-frame-corner-tr" />
          <span className="lt-frame-corner lt-frame-corner-bl" />
          <span className="lt-frame-corner lt-frame-corner-br" />

          {/* Left Brand Badge */}
          <Link href="/" aria-label="Lam Trà – Trang chủ" className="lt-header-logo-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/lam-tra-emblem.svg" alt="" width={70} height={63} />
          </Link>

          {/* Center Navigation Links */}
          <nav aria-label="Danh mục chính" className="lt-desktop" style={{ gap: 32, flex: 1, justifyContent: "center" }}>
            <Suspense>
              <NavLinks />
            </Suspense>
          </nav>

          {/* Right Action Icons & CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", color: "#F5EEDB" }}>
            <button type="button" aria-label="Tìm kiếm" className="lt-head-btn" style={roundBtn} onClick={() => setSearch(true)}>
              <Icon name="search" size={21} />
            </button>
            <Link href="/yeu-thich" aria-label="Yêu thích" className="lt-head-btn lt-desktop" style={{ ...roundBtn, color: "#F5EEDB" }}>
              <Icon name="heart" size={21} />
            </Link>
            <Link href="/tai-khoan" aria-label="Tài khoản" className="lt-head-btn lt-desktop" style={{ ...roundBtn, color: "#F5EEDB" }}>
              <Icon name="user" size={21} />
            </Link>
            <Link href="/gio-hang" aria-label={`Giỏ hàng, ${count} sản phẩm`} className="lt-head-btn" style={{ ...roundBtn, color: "#F5EEDB" }}>
              <Icon name="shopping-bag" size={22} />
              {ready && count > 0 && (
                <span className="lt-badge-count">
                  {count}
                </span>
              )}
            </Link>

            {/* Elegant Divider between icons and CTA button */}
            <span style={{ width: 1, height: 28, background: "rgba(188, 154, 108, 0.35)", margin: "0 6px" }} className="lt-desktop" />

            <Link href="/san-pham" className="lt-order-btn lt-desktop">
              <span>Đặt hàng ngay</span>
              <Icon name="arrow-right" size={16} />
            </Link>
            <button
              type="button"
              aria-label={menu ? "Đóng danh mục" : "Mở danh mục"}
              aria-expanded={menu}
              className="lt-mobile lt-head-btn"
              onClick={() => setMenu((m) => !m)}
              style={roundBtn}
            >
              <Icon name={menu ? "x" : "menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {menu && (
          <nav aria-label="Danh mục di động" className="lt-mobile lt-fade lt-mobile-drawer">
            <Suspense>
              <NavLinks vertical onNavigate={() => setMenu(false)} />
            </Suspense>
            <Link
              href="/san-pham"
              className="lt-order-btn"
              style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
              onClick={() => setMenu(false)}
            >
              <span>Đặt hàng ngay</span>
              <Icon name="arrow-right" size={16} />
            </Link>
          </nav>
        )}
      </header>
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </>
  );
}
