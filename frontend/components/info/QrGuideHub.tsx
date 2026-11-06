"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, CopyButton, Icon, Panel, Price, ProductImage } from "@/components/ds";
import { photo, priceOf, type Product } from "@/lib/products";
import { SITE, telLink, zaloLink } from "@/lib/site";

const DEFAULT_PUBLIC_ORIGIN = "https://lamtra-frontend.onrender.com";

export type GuideVideo = {
  id: string;
  step: string;
  title: string;
  duration: string;
  summary: string;
  poster: string;
  /**
   * Điền link YouTube embed (vd: "https://www.youtube.com/embed/VIDEO_ID")
   * hoặc đường dẫn file MP4 (vd: "/assets/videos/huong-dan-pha-tra.mp4").
   * Khi để trống, trang hiển thị trình mô phỏng từng bước trực quan kèm nút mở video trên Fanpage/TikTok.
   */
  embedUrl?: string;
  highlights: { title: string; detail: string }[];
};

export const GUIDE_VIDEOS: GuideVideo[] = [
  {
    id: "pha-tra",
    step: "Video 01",
    title: "Cách pha ấm trà Thái Nguyên xanh nước, ngọt hậu",
    duration: "01:45",
    summary:
      "Bí quyết nằm ở nhiệt độ nước 80 – 85°C và thời gian hãm 20 – 30 giây. Không dùng nước sôi già 100°C để tránh làm cháy búp trà non.",
    poster: "/assets/journey/thuong-tra.webp",
    embedUrl: "",
    highlights: [
      { title: "Bước 1 · Tráng ấm chén", detail: "Rót nước sôi tráng đều ấm và chén để làm nóng dụng cụ pha." },
      { title: "Bước 2 · Đánh thức búp trà", detail: "Cho 5g trà vào ấm 150ml, rót nước 80–85°C ngập trà rồi chắt bỏ ngay trong 3 giây." },
      { title: "Bước 3 · Hãm trà 20–30 giây", detail: "Rót 150ml nước 80–85°C, đậy nắp chờ đúng 20–30 giây tùy dòng trà." },
      { title: "Bước 4 · Rót hết ra chén", detail: "Rót cạn nước trong ấm ra tống/chén, mở hé nắp ấm để búp trà không bị nồng cho tuần nước sau." },
    ],
  },
  {
    id: "bao-quan",
    step: "Video 02",
    title: "Bí quyết giữ hương cốm non suốt 12 tháng",
    duration: "01:15",
    summary:
      "Trà sao khô rất nhạy với độ ẩm và mùi lạ. Chỉ cần 3 thao tác nhỏ sau mỗi lần pha để giữ trọn hương cốm như lúc mới mở túi.",
    poster: "/assets/journey/rot-tra.webp",
    embedUrl: "",
    highlights: [
      { title: "Ép kín khí túi zip", detail: "Vuốt nhẹ từ dưới lên để đẩy hết không khí ra ngoài trước khi bấm khóa zip." },
      { title: "Tránh ánh nắng & nhiệt độ cao", detail: "Đặt túi trà hoặc hũ gốm ở nơi khô mát, cách xa bếp nấu và cửa sổ nắng gắt." },
      { title: "Dùng muỗng khô sạch", detail: "Không dùng tay ướt hoặc muỗng ẩm xúc trà; với trà sen nên thưởng thức trong 6 tháng đầu." },
    ],
  },
  {
    id: "hanh-trinh",
    step: "Video 03",
    title: "Hành trình búp chè Tân Cương từ sương sớm",
    duration: "02:10",
    summary:
      "Theo chân nghệ nhân Lam Trà từ đồi chè Tân Cương lúc bình minh qua chảo gang sao tay truyền thống đến hộp trà trên tay bạn.",
    poster: "/assets/journey/che-bien.webp",
    embedUrl: "",
    highlights: [
      { title: "Thu hái lúc sương tan", detail: "Chọn hái từng búp 1 tôm 1 lá hoặc búp đinh non khi trời vừa hửng nắng." },
      { title: "Sao tay chảo gang", detail: "Canh lửa thủ công nhiều lượt để đánh thức hương cốm non tự nhiên, không hương liệu." },
      { title: "Đóng gói chuẩn vị", detail: "Gói kín ngay sau khi lên hương để trao tận tay người thưởng trà." },
    ],
  },
];

