import Link from "next/link";
import BottleRender from "@/components/bottle/BottleRender";
import { Icon } from "@/components/ds";
import { CUSTOM_LEAD_TIME } from "@/lib/checkout";

type Custom = { text: string; font: "block" | "round" | "script"; ink: string; sticker?: string };

type Step = {
  title: string;
  desc: string;
  hex: string;
  size: string;
  tint: string;
  custom?: Custom;
};

/* Hình mỗi bước là chính chiếc bình đang được dựng dần: trơn → màu → tên → sticker → bản in thật. */
const STEPS: Step[] = [
  { title: "Chọn mẫu", desc: "Nắp vặn, nắp ống hút hay nắp quai xách, hợp nhịp ngày của bạn.", hex: "#0688AE", size: "700", tint: "#D2EBF3" },
  { title: "Chọn dung tích", desc: "500, 700 hoặc 900ml. Bình 700ml rót đầy ba lần là đủ 2 lít mỗi ngày.", hex: "#262B2E", size: "900", tint: "#F5E6CA" },
  { title: "Chọn màu sơn", desc: "3 – 5 màu sơn nhám cho mỗi mẫu, đổi màu là thấy ngay trên bình 3D.", hex: "#5B6C55", size: "700", tint: "#DDF0E4" },
  { title: "Gõ tên hoặc số", desc: "Tối đa 14 ký tự, 3 kiểu chữ, 5 màu mực. Xoay 3D xem chữ nằm ở đâu.", hex: "#1F3A5C", size: "700", tint: "#D2EBF3", custom: { text: "MINH ANH", font: "block", ink: "#FFFFFF" } },
  { title: "Thêm sticker", desc: "Gấu, thỏ, capybara, mèo, gấu trúc. Kéo thả tới vị trí ưng ý.", hex: "#0688AE", size: "500", tint: "#FBEBC8", custom: { text: "Minh 07", font: "round", ink: "#FFFFFF", sticker: "set" } },
  { title: "In UV và gửi đi", desc: `In bền màu trong ${CUSTOM_LEAD_TIME}, Hydron nhắn Zalo ảnh bình thật trước khi giao.`, hex: "#E6D8BF", size: "700", tint: "#EAF5F9", custom: { text: "Bảo An", font: "script", ink: "#0B2A36", sticker: "la" } },
];

export default function Process({ models }: { models: number }) {
  return (
    <section className="hd-process hd-section" aria-labelledby="quy-trinh">
      <div className="lt-container hd-process-grid">
        <div className="hd-process-intro">
          <p className="hd-process-eyebrow">Quy trình đặt bình</p>
          <h2 id="quy-trinh">
            Từ ý tưởng
            <span>đến chiếc bình của bạn</span>
          </h2>
          <p className="hd-process-lead">
            {models} mẫu bình thép 304, mọi mẫu đều in được tên. Bạn thiết kế trên web, Hydron lo phần in và giao tận tay, không cần tài khoản.
          </p>
          <Link href="/thiet-ke-3d" className="hd-btn hd-btn-primary">
            <Icon name="pencil" size={18} />Mở trình thiết kế 3D
          </Link>
        </div>

        <ol className="hd-process-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="hd-process-step">
              <span className="hd-process-num">{String(i + 1).padStart(2, "0")}<b>{s.title}</b></span>
              <span className="hd-process-blob" style={{ background: s.tint }} aria-hidden>
                <BottleRender shape="classic" hex={s.hex} size={s.size} custom={s.custom} label="" viewBox="110 40 180 430" noShadow />
              </span>
              <p>{s.desc}</p>
              {i % 3 !== 2 && i < STEPS.length - 1 && <span className="hd-process-arrow" aria-hidden><Icon name="arrow-right" size={16} /></span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
