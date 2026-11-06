"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import ProductVisual, { tintFor } from "@/components/bottle/ProductVisual";
import { Dialog, Icon, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { FREE_SHIP_MIN } from "@/lib/checkout";
import { priceRange } from "@/lib/products";
import { NAV } from "@/lib/site";
import { fold } from "@/lib/text";

function useIsActive() {
  const pathname = usePathname();
  const params = useSearchParams();
  return (href: string) => {
    const [p, q] = href.split("?");
    if (pathname !== p) return false;
    if (!q) return true;
    const [k, v] = q.split("=");
    return params.get(k) === v;
  };
}

function DesktopNav() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Danh mục chính" className="hd-nav lt-desktop">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? "page" : undefined} data-feature={n.href === "/thiet-ke-3d" ? "" : undefined}>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const isActive = useIsActive();
  return (
    <nav aria-label="Danh mục" className="hd-drawer lt-fade">
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} className="hd-drawer-link" aria-current={isActive(n.href) ? "page" : undefined} onClick={onClose}>
          {n.label}
          <Icon name="chevron-right" size={20} />
        </Link>
      ))}
      <div style={{ display: "grid", gap: 4, marginTop: 20, fontSize: 15 }}>
        {[
          ["/tra-cuu-don", "Tra cứu đơn hàng"],
          ["/yeu-thich", "Sản phẩm yêu thích"],
          ["/hoi-dap", "Hỏi đáp"],
          ["/chinh-sach", "Chính sách đổi trả, bảo hành"],
          ["/lien-he", "Liên hệ"],
        ].map(([href, label]) => (
          <Link key={href} href={href} onClick={onClose} style={{ padding: "10px 0", color: "var(--text-body)", textDecoration: "none" }}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const { products } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  const results = useMemo(() => {
    const k = fold(q.trim());
    const list = products.filter((p) => p.active !== false);
    if (!k) return [...list].sort((a, b) => b.sold - a.sold).slice(0, 4);
    return list.filter((p) => fold(`${p.name} ${p.kind} ${p.note} ${p.colors.map((c) => c.name).join(" ")} ${p.sizes.join("ml ")}ml`).includes(k));
  }, [q, products]);

  const submit = () => {
    onClose();
    router.push(`/san-pham${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  };

  return (
    <Dialog open={open} onClose={onClose} title="Tìm sản phẩm">
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ padding: "16px 20px 8px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, height: 52, padding: "0 16px", border: "1px solid var(--border-strong)", borderRadius: "var(--radius-input)", background: "#fff" }}>
          <Icon name="search" size={20} color="var(--primary)" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Thử: bình 900ml, ống hút, màu kem…"
            aria-label="Từ khóa tìm kiếm"
            style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", fontFamily: "inherit", fontSize: 16, color: "var(--text-strong)" }}
          />
        </label>
      </form>
      <div style={{ padding: "4px 20px 20px" }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", padding: "10px 0 6px" }}>{q.trim() ? `${results.length} sản phẩm` : "Được mua nhiều"}</div>
        {results.length === 0 ? (
          <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--text-body)" }}>Chưa có sản phẩm khớp “{q}”. Bạn thử từ khóa khác, hoặc nhắn Hydron để được tư vấn.</p>
        ) : (
          results.map((p) => {
            const [lo, hi] = priceRange(p);
            return (
              <Link key={p.slug} href={`/san-pham/${p.slug}`} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: "1px solid var(--border-hairline)", textDecoration: "none", color: "var(--text-strong)" }}>
                <span style={{ position: "relative", width: 52, height: 64, flexShrink: 0, borderRadius: 10, overflow: "hidden", background: tintFor(p) }}>
                  <ProductVisual product={p} />
                </span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{p.kind} · {p.sizes.length ? p.sizes.map((s) => s + "ml").join(", ") : "Một cỡ"}</span>
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{lo === hi ? formatVND(lo) : `từ ${formatVND(lo)}`}</span>
              </Link>
            );
          })
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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  // Phím tắt "/" mở tìm kiếm
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a href="#noi-dung" className="hd-skip">Bỏ qua tới nội dung</a>
      <div className="hd-strip">
        <div className="lt-container hd-strip-inner">
          <span>Miễn phí giao hàng cho đơn từ {formatVND(FREE_SHIP_MIN)}</span>
          <span>Đổi trả 7 ngày</span>
          <span>Bảo hành giữ nhiệt 12 tháng</span>
        </div>
      </div>
      <header className="hd-header" data-scrolled={scrolled || menu}>
        <div className="lt-container hd-header-row">
          <button type="button" className="hd-icon-btn lt-mobile" aria-label={menu ? "Đóng menu" : "Mở menu"} aria-expanded={menu} onClick={() => setMenu((m) => !m)} style={{ marginLeft: -10 }}>
            <Icon name={menu ? "x" : "menu"} size={24} />
          </button>
          <Link href="/" className="hd-logo" aria-label="Hydron – Trang chủ">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/hydron-logo.png" alt="" width={80} height={30} />
          </Link>
          <Suspense>
            <DesktopNav />
          </Suspense>
          <div className="hd-head-actions">
            <button type="button" className="hd-search-btn lt-desktop" onClick={() => setSearch(true)} aria-label="Tìm kiếm sản phẩm">
              <Icon name="search" size={18} />
              Tìm bình, phụ kiện…
              <kbd style={{ marginLeft: "auto", fontFamily: "inherit", fontSize: 12, padding: "1px 6px", border: "1px solid var(--border-strong)", borderRadius: 5, color: "var(--text-subtle)" }}>/</kbd>
            </button>
            <button type="button" className="hd-icon-btn lt-mobile" aria-label="Tìm kiếm" onClick={() => setSearch(true)}>
              <Icon name="search" size={21} />
            </button>
            <Link href="/yeu-thich" aria-label="Yêu thích" className="hd-icon-btn lt-desktop">
              <Icon name="heart" size={21} />
            </Link>
            <Link href="/tai-khoan" aria-label="Tài khoản" className="hd-icon-btn lt-desktop">
              <Icon name="user" size={21} />
            </Link>
            <Link href="/gio-hang" aria-label={`Giỏ hàng, ${count} sản phẩm`} className="hd-icon-btn" style={{ marginRight: -8 }}>
              <Icon name="shopping-bag" size={22} />
              {ready && count > 0 && <span className="hd-count">{count}</span>}
            </Link>
          </div>
        </div>
      </header>
      {menu && (
        <Suspense>
          <MobileDrawer onClose={() => setMenu(false)} />
        </Suspense>
      )}
      <SearchDialog open={search} onClose={() => setSearch(false)} />
    </>
  );
}
