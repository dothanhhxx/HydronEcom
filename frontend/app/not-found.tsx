import { Button } from "@/components/ds";

export default function NotFound() {
  return (
    <div className="lt-container" style={{ paddingTop: "96px", paddingBottom: "120px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, maxWidth: 640 }}>
      <span style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--accent)" }}>Lỗi 404</span>
      <h1 style={{ margin: 0, fontSize: "clamp(28px,4vw,42px)", lineHeight: 1.2, fontWeight: 500, color: "var(--text-strong)" }}>Ấm trà này đã nguội mất rồi</h1>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: "var(--text-body)" }}>Trang bạn tìm không còn hoặc chưa từng có. Bạn quay lại trang chủ, hoặc xem các loại trà Lam Trà đang có nhé.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
        <Button href="/san-pham" iconRight="arrow-right">Xem các loại trà</Button>
        <Button href="/" variant="secondary">Về trang chủ</Button>
      </div>
    </div>
  );
}
