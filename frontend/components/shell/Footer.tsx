import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ds";
import { CATEGORIES } from "@/lib/products";
import { SITE, telLink, zaloLink } from "@/lib/site";

const ABOUT = [
  { label: "Trang chủ", href: "/" },
  { label: "Câu chuyện", href: "/cau-chuyen" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Hồ sơ chứng nhận", href: "/chung-nhan" },
  { label: "Trà đàm", href: "/tra-dam" },
  { label: "Cẩm nang pha trà (QR)", href: "/huong-dan" },
  { label: "Kiểm tra đơn hàng", href: "/tra-cuu-don" },
  { label: "Hỏi đáp", href: "/hoi-dap" },
  { label: "Liên hệ", href: "/lien-he" },
];

const POLICIES = [
  { label: "Chính sách", href: "/chinh-sach" },
  { label: "Bảo mật", href: "/chinh-sach#bao-mat" },
  { label: "Điều khoản", href: "/chinh-sach#dieu-khoan" },
  { label: "Quản trị", href: "/quan-tri" },
];

function Column({ title, label, children }: { title: string; label?: string; children: ReactNode }) {
  return (
    <nav aria-label={label ?? title} className="lt-ft-col">
      <h2 className="lt-ft-head">
        <Icon name="leaf" size={15} />
        {title}
      </h2>
      {children}
    </nav>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="lt-ft">
      <div className="lt-container">
        <div className="lt-ft-grid">
          <div className="lt-ft-brand">
            <Link href="/" aria-label="Lam Trà – Trang chủ" className="lt-ft-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/lam-tra-emblem.svg" alt="" width={56} height={56} />
              <span>Lam Trà</span>
            </Link>
            <p>
              Trọn vị trà Việt, trọn tấm lòng trao gửi. Từ những đồi chè Tân Cương sương sớm đến chén trà trong từng
              khoảnh khắc đời thường.
            </p>
            <div className="lt-ft-social">
              <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok Lam Trà" title="TikTok">
                <Icon name="tiktok" size={17} />
              </a>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook Lam Trà" title="Facebook">
                <Icon name="facebook" size={17} />
              </a>
              <a href={zaloLink()} target="_blank" rel="noopener noreferrer" aria-label="Zalo Lam Trà" title="Zalo">
                <Icon name="zalo" size={18} />
              </a>
              <a href={`mailto:${SITE.email}`} aria-label="Gửi email cho Lam Trà" title="Email">
                <Icon name="mail" size={17} />
              </a>
            </div>
          </div>

          <Column title="Về Lam Trà">
            <ul className="lt-ft-list">
              {ABOUT.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </Column>

          <Column title="Sản phẩm">
            <ul className="lt-ft-list">
              {CATEGORIES.map((c) => (
                <li key={c.slug}><Link href={`/san-pham?danh-muc=${c.slug}`}>{c.name}</Link></li>
              ))}
              <li><Link href="/chinh-sach#bang-gia">Bảng giá niêm yết</Link></li>
              <li>
                <Link href="/san-pham" className="lt-ft-all">
                  Tất cả sản phẩm <Icon name="arrow-right" size={14} />
                </Link>
              </li>
            </ul>
          </Column>

          <Column title="Liên hệ">
            <ul className="lt-ft-contact">
              <li>
                <Icon name="map-pin" size={16} />
                <span>{SITE.address}</span>
              </li>
              <li>
                <Icon name="phone" size={16} />
                <span>
                  <a href={telLink()}>{SITE.phone}</a>
                  <small>Hotline · Zalo</small>
                </span>
              </li>
              <li>
                <Icon name="mail" size={16} />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <Icon name="clock" size={16} />
                <span>{SITE.hours}</span>
              </li>
              <li>
                <Icon name="leaf" size={16} />
                <span>Trà Tân Cương, Thái Nguyên</span>
              </li>
            </ul>
          </Column>
        </div>

        <div className="lt-ft-bottom">
          <div className="lt-ft-copy">
            <span>© {year} {SITE.legal.company}. Tất cả quyền được bảo lưu.</span>
            <small>
              {SITE.legal.notice}
              {POLICIES.map((l) => (
                <span key={l.href}> · <Link href={l.href}>{l.label}</Link></span>
              ))}
              {SITE.legal.moitUrl ? (
                <span> · <a href={SITE.legal.moitUrl} target="_blank" rel="noopener noreferrer">Đã thông báo Bộ Công Thương</a></span>
              ) : null}
            </small>
          </div>
          <div className="lt-ft-seal" aria-hidden="true">
            <span />
            <Icon name="leaf" size={18} />
            <span />
          </div>
          <ul className="lt-ft-slogan" aria-label="Tinh thần Lam Trà">
            {SITE.slogan.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}
