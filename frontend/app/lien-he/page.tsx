import type { Metadata } from "next";
import { Icon } from "@/components/ds";
import { ContactForm, QuoteForm } from "@/components/info/Forms";
import { PageHeader } from "@/components/shell/PageHeader";
import { SITE, telLink, zaloLink } from "@/lib/site";

export const metadata: Metadata = { title: "Liên hệ", description: `Liên hệ Hydron qua Zalo, điện thoại ${SITE.phone}, email ${SITE.email}. Nhận báo giá in logo số lượng lớn.` };

export default function ContactPage() {
  const items = [
    { icon: "zalo", k: "Zalo", v: SITE.phone, href: zaloLink(), note: "Nhanh nhất, trả lời trong vài phút" },
    { icon: "message-circle", k: "Messenger", v: "Nhắn fanpage Hydron", href: SITE.messenger },
    { icon: "phone", k: "Điện thoại", v: SITE.phone, href: telLink() },
    { icon: "mail", k: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
    { icon: "map-pin", k: "Kho hàng", v: SITE.address },
    { icon: "clock", k: "Giờ làm việc", v: SITE.hours },
  ];
  return (
    <>
      <PageHeader title="Liên hệ Hydron" crumbs={[{ label: "Liên hệ" }]} desc="Hỏi về sản phẩm, đơn hàng hay in logo số lượng lớn, bạn nhắn Hydron theo cách tiện nhất." />
      <div className="lt-container" style={{ paddingTop: 40, paddingBottom: 56, display: "flex", flexWrap: "wrap", gap: "40px clamp(28px,4vw,64px)", alignItems: "flex-start" }}>
        <ul style={{ flex: "1 1 300px", listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
          {items.map((i) => (
            <li key={i.k} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid var(--border-hairline)" }}>
              <span className="hd-promise-icon" style={{ width: 40, height: 40 }}><Icon name={i.icon} size={20} /></span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, fontSize: 15 }}>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{i.k}</span>
                {i.href ? (
                  <a href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ fontWeight: 600 }}>{i.v}</a>
                ) : (
                  <span style={{ color: "var(--text-strong)", fontWeight: 500 }}>{i.v}</span>
                )}
                {i.note && <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{i.note}</span>}
              </div>
            </li>
          ))}
        </ul>
        <section aria-labelledby="gui-tin" style={{ flex: "1 1 440px", minWidth: 0 }}>
          <h2 id="gui-tin" style={{ margin: "0 0 20px", fontSize: 24 }}>Gửi tin nhắn</h2>
          <ContactForm />
        </section>
      </div>
      <section id="dat-so-luong" aria-labelledby="bao-gia" style={{ background: "var(--cream-100)", scrollMarginTop: 80 }}>
        <div className="lt-container hd-split" style={{ paddingTop: "clamp(48px, 7vw, 88px)", paddingBottom: "clamp(48px, 7vw, 88px)", alignItems: "start" }}>
          <div>
            <h2 id="bao-gia" style={{ fontSize: "clamp(26px, 3vw, 38px)" }}>Đặt in logo số lượng lớn</h2>
            <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.7, color: "var(--text-body)", maxWidth: 460 }}>
              Quà tặng nhân viên, sự kiện, đội nhóm, lớp học. Từ 20 bình: giá riêng, in logo một mặt và tên từng người, bản in thử trước khi sản xuất.
            </p>
          </div>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
