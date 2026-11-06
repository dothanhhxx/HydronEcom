import type { Metadata } from "next";
import Link from "next/link";
import { Button, Icon } from "@/components/ds";
import CertZoom from "@/components/info/CertZoom";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { CERTIFICATES, PARTNER, statusOf, vnDate, type Certificate } from "@/lib/certificates";
import { zaloLink } from "@/lib/site";

// Trạng thái hiệu lực tính theo ngày, nên dựng lại trang mỗi giờ.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hồ sơ chứng nhận",
  description: "Giấy chứng nhận VietGAP, cơ sở đủ điều kiện an toàn thực phẩm và đăng ký hợp tác xã của Hợp tác xã Chè Thanh Huyền Trà, đối tác sản xuất của Lam Trà.",
  openGraph: { images: ["/assets/chung-nhan/tong-hop.webp"] },
};

const CHAIN = [
  { icon: "leaf", step: "Vùng trồng", text: "Chè búp tươi được chứng nhận VietGAP tại Tân Cương.", cert: "vietgap" },
  { icon: "thermometer", step: "Chế biến", text: "Cơ sở chế biến đủ điều kiện an toàn thực phẩm.", cert: "an-toan-thuc-pham" },
  { icon: "package", step: "Lam Trà đóng gói & gửi đi", text: "Ghi rõ khối lượng, phân hạng, vùng trồng trên từng gói.", cert: "" },
];

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="lt-cert-row">
      <dt>{label}</dt>
      <dd className={mono ? "lt-mono" : undefined}>{value}</dd>
    </div>
  );
}

function CertCard({ c, i, today }: { c: Certificate; i: number; today: Date }) {
  const st = statusOf(c, today);
  return (
    <article id={c.slug} className="lt-cert-card" aria-labelledby={`${c.slug}-t`}>
      <div className="lt-cert-card-body">
        <header className="lt-cert-card-head">
          <span className="lt-cert-index">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 id={`${c.slug}-t`}>{c.short}</h3>
            <p>{c.title}</p>
          </div>
          <span className={`lt-cert-status lt-cert-${st.tone}`}>
            <span aria-hidden="true" />
            {st.label}
          </span>
        </header>
        <dl className="lt-cert-dl">
          <Row label={c.slug === "dang-ky-hop-tac-xa" ? "Mã số" : "Số / mã số"} value={c.number} mono />
          <Row label="Ngày cấp" value={vnDate(c.issued)} mono />
          <Row label="Hiệu lực đến" value={c.expires ? vnDate(c.expires) : "Không thời hạn"} mono />
          <Row label="Cơ quan cấp" value={c.issuer} />
          {c.fields.map((f) => <Row key={f.label} label={f.label} value={f.value} />)}
        </dl>
        {st.tone === "expired" && (
          <p className="lt-cert-warn">
            <Icon name="info" size={16} />
            Giấy này đã quá thời hạn ghi trên bản chụp. Lam Trà sẽ cập nhật bản gia hạn khi nhận được từ Hợp tác xã.
          </p>
        )}
      </div>
      <CertZoom src={c.image.src} alt={c.image.alt} w={c.image.w} h={c.image.h} label={c.title} />
    </article>
  );
}

