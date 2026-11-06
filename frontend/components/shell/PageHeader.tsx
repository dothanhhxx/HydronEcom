import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ds";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
      <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Trang chủ</Link>
      {crumbs.map((c) => (
        <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name="chevron-right" size={14} />
          {c.href ? <Link href={c.href} style={{ color: "inherit", textDecoration: "none" }}>{c.label}</Link> : <span aria-current="page" style={{ color: "var(--text-strong)" }}>{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/** Đầu trang thông tin: dải kem tràn viền có họa tiết nước, tiêu đề lớn, `art` (tuỳ chọn) đặt bên phải.
 *  `plain` dùng cho trang giao dịch (giỏ, đặt hàng). */
export function PageHeader({ title, desc, crumbs = [], plain, art }: { title: string; eyebrow?: string; desc?: ReactNode; crumbs?: Crumb[]; plain?: boolean; art?: ReactNode }) {
  if (plain)
    return (
      <div className="lt-container" style={{ paddingTop: 20, paddingBottom: 24 }}>
        <Breadcrumbs crumbs={crumbs} />
        <h1 style={{ marginTop: 16, fontSize: "clamp(28px,3.4vw,40px)" }}>{title}</h1>
        {desc && <p style={{ marginTop: 10, maxWidth: 620, fontSize: 15.5, lineHeight: 1.6, color: "var(--text-muted)" }}>{desc}</p>}
      </div>
    );
  return (
    <div className="hd-page-head">
      <div className="lt-container hd-page-head-inner" data-art={art ? "" : undefined}>
        <div>
          <Breadcrumbs crumbs={crumbs} />
          <h1>{title}</h1>
          {desc && <p>{desc}</p>}
        </div>
        {art && (
          <div className="hd-page-head-art" aria-hidden>
            {art}
          </div>
        )}
      </div>
    </div>
  );
}
