"use client";

// HYDRO CUSTOM STUDIO - Trình thiết kế bình giữ nhiệt 3D chuyên nghiệp.
// Bố cục chia đôi: Bên trái mô hình 3D tương tác 360° quấn decal/sticker/ảnh/tên/số lên bề mặt;
// Bên phải thanh công cụ đa năng (Bình & Màu, Tên & Số, Sticker Library, Upload & AI Sticker, AI Design for Me, Quản lý lớp).

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import Bottle3D, { type BottleSceneHandle } from "@/components/bottle/Bottle3D";
import BottleRender from "@/components/bottle/BottleRender";
import {
  ALL_STICKERS,
  STICKER_CATEGORIES,
  StickerIcon,
} from "@/components/bottle/stickers";
import { Button, Icon, IconButton, QuantityStepper, formatVND } from "@/components/ds";
import { useCart } from "@/lib/cart";
import { CUSTOM_LEAD_TIME } from "@/lib/checkout";
import {
  CUSTOM_STICKER_FEE,
  CUSTOM_TEXT_FEE,
  CUSTOM_TEXT_MAX,
  FONTS,
  INKS,
  STICKERS,
  colorOf,
  customFee,
  defaultColor,
  defaultSize,
  maxQtyOf,
  normalizeCustom,
  sizeLabel,
  sizePrice,
  variantLabel,
  type Customization,
  type CustomLayer,
  type FontId,
  type Product,
} from "@/lib/products";
import {
  STICKER_STYLES,
  processImageToSticker,
  type StickerStyleId,
} from "@/lib/sticker-engine";
import {
  DESIGN_THEMES,
  generateAiDesign,
  type DesignThemeId,
} from "@/lib/ai-designer";

type StudioTab = "bottle" | "text" | "stickers" | "upload" | "ai" | "layers";

