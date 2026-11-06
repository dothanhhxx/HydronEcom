"use client";

// Trang danh mục: lọc theo loại, dung tích, màu, giá; sắp xếp; tìm kiếm. Trạng thái nằm trên URL để chia sẻ được.
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Button, Icon } from "@/components/ds";
import { CATEGORIES, getCategory, priceRange, type Product } from "@/lib/products";
import { fold } from "@/lib/text";
import { ProductGridList } from "./ProductCard";
import { Breadcrumbs } from "@/components/shell/PageHeader";

const PRICES = [
  { value: "duoi-100", label: "Dưới 100.000₫", min: 0, max: 99999 },
  { value: "100-160", label: "100.000₫ – 160.000₫", min: 100000, max: 160000 },
  { value: "160-200", label: "160.000₫ – 200.000₫", min: 160001, max: 200000 },
];

const SORTS: { value: string; label: string; cmp: (a: Product, b: Product) => number }[] = [
  { value: "", label: "Nổi bật", cmp: (a, b) => b.rating * b.reviews - a.rating * a.reviews },
  { value: "ban-chay", label: "Bán chạy", cmp: (a, b) => b.sold - a.sold },
  { value: "moi-nhat", label: "Mới nhất", cmp: (a, b) => b.addedAt.localeCompare(a.addedAt) },
  { value: "gia-tang", label: "Giá tăng dần", cmp: (a, b) => priceRange(a)[0] - priceRange(b)[0] },
  { value: "gia-giam", label: "Giá giảm dần", cmp: (a, b) => priceRange(b)[0] - priceRange(a)[0] },
];

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

