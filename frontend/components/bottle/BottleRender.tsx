// Ảnh dựng 2D của sản phẩm theo kiểu dáng, màu, dung tích và phần in riêng.
// Dùng khi sản phẩm chưa có ảnh chụp (thẻ sản phẩm, giỏ hàng, đơn hàng, admin) để đổi màu là đổi ảnh.
import { useId, type ReactNode } from "react";
import type { Customization, Shape } from "@/shared/types/product.types";
import { luminance, mix } from "./color";
import { STICKER_ART } from "./stickers";

const DIMS: Record<string, { H: number; W: number }> = {
  "500": { H: 286, W: 100 },
  "700": { H: 322, W: 108 },
  "900": { H: 356, W: 120 },
};

const STEEL = { light: "#EEF1F2", mid: "#B9C1C4", dark: "#7D878B" };

const FONT_FAMILY: Record<string, string> = {
  block: "var(--font-display)",
  round: "var(--font-sans)",
  script: "var(--font-script)",
};

export type BottleRenderProps = {
  shape: Shape;
  hex: string;
  /** Màu nắp riêng, nếu có */
  lid?: string;
  size?: string;
  custom?: Customization;
  label?: string;
  className?: string;
  /** Ẩn bóng đổ dưới đáy (khi đặt nhiều bình cạnh nhau) */
  noShadow?: boolean;
  /** Khung hình: mặc định 400×500 (4:5) */
  viewBox?: string;
};

