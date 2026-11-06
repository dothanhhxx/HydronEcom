"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Toast } from "@/components/ds";
import { CartProvider, useCart } from "@/lib/cart";
import { zaloLink } from "@/lib/site";
import Footer from "./Footer";
import Header from "./Header";

const TABS = [
  { href: "/", label: "Trang chủ", icon: "house" },
  { href: "/san-pham", label: "Danh mục", icon: "list" },
  { href: "/gio-hang", label: "Giỏ hàng", icon: "shopping-bag" },
  { href: "/tai-khoan", label: "Tài khoản", icon: "circle-user" },
];

function MobileTabBar() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <nav
      aria-label="Điều hướng nhanh"
      className="lt-tabbar"
      style={{
        position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 30, height: "var(--bottom-bar-h)",
        paddingBottom: "env(safe-area-inset-bottom)", background: "rgba(252,248,241,.96)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderTop: "1px solid var(--border-hairline)",
      }}
    >
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className="lt-tab" aria-current={active(t.href) ? "page" : undefined}>
          <span style={{ position: "relative", display: "flex" }}>
            <Icon name={t.icon} size={22} />
            {t.href === "/gio-hang" && ready && count > 0 && (
              <span style={{ position: "absolute", top: -4, right: -9, minWidth: 16, height: 16, padding: "0 4px", boxSizing: "border-box", borderRadius: 999, background: "var(--accent)", color: "var(--text-on-primary)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {count}
              </span>
            )}
          </span>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

function ShellToast() {
  const { toast, dismissToast } = useCart();
  return <Toast message={toast?.message ?? null} onClose={dismissToast} action={toast?.action} />;
}

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Trang quản trị có layout AdminShell riêng biệt, không hiển thị header/footer của khách
  if (pathname.startsWith("/quan-tri")) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#FFFFFF", color: "var(--text-body)", fontFamily: "var(--font-ui)" }}>
        <Header />
        <main className="lt-page-bg" style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
      <a href={zaloLink()} target="_blank" rel="noopener noreferrer" className="lt-zalo" aria-label="Chat Zalo với Lam Trà">
        <Icon name="zalo" size={20} />
        <span className="lt-zalo-label">Chat Zalo</span>
      </a>
      <MobileTabBar />
      <ShellToast />
    </CartProvider>
  );
}