function Filters({ products, get, toggle }: { products: Product[]; get: (k: string) => string[]; toggle: (k: string, v: string, single?: boolean) => void }) {
  const sizes = Array.from(new Set(products.flatMap((p) => p.sizes))).sort();
  const colors = Array.from(new Map(products.flatMap((p) => p.colors).map((c) => [c.id, c])).values());
  const count = (fn: (p: Product) => boolean) => products.filter(fn).length;
  const Group = ({ title, children }: { title: string; children: ReactNode }) => (
    <fieldset className="hd-filter-group">
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
  return (
    <>
      <Group title="Loại sản phẩm">
        {CATEGORIES.map((c) => (
          <label key={c.slug} className="hd-check">
            <input type="checkbox" checked={get("danh-muc").includes(c.slug)} onChange={() => toggle("danh-muc", c.slug, true)} />
            {c.name}
            <small>{count((p) => p.category === c.slug)}</small>
          </label>
        ))}
      </Group>
      <Group title="Dung tích">
        {sizes.map((s) => (
          <label key={s} className="hd-check">
            <input type="checkbox" checked={get("dung-tich").includes(s)} onChange={() => toggle("dung-tich", s)} />
            {s}ml
            <small>{count((p) => p.sizes.includes(s))}</small>
          </label>
        ))}
      </Group>
      <Group title="Màu">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {colors.map((c) => {
            const on = get("mau").includes(c.id);
            return (
              <button key={c.id} type="button" className="hd-color-btn" aria-checked={on} role="checkbox" aria-label={c.name} title={c.name} style={{ background: c.hex, width: 36, height: 36 }} onClick={() => toggle("mau", c.id)} />
            );
          })}
        </div>
      </Group>
      <Group title="Khoảng giá">
        {PRICES.map((r) => (
          <label key={r.value} className="hd-check">
            <input type="checkbox" checked={get("gia").includes(r.value)} onChange={() => toggle("gia", r.value)} />
            {r.label}
          </label>
        ))}
      </Group>
    </>
  );
}

export default function ProductGrid({ initialProducts }: { initialProducts: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sheet, setSheet] = useState(false);
  const products = initialProducts.filter((p) => p.active !== false && !p.deleted);

  const get = (k: string) => list(params.get(k));
  const setParams = (mut: (u: URLSearchParams) => void) => {
    const u = new URLSearchParams(params.toString());
    mut(u);
    const s = u.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };
  const toggle = (k: string, v: string, single?: boolean) =>
    setParams((u) => {
      const cur = list(u.get(k));
      const next = cur.includes(v) ? cur.filter((x) => x !== v) : single ? [v] : [...cur, v];
      if (next.length) u.set(k, next.join(","));
      else u.delete(k);
    });

  const q = params.get("q") ?? "";
  const sort = params.get("sap-xep") ?? "";
  const cat = get("danh-muc");
  const sizes = get("dung-tich");
  const colors = get("mau");
  const prices = get("gia");

  const shown = useMemo(() => {
    const k = fold(q.trim());
    const out = products.filter((p) => {
      if (k && !fold(`${p.name} ${p.kind} ${p.note} ${p.desc} ${p.colors.map((c) => c.name).join(" ")}`).includes(k)) return false;
      if (cat.length && !cat.includes(p.category)) return false;
      if (sizes.length && !sizes.some((s) => p.sizes.includes(s))) return false;
      if (colors.length && !p.colors.some((c) => colors.includes(c.id))) return false;
      if (prices.length) {
        const [lo, hi] = priceRange(p);
        if (!prices.some((v) => { const r = PRICES.find((x) => x.value === v); return r && lo <= r.max && hi >= r.min; })) return false;
      }
      return true;
    });
    return out.sort((SORTS.find((s) => s.value === sort) ?? SORTS[0]).cmp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, q, sort, cat.join(), sizes.join(), colors.join(), prices.join()]);

  const active = [
    ...cat.map((v) => ({ k: "danh-muc", v, label: getCategory(v)?.name ?? v })),
    ...sizes.map((v) => ({ k: "dung-tich", v, label: `${v}ml` })),
    ...colors.map((v) => ({ k: "mau", v, label: products.flatMap((p) => p.colors).find((c) => c.id === v)?.name ?? v })),
    ...prices.map((v) => ({ k: "gia", v, label: PRICES.find((r) => r.value === v)?.label ?? v })),
  ];
  const title = q ? `Kết quả cho “${q}”` : cat.length === 1 ? getCategory(cat[0])?.name ?? "Sản phẩm" : "Tất cả sản phẩm";
  const desc = cat.length === 1 ? getCategory(cat[0])?.desc : "Bình giữ nhiệt thép 304 dung tích 500 – 900ml và phụ kiện. Mọi bình đều in tên được.";
  const clearAll = () => setParams((u) => ["danh-muc", "dung-tich", "mau", "gia", "q"].forEach((k) => u.delete(k)));

  return (
    <>
    <div className="hd-page-head hd-catalog-band">
      <div className="lt-container">
        <Breadcrumbs crumbs={[{ label: "Sản phẩm" }]} />
        <div className="hd-catalog-head">
          <div>
            <h1>{title}</h1>
            <p style={{ marginTop: 14, color: "var(--text-body)", maxWidth: 560, fontSize: 16.5, lineHeight: 1.65 }}>{desc}</p>
          </div>
        </div>
      </div>
    </div>
    <div className="hd-catalog-body">
    <div className="lt-container">
      <div className="hd-toolbar">
        <div className="hd-tabs" role="group" aria-label="Loại sản phẩm" style={{ flex: "0 1 auto", minWidth: 0 }}>
          <button type="button" className="hd-tab" aria-pressed={!cat.length} onClick={() => setParams((u) => u.delete("danh-muc"))}>Tất cả</button>
          {CATEGORIES.map((c) => (
            <button key={c.slug} type="button" className="hd-tab" aria-pressed={cat.includes(c.slug)} onClick={() => setParams((u) => (cat.includes(c.slug) ? u.delete("danh-muc") : u.set("danh-muc", c.slug)))}>
              {c.name}
            </button>
          ))}
        </div>
        <button type="button" className="hd-tab lt-mobile" onClick={() => setSheet(true)} style={{ flexShrink: 0 }}>
          <Icon name="sliders-horizontal" size={16} />
          Lọc{active.length ? ` (${active.length})` : ""}
        </button>
        <label className="hd-sort">
          <span className="lt-sr">Sắp xếp</span>
          <select value={sort} onChange={(e) => setParams((u) => (e.target.value ? u.set("sap-xep", e.target.value) : u.delete("sap-xep")))}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <Icon name="chevron-down" size={16} />
        </label>
      </div>

      <div className="hd-catalog">
        <aside className="hd-filters" aria-label="Bộ lọc">
          <Filters products={products} get={get} toggle={toggle} />
        </aside>
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 20, minHeight: 32 }}>
            <span style={{ fontSize: 14, color: "var(--text-muted)", marginRight: 4 }} aria-live="polite">{shown.length} sản phẩm</span>
            {q && (
              <button type="button" className="hd-chip" onClick={() => setParams((u) => u.delete("q"))}>“{q}” <Icon name="x" size={14} /></button>
            )}
            {active.map((a) => (
              <button key={a.k + a.v} type="button" className="hd-chip" onClick={() => toggle(a.k, a.v)} aria-label={`Bỏ lọc ${a.label}`}>
                {a.label} <Icon name="x" size={14} />
              </button>
            ))}
            {(active.length > 0 || q) && (
              <button type="button" onClick={clearAll} style={{ border: 0, background: "transparent", color: "var(--text-link)", font: "500 13px var(--font-ui)", cursor: "pointer", textDecoration: "underline" }}>Xóa tất cả</button>
            )}
          </div>
          {shown.length ? (
            <ProductGridList products={shown} />
          ) : (
            <div role="status" style={{ padding: "48px 24px", borderRadius: "var(--radius-card)", background: "var(--cream-50)", textAlign: "center", display: "grid", gap: 14, justifyItems: "center" }}>
              <Icon name="search" size={28} color="var(--text-muted)" />
              <p style={{ fontSize: 16, color: "var(--text-strong)", fontWeight: 600 }}>Không có sản phẩm khớp bộ lọc</p>
              <p style={{ fontSize: 14.5, color: "var(--text-muted)", maxWidth: 380 }}>Bỏ bớt một vài điều kiện, hoặc nhắn Hydron để hỏi mẫu bạn cần.</p>
              <Button variant="secondary" onClick={clearAll}>Xóa bộ lọc</Button>
            </div>
          )}
        </div>
      </div>

      {sheet && (
        <div className="hd-sheet" role="dialog" aria-modal aria-label="Bộ lọc">
          <div className="hd-sheet-scrim" onClick={() => setSheet(false)} />
          <div className="hd-sheet-panel">
            <div className="hd-sheet-head">
              <h2>Bộ lọc</h2>
              <button type="button" className="hd-icon-btn" aria-label="Đóng bộ lọc" onClick={() => setSheet(false)}><Icon name="x" size={22} /></button>
            </div>
            <div className="hd-sheet-body">
              <Filters products={products} get={get} toggle={toggle} />
            </div>
            <div className="hd-sheet-foot">
              <Button variant="secondary" onClick={clearAll}>Xóa lọc</Button>
              <Button onClick={() => setSheet(false)}>Xem {shown.length} sản phẩm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
}
