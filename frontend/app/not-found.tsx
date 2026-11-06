import BottleRender from "@/components/bottle/BottleRender";
import { Button } from "@/components/ds";

export default function NotFound() {
  return (
    <div className="lt-container hd-split" style={{ paddingTop: 64, paddingBottom: 96 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--primary)" }}>Lỗi 404</span>
        <h1 style={{ fontSize: "clamp(30px,4vw,48px)" }}>Trang này đã cạn nước</h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--text-body)", maxWidth: 480 }}>Trang bạn tìm không còn hoặc chưa từng có. Quay lại trang chủ, hoặc xem các mẫu bình Hydron đang bán.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          <Button href="/san-pham" iconRight="arrow-right">Xem các mẫu bình</Button>
          <Button href="/" variant="secondary">Về trang chủ</Button>
        </div>
      </div>
      <div style={{ position: "relative", aspectRatio: "1 / 1", maxWidth: 380, width: "100%", justifySelf: "center", borderRadius: "var(--radius-lg)", background: "var(--cream-100)" }} aria-hidden>
        <BottleRender shape="classic" hex="#0688AE" size="700" custom={{ text: "404", font: "block", ink: "#FFFFFF" }} label="" />
      </div>
    </div>
  );
}
