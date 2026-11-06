"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ds";
import { postJSON } from "@/lib/api";
import { SITE, telLink, zaloLink } from "@/lib/site";

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "Mua sắm",
    links: [
      ["/san-pham?danh-muc=binh", "Bình giữ nhiệt"],
      ["/san-pham?danh-muc=phu-kien", "Phụ kiện"],
      ["/san-pham?danh-muc=moc-khoa", "Móc khóa linh vật"],
      ["/thiet-ke-3d", "Tự thiết kế 3D"],
      ["/lien-he#dat-so-luong", "Đặt in logo số lượng lớn"],
      ["/tra-cuu-don", "Tra cứu đơn hàng"],
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      ["/chinh-sach#van-chuyen", "Vận chuyển"],
      ["/chinh-sach#doi-tra", "Đổi trả 7 ngày"],
      ["/chinh-sach#bao-hanh", "Bảo hành 12 tháng"],
      ["/chinh-sach#bao-mat", "Bảo mật thông tin"],
      ["/hoi-dap", "Hỏi đáp"],
    ],
  },
];

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setState("error");
    setState("busy");
    const r = await postJSON("/api/contact", { type: "lien-he", name: "Đăng ký nhận tin", email: email.trim(), message: "Đăng ký nhận tin ưu đãi từ chân trang." });
    setState(r.ok ? "done" : "error");
  };
  if (state === "done") return <p style={{ marginTop: 14, color: "var(--cream-100)", fontSize: 14 }}>Đã đăng ký. Hydron gửi ưu đãi mới qua email của bạn.</p>;
  return (
    <form className="hd-news" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
      <input type="email" aria-label="Email nhận ưu đãi" placeholder="Email của bạn" value={email} onChange={(e) => { setEmail(e.target.value); setState("idle"); }} aria-invalid={state === "error"} />
      <button type="submit" className="hd-btn hd-btn-cream" style={{ minHeight: 44, padding: "0 16px" }} disabled={state === "busy"}>{state === "busy" ? "Đang gửi…" : "Đăng ký"}</button>
      {state === "error" && <span role="alert" className="lt-sr">Email chưa đúng định dạng</span>}
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="hd-footer">
      <div className="lt-container">
        <div className="hd-footer-grid">
          <div className="hd-footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/hydron-logo-cream.png" alt="Hydron" width={112} height={42} style={{ height: 34, width: "auto" }} />
            <p>Bình giữ nhiệt thép 304 in tên riêng. Tự thiết kế 3D trên web, Hydron in và giao trong 1 – 2 ngày.</p>
            <div className="hd-footer-social">
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="facebook" size={18} /></a>
              <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><Icon name="tiktok" size={18} /></a>
              <a href={zaloLink()} target="_blank" rel="noopener noreferrer" aria-label="Zalo"><Icon name="zalo-mark" size={20} /></a>
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <h2>{c.title}</h2>
              <ul>
                {c.links.map(([href, label]) => (
                  <li key={href}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2>Liên hệ</h2>
            <ul>
              <li><a href={telLink()}>{SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li>{SITE.address}</li>
              <li>{SITE.hours}</li>
            </ul>
            <h2 style={{ marginTop: 24, marginBottom: 0 }}>Nhận ưu đãi</h2>
            <Newsletter />
          </div>
        </div>
        <div className="hd-footer-bottom">
          <span>© {new Date().getFullYear()} {SITE.legal.company}{SITE.legal.notice ? ` · ${SITE.legal.notice}` : ""}</span>
          <span style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/chinh-sach#dieu-khoan">Điều khoản</Link>
            <Link href="/chinh-sach#bao-mat">Bảo mật</Link>
            <Link href="/gioi-thieu">Về Hydron</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
