"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ds";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/quan-tri");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { href: "/quan-tri/don-hang", label: "Đơn hàng", icon: "receipt" },
    { href: "/quan-tri/san-pham", label: "Sản phẩm & Giá", icon: "package" },
    { href: "/quan-tri/lien-he", label: "Tin nhắn & Báo giá", icon: "message-circle" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F8F9FA", color: "#1A202C", fontFamily: "var(--font-ui)" }}>
      {/* ─── 1. DESKTOP HEADER (≥ 900px) ─── */}
      <header className="lt-site-header lt-admin-header-desktop">
        <div className="lt-header-frame">
          {/* Royal Corner Brackets for Luxury Frame */}
          <span className="lt-frame-corner lt-frame-corner-tl" />
          <span className="lt-frame-corner lt-frame-corner-tr" />
          <span className="lt-frame-corner lt-frame-corner-bl" />
          <span className="lt-frame-corner lt-frame-corner-br" />

          {/* Left Brand Badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Link href="/quan-tri/don-hang" className="lt-header-logo-box" style={{ textDecoration: "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/brand/hydron-logo-cream.png" alt="Hydron" style={{ height: 26, width: "auto" }} />
              <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--blue-200)", fontWeight: 600 }}>
                  QUẢN TRỊ VIÊN
                </span>
              </span>
            </Link>

            <span style={{ width: 1, height: 32, background: "rgba(6, 136, 174, 0.35)", margin: "0 4px" }} />

            {/* Navigation Tabs */}
            <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "10px 18px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#062F3C" : "#FDF2DF",
                      background: active ? "#FDF2DF" : "rgba(255, 255, 255, 0.05)",
                      border: active ? "1px solid #62B3CE" : "1px solid rgba(6, 136, 174, 0.2)",
                      textDecoration: "none",
                      boxShadow: active ? "0 2px 8px rgba(6, 136, 174, 0.4)" : "none",
                      transition: "all 180ms ease",
                    }}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                height: 44,
                padding: "0 18px",
                borderRadius: 999,
                border: "1.5px solid rgba(6, 136, 174, 0.55)",
                background: "rgba(6, 136, 174, 0.12)",
                color: "#FDF2DF",
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 180ms ease",
              }}
            >
              <Icon name="external-link" size={16} />
              <span>Xem cửa hàng</span>
            </Link>

            <span style={{ width: 1, height: 28, background: "rgba(6, 136, 174, 0.35)" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
                <span style={{ fontSize: 13, color: "#E2E8F0", fontWeight: 500 }}>Quản trị viên</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                title="Đăng xuất khỏi hệ thống"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  background: "rgba(239, 68, 68, 0.14)",
                  color: "#FCA5A5",
                  cursor: loggingOut ? "wait" : "pointer",
                  transition: "all 180ms ease",
                }}
              >
                <Icon name="log-out" size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── 2. MOBILE HEADER & NAVIGATION (< 900px) ─── */}
      <header
        className="lt-admin-header-mobile"
        style={{
          flexDirection: "column",
          background: "#062F3C",
          borderBottom: "1.5px solid rgba(6, 136, 174, 0.4)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        {/* Mobile Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderBottom: "1px solid rgba(6, 136, 174, 0.2)",
          }}
        >
          {/* Logo brand */}
          <Link href="/quan-tri/don-hang" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/hydron-logo-cream.png" alt="Hydron" style={{ height: 20, width: "auto" }} />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontSize: 9.5, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--blue-200)", fontWeight: 600 }}>
                QUẢN TRỊ VIÊN
              </div>
            </div>
          </Link>

          {/* Quick actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                height: 34,
                padding: "0 10px",
                borderRadius: 6,
                border: "1px solid rgba(6, 136, 174, 0.45)",
                background: "rgba(6, 136, 174, 0.12)",
                color: "#FDF2DF",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Icon name="external-link" size={13} />
              <span>Xem shop</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              title="Đăng xuất"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 6,
                border: "1px solid rgba(239, 68, 68, 0.4)",
                background: "rgba(239, 68, 68, 0.16)",
                color: "#FCA5A5",
                cursor: loggingOut ? "wait" : "pointer",
              }}
            >
              <Icon name="log-out" size={15} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs (1-Tap Switch) */}
        <nav
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            padding: "4px 8px 6px",
            gap: 6,
            background: "#04222C",
          }}
        >
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  padding: "8px 4px",
                  minHeight: 46,
                  borderRadius: 6,
                  fontSize: 11.5,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#062F3C" : "#D1D5DB",
                  background: active ? "#FDF2DF" : "transparent",
                  textDecoration: "none",
                  textAlign: "center",
                  boxShadow: active ? "0 2px 6px rgba(6, 136, 174, 0.4)" : "none",
                  transition: "all 150ms ease",
                }}
              >
                <Icon name={item.icon} size={16} />
                <span style={{ lineHeight: 1.2 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main Content View */}
      <main className="lt-admin-main">
        {children}
      </main>
    </div>
  );
}
