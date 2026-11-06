"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Toast } from "@/components/ds";
import { CartProvider, useCart } from "@/lib/cart";
import ChatWidget from "./ChatWidget";
import Footer from "./Footer";
import Header from "./Header";

const TABS = [
  { href: "/", label: "Trang chủ", icon: "house" },
  { href: "/san-pham", label: "Sản phẩm", icon: "list" },
  { href: "/thiet-ke-3d", label: "Thiết kế", icon: "pencil", feature: true },
  { href: "/gio-hang", label: "Giỏ hàng", icon: "shopping-bag" },
  { href: "/tai-khoan", label: "Tài khoản", icon: "circle-user" },
];

function MobileTabBar() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <nav aria-label="Điều hướng nhanh" className="lt-tabbar">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={`lt-tab${t.feature ? " lt-tab-feature" : ""}`} aria-current={active(t.href) ? "page" : undefined}>
          <span style={{ position: "relative", display: "flex" }}>
            <Icon name={t.icon} size={t.feature ? 20 : 22} />
            {t.href === "/gio-hang" && ready && count > 0 && <span className="hd-count" style={{ top: -6, right: -10 }}>{count}</span>}
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

  // Trang quản trị có layout AdminShell riêng, không hiển thị header/footer của khách
  if (pathname.startsWith("/quan-tri")) return <>{children}</>;

  return (
    <CartProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main id="noi-dung" style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
      <ChatWidget />
      <MobileTabBar />
      <ShellToast />
    </CartProvider>
  );
}
