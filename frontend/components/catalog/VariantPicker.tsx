"use client";

import { formatVND } from "@/components/ds";
import { colorOf, maxQtyOf, sizeLabel, sizePrice, type Product } from "@/lib/products";

export function SizePicker({ product: p, value, color, onChange }: { product: Product; value: string; color: string; onChange: (s: string) => void }) {
  if (!p.sizes.length) return null;
  return (
    <div>
      <div className="hd-opt-label" id={`size-${p.slug}`}>
        <strong>Dung tích</strong>
        <span>{sizeLabel(value)}</span>
      </div>
      <div className="hd-sizes-pick" role="radiogroup" aria-labelledby={`size-${p.slug}`} style={{ gridTemplateColumns: `repeat(${Math.max(p.sizes.length, 2)}, minmax(0, 1fr))` }}>
        {p.sizes.map((s) => {
          const out = maxQtyOf(p, s, color) < 1;
          return (
            <button key={s} type="button" role="radio" aria-checked={s === value} className="hd-size-btn" onClick={() => onChange(s)} disabled={out} title={out ? "Tạm hết màu này" : undefined}>
              {sizeLabel(s)}
              <small>{formatVND(sizePrice(p, s))}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ColorPicker({ product: p, value, size, onChange }: { product: Product; value: string; size: string; onChange: (c: string) => void }) {
  if (!p.colors.length) return null;
  return (
    <div>
      <div className="hd-opt-label" id={`color-${p.slug}`}>
        <strong>Màu</strong>
        <span>{colorOf(p, value)?.name}</span>
      </div>
      <div className="hd-colors-pick" role="radiogroup" aria-labelledby={`color-${p.slug}`}>
        {p.colors.map((c) => {
          const out = maxQtyOf(p, size, c.id) < 1;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={c.id === value}
              aria-label={`${c.name}${out ? " (tạm hết)" : ""}`}
              title={c.name}
              className="hd-color-btn"
              data-out={out}
              style={{ background: c.hex }}
              onClick={() => onChange(c.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
