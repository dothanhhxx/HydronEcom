"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button, Icon } from "@/components/ds";
import { FilterSheet, PillGroup, SortMenu } from "./CatalogControls";
import { fold } from "@/lib/text";
import { CATEGORIES, PRODUCTS, PURPOSES, getCategory, priceOf, type Product } from "@/lib/products";
import { BuyGrid, FeaturedProduct } from "./BuyCard";

const chip = (on: boolean) => ({
  display: "inline-flex", alignItems: "center", height: 36, padding: "0 14px", borderRadius: 999, fontSize: 13, whiteSpace: "nowrap" as const,
  textDecoration: "none", border: "1px solid " + (on ? "var(--text-strong)" : "var(--border-strong)"),
  background: on ? "var(--text-strong)" : "transparent", color: on ? "var(--paper-50)" : "var(--text-strong)",
});

const PRICES = [
  { value: "duoi-200", label: "Dưới 200.000₫", test: (n: number) => n < 200000 },
  { value: "200-400", label: "200.000₫ – 400.000₫", test: (n: number) => n >= 200000 && n <= 400000 },
  { value: "tren-400", label: "Trên 400.000₫", test: (n: number) => n > 400000 },
];

const SORTS: { value: string; label: string; cmp: (a: Product, b: Product) => number }[] = [
  { value: "", label: "Nổi bật", cmp: (a, b) => b.rating * b.reviews - a.rating * a.reviews },
  { value: "ban-chay", label: "Bán chạy", cmp: (a, b) => b.sold - a.sold },
  { value: "moi-nhat", label: "Mới nhất", cmp: (a, b) => b.addedAt.localeCompare(a.addedAt) },
  { value: "gia-tang", label: "Giá thấp đến cao", cmp: (a, b) => priceOf(a) - priceOf(b) },
  { value: "gia-giam", label: "Giá cao đến thấp", cmp: (a, b) => priceOf(b) - priceOf(a) },
];

