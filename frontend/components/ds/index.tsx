"use client";

// Lam Trà design system components, ported from _ds_bundle.js.
import { useEffect, useId, useState, type CSSProperties, type InputHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { ICON_PATHS } from "./icon-paths";
import { WishButton } from "./more";

export * from "./more";

import { formatVND } from "@/lib/format";

export { formatVND };

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  color = "currentColor",
  style,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ flexShrink: 0, display: "block", ...style }}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || "" }}
    />
  );
}

const SIZES = {
  sm: { height: 36, padding: "0 14px", fontSize: 13, gap: 6, icon: 16 },
  md: { height: 44, padding: "0 20px", fontSize: 14, gap: 8, icon: 18 },
  lg: { height: 52, padding: "0 28px", fontSize: 15, gap: 10, icon: 20 },
};
const VARIANTS = {
  primary: { bg: "var(--primary)", fg: "var(--text-on-primary)", bd: "var(--primary)", hbg: "var(--primary-hover)", hbd: "var(--primary-hover)" },
  accent: { bg: "var(--accent)", fg: "var(--text-on-primary)", bd: "var(--accent)", hbg: "var(--accent-hover)", hbd: "var(--accent-hover)" },
  secondary: { bg: "transparent", fg: "var(--text-strong)", bd: "var(--text-strong)", hbg: "var(--bg-sunken)", hbd: "var(--text-strong)" },
  ghost: { bg: "transparent", fg: "var(--text-strong)", bd: "transparent", hbg: "var(--bg-sunken)", hbd: "transparent" },
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth,
  children,
  style,
  onClick,
  type = "button",
  disabled,
  href,
}: {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  iconLeft?: string;
  iconRight?: string;
  fullWidth?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Khi có href, nút được render thành link (Next.js) */
  href?: string;
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const s = SIZES[size];
  const v = VARIANTS[variant];
  const events = {
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
  };
  const css: CSSProperties = {
    display: fullWidth ? "flex" : "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? "100%" : undefined,
    fontFamily: "var(--font-ui)",
    fontSize: s.fontSize,
    fontWeight: 500,
    letterSpacing: ".02em",
    textDecoration: "none",
    color: v.fg,
    background: hover && !disabled ? v.hbg : v.bg,
    border: "1px solid " + (hover && !disabled ? v.hbd : v.bd),
    borderRadius: "var(--radius-button)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transform: press ? "translateY(1px)" : "none",
    transition: "background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), transform var(--dur-fast)",
    whiteSpace: "nowrap",
    ...style,
  };
  const inner = (
    <>
      {iconLeft && <Icon name={iconLeft} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </>
  );
  if (href && !disabled) {
    return (
      <Link href={href} {...events} style={{ ...css, color: v.fg }}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} {...events} style={css}>
      {inner}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  variant = "ghost",
  size = 44,
  onClick,
}: {
  icon: string;
  label: string;
  variant?: "ghost" | "surface" | "filled" | "outline";
  size?: number;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const filled = variant === "filled";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-pill)",
        padding: 0,
        cursor: "pointer",
        color: filled ? "var(--text-on-primary)" : "var(--text-strong)",
        background: filled
          ? hover ? "var(--primary-hover)" : "var(--primary)"
          : variant === "surface" ? "rgba(251,248,242,.88)" : hover ? "var(--bg-sunken)" : "transparent",
        border: variant === "outline" ? "1px solid var(--border-strong)" : "1px solid transparent",
        backdropFilter: variant === "surface" ? "blur(8px)" : undefined,
        transition: "background var(--dur-base) var(--ease-out)",
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.48)} />
    </button>
  );
}