export default function BottleRender({ shape, hex, lid, size = "700", custom, label, className = "hd-render", noShadow, viewBox = "0 0 400 500" }: BottleRenderProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const light = luminance(hex) > 0.55;
  const capHex = lid ?? (shape === "sport" && light ? "#F6F4EF" : mix(hex, "#000000", light ? 0.08 : 0.18));
  const ids = { body: `b${uid}`, shade: `s${uid}`, vert: `v${uid}`, steel: `st${uid}`, cap: `c${uid}`, floor: `f${uid}`, canvas: `cv${uid}` };

  const defs = (
    <defs>
      <linearGradient id={ids.shade} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity={light ? 0.22 : 0.34} />
        <stop offset=".1" stopColor="#000" stopOpacity=".06" />
        <stop offset=".2" stopColor="#fff" stopOpacity={light ? 0.5 : 0.3} />
        <stop offset=".3" stopColor="#fff" stopOpacity=".05" />
        <stop offset=".64" stopColor="#000" stopOpacity="0" />
        <stop offset=".86" stopColor="#000" stopOpacity={light ? 0.1 : 0.16} />
        <stop offset="1" stopColor="#000" stopOpacity={light ? 0.26 : 0.38} />
      </linearGradient>
      <linearGradient id={ids.vert} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".1" />
        <stop offset=".6" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".12" />
      </linearGradient>
      <linearGradient id={ids.steel} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={STEEL.dark} />
        <stop offset=".22" stopColor={STEEL.light} />
        <stop offset=".45" stopColor={STEEL.mid} />
        <stop offset=".75" stopColor={STEEL.light} />
        <stop offset="1" stopColor={STEEL.dark} />
      </linearGradient>
      <radialGradient id={ids.floor} cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#0B2A36" stopOpacity=".28" />
        <stop offset="1" stopColor="#0B2A36" stopOpacity="0" />
      </radialGradient>
      <pattern id={ids.canvas} width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M0 0h4M0 2h4" stroke="#000" strokeOpacity=".05" strokeWidth=".8" />
        <path d="M0 0v4M2 0v4" stroke="#fff" strokeOpacity=".06" strokeWidth=".8" />
      </pattern>
    </defs>
  );

  const aria = label ?? "Ảnh sản phẩm";

  if (shape === "bag") return <Bag hex={hex} ids={ids} defs={defs} aria={aria} className={className} viewBox={viewBox} noShadow={noShadow} />;
  if (shape === "strap") return <Strap hex={hex} ids={ids} defs={defs} aria={aria} className={className} viewBox={viewBox} />;

  const { H, W } = DIMS[size] ?? DIMS["700"];
  const cx = 200;
  const bottom = 452;
  const r = 16;
  const sy = bottom - H * 0.8;
  const ny = bottom - H * 0.865;
  const nw = W * 0.74;
  const ringH = H * 0.026;
  const capBottom = ny - ringH;
  const hw = W / 2;
  const body = [
    `M${cx - hw},${sy}`,
    `L${cx - hw},${bottom - r}`,
    `Q${cx - hw},${bottom} ${cx - hw + r},${bottom}`,
    `L${cx + hw - r},${bottom}`,
    `Q${cx + hw},${bottom} ${cx + hw},${bottom - r}`,
    `L${cx + hw},${sy}`,
    `C${cx + hw},${sy - (sy - ny) * 0.55} ${cx + nw / 2},${sy - (sy - ny) * 0.65} ${cx + nw / 2},${ny}`,
    `L${cx - nw / 2},${ny}`,
    `C${cx - nw / 2},${sy - (sy - ny) * 0.65} ${cx - hw},${sy - (sy - ny) * 0.55} ${cx - hw},${sy}Z`,
  ].join(" ");

  const cw = nw * 1.04;
  let cap: ReactNode;
  if (shape === "classic") {
    const capH = H * 0.1;
    const top = capBottom - capH;
    const loopH = H * 0.12;
    cap = (
      <g>
        <path d={`M${cx - cw * 0.3},${top + 4} C${cx - cw * 0.32},${top - loopH} ${cx + cw * 0.32},${top - loopH} ${cx + cw * 0.3},${top + 4}`} fill="none" stroke={mix(capHex, "#000", 0.25)} strokeWidth="9" strokeLinecap="round" />
        <path d={`M${cx - cw * 0.3},${top + 4} C${cx - cw * 0.32},${top - loopH} ${cx + cw * 0.32},${top - loopH} ${cx + cw * 0.3},${top + 4}`} fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="2" strokeLinecap="round" transform="translate(-1.5,-2)" />
        <rect x={cx - cw / 2} y={top} width={cw} height={capH} rx="7" fill={capHex} />
        <rect x={cx - cw / 2} y={top} width={cw} height={capH} rx="7" fill={`url(#${ids.shade})`} />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={cx - cw / 2 + 6 + i * ((cw - 12) / 8)} x2={cx - cw / 2 + 6 + i * ((cw - 12) / 8)} y1={top + capH * 0.3} y2={top + capH - 4} stroke="#000" strokeOpacity=".09" strokeWidth="1.4" />
        ))}
      </g>
    );
  } else if (shape === "sport") {
    const capH = H * 0.12;
    const top = capBottom - capH;
    cap = (
      <g>
        <path d={`M${cx + cw / 2 - 2},${top + capH * 0.25} C${cx + cw / 2 + 26},${top + capH * 0.1} ${cx + cw / 2 + 26},${top + capH * 0.95} ${cx + cw / 2 - 2},${top + capH * 0.8}`} fill="none" stroke={mix(capHex, "#000", 0.2)} strokeWidth="8" strokeLinecap="round" />
        <rect x={cx - 9} y={top - 22} width="18" height="30" rx="8" fill={mix(capHex, "#000", 0.32)} transform={`rotate(-8 ${cx} ${top})`} />
        <path d={`M${cx - cw / 2},${top + capH} L${cx - cw / 2},${top + 14} Q${cx - cw / 2},${top} ${cx - cw / 2 + 16},${top} L${cx + cw / 2 - 16},${top} Q${cx + cw / 2},${top} ${cx + cw / 2},${top + 14} L${cx + cw / 2},${top + capH}Z`} fill={capHex} />
        <path d={`M${cx - cw / 2},${top + capH} L${cx - cw / 2},${top + 14} Q${cx - cw / 2},${top} ${cx - cw / 2 + 16},${top} L${cx + cw / 2 - 16},${top} Q${cx + cw / 2},${top} ${cx + cw / 2},${top + 14} L${cx + cw / 2},${top + capH}Z`} fill={`url(#${ids.shade})`} />
        <rect x={cx - cw / 2} y={top + capH * 0.62} width={cw} height="3" fill="#000" opacity=".08" />
      </g>
    );
  } else {
    const capH = H * 0.11;
    const top = capBottom - capH;
    const dome = `M${cx - cw / 2},${top + capH} L${cx - cw / 2},${top + capH * 0.45} Q${cx - cw / 2},${top} ${cx},${top} Q${cx + cw / 2},${top} ${cx + cw / 2},${top + capH * 0.45} L${cx + cw / 2},${top + capH}Z`;
    cap = (
      <g>
        <path d={dome} fill={capHex} />
        <path d={dome} fill={`url(#${ids.shade})`} />
        <path d={`M${cx - cw / 2 + 2},${top + capH * 0.48} L${cx + cw / 2 - 2},${top + capH * 0.48}`} stroke="#000" strokeOpacity=".16" strokeWidth="1.5" />
        <rect x={cx - 11} y={top + capH * 0.55} width="22" height={capH * 0.32} rx="4" fill={mix(capHex, "#fff", 0.35)} stroke="#000" strokeOpacity=".12" />
      </g>
    );
  }

  const mid = (sy + bottom) / 2 + 8;
  const text = custom?.text ?? "";
  const sticker = custom?.sticker ? STICKER_ART[custom.sticker] : undefined;
  const fontBase = 30 * (W / 108);
  const widthFactor = custom?.font === "script" ? 0.48 : custom?.font === "block" ? 0.72 : 0.62;
  const fs = text ? Math.min(fontBase, (W * 0.86) / (Math.max(text.length, 1) * widthFactor)) : 0;
  const both = !!text && !!sticker;
  const stickerSize = W * 0.42;
  const stickerY = both ? mid - stickerSize * 0.75 : mid - stickerSize / 2;
  const textY = both ? mid + stickerSize * 0.55 : mid;

  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label={aria}>
      {defs}
      {!noShadow && <ellipse cx={cx} cy={bottom + 4} rx={W * 0.8} ry="10" fill={`url(#${ids.floor})`} />}
      {cap}
      <rect x={cx - nw / 2} y={capBottom} width={nw} height={ringH + 1} fill={`url(#${ids.steel})`} />
      <path d={body} fill={hex} />
      <path d={body} fill={`url(#${ids.vert})`} />
      <path d={body} fill={`url(#${ids.shade})`} />
      <path d={`M${cx - hw + 6},${bottom - 3} L${cx + hw - 6},${bottom - 3}`} stroke="#000" strokeOpacity=".18" strokeWidth="2" />
      {sticker && (
        <g transform={`translate(${cx - stickerSize / 2} ${stickerY}) scale(${stickerSize / 24})`}>
          <path d={sticker.d} fill={sticker.mode === "fill" ? custom?.ink : "none"} stroke={sticker.mode === "stroke" ? custom?.ink : "none"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fillRule="evenodd" />
        </g>
      )}
      {text && (
        <text x={cx} y={textY} textAnchor="middle" dominantBaseline="central" fill={custom?.ink} style={{ fontFamily: FONT_FAMILY[custom?.font ?? "block"], fontWeight: custom?.font === "round" ? 800 : 700, fontSize: fs, letterSpacing: custom?.font === "block" ? "0.02em" : undefined }}>
          {text}
        </text>
      )}
    </svg>
  );
}

