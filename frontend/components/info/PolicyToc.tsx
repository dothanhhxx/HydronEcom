"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ds";
import { SITE, telLink } from "@/lib/site";

export interface TocItem {
  id: string;
  label: string;
  icon: string;
}

export function PolicyToc({ items }: { items: TocItem[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140;
      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActiveId(items[i].id);
          return;
        }
      }
      setActiveId("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  // Khóa cuộn trang khi drawer mở trên mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navContent = (
    <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((t) => {
        const isActive = activeId === t.id;
        return (
          <a
            key={t.id}
            href={`#${t.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(t.id);
            }}
            className="lt-toc-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 6,
              color: isActive ? "var(--tra-900)" : "var(--text-body)",
              background: isActive ? "rgba(188, 154, 108, 0.18)" : "transparent",
              fontWeight: isActive ? 700 : 500,
              textDecoration: "none",
              fontSize: 13.5,
              lineHeight: 1.4,
              borderLeft: isActive ? "3px solid var(--tra-700)" : "3px solid transparent",
              transition: "all 0.15s ease",
            }}
          >
            <Icon name={t.icon} size={16} color={isActive ? "var(--tra-800)" : "var(--tra-600)"} />
            <span>{t.label}</span>
          </a>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ─── 1. ASIDE CỐ ĐỊNH TRÊN MÁY TÍNH (DESKTOP) ─── */}
      <aside
        aria-label="Mục lục chính sách"
        className="lt-toc-desktop"
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".12em",
            color: "var(--tra-700)",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: "1px solid var(--border-hairline)",
          }}
        >
          Nội dung chính sách
        </div>

        {navContent}

        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px dashed var(--border-hairline)",
            fontSize: 12,
            lineHeight: 1.5,
            color: "var(--text-muted)",
          }}
        >
          Cần hỗ trợ trực tiếp?
          <br />
          <a
            href={telLink()}
            style={{
              color: "var(--tra-700)",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-block",
              marginTop: 4,
            }}
          >
            📞 Hotline: {SITE.phone}
          </a>
        </div>
      </aside>

      {/* ─── 2. NÚT TAB GẮN CẠNH TRÁI MÀN HÌNH (MOBILE) ─── */}
      <button
        id="lt-toc-toggle-btn"
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        className="lt-toc-mobile-tab"
        aria-label={mobileOpen ? "Đóng mục lục chính sách" : "Mở mục lục chính sách"}
        title={mobileOpen ? "Đóng mục lục" : "Mở mục lục chính sách"}
      >
        <span style={{ display: "flex", alignItems: "center", color: "var(--tra-300)" }}>
          <Icon name="file-text" size={17} />
        </span>
        <span>{mobileOpen ? "Đóng" : "Mục lục"}</span>
      </button>

      {/* ─── 3. DRAWER MENU TRƯỢT TỪ BÊN TRÁI RA (MOBILE) ─── */}
      {mobileOpen && (
        <div
          id="lt-toc-backdrop"
          className="lt-toc-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="lt-toc-drawer"
        className={`lt-toc-mobile-drawer ${mobileOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mục lục chính sách"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 18px",
            background: "#0D2219",
            color: "#FAF8F5",
            borderBottom: "1.5px solid rgba(188, 154, 108, 0.45)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Icon name="file-text" size={19} color="var(--tra-300)" />
            <span style={{ fontWeight: 700, fontSize: 15.5, letterSpacing: "0.02em" }}>
              Mục lục chính sách
            </span>
          </div>
          <button
            id="lt-toc-close-btn"
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Đóng mục lục"
            style={{
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(188, 154, 108, 0.35)",
              borderRadius: 6,
              color: "#FAF8F5",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "16px 14px", overflowY: "auto", flex: 1 }}>
          <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--text-muted)", paddingLeft: 4 }}>
            Chạm vào mục để cuộn nhanh đến nội dung:
          </p>

          {navContent}

          <div
            style={{
              marginTop: 24,
              padding: "14px",
              background: "rgba(188, 154, 108, 0.08)",
              borderRadius: 8,
              border: "1px solid rgba(188, 154, 108, 0.2)",
              fontSize: 12.5,
              lineHeight: 1.5,
              color: "var(--text-body)",
            }}
          >
            <strong>Cần tư vấn trực tiếp?</strong>
            <br />
            Hotline / Zalo:{" "}
            <a href={telLink()} style={{ color: "var(--tra-800)", fontWeight: 700, textDecoration: "none" }}>
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
