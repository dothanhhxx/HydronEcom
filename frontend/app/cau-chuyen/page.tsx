import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, Icon } from "@/components/ds";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { JOURNEY_PHOTOS as J, STORY_PHOTOS as S, type Figure } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Câu chuyện Lam Trà",
  description: "Lam Trà bắt đầu từ những đồi chè Tân Cương, Thái Nguyên: hái tay sáng sớm, sao chảo gang, gửi trà đi khắp Việt Nam.",
  openGraph: { images: ["/assets/bg/tea-hills-mist.webp"] },
};

const VALUES = [
  { icon: "leaf", title: "Hái tay, sao tay", text: "Búp chè được hái vào sáng sớm khi còn sương, sao trên chảo gang theo cách các nhà chè Tân Cương vẫn làm." },
  { icon: "scale", title: "Nói rõ từng gói", text: "Mỗi gói ghi khối lượng, phân hạng, vùng trồng và ngày đóng gói. Bạn biết mình đang uống gì." },
  { icon: "gift", title: "Trao tay tử tế", text: "Lời nhắn của bạn được viết tay lên thiệp. Hộp quà được gói như khi chính Lam Trà mang biếu." },
];

const JOURNEY: { title: string; text: string; img?: Figure }[] = [
  { title: "Vùng trồng", img: J.vungTrong, text: "Tân Cương, vùng đất trồng và chế biến chè lâu đời, cho trà hương thơm tự nhiên, vị chát dịu và hậu ngọt." },
  { title: "Thu hái", img: J.thuHai, text: "Khi búp đạt độ non thích hợp, người làm chè chọn hái từng búp để giữ độ tươi." },
  { title: "Chế biến", img: J.cheBien, text: "Làm héo, diệt men, vò và sấy khô. Nhiệt độ, thời gian và tay nghề quyết định màu nước, hương vị." },
  { title: "Đóng gói", img: J.rotTra, text: "Đóng kín tránh ẩm, ánh sáng và mùi lạ; bao bì ghi rõ vùng trồng, phân hạng và cách pha." },
  { title: "Thưởng trà", img: J.thuongTra, text: "Lá trà khô được đánh thức bằng nước nóng, gắn với những lúc sum họp và tiếp bạn." },
];

const LEAF_TO_CUP = [
  { src: "/assets/journey/hai-bup.webp", label: "Búp trà tươi" },
  { src: J.voChe.src, label: "Sao, vò thành trà khô" },
  { src: J.rotTra.src, label: "Chén trà thơm" },
];

/** Một chương của câu chuyện: số thứ tự lớn, tiêu đề hai tông màu, nội dung và ảnh đặt so le. */
function Chapter({ no, eyebrow, title, accent, media, reverse, tone, children, id }: {
  no: string; eyebrow: string; title: string; accent: string; media: ReactNode; reverse?: boolean; tone?: "veil" | "plain"; children: ReactNode; id: string;
}) {
  return (
    <section aria-labelledby={id} className={`lt-chapter${tone === "veil" ? " lt-chapter-veil" : ""}`}>
      <span className="lt-chapter-water" aria-hidden="true">{no}</span>
      <div className={`lt-container lt-chapter-grid${reverse ? " lt-chapter-reverse" : ""}`}>
        <div className="lt-chapter-text">
          <div className="lt-chapter-kicker">
            <span className="lt-chapter-no">{no}</span>
            <span className="lt-chapter-eyebrow">{eyebrow}</span>
            <span className="lt-chapter-rule" aria-hidden="true" />
          </div>
          <h2 id={id} className="lt-chapter-title">
            {title} <span>{accent}</span>
          </h2>
          {children}
        </div>
        <div className="lt-chapter-media">{media}</div>
      </div>
    </section>
  );
}

function Framed({ src, alt, caption, ratio = "4 / 3", sprig }: { src: string; alt: string; caption?: string; ratio?: string; sprig?: boolean }) {
  return (
    <figure className="lt-framed">
      <span className="lt-framed-photo" style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </span>
      {caption && <figcaption>{caption}</figcaption>}
      {sprig && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="lt-framed-sprig" src="/assets/bg/tea-sprig.webp" alt="" aria-hidden="true" width={661} height={1000} loading="lazy" />
      )}
    </figure>
  );
}

