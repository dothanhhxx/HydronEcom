import type { Metadata } from "next";
import Link from "next/link";
import BottleRender from "@/components/bottle/BottleRender";
import { Icon } from "@/components/ds";
import { PageHeader } from "@/components/shell/PageHeader";
import { CUSTOM_LEAD_TIME } from "@/lib/checkout";

export const metadata: Metadata = {
  title: "Giới thiệu Hydron",
  description: "Hydron làm bình giữ nhiệt thép 304 và cho bạn tự thiết kế tên, số, sticker trên mô hình 3D trước khi in.",
};

// TODO: thay bằng phần giới thiệu doanh nghiệp thật (phiếu thông tin mục 1 chưa điền: năm thành lập, câu chuyện, người sáng lập).
const STEPS = [
  { t: "Nhận thiết kế", d: "Bản thiết kế 3D của bạn gửi kèm đơn hàng: mẫu bình, màu, chữ, kiểu chữ, màu mực, sticker." },
  { t: "In UV lên thân bình", d: "Mực UV khô ngay dưới đèn, bám chắc trên sơn nhám, không bong khi rửa tay hằng ngày." },
  { t: "Kiểm tra và chụp ảnh", d: "Từng bình được thử kín nắp, kiểm tra giữ nhiệt; Hydron nhắn Zalo ảnh bình thật cho bạn." },
  { t: "Đóng gói và giao", d: `Hộp giấy cứng có lót, gửi trong ${CUSTOM_LEAD_TIME} với đơn in riêng, trong ngày với đơn bình trơn.` },
];

const MATERIALS: { icon: string; t: string; d: string }[] = [
  { icon: "thermometer", t: "Lõi thép 304", d: "Hai lớp, hút chân không, giữ lạnh 24 giờ và giữ nóng 12 giờ." },
  { icon: "droplet", t: "Sơn tĩnh điện nhám", d: "Cầm chắc tay, không đổ mồ hôi khi đựng đá." },
  { icon: "leaf", t: "Nắp PP, gioăng silicon", d: "Nhựa và silicon dùng cho thực phẩm, không chứa BPA." },
  { icon: "pencil", t: "Mực in UV", d: "Bám trên lớp sơn nhám, rửa tay hằng ngày không phai." },
  { icon: "shield-check", t: "Bảo hành 12 tháng", d: "Đổi bình mới nếu lớp chân không mất nhiệt." },
];

const TRIO = (
  <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", alignItems: "end" }}>
    <BottleRender shape="flip" hex="#F1EEE8" size="500" custom={{ text: "Ngọc", font: "script", ink: "#0B2A36", sticker: "tim" }} label="" viewBox="110 40 180 430" />
    <BottleRender shape="classic" hex="#0688AE" size="900" custom={{ text: "HUY", font: "block", ink: "#FFFFFF", sticker: "song" }} label="" viewBox="110 40 180 430" />
    <BottleRender shape="sport" hex="#DF6440" size="700" custom={{ text: "23", font: "block", ink: "#FFFFFF" }} label="" viewBox="110 40 180 430" />
  </div>
);

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Một chiếc bình, một cái tên"
        crumbs={[{ label: "Giới thiệu" }]}
        desc="Hydron làm bình giữ nhiệt để bạn mang theo mỗi ngày, và để bạn tự quyết định nó trông thế nào: màu gì, in tên ai, kiểu chữ nào."
        art={TRIO}
      />

      <section className="hd-surface hd-surface-mist hd-section" data-ripple="left" aria-labelledby="vi-sao">
        <div className="lt-container hd-feature">
          <div className="hd-frame" style={{ maxWidth: 620, width: "100%", justifySelf: "center" }}>
            <div className="hd-frame-inner" style={{ aspectRatio: "5 / 4", background: "linear-gradient(180deg, var(--blue-50), var(--cream-100))" }}>
              <div style={{ position: "absolute", inset: "8% 10% 0" }}>
                <BottleRender shape="classic" hex="#0B2A36" size="700" custom={{ text: "AN", font: "block", ink: "#FDF2DF", sticker: "song" }} label="" viewBox="60 30 280 450" />
              </div>
            </div>
            <span className="hd-frame-tag">Mỗi bình mang một cái tên</span>
          </div>
          <div className="hd-stack">
            <span className="hd-kicker">Câu chuyện</span>
            <h2 id="vi-sao" className="hd-display">Vì sao có Hydron</h2>
            <p className="hd-lede">Bình giữ nhiệt trên sàn thương mại điện tử giống nhau đến mức người ta phải dán băng dính ghi tên để không cầm nhầm ở văn phòng, ở lớp học.</p>
            <p className="hd-lede">Hydron giữ phần lõi tốt (thép 304 hai lớp, chân không, giữ lạnh 24 giờ) và để bạn làm phần còn lại: chọn màu sơn, gõ tên, chọn sticker, xoay mô hình 3D trên web để thấy đúng chiếc bình sẽ nhận.</p>
            <p className="hd-lede" style={{ color: "var(--text-strong)", fontWeight: 600 }}>Giá vẫn từ 150.000₫, như một chiếc bình trơn.</p>
          </div>
        </div>
      </section>

      <section className="hd-surface hd-surface-deep hd-section" data-ripple="right" data-waves aria-labelledby="quy-trinh">
        <div className="lt-container">
          <div className="hd-stack" style={{ maxWidth: 720 }}>
            <span className="hd-kicker">Quy trình in riêng</span>
            <h2 id="quy-trinh" className="hd-display">Từ bản thiết kế tới tay bạn</h2>
            <p className="hd-lede">Bốn bước Hydron làm với mỗi bình in riêng, ảnh bình thật gửi bạn xem trước khi giao.</p>
          </div>
          <ol className="hd-timeline" style={{ ["--tl-n" as string]: STEPS.length }}>
            {STEPS.map((s) => (
              <li key={s.t}>
                <span className="hd-tl-dot" aria-hidden />
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hd-surface hd-surface-cream hd-section" data-ripple="center" aria-labelledby="chat-lieu">
        <div className="lt-container">
          <div className="hd-stack" style={{ textAlign: "center", display: "grid", justifyItems: "center" }}>
            <span className="hd-kicker">Chất liệu</span>
            <h2 id="chat-lieu" className="hd-display">Chất liệu chúng tôi chọn</h2>
          </div>
          <ul className="hd-pillars">
            {MATERIALS.map((m) => (
              <li key={m.t}>
                <span className="hd-pillar-icon"><Icon name={m.icon} size={26} /></span>
                <h3>{m.t}</h3>
                <p>{m.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hd-surface hd-surface-deep" data-ripple="center" data-waves>
        <div className="lt-container hd-cta">
          <span className="hd-kicker">Bắt đầu</span>
          <h2 className="hd-display">Thiết kế chiếc bình đầu tiên của bạn</h2>
          <p className="hd-lede">Chọn mẫu, gõ tên, xoay mô hình 3D. Mất khoảng hai phút.</p>
          <div className="hd-cta-actions">
            <Link href="/thiet-ke-3d" className="hd-btn hd-btn-cream"><Icon name="pencil" size={18} />Mở trình thiết kế 3D</Link>
            <Link href="/san-pham" className="hd-btn hd-btn-ghost-light">Xem các mẫu bình</Link>
          </div>
        </div>
      </section>
    </>
  );
}