function parseSeconds(timeStr?: string): number {
  if (!timeStr) return 25;
  const nums = timeStr.match(/\d+/g);
  if (!nums || nums.length === 0) return 25;
  if (nums.length >= 2) {
    return Math.round((Number(nums[0]) + Number(nums[1])) / 2);
  }
  return Number(nums[0]) || 25;
}

export default function QrGuideHub({
  products,
  initialSlug,
}: {
  products: Product[];
  initialSlug?: string;
}) {
  const teaProducts = useMemo(() => {
    const withBrew = products.filter((p) => p.brew);
    return withBrew.length > 0 ? withBrew : products;
  }, [products]);

  const [selectedSlug, setSelectedSlug] = useState<string>(() => {
    if (initialSlug && products.some((p) => p.slug === initialSlug)) {
      return initialSlug;
    }
    return teaProducts[0]?.slug ?? products[0]?.slug ?? "tra-moc-cau";
  });

  const [activeVideoId, setActiveVideoId] = useState<string>(GUIDE_VIDEOS[0].id);
  const [playingStep, setPlayingStep] = useState<number>(0);

  // Đồng hồ bấm giờ hãm trà (Brew Timer)
  const selectedProduct = useMemo(
    () => products.find((p) => p.slug === selectedSlug) ?? teaProducts[0] ?? products[0],
    [products, teaProducts, selectedSlug]
  );

  const baseSeconds = useMemo(() => parseSeconds(selectedProduct?.brew?.time), [selectedProduct]);
  const [infusionRound, setInfusionRound] = useState<number>(1);
  const targetSeconds = baseSeconds + (infusionRound - 1) * 10;

  const [timeLeft, setTimeLeft] = useState<number>(targetSeconds);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerDone, setTimerDone] = useState<boolean>(false);

  // QR Generator cho chủ cửa hàng in bao bì
  const [qrTargetSlug, setQrTargetSlug] = useState<string>("all");

  useEffect(() => {
    if (initialSlug && products.some((p) => p.slug === initialSlug)) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug, products]);

  useEffect(() => {
    setTimerRunning(false);
    setTimerDone(false);
    setTimeLeft(baseSeconds + (infusionRound - 1) * 10);
  }, [baseSeconds, infusionRound, selectedSlug]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setTimerRunning(false);
          setTimerDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const activeVideo = useMemo(
    () => GUIDE_VIDEOS.find((v) => v.id === activeVideoId) ?? GUIDE_VIDEOS[0],
    [activeVideoId]
  );

  const qrUrl = useMemo(() => {
    const base = `${DEFAULT_PUBLIC_ORIGIN}/huong-dan`;
    if (qrTargetSlug && qrTargetSlug !== "all") {
      return `${base}?tra=${encodeURIComponent(qrTargetSlug)}`;
    }
    return base;
  }, [qrTargetSlug]);

  const qrImageSrc = useMemo(() => {
    const params = new URLSearchParams({
      size: "600x600",
      margin: "16",
      color: "24341F",
      bgcolor: "FCF8F1",
      format: "svg",
      qzone: "2",
      data: qrUrl,
    });
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  }, [qrUrl]);

  const qrPngDownloadSrc = useMemo(() => {
    const params = new URLSearchParams({
      size: "1000x1000",
      margin: "24",
      color: "24341F",
      bgcolor: "FCF8F1",
      format: "png",
      qzone: "2",
      data: qrUrl,
    });
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  }, [qrUrl]);

  const handleDownloadQr = async (format: "svg" | "png") => {
    const src = format === "svg" ? qrImageSrc : qrPngDownloadSrc;
    const fileName =
      qrTargetSlug === "all"
        ? `qr-lam-tra-huong-dan.${format}`
        : `qr-lam-tra-${qrTargetSlug}.${format}`;
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(src, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div style={{ background: "var(--bg-sunken)", minHeight: "100vh", paddingBottom: 72 }}>
      {/* ─── 1. HERO BANNER: LỜI CHÀO TỪ HỘP TRÀ (TỐI ƯU MOBILE BIO) ─── */}
      <section
        style={{
          background: "linear-gradient(165deg, var(--reu-900) 0%, var(--reu-800) 60%, var(--reu-700) 100%)",
          color: "var(--text-on-inverse)",
          padding: "clamp(28px, 5vw, 48px) 0 clamp(32px, 5vw, 52px)",
          borderBottom: "1px solid rgba(188, 154, 108, 0.25)",
        }}
      >
        <div className="lt-container" style={{ maxWidth: 880 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 14px",
                borderRadius: 999,
                background: "rgba(188, 154, 108, 0.16)",
                border: "1px solid rgba(188, 154, 108, 0.35)",
                color: "var(--tra-300)",
                fontSize: 12,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              <Icon name="qr-code" size={14} color="var(--tra-300)" />
              Cẩm nang thưởng trà &amp; Kết nối nhanh
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 2 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/lam-tra-emblem.svg"
                alt="Biểu tượng Lam Trà"
                width={44}
                height={44}
                style={{ borderRadius: 10, border: "1px solid rgba(188, 154, 108, 0.35)" }}
              />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, color: "var(--tra-300)", letterSpacing: ".04em" }}>Tân Cương · Thái Nguyên</div>
                <h1 style={{ margin: 0, fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 500, color: "var(--logo-cream)", lineHeight: 1.2 }}>
                  Chào bạn đến với Lam Trà
                </h1>
              </div>
            </div>

            <p style={{ margin: "2px 0 0", maxWidth: 560, fontSize: 15, lineHeight: 1.6, color: "var(--text-on-inverse-muted)" }}>
              Cảm ơn bạn đã mở hộp trà hôm nay. Tại đây bạn có thể xem{" "}
              <strong style={{ color: "var(--logo-cream)", fontWeight: 500 }}>video hướng dẫn pha trà</strong>, tra cứu nhanh{" "}
              <strong style={{ color: "var(--logo-cream)", fontWeight: 500 }}>nhiệt độ &amp; bấm giờ hãm trà</strong>, hoặc kết nối trực tiếp với{" "}
              <strong style={{ color: "var(--logo-cream)", fontWeight: 500 }}>Facebook / Zalo Lam Trà</strong>.
            </p>

            {/* Thanh neo điều hướng nhanh trên điện thoại */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 8,
                marginTop: 10,
              }}
            >
              {[
                { href: "#video-huong-dan", icon: "video", label: "Video hướng dẫn" },
                { href: "#cong-thuc-pha", icon: "timer", label: "Cách pha & Bấm giờ" },
                { href: "#ket-noi-nhanh", icon: "facebook", label: "Facebook & Liên hệ" },
                { href: "#san-pham-noi-bat", icon: "store", label: "Đặt thêm trà" },
                { href: "#ma-qr-bao-bi", icon: "qr-code", label: "Tải QR in hộp" },
              ].map((nav) => (
                <a
                  key={nav.href}
                  href={nav.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "rgba(252, 248, 241, 0.1)",
                    border: "1px solid rgba(252, 248, 241, 0.2)",
                    color: "var(--logo-cream)",
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  <Icon name={nav.icon} size={15} color="var(--tra-300)" />
                  {nav.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="lt-container" style={{ maxWidth: 880, paddingTop: 28, display: "flex", flexDirection: "column", gap: 36 }}>
        {/* ─── 2. KẾT NỐI NHANH (FACEBOOK, ZALO, TIKTOK, CỬA HÀNG) ─── */}
        <section id="ket-noi-nhanh" aria-labelledby="heading-ket-noi" style={{ scrollMarginTop: 80 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>
                Kênh chính thức
              </div>
              <h2 id="heading-ket-noi" style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 500, color: "var(--text-strong)" }}>
                Kết nối nhanh cùng Lam Trà
              </h2>
            </div>
            <Badge tone="accent">Hỗ trợ 8:00 – 21:00</Badge>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {/* Nút Fanpage Facebook */}
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                borderRadius: 12,
                background: "#1877F2",
                color: "#FFFFFF",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(24, 119, 242, 0.22)",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="facebook" size={24} color="#FFFFFF" />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>Fanpage Facebook Lam Trà</span>
                <span style={{ display: "block", fontSize: 12.5, opacity: 0.9, marginTop: 2 }}>
                  Xem video mới, ưu đãi &amp; nhắn tin trực tiếp
                </span>
              </span>
              <Icon name="external-link" size={18} color="#FFFFFF" />
            </a>

            {/* Nút Zalo OA / Tư vấn nhanh */}
            <a
              href={zaloLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                borderRadius: 12,
                background: "var(--primary)",
                color: "var(--text-on-primary)",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(36, 52, 31, 0.18)",
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="zalo" size={24} color="var(--tra-300)" />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>Nhắn Zalo · {SITE.phone}</span>
                <span style={{ display: "block", fontSize: 12.5, opacity: 0.9, marginTop: 2 }}>
                  Hỏi cách pha, đặt thêm trà, bảo hành đổi trả 7 ngày
                </span>
              </span>
              <Icon name="chevron-right" size={18} color="var(--tra-300)" />
            </a>

            {/* Nút TikTok */}
            <a
              href={SITE.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "15px 18px",
                borderRadius: 12,
                background: "var(--surface-card)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-strong)",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: "var(--stone-900)",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="tiktok" size={20} color="#FFFFFF" />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>Kênh TikTok Lam Trà</span>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                  Clip ngắn hướng dẫn pha trà &amp; chuyện đồi chè
                </span>
              </span>
              <Icon name="external-link" size={17} color="var(--text-muted)" />
            </a>

            {/* Nút Cửa hàng trực tuyến */}
            <Link
              href="/san-pham"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "15px 18px",
                borderRadius: 12,
                background: "var(--surface-card)",
                border: "1px solid var(--border-strong)",
                color: "var(--text-strong)",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name="store" size={20} color="var(--accent)" />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>Cửa hàng Lam Trà Online</span>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                  Xem bảng giá Móc Câu, Nõn Tôm, Trà Đinh &amp; Quà biếu
                </span>
              </span>
              <Icon name="arrow-right" size={17} color="var(--accent)" />
            </Link>
          </div>
        </section>

        {/* ─── 3. VIDEO HƯỚNG DẪN PHA TRÀ & TRẢI NGHIỆM ─── */}
        <section id="video-huong-dan" aria-labelledby="heading-video" style={{ scrollMarginTop: 80 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>
              Trải nghiệm trực quan
            </div>
            <h2 id="heading-video" style={{ margin: "2px 0 4px", fontSize: 22, fontWeight: 500, color: "var(--text-strong)" }}>
              Video hướng dẫn thưởng trà &amp; bảo quản
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>
              Chọn chủ đề bên dưới để xem hướng dẫn chi tiết từng bước từ nghệ nhân Lam Trà.
            </p>
          </div>

          {/* Tabs chọn video */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 16 }}>
            {GUIDE_VIDEOS.map((vid) => {
              const active = vid.id === activeVideo.id;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => {
                    setActiveVideoId(vid.id);
                    setPlayingStep(0);
                  }}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontFamily: "var(--font-ui)",
                    border: active ? "1.5px solid var(--primary)" : "1px solid var(--border-hairline)",
                    background: active ? "var(--primary-soft)" : "var(--surface-card)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: active ? "var(--primary)" : "var(--accent)" }}>{vid.step}</span>
                    <span style={{ color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Icon name="clock" size={13} />
                      {vid.duration}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: "var(--text-strong)", lineHeight: 1.35 }}>
                    {vid.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Khung phát Video / Trình hướng dẫn từng bước */}
          <Panel style={{ overflow: "hidden", borderRadius: 14, background: "var(--surface-card)" }}>
            {activeVideo.embedUrl ? (
              <div style={{ position: "relative", aspectRatio: "16 / 9", width: "100%", background: "#000" }}>
                {activeVideo.embedUrl.endsWith(".mp4") ? (
                  <video
                    src={activeVideo.embedUrl}
                    poster={activeVideo.poster}
                    controls
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <iframe
                    src={activeVideo.embedUrl}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  />
                )}
              </div>
            ) : (
              <div
                style={{
                  position: "relative",
                  minHeight: 280,
                  backgroundImage: `linear-gradient(180deg, rgba(25,36,26,0.35) 0%, rgba(25,36,26,0.88) 100%), url('${activeVideo.poster}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "var(--logo-cream)",
                  padding: "clamp(20px, 4vw, 32px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 12px",
                      borderRadius: 999,
                      background: "rgba(25, 36, 26, 0.72)",
                      border: "1px solid rgba(217, 191, 148, 0.4)",
                      fontSize: 12,
                      color: "var(--tra-300)",
                    }}
                  >
                    <Icon name="video" size={14} color="var(--tra-300)" />
                    {activeVideo.step} · Thời lượng {activeVideo.duration}
                  </span>

                  <div style={{ display: "flex", gap: 8 }}>
                    <a
                      href={SITE.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: "rgba(24, 119, 242, 0.9)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      <Icon name="facebook" size={13} color="#fff" />
                      Xem trên Facebook
                    </a>
                    <a
                      href={SITE.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: "rgba(25, 36, 26, 0.85)",
                        border: "1px solid rgba(255,255,255,0.25)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      <Icon name="tiktok" size={13} color="#fff" />
                      Xem trên TikTok
                    </a>
                  </div>
                </div>

                {/* Slide bước đang chọn trong trình mô phỏng */}
                <div
                  style={{
                    background: "rgba(25, 36, 26, 0.78)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(217, 191, 148, 0.3)",
                    borderRadius: 12,
                    padding: "16px 18px",
                  }}
                >
                  <div style={{ fontSize: 12, color: "var(--tra-300)", fontWeight: 600, marginBottom: 4 }}>
                    {activeVideo.highlights[playingStep]?.title}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "var(--logo-cream)", lineHeight: 1.5 }}>
                    {activeVideo.highlights[playingStep]?.detail}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, gap: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {activeVideo.highlights.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPlayingStep(idx)}
                          style={{
                            height: 8,
                            width: playingStep === idx ? 28 : 8,
                            borderRadius: 999,
                            border: 0,
                            background: playingStep === idx ? "var(--tra-400)" : "rgba(255,255,255,0.35)",
                            cursor: "pointer",
                            transition: "width 0.2s ease",
                            padding: 0,
                          }}
                          aria-label={`Bước ${idx + 1}`}
                        />
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() =>
                          setPlayingStep((p) => (p - 1 + activeVideo.highlights.length) % activeVideo.highlights.length)
                        }
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: "1px solid rgba(255,255,255,0.25)",
                          background: "transparent",
                          color: "var(--logo-cream)",
                          fontSize: 12.5,
                          cursor: "pointer",
                        }}
                      >
                        Bước trước
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlayingStep((p) => (p + 1) % activeVideo.highlights.length)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          border: "1px solid var(--tra-400)",
                          background: "var(--tra-500)",
                          color: "#fff",
                          fontSize: 12.5,
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Icon name="play" size={12} color="#fff" />
                        Bước tiếp theo ({playingStep + 1}/{activeVideo.highlights.length})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tóm tắt các bước ngay bên dưới video */}
            <div style={{ padding: "18px 20px" }}>
              <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.6, color: "var(--text-body)" }}>
                {activeVideo.summary}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                {activeVideo.highlights.map((h, idx) => {
                  const active = idx === playingStep;
                  return (
                    <button
                      key={h.title}
                      type="button"
                      onClick={() => setPlayingStep(idx)}
                      style={{
                        textAlign: "left",
                        padding: "12px 14px",
                        borderRadius: 8,
                        border: active ? "1.5px solid var(--accent)" : "1px solid var(--border-hairline)",
                        background: active ? "var(--accent-soft)" : "var(--surface-raised)",
                        cursor: "pointer",
                        fontFamily: "var(--font-ui)",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)", marginBottom: 4 }}>{h.title}</div>
                      <div style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.45 }}>{h.detail}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Panel>
        </section>

        {/* ─── 4. TRA CỨU NHANH THEO LOẠI TRÀ & ĐỒNG HỒ BẤM GIỜ HÃM TRÀ ─── */}
        <section id="cong-thuc-pha" aria-labelledby="heading-cong-thuc" style={{ scrollMarginTop: 80 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>
              Thông số chuẩn từng dòng trà
            </div>
            <h2 id="heading-cong-thuc" style={{ margin: "2px 0 4px", fontSize: 22, fontWeight: 500, color: "var(--text-strong)" }}>
              Bạn đang thưởng thức loại trà nào?
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>
              Chạm vào tên loại trà trên vỏ hộp của bạn để xem đúng nhiệt độ nước và bật đồng hồ canh giờ hãm trà.
            </p>
          </div>

          {/* Danh sách nút chọn sản phẩm trà */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 14 }}>
            {teaProducts.map((p) => {
              const selected = p.slug === selectedProduct?.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSelectedSlug(p.slug)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 16px",
                    borderRadius: 999,
                    border: selected ? "1.5px solid var(--primary)" : "1px solid var(--border-strong)",
                    background: selected ? "var(--primary)" : "var(--surface-card)",
                    color: selected ? "var(--text-on-primary)" : "var(--text-strong)",
                    fontFamily: "var(--font-ui)",
                    fontSize: 13.5,
                    fontWeight: selected ? 700 : 500,
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                >
                  <Icon name="leaf" size={14} color={selected ? "var(--tra-300)" : "var(--accent)"} />
                  {p.name}
                </button>
              );
            })}
          </div>

          {selectedProduct && (
            <Panel style={{ padding: "clamp(18px, 3vw, 24px)", borderRadius: 14 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}>
                {/* Cột thông tin trà & 4 ô thông số pha */}
                <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                    <div style={{ width: 68, height: 68, flexShrink: 0 }}>
                      <ProductImage src={photo(selectedProduct.ph)} alt={selectedProduct.name} ratio="1 / 1" radius="10px" />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 500 }}>
                        {selectedProduct.kind} · {selectedProduct.origin}
                      </div>
                      <h3 style={{ margin: "2px 0", fontSize: 20, fontWeight: 500, color: "var(--text-strong)" }}>
                        {selectedProduct.name}
                      </h3>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{selectedProduct.note}</div>
                    </div>
                  </div>

                  {selectedProduct.brew ? (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                        {[
                          { icon: "thermometer", label: "Nhiệt độ nước", value: selectedProduct.brew.temp },
                          { icon: "leaf", label: "Lượng trà khuyên dùng", value: selectedProduct.brew.amount },
                          { icon: "timer", label: "Thời gian hãm", value: selectedProduct.brew.time },
                          { icon: "repeat", label: "Số tuần nước", value: selectedProduct.brew.infusions },
                        ].map((item) => (
                          <div
                            key={item.label}
                            style={{
                              padding: "12px 14px",
                              borderRadius: 8,
                              border: "1px solid var(--border-hairline)",
                              background: "var(--surface-raised)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
                              <Icon name={item.icon} size={15} color="var(--accent)" />
                              {item.label}
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-strong)", marginTop: 4 }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          padding: "11px 14px",
                          borderRadius: 8,
                          background: "var(--accent-soft)",
                          color: "var(--tra-700)",
                          fontSize: 13.5,
                          lineHeight: 1.5,
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        <Icon name="info" size={17} color="var(--accent)" style={{ marginTop: 2 }} />
                        <span>
                          <strong>Mẹo từ nghệ nhân:</strong> {selectedProduct.brew.tip}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.6 }}>{selectedProduct.desc}</p>
                  )}

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                    <Button href={`/san-pham/${selectedProduct.slug}`} size="sm" iconRight="arrow-right">
                      Xem chi tiết &amp; Đặt mua {selectedProduct.name}
                    </Button>
                    <Button href="/tra-dam/cach-pha-tra-thai-nguyen" variant="secondary" size="sm" iconLeft="book-open">
                      Bài viết hướng dẫn đầy đủ
                    </Button>
                  </div>
                </div>

                {/* Cột Đồng hồ bấm giờ hãm trà (Brew Timer) */}
                <div
                  style={{
                    flex: "1 1 250px",
                    minWidth: 0,
                    padding: "18px 20px",
                    borderRadius: 12,
                    background: "var(--surface-inverse)",
                    color: "var(--text-on-inverse)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--tra-300)", fontWeight: 600 }}>
                    Đồng hồ canh giờ hãm trà
                  </div>

                  {/* Chọn tuần nước */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                    {[1, 2, 3, 4].map((round) => (
                      <button
                        key={round}
                        type="button"
                        onClick={() => setInfusionRound(round)}
                        style={{
                          padding: "5px 11px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: infusionRound === round ? 700 : 500,
                          border: infusionRound === round ? "1px solid var(--tra-300)" : "1px solid rgba(255,255,255,0.2)",
                          background: infusionRound === round ? "var(--tra-500)" : "transparent",
                          color: "var(--logo-cream)",
                          cursor: "pointer",
                        }}
                      >
                        Nước {round} ({baseSeconds + (round - 1) * 10}s)
                      </button>
                    ))}
                  </div>

                  {/* Hiển thị số giây */}
                  <div
                    aria-live="polite"
                    style={{
                      width: 118,
                      height: 118,
                      borderRadius: "50%",
                      border: `3px solid ${timerDone ? "var(--tra-300)" : timerRunning ? "var(--tra-400)" : "rgba(217,191,148,0.35)"}`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.04)",
                      margin: "4px 0",
                    }}
                  >
                    <span style={{ fontSize: 34, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "var(--logo-cream)" }}>
                      {timeLeft}s
                    </span>
                    <span style={{ fontSize: 11.5, color: "var(--tra-300)" }}>
                      {timerDone ? "Rót trà ngay!" : timerRunning ? "Đang hãm trà..." : `Chuẩn ${targetSeconds} giây`}
                    </span>
                  </div>

                  {timerDone && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--tra-300)",
                        background: "rgba(188, 154, 108, 0.16)",
                        padding: "8px 12px",
                        borderRadius: 8,
                        lineHeight: 1.45,
                      }}
                    >
                      Đã đủ thời gian! Bạn rót hết nước trà ra chén để trà không bị đắng nhé.
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, width: "100%" }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (timerDone || timeLeft === 0) {
                          setTimeLeft(targetSeconds);
                          setTimerDone(false);
                          setTimerRunning(true);
                        } else {
                          setTimerRunning((r) => !r);
                        }
                      }}
                      style={{
                        flex: 1,
                        height: 42,
                        borderRadius: 8,
                        border: "1px solid var(--tra-400)",
                        background: "var(--tra-500)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13.5,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <Icon name={timerRunning ? "clock" : "play"} size={15} color="#fff" />
                      {timerRunning ? "Tạm dừng" : timerDone ? "Bấm lại" : "Bắt đầu hãm"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerDone(false);
                        setTimeLeft(targetSeconds);
                      }}
                      aria-label="Đặt lại đồng hồ"
                      title="Đặt lại"
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.25)",
                        background: "transparent",
                        color: "var(--logo-cream)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="rotate-ccw" size={16} color="var(--logo-cream)" />
                    </button>
                  </div>
                </div>
              </div>
            </Panel>
          )}
        </section>

        {/* ─── 5. THÔNG TIN NHANH: BẢO QUẢN, ĐỔI TRẢ & LIÊN HỆ ─── */}
        <section aria-labelledby="heading-thong-tin-nhanh">
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>
              An tâm thưởng thức
            </div>
            <h2 id="heading-thong-tin-nhanh" style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 500, color: "var(--text-strong)" }}>
              Thông tin nhanh dành cho khách hàng
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
            {[
              {
                icon: "shield-check",
                title: "100% Búp chè Tân Cương sao tay",
                text: "Không hương liệu, không phẩm màu, không chất bảo quản. Hương cốm non tự nhiên từ chảo gang truyền thống.",
              },
              {
                icon: "package",
                title: "Cách bảo quản giữ hương lâu",
                text: "Ép hết không khí trong túi zip sau khi mở, để nơi khô mát, tránh ánh nắng và tránh đặt cạnh cà phê, gia vị.",
              },
              {
                icon: "rotate-ccw",
                title: "Bảo hành & Đổi trả trong 7 ngày",
                text: "Đổi gói mới miễn phí nếu trà bị ẩm, hở túi khi vận chuyển hoặc không đúng vị đã đặt. Chỉ cần nhắn Zalo Lam Trà.",
              },
            ].map((card) => (
              <Panel key={card.title} style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "var(--primary-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={card.icon} size={18} color="var(--primary)" />
                  </span>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--text-strong)" }}>{card.title}</h3>
                </div>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "var(--text-muted)" }}>{card.text}</p>
              </Panel>
            ))}
          </div>
        </section>

        {/* ─── 6. DANH MỤC TRÀ ĐẶC SẢN (ĐẶT THÊM TRÀ NHANH) ─── */}
        <section id="san-pham-noi-bat" aria-labelledby="heading-san-pham" style={{ scrollMarginTop: 80 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>
                Đặc sản Tân Cương
              </div>
              <h2 id="heading-san-pham" style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 500, color: "var(--text-strong)" }}>
                Khám phá các dòng trà của Lam Trà
              </h2>
            </div>
            <Link href="/san-pham" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-link)", textDecoration: "none" }}>
              Xem tất cả →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {products.slice(0, 6).map((p) => (
              <Link
                key={p.slug}
                href={`/san-pham/${p.slug}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 10,
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-hairline)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ width: 64, height: 64, flexShrink: 0 }}>
                  <ProductImage src={photo(p.ph)} alt={p.name} ratio="1 / 1" radius="8px" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.note}
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <Price value={priceOf(p)} compareAt={p.compareAt} size="sm" />
                  </div>
                </div>
                <Icon name="chevron-right" size={18} color="var(--text-muted)" />
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
            <Button href="/san-pham" iconLeft="shopping-bag">
              Vào cửa hàng đặt trà
            </Button>
            <Button href="/tra-cuu-don" variant="secondary" iconLeft="receipt">
              Kiểm tra đơn hàng
            </Button>
            <Button href={telLink()} variant="ghost" iconLeft="phone">
              Gọi Hotline: {SITE.phone}
            </Button>
          </div>
        </section>

        {/* ─── 7. HỘP CÔNG CỤ TẢI MÃ QR IN BAO BÌ (CHO CHỦ CỬA HÀNG) ─── */}
        <section id="ma-qr-bao-bi" aria-labelledby="heading-ma-qr" style={{ scrollMarginTop: 80 }}>
          <details className="lt-details" style={{ background: "var(--surface-card)", borderRadius: 12, padding: "4px 18px", border: "1px solid var(--border-strong)" }}>
            <summary style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 700, color: "var(--text-strong)" }}>
              <Icon name="qr-code" size={20} color="var(--primary)" />
              <span>Công cụ lấy mã QR in lên bao bì sản phẩm (Dành cho cửa hàng)</span>
            </summary>

            <div style={{ paddingTop: 12, paddingBottom: 16, display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
              {/* Ảnh QR Preview */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "#FCF8F1",
                  border: "1.5px solid var(--border-strong)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageSrc}
                  alt={`Mã QR dẫn tới ${qrUrl}`}
                  width={180}
                  height={180}
                  style={{ display: "block", borderRadius: 6 }}
                />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--reu-800)" }}>
                  Quét xem hướng dẫn pha trà
                </span>
              </div>

              {/* Tuỳ chọn link đích & nút tải xuống */}
              <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label htmlFor="qr-product-select" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-strong)", marginBottom: 6 }}>
                    Chọn loại mã QR muốn in lên vỏ hộp:
                  </label>
                  <select
                    id="qr-product-select"
                    value={qrTargetSlug}
                    onChange={(e) => setQrTargetSlug(e.target.value)}
                    style={{
                      width: "100%",
                      maxWidth: 420,
                      height: 42,
                      padding: "0 12px",
                      borderRadius: 8,
                      border: "1px solid var(--border-strong)",
                      background: "var(--surface-raised)",
                      fontFamily: "var(--font-ui)",
                      fontSize: 14,
                      color: "var(--text-strong)",
                    }}
                  >
                    <option value="all">Mã QR chung cho mọi vỏ hộp (/huong-dan)</option>
                    {teaProducts.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        Mã QR riêng cho hộp: {p.name} (/huong-dan?tra={p.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "var(--bg-sunken)",
                    border: "1px solid var(--border-hairline)",
                    fontSize: 13,
                  }}
                >
                  <code style={{ color: "var(--primary)", wordBreak: "break-all" }}>{qrUrl}</code>
                  <CopyButton text={qrUrl} label="Chép link" />
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <Button size="sm" iconLeft="download" onClick={() => handleDownloadQr("png")}>
                    Tải ảnh QR sắc nét (PNG 1000px)
                  </Button>
                  <Button size="sm" variant="secondary" iconLeft="download" onClick={() => handleDownloadQr("svg")}>
                    Tải file Vector in ấn (SVG)
                  </Button>
                </div>

                <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Mã QR này trỏ trực tiếp về <strong>{qrUrl}</strong>. Sau khi in lên bao bì, bạn có thể thay đổi video, thông tin pha trà hoặc link Facebook bất kỳ lúc nào trên code mà không cần in lại vỏ hộp.
                </p>
              </div>
            </div>
          </details>
        </section>
      </div>
    </div>
  );
}

