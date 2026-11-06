"use client";

// Trình thiết kế 3D: chọn mẫu → dung tích → màu → chữ/số, font, màu mực → sticker → giỏ hàng.
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Bottle3D, { type BottleSceneHandle } from "@/components/bottle/Bottle3D";
import BottleRender from "@/components/bottle/BottleRender";
import { StickerIcon } from "@/components/bottle/stickers";
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
  type FontId,
  type Product,
} from "@/lib/products";

export default function Studio({ products: initial }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const { add, products: live } = useCart();
  const models = (live.length ? live : initial).filter((p) => p.customizable && p.active !== false && !p.deleted);
  const first = models.find((p) => p.slug === params.get("sp")) ?? models[0];

  const [slug, setSlug] = useState(first?.slug ?? "");
  const p = models.find((m) => m.slug === slug) ?? first;
  const [size, setSize] = useState(() => (first && first.sizes.includes(params.get("size") ?? "") ? params.get("size")! : first ? defaultSize(first) : "700"));
  const [color, setColor] = useState(() => (first && first.colors.some((c) => c.id === params.get("mau")) ? params.get("mau")! : first ? defaultColor(first) : ""));
  const [text, setText] = useState("");
  const [font, setFont] = useState<FontId>("block");
  const [ink, setInk] = useState(INKS[0].id);
  const [sticker, setSticker] = useState<string | undefined>("song");
  const [qty, setQty] = useState(1);
  const scene = useRef<BottleSceneHandle>(null);

  // Đổi mẫu: giữ dung tích/màu nếu mẫu mới có, không thì về mặc định
  useEffect(() => {
    if (!p) return;
    if (!p.sizes.includes(size)) setSize(defaultSize(p));
    if (!p.colors.some((c) => c.id === color)) setColor(defaultColor(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Mực trắng trên bình màu sáng khó đọc: gợi ý đổi mực khi đổi màu bình
  const hex = p ? colorOf(p, color)?.hex ?? "#0688AE" : "#0688AE";
  const lid = p ? colorOf(p, color)?.lid : undefined;
  const lightBody = useMemo(() => {
    const n = parseInt(hex.slice(1), 16);
    return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 > 170;
  }, [hex]);
  useEffect(() => {
    if (lightBody && ink === "#FFFFFF") setInk("#0B2A36");
    if (!lightBody && ink === "#0B2A36") setInk("#FFFFFF");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightBody]);

  const custom: Customization | undefined = useMemo(() => normalizeCustom({ text, font, ink, sticker }, p), [text, font, ink, sticker, p]);
  useEffect(() => {
    scene.current?.front();
  }, [text, sticker]);

  if (!p) return <p className="lt-container" style={{ padding: "64px 0" }}>Chưa có mẫu bình nào cho phép tự thiết kế.</p>;

  const base = sizePrice(p, size);
  const fee = customFee(custom);
  const unit = base + fee;
  const max = maxQtyOf(p, size, color);

  const download = () => {
    const url = scene.current?.snapshot();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `hydron-${p.slug}-${text || "thiet-ke"}.png`;
    a.click();
  };
  const addToCart = (go?: boolean) => {
    if (add({ slug: p.slug, size, color, qty, custom }) && go) router.push("/thanh-toan");
  };

  return (
    <div className="hd-studio">
      <div className="hd-studio-stage">
        <Bottle3D ref={scene} shape={p.shape} hex={hex} lid={lid} size={size} custom={custom} label={`Mô hình 3D ${p.name} ${variantLabel(p, size, color)}${text ? `, in chữ ${text}` : ""}. Kéo để xoay, cuộn để phóng to.`} />
        <div className="hd-studio-tools">
          <IconButton icon="rotate-ccw" label="Xoay về mặt trước" variant="surface" onClick={() => scene.current?.front()} />
          <IconButton icon="download" label="Tải ảnh thiết kế" variant="surface" onClick={download} />
        </div>
        <span className="hd-studio-hint"><Icon name="rotate-ccw" size={14} />Kéo để xoay · cuộn để phóng to</span>
      </div>

      <form className="hd-studio-panel" onSubmit={(e) => { e.preventDefault(); addToCart(); }}>
        <fieldset>
          <legend>1. Mẫu bình <span>{p.kind}</span></legend>
          <div className="hd-models" role="radiogroup" aria-label="Mẫu bình">
            {models.map((m) => (
              <button key={m.slug} type="button" role="radio" aria-checked={m.slug === p.slug} className="hd-model" onClick={() => setSlug(m.slug)}>
                <span style={{ width: 44, height: 56, display: "block" }}>
                  <BottleRender shape={m.shape} hex={m.slug === p.slug ? hex : colorOf(m, defaultColor(m))?.hex ?? "#0688AE"} lid={m.slug === p.slug ? lid : colorOf(m, defaultColor(m))?.lid} size={defaultSize(m)} label="" viewBox="110 40 180 430" noShadow />
                </span>
                {m.name.replace("Hydron ", "")}
              </button>
            ))}
          </div>
        </fieldset>

        {p.sizes.length > 1 && (
          <fieldset>
            <legend>2. Dung tích <span>{sizeLabel(size)}</span></legend>
            <div className="hd-pills" role="radiogroup" aria-label="Dung tích">
              {p.sizes.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={s === size} className="hd-pill" onClick={() => setSize(s)}>
                  {s}ml <span style={{ opacity: 0.7, fontSize: 13 }}>{formatVND(sizePrice(p, s))}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend>3. Màu bình <span>{colorOf(p, color)?.name}</span></legend>
          <div className="hd-colors-pick" role="radiogroup" aria-label="Màu bình">
            {p.colors.map((c) => (
              <button key={c.id} type="button" role="radio" aria-checked={c.id === color} aria-label={c.name} title={c.name} className="hd-color-btn" data-out={maxQtyOf(p, size, c.id) < 1} style={{ background: c.hex }} onClick={() => setColor(c.id)} />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>4. Tên hoặc số <span>+{formatVND(CUSTOM_TEXT_FEE)}</span></legend>
          <div style={{ position: "relative" }}>
            <input
              className="lt-field hd-text-input"
              value={text}
              maxLength={CUSTOM_TEXT_MAX}
              onChange={(e) => setText(e.target.value)}
              placeholder="VD: MINH ANH, 07, Team A1"
              aria-label="Chữ hoặc số in lên bình"
              aria-describedby="text-count"
              style={{ fontFamily: font === "block" ? "var(--font-display)" : font === "script" ? "var(--font-script)" : "var(--font-sans)" }}
            />
            <span id="text-count" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12.5, color: "var(--text-subtle)", fontVariantNumeric: "tabular-nums" }}>
              {text.length}/{CUSTOM_TEXT_MAX}
            </span>
          </div>
          <div className="hd-pills" role="radiogroup" aria-label="Kiểu chữ" style={{ marginTop: 12 }}>
            {FONTS.map((f) => (
              <button key={f.id} type="button" role="radio" aria-checked={f.id === font} className="hd-pill" onClick={() => setFont(f.id)} style={{ fontFamily: f.id === "block" ? "var(--font-display)" : f.id === "script" ? "var(--font-script)" : "var(--font-sans)", fontSize: f.id === "script" ? 17 : 14 }}>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13.5, color: "var(--text-muted)", minWidth: 64 }}>Màu mực</span>
            <div className="hd-colors-pick" role="radiogroup" aria-label="Màu mực in">
              {INKS.map((i) => (
                <button key={i.id} type="button" role="radio" aria-checked={i.id === ink} aria-label={i.label} title={i.label} className="hd-color-btn" style={{ background: i.id, width: 34, height: 34 }} onClick={() => setInk(i.id)} />
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>5. Sticker <span>+{formatVND(CUSTOM_STICKER_FEE)}</span></legend>
          <div className="hd-stickers" role="radiogroup" aria-label="Sticker">
            <button type="button" role="radio" aria-checked={!sticker} className="hd-sticker" onClick={() => setSticker(undefined)} aria-label="Không dùng sticker" style={{ fontSize: 12.5, fontWeight: 600 }}>
              Không
            </button>
            {STICKERS.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={sticker === s.id} className="hd-sticker" onClick={() => setSticker(s.id)} aria-label={s.label} title={s.label}>
                <StickerIcon id={s.id} size={26} />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="hd-studio-total">
          <span style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5 }}>
            {p.name} {variantLabel(p, size, color)} · {formatVND(base)}
            {custom?.text && <><br />In chữ +{formatVND(CUSTOM_TEXT_FEE)}</>}
            {custom?.sticker && <><br />Sticker +{formatVND(CUSTOM_STICKER_FEE)}</>}
          </span>
          <strong aria-live="polite">{formatVND(unit * qty)}</strong>
        </div>
        <div className="hd-buy-row">
          <QuantityStepper value={Math.min(qty, Math.max(max, 1))} max={Math.max(max, 1)} onChange={setQty} />
          <Button type="submit" size="lg" variant="secondary" disabled={max < 1} iconLeft="shopping-bag">{max < 1 ? "Tạm hết màu này" : "Thêm vào giỏ"}</Button>
        </div>
        <Button size="lg" fullWidth disabled={max < 1} onClick={() => addToCart(true)}>Đặt bình này</Button>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--text-muted)" }}>
          {fee > 0 ? `Hydron in UV theo đúng bản xem trước, cần thêm ${CUSTOM_LEAD_TIME} trước khi gửi. ` : ""}
          Bình đã in tên chỉ đổi khi lỗi từ Hydron. <Link href="/chinh-sach#doi-tra">Chính sách đổi trả</Link>
        </p>
      </form>
    </div>
  );
}
