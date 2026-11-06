"use client";

// Bổ sung bộ UI kit cho giai đoạn 2: chọn, theo dõi đơn, skeleton, sao chép, yêu thích.
import { useId, useState, type CSSProperties, type ReactNode, type SelectHTMLAttributes } from "react";
import { Icon } from "./index";

export function WishButton({ on, name, onClick, size = 44 }: { on: boolean; name: string; onClick: () => void; size?: number }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Bỏ ${name} khỏi yêu thích` : `Lưu ${name} vào yêu thích`}
      title={on ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: 999, padding: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: "rgba(255,253,248,.92)", backdropFilter: "blur(8px)", border: "1px solid var(--border-hairline)",
        color: on ? "var(--sen-600)" : "var(--text-strong)",
      }}
    >
      <Icon name="heart" size={Math.round(size * 0.48)} style={{ fill: on ? "currentColor" : "none" }} />
    </button>
  );
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  ...rest
}: {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-ui)" }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: "var(--text-strong)" }}>
          {label}
          {rest.required && <span style={{ color: "var(--danger)" }}> *</span>}
        </label>
      )}
      <span style={{ position: "relative", display: "block" }}>
        <select
          id={id}
          className="lt-field"
          aria-invalid={!!error}
          {...rest}
          style={{
            width: "100%", boxSizing: "border-box", height: 48, padding: "0 40px 0 14px", appearance: "none",
            fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-strong)", background: "#FFFFFF",
            border: "1.2px solid " + (error ? "var(--danger)" : "var(--border-strong)"), borderRadius: "var(--radius-input)",
            boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)", outline: "none", cursor: "pointer",
            ...rest.style,
          }}
        >
          {placeholder != null && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}>
          <Icon name="chevron-down" size={20} />
        </span>
      </span>
      {(error || hint) && <span style={{ fontSize: 12, color: error ? "var(--danger)" : "var(--text-muted)" }}>{error || hint}</span>}
    </div>
  );
}

/** Ô chọn dạng thẻ: radio (chọn một) hoặc checkbox (bật/tắt). */
export function Choice({
  type = "radio",
  name,
  checked,
  onChange,
  title,
  desc,
  aside,
  icon,
  disabled,
}: {
  type?: "radio" | "checkbox";
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: ReactNode;
  desc?: ReactNode;
  aside?: ReactNode;
  icon?: string;
  disabled?: boolean;
}) {
  return (
    <label
      style={{
        display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: "var(--radius-md)", cursor: disabled ? "not-allowed" : "pointer",
        border: checked ? "1.5px solid var(--primary)" : "1.2px solid var(--border-strong)",
        background: checked ? "var(--blue-50)" : "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        opacity: disabled ? 0.5 : 1, fontFamily: "var(--font-ui)",
      }}
    >
      <input type={type} name={name} checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} style={{ margin: "2px 0 0", width: 18, height: 18, accentColor: "var(--primary)", flexShrink: 0 }} />
      {icon && <Icon name={icon} size={20} color="var(--accent)" style={{ marginTop: 1 }} />}
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 14, fontWeight: checked ? 700 : 500, color: "var(--text-strong)" }}>{title}</span>
        {desc && <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--text-muted)" }}>{desc}</span>}
      </span>
      {aside && <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-strong)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{aside}</span>}
    </label>
  );
}

const TRACK_STEPS = [
  { label: "Đã đặt hàng", icon: "receipt" },
  { label: "Đã xác nhận", icon: "circle-check" },
  { label: "Đang giao", icon: "truck" },
  { label: "Hoàn thành", icon: "package" },
];

export function OrderTracker({ current = 0, times = [] }: { current?: number; times?: (string | undefined)[] }) {
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", fontFamily: "var(--font-ui)" }}>
      {TRACK_STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        const reached = i <= current;
        return (
          <li key={s.label} aria-current={active ? "step" : undefined} style={{ position: "relative", flex: "1 1 0", minWidth: 0, display: "grid", justifyItems: "center", alignContent: "start", rowGap: 8, textAlign: "center" }}>
            {i < TRACK_STEPS.length - 1 && <span style={{ position: "absolute", top: 16, left: "50%", width: "100%", height: 1, background: done ? "var(--primary)" : "var(--border-strong)" }} />}
            <span
              style={{
                width: 32, height: 32, borderRadius: 16, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                background: reached ? "var(--primary)" : "var(--surface-card)", color: reached ? "var(--text-on-primary)" : "var(--text-subtle)",
                border: "1px solid " + (reached ? "var(--primary)" : "var(--border-strong)"), boxShadow: active ? "0 0 0 4px var(--primary-soft)" : "none",
              }}
            >
              <Icon name={done ? "check" : s.icon} size={16} />
            </span>
            <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: reached ? "var(--text-strong)" : "var(--text-subtle)", lineHeight: 1.3 }}>{s.label}</span>
            {times[i] && <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: -6 }}>{times[i]}</span>}
          </li>
        );
      })}
    </ol>
  );
}

export function Skeleton({ w = "100%", h = 16, radius = 4, style }: { w?: number | string; h?: number | string; radius?: number | string; style?: CSSProperties }) {
  return <span aria-hidden className="lt-skeleton" style={{ display: "block", width: w, height: h, borderRadius: radius, ...style }} />;
}

export function CopyButton({ text, label = "Sao chép" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1600);
          })
          .catch(() => {});
      }}
      aria-label={`${label}: ${text}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, border: 0, background: "transparent", padding: "4px 6px", color: "var(--text-link)", fontFamily: "var(--font-ui)", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}
    >
      <Icon name={done ? "check" : "copy"} size={15} />
      {done ? "Đã chép" : label}
    </button>
  );
}

/** Khối nội dung có viền (tóm tắt đơn, thông báo). DS: card nội dung không đổ bóng. */
export function Panel({ children, style, tone = "card" }: { children: ReactNode; style?: CSSProperties; tone?: "card" | "accent" | "info" }) {
  const bg = tone === "accent" ? "var(--accent-soft)" : tone === "info" ? "var(--primary-soft)" : "var(--surface-card)";
  return <div style={{ background: bg, border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", ...style }}>{children}</div>;
}

export function SectionTitle({
  eyebrow,
  title,
  action,
  id,
  displayFont = true,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  id?: string;
  displayFont?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 28, fontFamily: "var(--font-ui)" }}>
      <div style={{ minWidth: 0 }}>
        {eyebrow && <div style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", fontWeight: 500, color: "var(--accent)", marginBottom: 8 }}>{eyebrow}</div>}
        <h2
          id={id}
          style={{
            margin: 0,
            fontSize: displayFont ? "clamp(28px, 3.2vw, 38px)" : "clamp(22px, 2vw, 28px)",
            lineHeight: 1.18,
            fontWeight: displayFont ? 600 : 500,
            letterSpacing: displayFont ? "0.015em" : "-.01em",
            fontFamily: displayFont ? "var(--font-display)" : "var(--font-ui)",
            color: "var(--text-strong)",
          }}
        >
          {title}
        </h2>
      </div>
      {action && <span style={{ flexShrink: 0, whiteSpace: "nowrap", paddingBottom: 4 }}>{action}</span>}
    </div>
  );
}
