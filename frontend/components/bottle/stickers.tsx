// Hình sticker in lên bình, khung 24×24. Dùng chung cho ảnh dựng SVG, canvas 3D và nút chọn.
// id phải khớp với STICKERS trong shared/catalog.ts.
export type StickerArt = { d: string; mode: "fill" | "stroke" };

// Linh vật Hydron (cùng bộ móc khóa). Vẽ bằng evenodd: các khối không chồng nhau,
// mắt/mũi là lỗ khoét trong khối, chi tiết nằm trong lỗ thì được tô lại.
const el = (cx: number, cy: number, rx: number, ry = rx) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

const MASCOTS: Record<string, string> = {
  gau: [el(12, 13.6, 7.4), el(5, 5.6, 2.7), el(19, 5.6, 2.7), el(9.2, 12.4, 1.05), el(14.8, 12.4, 1.05), el(12, 16.3, 2.9, 2.2), el(12, 15.5, 1.1, 0.8)].join(""),
  tho: [el(12, 16, 6.4), el(8.8, 5.6, 1.9, 4.4), el(15.2, 5.6, 1.9, 4.4), el(8.8, 6, 0.8, 2.8), el(15.2, 6, 0.8, 2.8), el(9.6, 15.4, 0.95), el(14.4, 15.4, 0.95), el(12, 17.6, 0.8, 0.6)].join(""),
  capybara: ["M8.5 6.5h7a5 5 0 0 1 5 5v4a5 5 0 0 1-5 5h-7a5 5 0 0 1-5-5v-4a5 5 0 0 1 5-5Z", el(6.4, 4.6, 1.7), el(17.6, 4.6, 1.7), el(8.4, 11.5, 1), el(15.6, 11.5, 1), el(10.3, 16.5, 0.7, 1), el(13.7, 16.5, 0.7, 1)].join(""),
  meo: "M4 21C2.5 17 3 12.5 4.5 10L4 2.5l5.5 4.3c1.7-.4 3.3-.4 5 0L20 2.5l-.5 7.5c1.5 2.5 2 7 .5 11-4 1.6-12 1.6-16 0Z" + "M7.2 14q1.8 1.8 3.6 0-1.8 1-3.6 0ZM13.2 14q1.8 1.8 3.6 0-1.8 1-3.6 0ZM11 16.6h2l-1 1.1Z",
  "gau-truc": [el(12, 13.4, 7.6), el(5.2, 5.4, 2.6), el(18.8, 5.4, 2.6), el(8.8, 12.8, 2.3, 2.9), el(15.2, 12.8, 2.3, 2.9), el(9.1, 12.4, 0.9), el(14.9, 12.4, 0.9), el(12, 17, 1.2, 0.85)].join(""),
};

export const STICKER_ART: Record<string, StickerArt> = {
  song: { mode: "stroke", d: "M2 8c2.5-2.5 4.5-2.5 7 0s4.5 2.5 7 0 4.5-2.5 6 0M2 13c2.5-2.5 4.5-2.5 7 0s4.5 2.5 7 0 4.5-2.5 6 0M2 18c2.5-2.5 4.5-2.5 7 0s4.5 2.5 7 0 4.5-2.5 6 0" },
  la: { mode: "fill", d: "M20.5 3.5C12 3.2 5.2 6.8 4.4 14.2c-.2 1.7.1 3.3.8 4.6L3 21l1.4 1 2.2-2.2c1.4.8 3 1.1 4.7.9 7.4-.8 9.6-8.5 9.2-17.2Zm-11 13.3c2.1-3.3 4.6-5.7 7.6-7.4-2.6 2.2-4.8 4.8-6.4 7.9Z" },
  nui: { mode: "fill", d: "M1.5 20.5 8.6 7.6l3.7 6.3 2.3-3.6 7.9 10.2Z M8.6 7.6l1.7 2.9-1.7-.9-1.6.9Z" },
  sao: { mode: "fill", d: "M12 1.8l3.1 6.5 7.1.9-5.2 4.9 1.3 7.1L12 17.8l-6.3 3.4L7 14.1 1.8 9.2l7.1-.9Z" },
  tim: { mode: "fill", d: "M12 21.2 3.6 12.9A5.4 5.4 0 0 1 11.2 5.3l.8.8.8-.8a5.4 5.4 0 0 1 7.6 7.6Z" },
  set: { mode: "fill", d: "M13.6 1.5 3.8 13.6h6.6l-1.6 8.9 10.4-12.6h-6.8Z" },
  "mat-troi": { mode: "stroke", d: "M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 1 0 0-9.6ZM12 1.5v2.6M12 19.9v2.6M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12h2.6M19.9 12h2.6M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" },
  giot: { mode: "fill", d: "M12 1.8C9.2 6 5.2 10.2 5.2 14.8a6.8 6.8 0 0 0 13.6 0C18.8 10.2 14.8 6 12 1.8Zm-3.2 13.4c0 1.8 1.2 3.2 2.9 3.6l-.3 1.4c-2.4-.5-4.1-2.6-4.1-5Z" },
  ...Object.fromEntries(Object.entries(MASCOTS).map(([id, d]) => [id, { d, mode: "fill" as const }])),
};

export function StickerIcon({ id, size = 24, color = "currentColor" }: { id: string; size?: number; color?: string }) {
  const art = STICKER_ART[id];
  if (!art) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ display: "block" }}>
      <path d={art.d} fill={art.mode === "fill" ? color : "none"} stroke={art.mode === "stroke" ? color : "none"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fillRule="evenodd" />
    </svg>
  );
}
