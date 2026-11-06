import type { Metadata } from "next";
import { Icon } from "@/components/ds";
import { ContactForm } from "@/components/info/Forms";
import { PageHeader } from "@/components/shell/PageHeader";
import { SITE, telLink, zaloLink } from "@/lib/site";

export const metadata: Metadata = { title: "Liên hệ", description: `Liên hệ Lam Trà: ${SITE.phone}, Zalo, email ${SITE.email}. ${SITE.address}.` };

export default function ContactPage() {
  const items = [
    { icon: "zalo", k: "Zalo", v: SITE.phone, href: zaloLink(), note: "Nhanh nhất, trả lời trong vài phút" },
    { icon: "phone", k: "Điện thoại", v: SITE.phone, href: telLink() },
    { icon: "mail", k: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
    { icon: "map-pin", k: "Cửa hàng", v: SITE.address },
    { icon: "clock", k: "Giờ mở cửa", v: SITE.hours },
  ];
  return (
    <>
      <PageHeader title="Liên hệ Lam Trà" crumbs={[{ label: "Liên hệ" }]} desc="Hỏi về trà, đơn hàng hay quà biếu, bạn nhắn Lam Trà theo cách tiện nhất." />
      <div className="lt-container" style={{ paddingTop: 24, paddingBottom: 80, display: "flex", flexWrap: "wrap", gap: "40px clamp(28px,4vw,56px)", alignItems: "flex-start" }}>
        <ul style={{ flex: "1 1 300px", listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
          {items.map((i) => (
            <li key={i.k} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--border-hairline)" }}>
              <Icon name={i.icon} size={22} color="var(--accent)" />
              <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 15 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{i.k}</span>
                {i.href ? <a href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ fontWeight: 500 }}>{i.v}</a> : <span style={{ color: "var(--text-strong)" }}>{i.v}</span>}
                {i.note && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{i.note}</span>}
              </div>
            </li>
          ))}
        </ul>
        <section aria-labelledby="gui-tin" style={{ flex: "1 1 420px", minWidth: 0 }}>
          <h2 id="gui-tin" style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 500, color: "var(--text-strong)" }}>Gửi tin nhắn</h2>
          <ContactForm />
        </section>
      </div>
    </>
  );
}