export default function ProductGrid({ initialProducts }: { initialProducts?: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const allProducts = initialProducts && initialProducts.length > 0 ? initialProducts : PRODUCTS;

  const cat = params.get("danh-muc") ?? "";
  const q = params.get("q") ?? "";
  const purpose = params.get("muc-dich") ?? "";
  const price = params.get("gia") ?? "";
  const rating = params.get("sao") ?? "";
  const sort = params.get("sap-xep") ?? "";

  const hrefWith = (patch: Record<string, string>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) v ? sp.set(k, v) : sp.delete(k);
    const s = sp.toString();
    return s ? `${pathname}?${s}` : pathname;
  };
  const set = (patch: Record<string, string>) => router.replace(hrefWith(patch), { scroll: false });

  const list = useMemo(() => {
    const k = fold(q.trim());
    const pr = PRICES.find((x) => x.value === price);
    const minStars = Number(rating) || 0;
    const cmp = (SORTS.find((s) => s.value === sort) ?? SORTS[0]).cmp;
    return allProducts.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!k || fold(`${p.name} ${p.kind} ${p.note} ${p.desc}`).includes(k)) &&
        (!purpose || p.purposes.includes(purpose as Product["purposes"][number])) &&
        (!pr || pr.test(priceOf(p))) &&
        p.rating >= minStars,
    ).sort(cmp);
  }, [allProducts, cat, q, purpose, price, rating, sort]);

  const category = getCategory(cat);
  type Active = { label: string; clear: Record<string, string> };
  const active: Active[] = [];
  if (q) active.push({ label: `“${q}”`, clear: { q: "" } });
  if (purpose) active.push({ label: PURPOSES.find((x) => x.value === purpose)?.label ?? purpose, clear: { "muc-dich": "" } });
  if (price) active.push({ label: PRICES.find((x) => x.value === price)?.label ?? price, clear: { gia: "" } });
  if (rating) active.push({ label: `Từ ${rating} sao`, clear: { sao: "" } });

  const filters = (
    <>
      <PillGroup legend="Mục đích" options={PURPOSES} value={purpose} onChange={(v) => set({ "muc-dich": v })} />
      <PillGroup legend="Khoảng giá (gói 150g)" options={PRICES} value={price} onChange={(v) => set({ gia: v })} />
      <PillGroup legend="Đánh giá" options={["4.8", "4.5"].map((x) => ({ value: x, label: `Từ ${x} sao` }))} value={rating} onChange={(v) => set({ sao: v })} />
    </>
  );

  const filtering = Boolean(cat || q || purpose || price || rating);
  const featured = [...allProducts].filter((p) => p.active !== false).sort((a, b) => b.sold - a.sold)[0];

  return (
    <div className="lt-container" style={{ paddingTop: 8, paddingBottom: 80 }}>
      {!filtering && featured && <FeaturedProduct p={featured} />}

      <header className="lt-collection-head">
        <span>Bộ sưu tập Lam Trà</span>
        <h1>{category ? category.name : "Sản phẩm Lam Trà"}</h1>
        <p>{category ? category.desc : "Trà Tân Cương, Thái Nguyên hái tay, sao chảo gang, cùng những hộp quà gửi trao tấm lòng."}</p>
      </header>

      <div role="navigation" aria-label="Lọc theo danh mục" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 0 20px", scrollbarWidth: "none", justifyContent: "safe center" }}>
        <Link href={hrefWith({ "danh-muc": "" })} style={chip(!cat)}>Tất cả</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={hrefWith({ "danh-muc": c.slug })} style={chip(cat === c.slug)}>{c.name}</Link>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "0 0 16px", borderBottom: "1px solid var(--border-hairline)", marginBottom: 28, fontSize: 14, color: "var(--text-muted)" }}>
        <span style={{ flex: "1 1 260px" }}>
          {list.length} sản phẩm{category ? ` trong ${category.name}` : ""}
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button type="button" className="lt-tool-btn" aria-haspopup="dialog" onClick={() => setOpen(true)}>
            <Icon name="sliders-horizontal" size={16} />
            Bộ lọc
            {active.length > 0 && <span className="lt-tool-count">{active.length}</span>}
          </button>
          <SortMenu value={sort} options={SORTS.map((s) => ({ value: s.value, label: s.label }))} onChange={(v) => set({ "sap-xep": v })} />
        </div>
      </div>

      {active.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "-12px 0 24px" }}>
          {active.map((a) => (
            <button key={a.label} type="button" onClick={() => set(a.clear)} style={{ ...chip(false), cursor: "pointer", gap: 6, fontFamily: "inherit", background: "var(--surface-card)" }}>
              {a.label}
              <Icon name="x" size={14} />
            </button>
          ))}
          <button type="button" onClick={() => set({ q: "", "muc-dich": "", gia: "", sao: "" })} style={{ border: 0, background: "transparent", color: "var(--text-link)", fontFamily: "inherit", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
            Xóa bộ lọc
          </button>
        </div>
      )}

      {list.length === 0 ? (
        <div style={{ padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-body)" }}>Chưa có loại trà phù hợp với lựa chọn của bạn. Bạn thử bỏ bớt bộ lọc, hoặc nhắn Zalo để Lam Trà tư vấn.</p>
          <Button variant="secondary" href="/san-pham">Xem tất cả trà</Button>
        </div>
      ) : (
        <BuyGrid products={list} />
      )}

      <FilterSheet
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" className="lt-sheet-reset" onClick={() => set({ "muc-dich": "", gia: "", sao: "" })}>
              <Icon name="rotate-ccw" size={15} />
              Xóa lọc
            </button>
            <button type="button" className="lt-sheet-apply" onClick={() => setOpen(false)}>
              Xem {list.length} sản phẩm
            </button>
          </>
        }
      >
        {filters}
      </FilterSheet>
    </div>
  );
}