export function ProductImage({
  src,
  alt = "",
  ratio = "4 / 5",
  radius = "var(--radius-card)",
}: {
  src: string;
  alt?: string;
  ratio?: string;
  radius?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: ratio,
        width: "100%",
        overflow: "hidden",
        borderRadius: radius,
        background: "var(--surface-photo)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}

export function Rating({ value = 0, count, size = 14 }: { value?: number; count?: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-ui)" }}>
      <span style={{ display: "inline-flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => {
          const on = i <= Math.round(value);
          return (
            <span key={i} style={{ color: on ? "var(--rating)" : "var(--paper-400)", display: "inline-flex" }}>
              <Icon name="star" size={size} style={{ fill: on ? "currentColor" : "none" }} />
            </span>
          );
        })}
      </span>
      {count != null && (
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {value.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}

export type Option = { value: string; label: string; sub?: string };

export function OptionPicker({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: Option[];
  value: string;
  onChange?: (v: string) => void;
}) {
  const current = options.find((o) => o.value === value);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font-ui)" }}>
      {label && (
        <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 13 }}>
          <span style={{ fontWeight: 500, color: "var(--text-strong)" }}>{label}</span>
          {current && <span style={{ color: "var(--text-muted)" }}>{current.label}</span>}
        </div>
      )}
      <div role="radiogroup" style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))`, gap: 8 }}>
        {options.map((o) => {
          const sel = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={sel}
              onClick={() => onChange && onChange(o.value)}
              style={{
                minHeight: 48,
                padding: "8px 10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                fontFamily: "inherit",
                border: sel ? "1.5px solid var(--text-strong)" : "1px solid var(--border-strong)",
                background: sel ? "var(--surface-raised)" : "transparent",
                color: "var(--text-strong)",
                transition: "border-color var(--dur-fast)",
              }}
            >
              {/* DS rule: Roboto has no 600, so selected uses 700 */}
              <span style={{ fontSize: 14, fontWeight: sel ? 700 : 500 }}>{o.label}</span>
              {o.sub && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{o.sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Price({ value, compareAt, size = "md" }: { value: number; compareAt?: number; size?: "sm" | "md" | "lg" }) {
  const fs = size === "lg" ? "var(--fs-price-lg)" : size === "sm" ? "14px" : "var(--fs-price)";
  const onSale = compareAt != null && compareAt > value;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", flexWrap: "wrap", gap: "2px 8px", fontFamily: "var(--font-ui)", fontVariantNumeric: "tabular-nums" }}>
      <span style={{ fontSize: fs, fontWeight: 700, color: onSale ? "var(--sale)" : "var(--text-price)" }}>{formatVND(value)}</span>
      {onSale && (
        <span style={{ fontSize: size === "lg" ? 15 : 13, color: "var(--text-price-old)", textDecoration: "line-through" }}>
          <span className="lt-sr">Giá cũ </span>
          {formatVND(compareAt)}
        </span>
      )}
    </span>
  );
}

const BADGE_TONES = {
  neutral: { bg: "var(--bg-sunken)", fg: "var(--text-body)" },
  accent: { bg: "var(--accent-soft)", fg: "var(--tra-700)" },
  sale: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  success: { bg: "var(--success-soft)", fg: "var(--success)" },
  new: { bg: "var(--primary-soft)", fg: "var(--primary)" },
};

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof BADGE_TONES; children: ReactNode }) {
  const t = BADGE_TONES[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: 22, padding: "0 8px", borderRadius: "var(--radius-xs)", background: t.bg, color: t.fg, fontSize: 11.5, fontWeight: 500, letterSpacing: ".01em", whiteSpace: "nowrap", fontFamily: "var(--font-ui)" }}>
      {children}
    </span>
  );
}

export function Input({
  label,
  hint,
  error,
  textarea,
  rows = 4,
  style,
  ...rest
}: {
  label?: string;
  hint?: string;
  error?: string;
  textarea?: boolean;
  rows?: number;
} & InputHTMLAttributes<HTMLInputElement & HTMLTextAreaElement>) {
  const id = useId();
  const field: CSSProperties = {
    width: "100%", boxSizing: "border-box", minHeight: 48, padding: textarea ? "12px 14px" : "0 14px",
    fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-strong)", background: "#FAF8F5",
    border: "1.2px solid " + (error ? "var(--danger)" : "rgba(36, 52, 31, 0.22)"), borderRadius: "var(--radius-input)",
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)",
    outline: "none", resize: "vertical", ...style,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-ui)" }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: "var(--text-strong)" }}>
          {label}
          {rest.required && <span style={{ color: "var(--danger)" }}> *</span>}
        </label>
      )}
      {textarea ? (
        <textarea id={id} rows={rows} className="lt-field" style={field} aria-invalid={!!error} {...rest} />
      ) : (
        <input id={id} className="lt-field" style={field} aria-invalid={!!error} {...rest} />
      )}
      {(error || hint) && <span style={{ fontSize: 12, color: error ? "var(--danger)" : "var(--text-muted)" }}>{error || hint}</span>}
    </div>
  );
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, size = "md" }: { value: number; onChange: (v: number) => void; min?: number; max?: number; size?: "sm" | "md" }) {
  const h = size === "sm" ? 36 : 44;
  const btn: CSSProperties = { width: h, height: h, border: 0, background: "transparent", color: "var(--text-strong)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: "1.2px solid rgba(36, 52, 31, 0.22)", borderRadius: "var(--radius-input)", background: "#FAF8F5", fontFamily: "var(--font-ui)", boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.02)" }}>
      <button type="button" aria-label="Giảm số lượng" disabled={value <= min} onClick={() => onChange(value - 1)} style={{ ...btn, opacity: value <= min ? 0.35 : 1 }}>
        <Icon name="minus" size={16} />
      </button>
      <span aria-live="polite" style={{ minWidth: 28, textAlign: "center", fontSize: 15, fontWeight: 500, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
      <button type="button" aria-label="Tăng số lượng" disabled={value >= max} onClick={() => onChange(value + 1)} style={{ ...btn, opacity: value >= max ? 0.35 : 1 }}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

export function Toast({ message, onClose, action }: { message: string | null; onClose?: () => void; action?: { label: string; href: string } }) {
  return (
    <div aria-live="polite" style={{ position: "fixed", left: 0, right: 0, bottom: "calc(var(--tabbar-space, 0px) + 16px)", zIndex: 50, display: "flex", justifyContent: "center", pointerEvents: "none", padding: "0 16px" }}>
      {message && (
        <div className="lt-rise" style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: 12, maxWidth: 440, width: "100%", padding: "12px 12px 12px 16px", borderRadius: "var(--radius-md)", background: "var(--surface-inverse)", color: "var(--text-on-inverse)", boxShadow: "var(--shadow-lg)", fontFamily: "var(--font-ui)", fontSize: 14 }}>
          <Icon name="circle-check" size={20} color="var(--tra-300)" />
          <span style={{ flex: 1, minWidth: 0 }}>{message}</span>
          {action && (
            <Link href={action.href} onClick={onClose} style={{ color: "var(--tra-300)", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>
              {action.label}
            </Link>
          )}
          {onClose && (
            <button type="button" aria-label="Đóng" onClick={onClose} style={{ border: 0, background: "transparent", color: "inherit", cursor: "pointer", padding: 4, display: "flex" }}>
              <Icon name="x" size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  sheet,
  maxWidth,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  sheet?: boolean;
  maxWidth?: number | string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: sheet ? "flex-end" : "center",
        justifyContent: "center",
        padding: sheet ? 0 : "20px 16px",
        overflow: "hidden",
      }}
    >
      <div onClick={onClose} className="lt-fade" style={{ position: "absolute", inset: 0, background: "var(--overlay-scrim)" }} />
      <div
        className="lt-rise"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: maxWidth ?? (sheet ? "100%" : 560),
          maxHeight: sheet ? "90vh" : "88vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#FFFFFF",
          borderRadius: sheet ? "var(--radius-sheet) var(--radius-sheet) 0 0" : "12px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0,0,0,0.08)",
          fontFamily: "var(--font-ui)",
        }}
      >
        {title && (
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "16px 20px",
              background: "#FFFFFF",
              borderBottom: "1px solid #E5E7EB",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.03)",
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 600, color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title}
            </span>
            <IconButton icon="x" label="Đóng" onClick={onClose} />
          </div>
        )}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function ProductCard({
  href,
  name,
  note,
  image,
  price,
  compareAt,
  rating,
  reviews,
  badge,
  onQuickAdd,
  wished,
  onWish,
}: {
  href: string;
  name: string;
  note?: string;
  image: string;
  price: number;
  compareAt?: number;
  rating?: number;
  reviews?: number;
  badge?: { label: string; tone?: keyof typeof BADGE_TONES };
  onQuickAdd?: () => void;
  wished?: boolean;
  onWish?: () => void;
}) {
  // DS rule: product cards have no box — the photo is the container.
  return (
    <article className="lt-card" style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font-ui)", minWidth: 0 }}>
      <div style={{ position: "relative" }}>
        <Link href={href} aria-label={name} className="lt-card-photo" style={{ display: "block", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
          <ProductImage src={image} alt={name} />
        </Link>
        {badge && (
          <span style={{ position: "absolute", left: 10, top: 10 }}>
            <Badge tone={badge.tone}>{badge.label}</Badge>
          </span>
        )}
        {onWish && (
          <span style={{ position: "absolute", right: 10, top: 10 }}>
            <WishButton on={!!wished} name={name} onClick={onWish} size={36} />
          </span>
        )}
        {onQuickAdd && (
          <span style={{ position: "absolute", right: 10, bottom: 10 }}>
            <IconButton icon="plus" label={`Thêm nhanh ${name} vào giỏ`} variant="surface" size={40} onClick={onQuickAdd} />
          </span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Link href={href} className="lt-card-name" style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3, color: "var(--text-strong)", textDecoration: "none" }}>
          {name}
        </Link>
        {note && <span style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>{note}</span>}
        {rating != null && <Rating value={rating} count={reviews} size={12} />}
        <div style={{ marginTop: 2 }}>
          <Price value={price} compareAt={compareAt} />
        </div>
      </div>
    </article>
  );
}