type PartProps = { hex: string; ids: Record<string, string>; defs: ReactNode; aria: string; className: string; viewBox: string; noShadow?: boolean };

function Bag({ hex, ids, defs, aria, className, viewBox, noShadow }: PartProps) {
  const cx = 200;
  const top = 150;
  const bottom = 440;
  const w = 136;
  const body = `M${cx - w / 2 + 6},${top} L${cx - w / 2},${bottom - 26} Q${cx - w / 2},${bottom} ${cx - w / 2 + 26},${bottom} L${cx + w / 2 - 26},${bottom} Q${cx + w / 2},${bottom} ${cx + w / 2},${bottom - 26} L${cx + w / 2 - 6},${top}Z`;
  const dark = mix(hex, "#000", 0.3);
  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label={aria}>
      {defs}
      {!noShadow && <ellipse cx={cx} cy={bottom + 6} rx="110" ry="11" fill={`url(#${ids.floor})`} />}
      <path d={`M${cx - w / 2 + 10},${top + 18} C${cx - 190},${top - 170} ${cx + 190},${top - 170} ${cx + w / 2 - 10},${top + 18}`} fill="none" stroke={dark} strokeWidth="11" strokeLinecap="round" />
      <path d={body} fill={hex} />
      <path d={body} fill={`url(#${ids.canvas})`} />
      <path d={body} fill={`url(#${ids.shade})`} />
      <path d={`M${cx - w / 2 + 4},${top} Q${cx},${top + 22} ${cx + w / 2 - 4},${top}`} fill="none" stroke={dark} strokeWidth="3" />
      <path d={`M${cx - 2},${top + 10} L${cx - 14},${top + 58} M${cx + 2},${top + 10} L${cx + 12},${top + 52}`} stroke={dark} strokeWidth="3" strokeLinecap="round" />
      <rect x={cx - 20} y={top + 50} width="16" height="20" rx="4" fill={STEEL.mid} />
      <rect x={cx - w / 2 + 22} y={top + 150} width={w - 44} height="70" rx="8" fill="#000" opacity=".06" />
      <path d={`M${cx - w / 2 + 26},${top + 156} L${cx + w / 2 - 26},${top + 156}`} stroke={dark} strokeWidth="2" strokeDasharray="5 4" />
      <rect x={cx - 26} y={bottom - 78} width="52" height="22" rx="4" fill="#FDF2DF" opacity=".92" />
      <text x={cx} y={bottom - 67} textAnchor="middle" dominantBaseline="central" fill="#0688AE" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 11 }}>.hydron</text>
    </svg>
  );
}

function Strap({ hex, ids, defs, aria, className, viewBox }: PartProps) {
  const dark = mix(hex, "#000", 0.25);
  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label={aria}>
      {defs}
      <path d="M200 120 C 80 150, 70 360, 150 420 C 210 462, 300 430, 316 330 C 330 240, 280 150, 200 120Z" fill="none" stroke={hex} strokeWidth="26" strokeLinejoin="round" />
      <path d="M200 120 C 80 150, 70 360, 150 420 C 210 462, 300 430, 316 330 C 330 240, 280 150, 200 120Z" fill="none" stroke="#000" strokeOpacity=".12" strokeWidth="26" strokeDasharray="2 6" />
      <path d="M200 120 C 80 150, 70 360, 150 420 C 210 462, 300 430, 316 330 C 330 240, 280 150, 200 120Z" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="2" transform="translate(-6,-4)" />
      <rect x="290" y="290" width="54" height="34" rx="8" fill={dark} transform="rotate(-12 317 307)" />
      <rect x="298" y="298" width="38" height="18" rx="4" fill="#000" opacity=".25" transform="rotate(-12 317 307)" />
      <ellipse cx="200" cy="112" rx="58" ry="24" fill="none" stroke={dark} strokeWidth="14" />
      <ellipse cx="200" cy="112" rx="58" ry="24" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="2" transform="translate(0,-5)" />
    </svg>
  );
}