export default function StoryPage() {
  return (
    <>
      {/* Mở đầu: dải ảnh đồi chè sương mù toàn chiều rộng */}
      <section className="lt-story-open" aria-labelledby="cau-chuyen-title">
        <div className="lt-container lt-story-open-inner">
          <Breadcrumbs crumbs={[{ label: "Câu chuyện" }]} />
          <span className="lt-story-open-eyebrow">Tân Cương · Thái Nguyên</span>
          <h1 id="cau-chuyen-title">
            Câu chuyện <span>Lam Trà</span>
          </h1>
          <p>Từ một ấm trà mỗi sáng bên đồi chè Tân Cương, đến món quà trao tay khắp mọi miền.</p>
          <a href="#khoi-nguon" className="lt-story-open-down" aria-label="Đọc câu chuyện">
            <Icon name="chevron-down" size={20} />
          </a>
        </div>
      </section>

      {/* TODO: nội dung mẫu, chủ shop thay bằng câu chuyện thật (số thế hệ làm chè, ý nghĩa tên Lam Trà). */}
      <Chapter
        id="khoi-nguon" no="01" eyebrow="Khởi nguồn" title="Bắt đầu từ" accent="một ấm trà."
        media={<Framed src="/assets/photos/hero.jpg" alt="Rót trà nóng từ ấm men lam" caption="Ấm trà mỗi sáng của gia đình Lam Trà" ratio="4 / 4.6" />}
      >
        <p className="lt-chapter-lead">Lam Trà bắt đầu từ một ấm trà mỗi sáng ở Tân Cương, nơi những đồi chè chạy dài bên hồ Núi Cốc và sương sớm còn đọng trên búp non.</p>
        <p>Gia đình chúng tôi làm chè đã ba thế hệ. Trước đây, trà được bán cho khách quen, cho người dưới xuôi lên mua làm quà, rồi qua Facebook, TikTok. Càng bán, chúng tôi càng nhận ra: người mua trà cần biết rõ hơn mình đang mua gì. Bao nhiêu gam, hạng nào, hái lúc nào, pha ra sao.</p>
        <p>Lam Trà ra đời để trả lời những câu hỏi đó. Mỗi gói trà ghi rõ khối lượng và phân hạng, mỗi loại trà có hướng dẫn pha riêng, và lời nhắn của bạn được viết tay khi gửi trà làm quà.</p>
      </Chapter>

      <Chapter
        id="vung-dat" no="02" eyebrow="Vùng đất" title="Vì sao là" accent="Tân Cương?" reverse tone="veil"
        media={<Framed src="/assets/bg/tea-hill-thai-nguyen.webp" alt="Đồi chè Tân Cương, Thái Nguyên" caption="Đồi chè Tân Cương, Thái Nguyên" ratio="16 / 11" sprig />}
      >
        <p>Đất Tân Cương pha cát, khí hậu có sương mù buổi sớm và chênh lệch ngày đêm lớn. Cây chè lớn chậm, búp nhỏ, tích được nhiều vị ngọt.</p>
        <p>Đó là lý do trà Tân Cương có hương cốm non và hậu ngọt sâu mà ít vùng nào có được.</p>
        <blockquote className="lt-chapter-quote">“Sương sớm, đất cát và đôi tay người làm chè: ba thứ làm nên hậu ngọt của trà Tân Cương.”</blockquote>
      </Chapter>

      <Chapter
        id="hanh-trinh" no="03" eyebrow="Hành trình" title="Từ búp non đến" accent="một chén trà."
        media={
          <ol className="lt-leafcup" aria-label="Từ búp trà đến chén trà">
            {LEAF_TO_CUP.map((s, i) => (
              <li key={s.label}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt="" loading="lazy" decoding="async" />
                <span>{s.label}</span>
                {i < LEAF_TO_CUP.length - 1 && <span className="lt-leafcup-arrow" aria-hidden="true"><Icon name="chevron-right" size={22} /></span>}
              </li>
            ))}
          </ol>
        }
      >
        <p>Búp chè được hái khi còn đọng sương, rồi qua làm héo, diệt men, vò và sao trên chảo gang. Mỗi công đoạn giữ lại một phần hương đất và tay nghề người làm trà.</p>
        <Button href="/tra-dam/hanh-trinh-tu-doi-che-den-tach-tra" variant="secondary" iconRight="arrow-right">Đọc trọn hành trình</Button>
      </Chapter>

      <section aria-label="Năm công đoạn" className="lt-chapter lt-chapter-steps">
        <div className="lt-container">
          <ol className="lt-steps">
            {JOURNEY.map((s, i) => (
              <li key={s.title}>
                {s.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.img.src} alt={s.img.alt} loading="lazy" decoding="async" />
                )}
                <span className="lt-steps-no">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Chapter
        id="cai-ten" no="04" eyebrow="Cái tên" title="Vì sao gọi là" accent="Lam Trà?" reverse tone="veil"
        media={<Framed src="/assets/photos/moccau.jpg" alt="Trà Móc Câu khô bên ấm và chén trà" caption="Trọn vị trà Việt, trọn tấm lòng trao gửi" ratio="4 / 4.4" />}
      >
        <p>“Lam” là màu xanh của đồi chè lúc sương tan, cũng là chữ “làm” bớt đi một dấu: làm trà bằng tay, bằng thời gian và bằng sự tỉ mỉ.</p>
        <blockquote className="lt-chapter-quote">“Trọn vị trà Việt, trọn tấm lòng trao gửi.”</blockquote>
        <p>Câu chúng tôi vẫn nói với nhau mỗi khi đóng một hộp trà gửi đi.</p>
      </Chapter>

      <Chapter
        id="bo-suu-tap" no="05" eyebrow="Bộ sưu tập" title="Bốn dòng trà," accent="bốn sắc thái."
        media={<Framed src={S.boSuuTap.src} alt={S.boSuuTap.alt} ratio="3 / 2" />}
      >
        <p>Vị thanh khiết, hậu ngọt sâu của Trà Đinh; hương dịu nhẹ của Trà Nõn Tôm; nét thanh tao của Trà Nhài; vị đậm đà của Trà Móc Câu.</p>
        <p>Dù bạn thích trà thanh nhẹ hay đậm đà, Lam Trà luôn có một lựa chọn cho khoảnh khắc thưởng trà của bạn.</p>
        <Button href="/san-pham" variant="secondary" iconRight="arrow-right">Xem các loại trà</Button>
      </Chapter>

      <Chapter
        id="nguon-goc" no="06" eyebrow="Minh bạch" title="Nguồn gốc rõ," accent="an tâm chất lượng." reverse tone="veil"
        media={
          <a href={S.chungNhan.src} target="_blank" rel="noopener" aria-label="Mở ảnh giấy chứng nhận cỡ lớn" className="lt-framed-link">
            <Framed src={S.chungNhan.src} alt={S.chungNhan.alt} caption="Hồ sơ của Hợp tác xã Chè Thanh Huyền Trà" ratio="1254 / 1104" />
          </a>
        }
      >
        <p>Lam Trà hợp tác cùng <strong>Hợp tác xã Chè Thanh Huyền Trà</strong> (Thái Nguyên), đơn vị chế biến và kinh doanh chè có Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm do Phòng Kinh tế thành phố Thái Nguyên cấp.</p>
        <ul className="lt-chapter-list">
          <li><Icon name="circle-check" size={18} />Chứng nhận cơ sở đủ điều kiện an toàn thực phẩm</li>
          <li><Icon name="circle-check" size={18} />Chứng nhận VietGAP cho chè búp tươi</li>
          <li><Icon name="circle-check" size={18} />Chứng nhận đăng ký hợp tác xã</li>
        </ul>
        <Button href="/chung-nhan" variant="secondary" iconRight="arrow-right">Xem hồ sơ chứng nhận</Button>
      </Chapter>

      <section aria-labelledby="gia-tri" className="lt-bg-ink">
        <div className="lt-container" style={{ paddingTop: "clamp(48px,6vw,80px)", paddingBottom: "clamp(48px,6vw,80px)" }}>
          <h2 id="gia-tri" style={{ margin: "0 0 28px", fontSize: "clamp(22px,2.2vw,28px)", lineHeight: 1.25, fontWeight: 500, color: "var(--text-strong)" }}>Điều Lam Trà giữ trong từng gói trà</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ padding: 24, border: "1px solid var(--border-hairline)", borderRadius: 6, background: "var(--surface-card)", display: "flex", flexDirection: "column", gap: 10 }}>
                <span style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid var(--border-strong)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={v.icon} size={20} />
                </span>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: "var(--text-strong)" }}>{v.title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)" }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kết: dải ảnh sáng, chữ căn giữa */}
      <section aria-labelledby="ket" className="lt-story-close">
        <div className="lt-container">
          <span className="lt-story-open-eyebrow">Từ câu chuyện đến hương vị</span>
          <h2 id="ket">
            Và câu chuyện
            <br />
            <span>tiếp tục trong từng chén trà.</span>
          </h2>
          <div className="lt-story-close-actions">
            <Button href="/san-pham" variant="accent" iconRight="arrow-right">Khám phá sản phẩm</Button>
            <Link href="/tra-dam" className="lt-story-close-link">Đọc Trà đàm</Link>
          </div>
        </div>
      </section>
    </>
  );
}
