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

const MATERIALS: [string, string][] = [
  ["Lõi bình", "Thép không gỉ 304, hai lớp, hút chân không"],
  ["Lớp ngoài", "Sơn tĩnh điện nhám, cầm chắc tay, không đổ mồ hôi"],
  ["Nắp, gioăng", "Nhựa PP và silicon thực phẩm, không chứa BPA"],
  ["Mực in", "Mực UV, bám trên sơn nhám, rửa tay không phai"],
  ["Bảo hành", "12 tháng cho lớp chân không, đổi bình mới nếu mất nhiệt"],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="Một chiếc bình, một cái tên" crumbs={[{ label: "Giới thiệu" }]} desc="Hydron làm bình giữ nhiệt để bạn mang theo mỗi ngày, và để bạn tự quyết định nó trông thế nào: màu gì, in tên ai, kiểu chữ nào." />

      <section className="hd-section">
        <div className="lt-container hd-split">
          <div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)" }}>Vì sao có Hydron</h2>
            <div style={{ marginTop: 18, display: "grid", gap: 16, fontSize: 16.5, lineHeight: 1.75, color: "var(--text-body)", maxWidth: 540 }}>
              <p>Bình giữ nhiệt trên sàn thương mại điện tử giống nhau đến mức người ta phải dán băng dính ghi tên để không cầm nhầm ở văn phòng, ở lớp học.</p>
              <p>Hydron giữ phần lõi tốt (thép 304 hai lớp, chân không, giữ lạnh 24 giờ) và để bạn làm phần còn lại: chọn màu sơn, gõ tên, chọn sticker, xoay mô hình 3D trên web để thấy đúng chiếc bình sẽ nhận.</p>
              <p>Giá vẫn từ 150.000₫, như một chiếc bình trơn.</p>
            </div>
          </div>
          <div style={{ position: "relative", aspectRatio: "1 / 1", borderRadius: "var(--radius-lg)", background: "var(--blue-50)", overflow: "hidden" }} aria-hidden>
            <div style={{ position: "absolute", inset: "6% 4% 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", alignItems: "end" }}>
              <BottleRender shape="flip" hex="#F1EEE8" size="500" custom={{ text: "Ngọc", font: "script", ink: "#0B2A36", sticker: "tim" }} label="" viewBox="110 40 180 430" />
              <BottleRender shape="classic" hex="#0688AE" size="900" custom={{ text: "HUY", font: "block", ink: "#FFFFFF", sticker: "song" }} label="" viewBox="110 40 180 430" />
              <BottleRender shape="sport" hex="#DF6440" size="700" custom={{ text: "23", font: "block", ink: "#FFFFFF" }} label="" viewBox="110 40 180 430" />
            </div>
          </div>
        </div>
      </section>

      <section className="hd-section" style={{ background: "var(--cream-50)" }} aria-labelledby="quy-trinh">
        <div className="lt-container">
          <div className="hd-section-head">
            <div>
              <h2 id="quy-trinh">Từ bản thiết kế tới tay bạn</h2>
              <p>Bốn bước Hydron làm với mỗi bình in riêng.</p>
            </div>
          </div>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {STEPS.map((s, i) => (
              <li key={s.t} style={{ padding: 24, borderRadius: "var(--radius-card)", background: "#fff", border: "1px solid var(--border-hairline)" }}>
                <span style={{ display: "inline-flex", width: 36, height: 36, borderRadius: 999, background: "var(--blue-600)", color: "#fff", alignItems: "center", justifyContent: "center", font: "600 15px var(--font-display)" }}>{i + 1}</span>
                <h3 style={{ marginTop: 16, fontSize: 18 }}>{s.t}</h3>
                <p style={{ marginTop: 8, fontSize: 15, lineHeight: 1.6, color: "var(--text-muted)" }}>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hd-section" aria-labelledby="chat-lieu">
        <div className="lt-container hd-split" style={{ alignItems: "start" }}>
          <h2 id="chat-lieu" style={{ fontSize: "clamp(26px, 3vw, 38px)" }}>Chất liệu chúng tôi chọn</h2>
          <table className="hd-spec">
            <tbody>
              {MATERIALS.map(([k, v]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="hd-band hd-section" style={{ textAlign: "center" }}>
        <div className="lt-container" style={{ display: "grid", justifyItems: "center", gap: 20 }}>
          <h2 style={{ fontSize: "clamp(26px, 3.4vw, 42px)", maxWidth: 720 }}>Thiết kế chiếc bình đầu tiên của bạn</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/thiet-ke-3d" className="hd-btn hd-btn-cream"><Icon name="pencil" size={18} />Mở trình thiết kế 3D</Link>
            <Link href="/san-pham" className="hd-btn hd-btn-ghost-light">Xem các mẫu bình</Link>
          </div>
        </div>
      </section>
    </>
  );
}