export default function Studio({ products: initial }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const { add, products: live } = useCart();
  const models = (live.length ? live : initial).filter(
    (p) => p.customizable && p.active !== false && !p.deleted
  );
  const first = models.find((p) => p.slug === params.get("sp")) ?? models[0];

  const [slug, setSlug] = useState(first?.slug ?? "");
  const p = models.find((m) => m.slug === slug) ?? first;
  const [size, setSize] = useState(() =>
    first && first.sizes.includes(params.get("size") ?? "")
      ? params.get("size")!
      : first
      ? defaultSize(first)
      : "700"
  );
  const [color, setColor] = useState(() =>
    first && first.colors.some((c) => c.id === params.get("mau"))
      ? params.get("mau")!
      : first
      ? defaultColor(first)
      : ""
  );

  // Trạng thái công cụ & Tabs
  const [activeTab, setActiveTab] = useState<StudioTab>("bottle");

  // In tên & số
  const [text, setText] = useState("");
  const [font, setFont] = useState<FontId>("block");
  const [number, setNumber] = useState("");
  const [numberFont, setNumberFont] = useState<FontId>("block");
  const [ink, setInk] = useState(INKS[0].id);

  // Thư viện sticker
  const [selectedCategory, setSelectedCategory] = useState("sports");
  const [primarySticker, setPrimarySticker] = useState<string | undefined>("song");

  // Upload ảnh & AI Sticker Maker
  const [uploadedRawImg, setUploadedRawImg] = useState<string | null>(null);
  const [aiStickerImg, setAiStickerImg] = useState<string | null>(null);
  const [aiStyle, setAiStyle] = useState<StickerStyleId>("cute");
  const [removeBg, setRemoveBg] = useState(true);
  const [isProcessingSticker, setIsProcessingSticker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Danh sách các Lớp thiết kế (Layers)
  const [layers, setLayers] = useState<CustomLayer[]>([
    {
      id: "init-sticker",
      type: "sticker",
      content: "song",
      x: 0.5,
      y: 0.5,
      scale: 1.2,
      rotation: 0,
    },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>("init-sticker");

  // AI Design for Me Wizard
  const [aiTheme, setAiTheme] = useState<DesignThemeId>("football");
  const [aiNameInput, setAiNameInput] = useState("");
  const [aiNumberInput, setAiNumberInput] = useState("10");
  const [aiStylePref, setAiStylePref] = useState<"cute" | "bold" | "minimal" | "sport">("sport");

  // 3D Canvas
  const [isSpinning, setIsSpinning] = useState(false);
  const [qty, setQty] = useState(1);
  const scene = useRef<BottleSceneHandle>(null);

  // Đổi mẫu bình: giữ dung tích / màu nếu có
  useEffect(() => {
    if (!p) return;
    if (!p.sizes.includes(size)) setSize(defaultSize(p));
    if (!p.colors.some((c) => c.id === color)) setColor(defaultColor(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Màu bình và màu nắp
  const hex = p ? colorOf(p, color)?.hex ?? "#0688AE" : "#0688AE";
  const lid = p ? colorOf(p, color)?.lid : undefined;
  const lightBody = useMemo(() => {
    const n = parseInt(hex.slice(1), 16);
    return (
      ((n >> 16) & 255) * 0.299 +
        ((n >> 8) & 255) * 0.587 +
        (n & 255) * 0.114 >
      170
    );
  }, [hex]);

  useEffect(() => {
    if (lightBody && ink === "#FFFFFF") setInk("#0B2A36");
    if (!lightBody && ink === "#0B2A36") setInk("#FFFFFF");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightBody]);

  // Đồng bộ hóa Tên vào layers
  const handleUpdateText = (val: string, f?: FontId) => {
    const nextText = val.slice(0, CUSTOM_TEXT_MAX);
    setText(nextText);
    const chosenFont = f ?? font;
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.type === "text");
      if (!nextText) {
        return prev.filter((l) => l.type !== "text");
      }
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], content: nextText, font: chosenFont };
        return copy;
      }
      const newLayer: CustomLayer = {
        id: `text-${Date.now()}`,
        type: "text",
        content: nextText,
        font: chosenFont,
        x: 0.5,
        y: number ? 0.44 : 0.54,
        scale: 1.15,
        rotation: 0,
      };
      setSelectedLayerId(newLayer.id);
      return [...prev, newLayer];
    });
  };

  // Đồng bộ hóa Số áo vào layers
  const handleUpdateNumber = (val: string, f?: FontId) => {
    const nextNum = val.replace(/[^0-9A-Za-z#]/g, "").slice(0, 4);
    setNumber(nextNum);
    const chosenFont = f ?? numberFont;
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.type === "number");
      if (!nextNum) {
        return prev.filter((l) => l.type !== "number");
      }
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], content: nextNum, font: chosenFont };
        return copy;
      }
      const newLayer: CustomLayer = {
        id: `number-${Date.now()}`,
        type: "number",
        content: nextNum,
        font: chosenFont,
        x: 0.5,
        y: 0.68,
        scale: 1.45,
        rotation: 0,
      };
      setSelectedLayerId(newLayer.id);
      return [...prev, newLayer];
    });
  };

  // Thêm / chọn Sticker từ Thư viện
  const handleSelectSticker = (stickerId: string) => {
    setPrimarySticker(stickerId);
    setLayers((prev) => {
      // Thêm sticker mới vào bình
      const newLayer: CustomLayer = {
        id: `sticker-${Date.now()}-${stickerId}`,
        type: "sticker",
        content: stickerId,
        color: ink,
        x: 0.5 + (prev.length % 2 === 0 ? 0.08 : -0.08),
        y: prev.some((l) => l.type === "text" || l.type === "number") ? 0.28 : 0.5,
        scale: 1.1,
        rotation: (prev.length % 3 - 1) * 6,
      };
      setSelectedLayerId(newLayer.id);
      return [...prev, newLayer];
    });
    scene.current?.front();
  };

  // Upload ảnh của khách hàng
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploadedRawImg(dataUrl);

      // Tự động tạo bản AI Sticker ban đầu
      setIsProcessingSticker(true);
      try {
        const processed = await processImageToSticker(dataUrl, aiStyle, {
          removeBg,
          maxWidth: 512,
        });
        setAiStickerImg(processed);
      } catch (err) {
        console.error("AI Sticker error:", err);
      } finally {
        setIsProcessingSticker(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Đổi phong cách AI Sticker
  const handleRegenerateAiSticker = async (style: StickerStyleId) => {
    setAiStyle(style);
    if (!uploadedRawImg) return;
    setIsProcessingSticker(true);
    try {
      const processed = await processImageToSticker(uploadedRawImg, style, {
        removeBg,
        maxWidth: 512,
      });
      setAiStickerImg(processed);
    } catch (err) {
      console.error("AI Sticker style error:", err);
    } finally {
      setIsProcessingSticker(false);
    }
  };

  // Dán Sticker AI hoặc Ảnh lên bình 3D
  const handleApplyImageToBottle = (imgUrl: string, isAi = true) => {
    setLayers((prev) => {
      const newLayer: CustomLayer = {
        id: `img-${Date.now()}`,
        type: "image",
        content: imgUrl,
        style: isAi ? aiStyle : "raw",
        x: 0.5,
        y: prev.some((l) => l.type === "text" || l.type === "number") ? 0.3 : 0.5,
        scale: 1.25,
        rotation: 0,
      };
      setSelectedLayerId(newLayer.id);
      return [...prev, newLayer];
    });
    scene.current?.front();
  };

  // Kích hoạt tính năng "AI Design for Me"
  const handleRunAiDesigner = () => {
    const res = generateAiDesign(
      {
        name: aiNameInput || text || "HYDRON",
        number: aiNumberInput || number,
        themeId: aiTheme,
        style: aiStylePref,
      },
      models,
      p
    );

    if (res.recommendedColorId) {
      setColor(res.recommendedColorId);
    }
    if (res.custom.text) setText(res.custom.text);
    if (res.custom.font) setFont(res.custom.font);
    if (res.custom.number) setNumber(res.custom.number);
    if (res.custom.ink) setInk(res.custom.ink);
    if (res.custom.layers) {
      setLayers(res.custom.layers);
      setSelectedLayerId(res.custom.layers[0]?.id ?? null);
    }
    scene.current?.front();
  };

  // Cập nhật thuộc tính của 1 Layer (Vị trí x, y, scale, rotation)
  const updateSelectedLayer = (updates: Partial<CustomLayer>) => {
    if (!selectedLayerId) return;
    setLayers((prev) =>
      prev.map((l) => (l.id === selectedLayerId ? { ...l, ...updates } : l))
    );
  };

  // Xóa layer
  const handleDeleteLayer = (id: string) => {
    setLayers((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (selectedLayerId === id) {
        setSelectedLayerId(next[0]?.id ?? null);
      }
      return next;
    });
  };

  // Nhân bản layer
  const handleDuplicateLayer = (layer: CustomLayer) => {
    const dup: CustomLayer = {
      ...layer,
      id: `${layer.type}-${Date.now()}`,
      x: Math.min(0.9, (layer.x ?? 0.5) + 0.08),
      y: Math.max(0.1, (layer.y ?? 0.5) - 0.05),
    };
    setLayers((prev) => [...prev, dup]);
    setSelectedLayerId(dup.id);
  };

  // Di chuyển thứ tự layer
  const handleMoveLayerOrder = (idx: number, direction: "up" | "down") => {
    setLayers((prev) => {
      const copy = [...prev];
      const targetIdx = direction === "up" ? idx + 1 : idx - 1;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  // Đối tượng Customization hoàn chỉnh
  const custom: Customization | undefined = useMemo(() => {
    return normalizeCustom(
      {
        text,
        font,
        ink,
        number: number || undefined,
        numberFont,
        sticker: primarySticker,
        uploadedImage: aiStickerImg || uploadedRawImg || undefined,
        uploadedImageStyle: aiStyle,
        layers,
      },
      p
    );
  }, [
    text,
    font,
    ink,
    number,
    numberFont,
    primarySticker,
    aiStickerImg,
    uploadedRawImg,
    aiStyle,
    layers,
    p,
  ]);

  if (!p)
    return (
      <p className="lt-container" style={{ padding: "64px 0" }}>
        Chưa có mẫu bình nào cho phép tự thiết kế.
      </p>
    );

  const base = sizePrice(p, size);
  const fee = customFee(custom);
  const unit = base + fee;
  const max = maxQtyOf(p, size, color);

  const download = () => {
    const url = scene.current?.snapshot();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `hydron-${p.slug}-${text || number || "custom-studio"}.png`;
    a.click();
  };

  const addToCart = (go?: boolean) => {
    if (add({ slug: p.slug, size, color, qty, custom }) && go)
      router.push("/thanh-toan");
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  return (
    <div className="hd-studio-container">
      {/* Header Studio */}
      <div className="hd-studio-header">
        <div>
          <span className="hd-badge hd-badge-accent">
            <Icon name="sparkles" size={14} /> HYDRO CUSTOM STUDIO
          </span>
          <h1>Tạo chiếc bình độc bản mang dấu ấn của bạn</h1>
          <p>
            Quan sát 360°, dán sticker trực tiếp lên bề mặt 3D, tự tạo AI
            sticker hoặc để AI phối màu và bố cục tự động.
          </p>
        </div>
        <div className="hd-studio-header-actions">
          <Button variant="ghost" size="sm" onClick={() => scene.current?.front()} iconLeft="rotate-ccw">
            Mặt trước
          </Button>
          <Button variant="ghost" size="sm" onClick={download} iconLeft="download">
            Lưu ảnh 3D
          </Button>
        </div>
      </div>

      {/* Main Studio Grid: Trái (3D Viewport) - Phải (Tool Panel) */}
      <div className="hd-studio">
        {/* VIEWPORT 3D BÊN TRÁI */}
        <div className="hd-studio-stage">
          <Bottle3D
            ref={scene}
            shape={p.shape}
            hex={hex}
            lid={lid}
            size={size}
            custom={custom}
            label={`Mô hình 3D ${p.name} ${variantLabel(p, size, color)}. Kéo để xoay 360°, cuộn để phóng to.`}
          />

          {/* Thanh công cụ 3D nổi trên canvas */}
          <div className="hd-studio-controls-bar">
            <div className="hd-studio-angles" role="group" aria-label="Góc nhìn 3D">
              <button
                type="button"
                className="hd-angle-btn"
                title="Mặt trước"
                onClick={() => scene.current?.front()}
              >
                Trước
              </button>
              <button
                type="button"
                className="hd-angle-btn"
                title="Mặt sau"
                onClick={() => scene.current?.back()}
              >
                Sau
              </button>
              <button
                type="button"
                className="hd-angle-btn"
                title="Mặt trái"
                onClick={() => scene.current?.left()}
              >
                Trái
              </button>
              <button
                type="button"
                className="hd-angle-btn"
                title="Mặt phải"
                onClick={() => scene.current?.right()}
              >
                Phải
              </button>
            </div>

            <div className="hd-studio-zoom-tools">
              <button
                type="button"
                className="hd-angle-btn"
                title="Phóng to"
                onClick={() => scene.current?.zoomIn()}
              >
                <Icon name="plus" size={15} />
              </button>
              <button
                type="button"
                className="hd-angle-btn"
                title="Thu nhỏ"
                onClick={() => scene.current?.zoomOut()}
              >
                <Icon name="minus" size={15} />
              </button>
              <button
                type="button"
                className="hd-angle-btn"
                title="Tự động xoay 360°"
                data-active={isSpinning}
                onClick={() => {
                  const sp = scene.current?.toggleSpin();
                  setIsSpinning(!!sp);
                }}
              >
                <Icon name="rotate-ccw" size={15} /> 360°
              </button>
            </div>
          </div>

          <span className="hd-studio-hint">
            <Icon name="rotate-ccw" size={14} />
            Kéo xoay 360° · Cuộn để Zoom · Nhìn từ mọi góc
          </span>
        </div>

        {/* BẢNG ĐIỀU KHIỂN & CÔNG CỤ BÊN PHẢI */}
        <div className="hd-studio-panel">
          {/* Thanh Tabs chọn công cụ */}
          <nav className="hd-studio-tabs" aria-label="Công cụ thiết kế">
            <button
              type="button"
              className="hd-studio-tab"
              aria-selected={activeTab === "bottle"}
              onClick={() => setActiveTab("bottle")}
            >
              🎨 Mẫu & Màu
            </button>
            <button
              type="button"
              className="hd-studio-tab"
              aria-selected={activeTab === "text"}
              onClick={() => setActiveTab("text")}
            >
              ✍️ Tên & Số
            </button>
            <button
              type="button"
              className="hd-studio-tab"
              aria-selected={activeTab === "stickers"}
              onClick={() => setActiveTab("stickers")}
            >
              🏷️ Thư viện ({ALL_STICKERS.length})
            </button>
            <button
              type="button"
              className="hd-studio-tab"
              aria-selected={activeTab === "upload"}
              onClick={() => setActiveTab("upload")}
            >
              📷 Upload & AI
            </button>
            <button
              type="button"
              className="hd-studio-tab"
              aria-selected={activeTab === "ai"}
              onClick={() => setActiveTab("ai")}
            >
              ✨ AI Designer
            </button>
            <button
              type="button"
              className="hd-studio-tab"
              aria-selected={activeTab === "layers"}
              onClick={() => setActiveTab("layers")}
            >
              📑 Lớp ({layers.length})
            </button>
          </nav>

          {/* TAB 1: MẪU BÌNH, DUNG TÍCH & MÀU SẮC */}
          {activeTab === "bottle" && (
            <div className="hd-studio-pane animate-fade-in">
              <fieldset>
                <legend>
                  1. Kiểu dáng nắp <span>{p.kind}</span>
                </legend>
                <div className="hd-models" role="radiogroup" aria-label="Mẫu bình">
                  {models.map((m) => (
                    <button
                      key={m.slug}
                      type="button"
                      role="radio"
                      aria-checked={m.slug === p.slug}
                      className="hd-model"
                      onClick={() => setSlug(m.slug)}
                    >
                      <span style={{ width: 44, height: 56, display: "block" }}>
                        <BottleRender
                          shape={m.shape}
                          hex={
                            m.slug === p.slug
                              ? hex
                              : colorOf(m, defaultColor(m))?.hex ?? "#0688AE"
                          }
                          lid={
                            m.slug === p.slug
                              ? lid
                              : colorOf(m, defaultColor(m))?.lid
                          }
                          size={defaultSize(m)}
                          label=""
                          viewBox="110 40 180 430"
                          noShadow
                        />
                      </span>
                      {m.name.replace("Hydron ", "")}
                    </button>
                  ))}
                </div>
              </fieldset>

              {p.sizes.length > 1 && (
                <fieldset style={{ marginTop: 20 }}>
                  <legend>
                    2. Dung tích <span>{sizeLabel(size)}</span>
                  </legend>
                  <div className="hd-pills" role="radiogroup" aria-label="Dung tích">
                    {p.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={s === size}
                        className="hd-pill"
                        onClick={() => setSize(s)}
                      >
                        {s}ml{" "}
                        <span style={{ opacity: 0.7, fontSize: 13 }}>
                          {formatVND(sizePrice(p, s))}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <fieldset style={{ marginTop: 20 }}>
                <legend>
                  3. Màu sơn tĩnh điện <span>{colorOf(p, color)?.name}</span>
                </legend>
                <div
                  className="hd-colors-pick"
                  role="radiogroup"
                  aria-label="Màu bình"
                >
                  {p.colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      role="radio"
                      aria-checked={c.id === color}
                      aria-label={c.name}
                      title={c.name}
                      className="hd-color-btn"
                      data-out={maxQtyOf(p, size, c.id) < 1}
                      style={{ background: c.hex }}
                      onClick={() => setColor(c.id)}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {/* TAB 2: IN TÊN & SỐ ÁO ĐẤU */}
          {activeTab === "text" && (
            <div className="hd-studio-pane animate-fade-in">
              <fieldset>
                <legend>
                  In Tên cá nhân <span>+{formatVND(CUSTOM_TEXT_FEE)}</span>
                </legend>
                <div style={{ position: "relative" }}>
                  <input
                    className="lt-field hd-text-input"
                    value={text}
                    maxLength={CUSTOM_TEXT_MAX}
                    onChange={(e) => handleUpdateText(e.target.value)}
                    placeholder="VD: VINH, MINH ANH, ALEX"
                    aria-label="Chữ in lên bình"
                    style={{
                      fontFamily:
                        font === "block"
                          ? "var(--font-display)"
                          : font === "script"
                          ? "var(--font-script)"
                          : "var(--font-sans)",
                    }}
                  />
                  <span
                    id="text-count"
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 12.5,
                      color: "var(--text-subtle)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {text.length}/{CUSTOM_TEXT_MAX}
                  </span>
                </div>
                <div
                  className="hd-pills"
                  role="radiogroup"
                  aria-label="Kiểu chữ tên"
                  style={{ marginTop: 12 }}
                >
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      role="radio"
                      aria-checked={f.id === font}
                      className="hd-pill"
                      onClick={() => {
                        setFont(f.id);
                        handleUpdateText(text, f.id);
                      }}
                      style={{
                        fontFamily:
                          f.id === "block"
                            ? "var(--font-display)"
                            : f.id === "script"
                            ? "var(--font-script)"
                            : "var(--font-sans)",
                        fontSize: f.id === "script" ? 17 : 14,
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset style={{ marginTop: 22 }}>
                <legend>
                  Số áo đấu thể thao <span>(Tùy chọn)</span>
                </legend>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input
                    className="lt-field hd-text-input"
                    value={number}
                    maxLength={4}
                    style={{
                      maxWidth: 140,
                      fontWeight: 900,
                      fontFamily: "var(--font-display, sans-serif)",
                      fontSize: 22,
                      letterSpacing: 2,
                      textAlign: "center",
                    }}
                    onChange={(e) => handleUpdateNumber(e.target.value)}
                    placeholder="VD: 10"
                    aria-label="Số áo đấu in lên bình"
                  />
                  <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>
                    In to đậm nổi bật phía trên tên như áo đấu thể thao chuyên nghiệp.
                  </span>
                </div>
              </fieldset>

              <fieldset style={{ marginTop: 22 }}>
                <legend>Màu mực in UV</legend>
                <div
                  className="hd-colors-pick"
                  role="radiogroup"
                  aria-label="Màu mực in"
                >
                  {INKS.map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      role="radio"
                      aria-checked={i.id === ink}
                      aria-label={i.label}
                      title={i.label}
                      className="hd-color-btn"
                      style={{ background: i.id, width: 34, height: 34 }}
                      onClick={() => {
                        setInk(i.id);
                        setLayers((prev) =>
                          prev.map((l) =>
                            l.type === "text" || l.type === "number"
                              ? { ...l, color: i.id }
                              : l
                          )
                        );
                      }}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {/* TAB 3: THƯ VIỆN STICKER ĐA DẠNG */}
          {activeTab === "stickers" && (
            <div className="hd-studio-pane animate-fade-in">
              <div className="hd-category-scroll" role="tablist">
                {STICKER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="hd-cat-chip"
                    data-active={selectedCategory === cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>

              <div className="hd-stickers-grid" role="group" aria-label="Danh sách Sticker">
                {STICKER_CATEGORIES.find(
                  (c) => c.id === selectedCategory
                )?.items.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="hd-sticker-card"
                    title={`Thêm sticker ${s.label}`}
                    onClick={() => handleSelectSticker(s.id)}
                  >
                    <span className="hd-sticker-preview">
                      <StickerIcon id={s.id} size={32} color={ink} />
                    </span>
                    <span className="hd-sticker-label">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: UPLOAD ẢNH & AI STICKER MAKER */}
          {activeTab === "upload" && (
            <div className="hd-studio-pane animate-fade-in">
              <div
                className="hd-upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <span className="hd-upload-icon">
                  <Icon name="upload" size={26} />
                </span>
                <strong>Tải ảnh của bạn lên</strong>
                <p>
                  Ảnh thú cưng, logo, nhân vật yêu thích, chữ viết tay hoặc ảnh nhóm bạn.
                </p>
                <span className="hd-btn hd-btn-sm hd-btn-surface">Chọn file từ máy</span>
              </div>

              {uploadedRawImg && (
                <div className="hd-ai-sticker-box">
                  <div className="hd-ai-sticker-header">
                    <h4>✨ AI Sticker Maker từ ảnh của bạn</h4>
                    <label className="hd-switch-label">
                      <input
                        type="checkbox"
                        checked={removeBg}
                        onChange={(e) => {
                          setRemoveBg(e.target.checked);
                          handleRegenerateAiSticker(aiStyle);
                        }}
                      />
                      <span>Tách nền thông minh</span>
                    </label>
                  </div>

                  {/* Lựa chọn 10 phong cách nghệ thuật */}
                  <div className="hd-style-chips">
                    {STICKER_STYLES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        className="hd-style-chip"
                        data-active={aiStyle === st.id}
                        onClick={() => handleRegenerateAiSticker(st.id)}
                      >
                        {st.tag}
                      </button>
                    ))}
                  </div>

                  {/* Preview ảnh xử lý & Nút dán lên bình */}
                  <div className="hd-ai-preview-row">
                    <div className="hd-ai-preview-canvas">
                      {isProcessingSticker ? (
                        <div className="hd-loading-spinner">Đang xử lý AI...</div>
                      ) : aiStickerImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={aiStickerImg}
                          alt="AI Sticker Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: 110,
                            objectFit: "contain",
                            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.18))",
                          }}
                        />
                      ) : null}
                    </div>

                    <div className="hd-ai-actions">
                      <Button
                        size="md"
                        variant="primary"
                        iconLeft="sparkles"
                        disabled={isProcessingSticker || !aiStickerImg}
                        onClick={() =>
                          aiStickerImg && handleApplyImageToBottle(aiStickerImg, true)
                        }
                      >
                        Dán AI Sticker lên bình 3D
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={isProcessingSticker || !uploadedRawImg}
                        onClick={() =>
                          uploadedRawImg &&
                          handleApplyImageToBottle(uploadedRawImg, false)
                        }
                      >
                        Dán ảnh gốc nguyên bản
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AI DESIGN FOR ME */}
          {activeTab === "ai" && (
            <div className="hd-studio-pane animate-fade-in">
              <div className="hd-ai-assistant-card">
                <div className="hd-ai-assistant-head">
                  <span className="hd-ai-badge">✨ AI Co-pilot</span>
                  <h3>Trợ lý AI thiết kế bố cục tự động</h3>
                  <p>
                    Chỉ cần chọn chủ đề và tên, AI sẽ tự động tính toán tỷ lệ, phối màu,
                    lựa chọn sticker hài hòa và căn chỉnh đẹp mắt trên bình 3D.
                  </p>
                </div>

                <div className="hd-form-group">
                  <label>Tên của bạn hoặc Team</label>
                  <input
                    className="lt-field"
                    value={aiNameInput}
                    onChange={(e) => setAiNameInput(e.target.value)}
                    placeholder="VD: VINH, TUẤN ANH"
                    maxLength={14}
                  />
                </div>

                <div className="hd-form-group">
                  <label>Số áo đấu may mắn</label>
                  <input
                    className="lt-field"
                    value={aiNumberInput}
                    onChange={(e) => setAiNumberInput(e.target.value)}
                    placeholder="VD: 10, 07, 99"
                    maxLength={4}
                  />
                </div>

                <div className="hd-form-group">
                  <label>Sở thích & Chủ đề phong cách</label>
                  <div className="hd-theme-grid">
                    {DESIGN_THEMES.map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        className="hd-theme-card"
                        data-active={aiTheme === th.id}
                        onClick={() => setAiTheme(th.id)}
                      >
                        <span style={{ fontSize: 22 }}>{th.icon}</span>
                        <strong>{th.name}</strong>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hd-form-group">
                  <label>Cảm hứng thiết kế</label>
                  <div className="hd-pills">
                    {(
                      [
                        { id: "sport", label: "🏆 Năng động Sport" },
                        { id: "cute", label: "🌸 Dễ thương Cute" },
                        { id: "bold", label: "🔥 Cá tính Bold" },
                        { id: "minimal", label: "✨ Tối giản Minimal" },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        className="hd-pill"
                        data-active={aiStylePref === m.id}
                        onClick={() => setAiStylePref(m.id)}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  fullWidth
                  variant="primary"
                  iconLeft="sparkles"
                  onClick={handleRunAiDesigner}
                >
                  ✨ Tạo thiết kế AI ngay
                </Button>
              </div>
            </div>
          )}

          {/* TAB 6: QUẢN LÝ LỚP (LAYERS STUDIO) */}
          {activeTab === "layers" && (
            <div className="hd-studio-pane animate-fade-in">
              <div className="hd-layers-header">
                <h4>Các chi tiết trên bình ({layers.length})</h4>
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Nhấp vào lớp để chỉnh vị trí xoay quanh thân bình 3D
                </span>
              </div>

              <div className="hd-layers-list">
                {layers.length === 0 ? (
                  <p style={{ fontSize: 13.5, color: "var(--text-muted)", padding: "16px 0" }}>
                    Chưa có chi tiết nào. Hãy chọn Sticker, in Tên hoặc Tải ảnh!
                  </p>
                ) : (
                  layers.map((l, idx) => (
                    <div
                      key={l.id}
                      className="hd-layer-row"
                      data-active={selectedLayerId === l.id}
                      onClick={() => setSelectedLayerId(l.id)}
                    >
                      <div className="hd-layer-info">
                        <span className="hd-layer-badge">
                          {l.type === "text"
                            ? "✍️ Chữ"
                            : l.type === "number"
                            ? "🔢 Số"
                            : l.type === "sticker"
                            ? "🏷️ Sticker"
                            : "📷 Ảnh"}
                        </span>
                        <strong className="hd-layer-title">
                          {l.type === "text" || l.type === "number"
                            ? l.content
                            : l.type === "sticker"
                            ? STICKERS.find((s) => s.id === l.content)?.label ?? l.content
                            : "Ảnh tùy chỉnh"}
                        </strong>
                      </div>

                      <div className="hd-layer-tools" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="hd-btn-icon"
                          title="Lên trên"
                          disabled={idx === layers.length - 1}
                          onClick={() => handleMoveLayerOrder(idx, "up")}
                        >
                          <Icon name="arrow-up" size={14} />
                        </button>
                        <button
                          type="button"
                          className="hd-btn-icon"
                          title="Xuống dưới"
                          disabled={idx === 0}
                          onClick={() => handleMoveLayerOrder(idx, "down")}
                        >
                          <Icon name="arrow-down" size={14} />
                        </button>
                        <button
                          type="button"
                          className="hd-btn-icon"
                          title="Nhân bản"
                          onClick={() => handleDuplicateLayer(l)}
                        >
                          <Icon name="copy" size={14} />
                        </button>
                        <button
                          type="button"
                          className="hd-btn-icon text-danger"
                          title="Xóa"
                          onClick={() => handleDeleteLayer(l.id)}
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Điều khiển trực tiếp Layer đang chọn */}
              {selectedLayer && (
                <div className="hd-layer-inspector">
                  <h5>
                    Điều chỉnh:{" "}
                    {selectedLayer.type === "text" || selectedLayer.type === "number"
                      ? selectedLayer.content
                      : selectedLayer.type === "sticker"
                      ? STICKERS.find((s) => s.id === selectedLayer.content)?.label ??
                        selectedLayer.content
                      : "Ảnh"}
                  </h5>

                  <div className="hd-slider-row">
                    <label>
                      <span>↔️ Vị trí quanh thân bình</span>
                      <span className="hd-slider-val">
                        {Math.round(((selectedLayer.x ?? 0.5) - 0.5) * 360)}°
                      </span>
                    </label>
                    <input
                      type="range"
                      min={0.1}
                      max={0.9}
                      step={0.01}
                      value={selectedLayer.x ?? 0.5}
                      onChange={(e) =>
                        updateSelectedLayer({ x: parseFloat(e.target.value) })
                      }
                    />
                  </div>

                  <div className="hd-slider-row">
                    <label>
                      <span>↕️ Độ cao trên bình</span>
                      <span className="hd-slider-val">
                        {Math.round((selectedLayer.y ?? 0.5) * 100)}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min={0.15}
                      max={0.85}
                      step={0.01}
                      value={selectedLayer.y ?? 0.5}
                      onChange={(e) =>
                        updateSelectedLayer({ y: parseFloat(e.target.value) })
                      }
                    />
                  </div>

                  <div className="hd-slider-row">
                    <label>
                      <span>🔍 Kích thước (Scale)</span>
                      <span className="hd-slider-val">
                        {(selectedLayer.scale ?? 1).toFixed(1)}x
                      </span>
                    </label>
                    <input
                      type="range"
                      min={0.6}
                      max={2.4}
                      step={0.05}
                      value={selectedLayer.scale ?? 1}
                      onChange={(e) =>
                        updateSelectedLayer({ scale: parseFloat(e.target.value) })
                      }
                    />
                  </div>

                  <div className="hd-slider-row">
                    <label>
                      <span>🔄 Xoay góc (Rotation)</span>
                      <span className="hd-slider-val">{selectedLayer.rotation ?? 0}°</span>
                    </label>
                    <input
                      type="range"
                      min={-180}
                      max={180}
                      step={5}
                      value={selectedLayer.rotation ?? 0}
                      onChange={(e) =>
                        updateSelectedLayer({ rotation: parseInt(e.target.value, 10) })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BẢNG TỔNG KẾT ĐẶT HÀNG & GIÁ DƯỚI ĐÁY */}
          <div className="hd-studio-bottom-checkout">
            <div className="hd-studio-total">
              <div>
                <span className="hd-studio-total-label">
                  {p.name} {variantLabel(p, size, color)}
                </span>
                <span className="hd-studio-fee-detail">
                  {formatVND(base)}
                  {custom?.text && <> · In tên +{formatVND(CUSTOM_TEXT_FEE)}</>}
                  {custom?.number && !custom?.text && (
                    <> · Số áo +{formatVND(CUSTOM_TEXT_FEE)}</>
                  )}
                  {(custom?.sticker ||
                    custom?.uploadedImage ||
                    (layers.length > 0 &&
                      layers.some((l) => l.type === "sticker" || l.type === "image"))) && (
                    <> · Sticker/Ảnh +{formatVND(CUSTOM_STICKER_FEE)}</>
                  )}
                </span>
              </div>
              <strong className="hd-studio-total-price" aria-live="polite">
                {formatVND(unit * qty)}
              </strong>
            </div>

            <div className="hd-buy-row">
              <QuantityStepper
                value={Math.min(qty, Math.max(max, 1))}
                max={Math.max(max, 1)}
                onChange={setQty}
              />
              <Button
                type="button"
                size="lg"
                variant="secondary"
                disabled={max < 1}
                iconLeft="shopping-bag"
                onClick={() => addToCart(false)}
              >
                {max < 1 ? "Tạm hết màu này" : "Thêm vào giỏ"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="primary"
                disabled={max < 1}
                onClick={() => addToCart(true)}
              >
                Đặt bình này
              </Button>
            </div>

            <p className="hd-studio-guarantee">
              <Icon name="shield-check" size={15} />
              In UV siêu bền màu theo đúng bản xem trước 3D · Giao hàng sau {CUSTOM_LEAD_TIME} ·{" "}
              <Link href="/chinh-sach#doi-tra">Bảo hành 12 tháng</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
