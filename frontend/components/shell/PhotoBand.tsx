import type { ReactNode } from "react";

// Dải ảnh toàn chiều rộng dùng làm phần kết của trang: ảnh đồi chè phủ lớp tối, chữ kem bên trái.
export function PhotoBand({ id, image, title, desc, actions }: { id: string; image: string; title: ReactNode; desc?: ReactNode; actions?: ReactNode }) {
  return (
    <section aria-labelledby={id} className="lt-band-photo" style={{ ["--photo" as string]: `url('${image}')` }}>
      <div className="lt-container" style={{ paddingTop: "clamp(48px,6vw,80px)", paddingBottom: "clamp(48px,6vw,80px)" }}>
        <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 18 }}>
          <h2
            id={id}
            style={{
              margin: 0,
              fontSize: "clamp(30px, 3.4vw, 44px)",
              lineHeight: 1.15,
              fontWeight: 600,
              letterSpacing: "0.015em",
              fontFamily: "var(--font-display)",
              color: "var(--logo-cream)",
              textWrap: "balance",
            }}
          >
            {title}
          </h2>
          {desc && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: "var(--reu-100)", maxWidth: 480 }}>{desc}</p>}
          {actions && <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 24px", marginTop: 8 }}>{actions}</div>}
        </div>
      </div>
    </section>
  );
}

// Cành chè (minh hoạ Köhler, 1887, public domain) đặt chồng lên đường nối giữa hai section; chỉ để trang trí.
export function TeaSprig({ side = "right" }: { side?: "left" | "right" }) {
  return (
    <div aria-hidden="true" className={`lt-sprig lt-sprig-${side}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/bg/tea-sprig.webp" alt="" width={661} height={1000} loading="lazy" decoding="async" />
    </div>
  );
}