export default function CertificatesPage() {
  const today = new Date();
  const expired = CERTIFICATES.filter((c) => statusOf(c, today).tone === "expired").length;

  return (
    <>
      <section className="lt-cert-hero" aria-labelledby="ho-so-title">
        <div className="lt-container">
          <Breadcrumbs crumbs={[{ label: "Câu chuyện", href: "/cau-chuyen" }, { label: "Hồ sơ chứng nhận" }]} />
          <span className="lt-cert-eyebrow">Minh bạch nguồn gốc · An tâm chất lượng</span>
          <h1 id="ho-so-title">Hồ sơ <span>chứng nhận</span></h1>
          <p>Thông tin đối tác sản xuất, giấy chứng nhận và vùng nguyên liệu của trà Lam Trà, chép từ bản chụp giấy tờ do Hợp tác xã cung cấp.</p>
          <ul className="lt-cert-jump" aria-label="Đi tới chứng nhận">
            {CERTIFICATES.map((c) => {
              const st = statusOf(c, today);
              return (
                <li key={c.slug}>
                  <a href={`#${c.slug}`}>
                    <span className={`lt-cert-dot lt-cert-${st.tone}`} aria-hidden="true" />
                    {c.short}
                    <small>{st.label}</small>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className="lt-container lt-cert-wrap">
        {/* 01 — Đối tác sản xuất */}
        <section className="lt-cert-panel" aria-labelledby="doi-tac">
          <div className="lt-cert-panel-head">
            <span className="lt-cert-badge">01</span>
            <div>
              <h2 id="doi-tac">Đối tác sản xuất</h2>
              <p>Đơn vị trồng, chế biến chè cho các dòng trà Lam Trà.</p>
            </div>
          </div>
          <div className="lt-cert-partner">
            <CertZoom src="/assets/chung-nhan/tong-hop.webp" alt="Ba giấy chứng nhận của Hợp tác xã Chè Thanh Huyền Trà" w={1254} h={1104} label="Bộ hồ sơ chứng nhận" className="lt-cert-thumb-wide" />
            <div className="lt-cert-partner-info">
              <span className="lt-cert-eyebrow">Tân Cương · Thái Nguyên</span>
              <h3>{PARTNER.name}</h3>
              <dl className="lt-cert-dl">
                <Row label="Mã số hợp tác xã" value={PARTNER.taxCode} mono />
                <Row label="Đăng ký lần đầu" value={vnDate(PARTNER.firstRegistered)} mono />
                <Row label="Trụ sở" value={PARTNER.address} />
                <Row label="Người đại diện" value={PARTNER.representative} />
                <Row label="Ngành chính" value={PARTNER.mainBusiness} />
              </dl>
              <ul className="lt-cert-stats">
                {PARTNER.stats.map((s) => (
                  <li key={s.label}>
                    <strong>{s.value}<small> {s.unit}</small></strong>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 02 — Chứng nhận */}
        <section className="lt-cert-panel" aria-labelledby="chung-nhan">
          <div className="lt-cert-panel-head">
            <span className="lt-cert-badge">02</span>
            <div>
              <h2 id="chung-nhan">Chứng nhận</h2>
              <p>
                {CERTIFICATES.length} giấy tờ liên quan đến vùng nguyên liệu, cơ sở chế biến và pháp lý của đối tác.
                {expired > 0 && ` ${expired} giấy đã quá thời hạn ghi trên bản chụp.`}
              </p>
            </div>
          </div>
          <div className="lt-cert-list">
            {CERTIFICATES.map((c, i) => <CertCard key={c.slug} c={c} i={i} today={today} />)}
          </div>
        </section>

        {/* 03 — Chuỗi minh bạch */}
        <section className="lt-cert-panel" aria-labelledby="chuoi">
          <div className="lt-cert-panel-head">
            <span className="lt-cert-badge">03</span>
            <div>
              <h2 id="chuoi">Từ vùng trồng đến tay bạn</h2>
              <p>Mỗi chứng nhận gắn với một khâu trong hành trình của gói trà.</p>
            </div>
          </div>
          <ol className="lt-cert-chain">
            {CHAIN.map((s, i) => (
              <li key={s.step}>
                <span className="lt-cert-chain-icon"><Icon name={s.icon} size={20} /></span>
                <span className="lt-cert-chain-no">Bước {String(i + 1).padStart(2, "0")}</span>
                <h3>{s.step}</h3>
                <p>{s.text}</p>
                {s.cert ? <a href={`#${s.cert}`}>Xem chứng nhận</a> : <Link href="/san-pham">Xem các loại trà</Link>}
              </li>
            ))}
          </ol>
          <div className="lt-cert-cta">
            <p>Cần bản chụp rõ hơn hoặc hỏi về tình trạng gia hạn giấy tờ? Lam Trà gửi bạn qua Zalo.</p>
            <div>
              <Button href={zaloLink()} variant="primary" iconLeft="zalo">Nhắn Zalo</Button>
              <Button href="/cau-chuyen" variant="secondary" iconRight="arrow-right">Câu chuyện Lam Trà</Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
