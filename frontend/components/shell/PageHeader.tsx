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

export function PageHeader({ title, eyebrow, desc, crumbs = [] }: { title: string; eyebrow?: string; desc?: ReactNode; crumbs?: Crumb[] }) {
  return (
    <div>
      <div className="lt-container" style={{ paddingTop: "clamp(16px,3vw,28px)", paddingBottom: "clamp(24px,5vw,72px)" }}>
      <Breadcrumbs crumbs={crumbs} />
      {eyebrow && <div style={{ marginTop: 24, fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--accent)" }}>{eyebrow}</div>}
      <h1 style={{ margin: eyebrow ? "8px 0 0" : "24px 0 0", fontSize: "clamp(30px,4vw,48px)", lineHeight: 1.15, fontWeight: 500, letterSpacing: "-.01em", color: "var(--text-strong)" }}>{title}</h1>
      {desc && <p style={{ margin: "14px 0 0", maxWidth: 600, fontSize: 16, lineHeight: 1.65, color: "var(--text-body)" }}>{desc}</p>}
      </div>
    </div>
  );
}
