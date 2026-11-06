"use client";

// Thanh công cụ trang Sản phẩm: menu sắp xếp tự vẽ (thay <select> mặc định của trình duyệt)
// và ngăn bộ lọc theo tông Lam Trà. Cả hai dùng được bằng bàn phím.
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ds";

type Opt = { value: string; label: string };

export function SortMenu({ value, options, onChange }: { value: string; options: Opt[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    list.current?.focus();
    const onDown = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, options, value]);

  const pick = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    btn.current?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    const n = options.length;
    if (e.key === "ArrowDown") setActive((a) => (a + 1) % n);
    else if (e.key === "ArrowUp") setActive((a) => (a - 1 + n) % n);
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(n - 1);
    else if (e.key === "Enter" || e.key === " ") pick(active);
    else if (e.key === "Escape" || e.key === "Tab") { setOpen(false); if (e.key === "Escape") btn.current?.focus(); return; }
    else return;
    e.preventDefault();
  };

  return (
    <div ref={wrap} className="lt-sort">
      <button
        ref={btn}
        type="button"
        className="lt-tool-btn lt-sort-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true); } }}
      >
        <span className="lt-sort-label">Sắp xếp</span>
        <span className="lt-sort-value">{current.label}</span>
        <Icon name="chevron-down" size={16} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform .2s ease" }} />
      </button>
      {open && (
        <ul
          ref={list}
          id={id}
          role="listbox"
          tabIndex={-1}
          aria-label="Sắp xếp sản phẩm"
          aria-activedescendant={`${id}-${active}`}
          className="lt-sort-list lt-rise"
          onKeyDown={onKey}
        >
          {options.map((o, i) => {
            const selected = o.value === current.value;
            return (
              <li
                key={o.value}
                id={`${id}-${i}`}
                role="option"
                aria-selected={selected}
                data-active={i === active || undefined}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(i)}
              >
                <span>{o.label}</span>
                {selected && <Icon name="check" size={16} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Nhóm lựa chọn dạng nút bo tròn, chọn một hoặc bỏ chọn. */
export function PillGroup({ legend, options, value, onChange }: { legend: string; options: (Opt & { desc?: string })[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="lt-filter-group">
      <legend>
        <Icon name="leaf" size={14} />
        {legend}
      </legend>
      <div className="lt-filter-pills">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button key={o.value} type="button" aria-pressed={on} title={o.desc} className="lt-filter-pill" onClick={() => onChange(on ? "" : o.value)}>
              {on && <Icon name="check" size={14} />}
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FilterSheet({ open, onClose, children, footer }: { open: boolean; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="lt-sheet" role="dialog" aria-modal="true" aria-labelledby="lt-filter-title">
      <div className="lt-sheet-scrim lt-fade" onClick={onClose} />
      <div ref={panel} tabIndex={-1} className="lt-sheet-panel">
        <header className="lt-sheet-head">
          <div>
            <span>Lam Trà · Tân Cương</span>
            <h2 id="lt-filter-title">Bộ lọc trà</h2>
          </div>
          <button type="button" className="lt-sheet-close" aria-label="Đóng bộ lọc" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </header>
        <div className="lt-sheet-body">{children}</div>
        <footer className="lt-sheet-foot">{footer}</footer>
      </div>
    </div>
  );
}
