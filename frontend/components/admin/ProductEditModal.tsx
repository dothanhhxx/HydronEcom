"use client";

// Form thêm / sửa sản phẩm Hydron: dung tích + giá, màu, tồn kho theo biến thể, ảnh, thông số, bảo quản.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import BottleRender from "@/components/bottle/BottleRender";
import { Dialog, Icon } from "@/components/ds";
import { CATEGORIES, SIZE_DELTA } from "@/lib/products";
import { fold } from "@/lib/text";
import type { ColorOption, Product, Shape, Spec } from "@/shared";

const ALL_SIZES = ["500", "700", "900"];
const SHAPES: { value: Shape; label: string }[] = [
  { value: "classic", label: "Nắp vặn quai xách" },
  { value: "sport", label: "Nắp ống hút" },
  { value: "flip", label: "Nắp bật" },
  { value: "bag", label: "Túi" },
  { value: "strap", label: "Dây đeo" },
];
const DEFAULT_SPECS: Spec[] = [
  { label: "Lõi bình", value: "Thép không gỉ 304 hai lớp, hút chân không" },
  { label: "Lớp ngoài", value: "Sơn tĩnh điện nhám, chống trầy" },
  { label: "Giữ lạnh", value: "Đến 24 giờ" },
  { label: "Giữ nóng", value: "Đến 12 giờ" },
  { label: "Nắp", value: "" },
  { label: "Bảo hành", value: "12 tháng lớp chân không" },
];

const toSlug = (s: string) => fold(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const input: CSSProperties = { width: "100%", height: 40, padding: "0 12px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, fontFamily: "inherit", background: "#fff", boxSizing: "border-box" };
const label: CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 6 };
const smallBtn: CSSProperties = { display: "inline-flex", alignItems: "center", gap: 6, height: 34, padding: "0 12px", border: "1px solid #D1D5DB", borderRadius: 8, background: "#fff", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" };

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section style={{ padding: "18px 0", borderTop: "1px solid #F3F4F6" }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 14.5, fontWeight: 700, color: "#111827" }}>{title}</h3>
      {hint && <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#6B7280" }}>{hint}</p>}
      <div style={{ display: "grid", gap: 12, marginTop: hint ? 0 : 10 }}>{children}</div>
    </section>
  );
}

async function upload(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  try {
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await r.json();
    if (d.ok && d.url) return d.url;
  } catch {
    /* dùng ảnh nhúng bên dưới */
  }
  return await new Promise((ok) => {
    const reader = new FileReader();
    reader.onload = () => ok(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export function ProductEditModal({ product, open, onClose, onSaved }: { product: Product | null; open: boolean; onClose: () => void; onSaved: () => void }) {
  const isEditing = !!product;
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("binh");
  const [kind, setKind] = useState("");
  const [note, setNote] = useState("");
  const [shape, setShape] = useState<Shape>("classic");
  const [customizable, setCustomizable] = useState(true);
  const [active, setActive] = useState(true);
  const [isNew, setIsNew] = useState(true);
  const [sizes, setSizes] = useState<string[]>(["500", "700", "900"]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [base, setBase] = useState("150000");
  const [compareAt, setCompareAt] = useState("");
  const [colors, setColors] = useState<ColorOption[]>([{ id: "xanh-hydron", name: "Xanh Hydron", hex: "#0688AE" }]);
  const [stock, setStock] = useState<Record<string, string>>({});
  const [ph, setPh] = useState("");
  const [gallery, setGallery] = useState<{ ph: string; alt: string }[]>([]);
  const [video, setVideo] = useState("");
  const [desc, setDesc] = useState("");
  const [specs, setSpecs] = useState<Spec[]>(DEFAULT_SPECS);
  const [care, setCare] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mainFile = useRef<HTMLInputElement>(null);
  const galleryFile = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const p = product;
    setError(null);
    setName(p?.name ?? "");
    setSlug(p?.slug ?? "");
    setSku(p?.sku ?? "");
    setCategory(p?.category ?? "binh");
    setKind(p?.kind ?? "");
    setNote(p?.note ?? "");
    setShape(p?.shape ?? "classic");
    setCustomizable(p?.customizable ?? true);
    setActive(p?.active !== false);
    setIsNew(p?.isNew ?? !p);
    setSizes(p ? [...(p.sizes ?? [])] : ["500", "700", "900"]);
    setBase(String(p?.base ?? 150000));
    setPrices(Object.fromEntries(ALL_SIZES.map((s) => [s, p?.sizePrices?.[s] ? String(p.sizePrices[s]) : ""])));
    setCompareAt(p?.compareAt ? String(p.compareAt) : "");
    setColors(p?.colors?.length ? p.colors.map((c) => ({ ...c })) : [{ id: "xanh-hydron", name: "Xanh Hydron", hex: "#0688AE" }]);
    setStock(Object.fromEntries(Object.entries(p?.stock ?? {}).map(([k, v]) => [k, String(v)])));
    setPh(p?.ph ?? "");
    setGallery(p?.gallery ? p.gallery.map((g) => ({ ...g })) : []);
    setVideo(p?.video ?? "");
    setDesc(p?.desc ?? "");
    setSpecs(p?.specs?.length ? p.specs.map((s) => ({ ...s })) : DEFAULT_SPECS.map((s) => ({ ...s })));
    setCare((p?.care ?? []).join("\n"));
  }, [open, product]);

  const sizeKeys = category !== "binh" || !sizes.length ? ["-"] : ALL_SIZES.filter((s) => sizes.includes(s));
  const basePrice = Number(base) || 0;
  const priceFor = (s: string) => Number(prices[s]) || basePrice + (SIZE_DELTA[s] ?? 0);

  const save = async () => {
    setError(null);
    if (!name.trim()) return setError("Nhập tên sản phẩm.");
    const finalSlug = toSlug(slug || name);
    if (!finalSlug) return setError("Đường dẫn (slug) không hợp lệ.");
    if (!colors.length) return setError("Thêm ít nhất một màu.");
    if (colors.some((c) => !c.name.trim())) return setError("Màu nào cũng cần tên.");
    const usedSizes = category !== "binh" ? [] : ALL_SIZES.filter((s) => sizes.includes(s));
    const sizePrices = Object.fromEntries(usedSizes.filter((s) => Number(prices[s]) > 0).map((s) => [s, Number(prices[s])]));
    const lowest = usedSizes.length ? Math.min(...usedSizes.map(priceFor)) : basePrice;
    if (!(lowest > 0)) return setError("Giá phải lớn hơn 0.");
    const cleanColors = colors.map((c) => ({ id: c.id || toSlug(c.name), name: c.name.trim(), hex: c.hex }));
    const keys = new Set((usedSizes.length ? usedSizes : ["-"]).flatMap((s) => cleanColors.map((c) => `${s}|${c.id}`)));
    const cleanStock = Object.fromEntries(Object.entries(stock).filter(([k, v]) => keys.has(k) && v.trim() !== "" && !isNaN(Number(v))).map(([k, v]) => [k, Math.max(0, Math.floor(Number(v)))]));

    const payload: Partial<Product> & { currentSlug?: string } = {
      name: name.trim(),
      slug: finalSlug,
      sku: sku.trim() || undefined,
      category,
      kind: kind.trim() || (CATEGORIES.find((c) => c.slug === category)?.name ?? ""),
      note: note.trim(),
      shape,
      customizable: category !== "binh" ? false : customizable,
      active,
      isNew,
      sizes: usedSizes,
      sizePrices: Object.keys(sizePrices).length ? sizePrices : undefined,
      base: lowest,
      compareAt: Number(compareAt) > lowest ? Number(compareAt) : undefined,
      colors: cleanColors,
      stock: cleanStock,
      ph,
      gallery: gallery.filter((g) => g.ph),
      video: video.trim() || undefined,
      desc: desc.trim(),
      specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      care: care.split("\n").map((l) => l.trim()).filter(Boolean),
    };
    if (isEditing) payload.currentSlug = product!.slug;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", { method: isEditing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Không lưu được sản phẩm.");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lưu được sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  const previewHex = colors[0]?.hex ?? "#0688AE";

  return (
    <Dialog open={open} onClose={onClose} title={isEditing ? `Sửa: ${product?.name}` : "Thêm sản phẩm"} maxWidth={860}>
      <form onSubmit={(e) => { e.preventDefault(); save(); }} style={{ padding: "4px 20px 20px", fontFamily: "var(--font-ui)" }}>
        <Section title="Thông tin chính">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <label><span style={label}>Tên sản phẩm *</span><input style={input} value={name} onChange={(e) => { setName(e.target.value); if (!isEditing) setSlug(toSlug(e.target.value)); }} placeholder="VD: Hydron Classic" /></label>
            <label><span style={label}>Đường dẫn (slug)</span><input style={input} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="hydron-classic" /></label>
            <label><span style={label}>Mã SKU</span><input style={input} value={sku} onChange={(e) => setSku(e.target.value)} placeholder="HD-CLS" /></label>
            <label><span style={label}>Danh mục</span>
              <select style={input} value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
            <label><span style={label}>Loại (hiện trên thẻ)</span><input style={input} value={kind} onChange={(e) => setKind(e.target.value)} placeholder="Nắp vặn quai xách" /></label>
            <label><span style={label}>Kiểu dáng (ảnh dựng, 3D)</span>
              <select style={input} value={shape} onChange={(e) => setShape(e.target.value as Shape)}>
                {SHAPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>
          <label><span style={label}>Mô tả ngắn (một dòng)</span><input style={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mẫu bán chạy nhất, quai xách gập gọn" /></label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, fontSize: 13.5 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />Đang bán</label>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />Gắn nhãn “Mới”</label>
            {category === "binh" && <label style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={customizable} onChange={(e) => setCustomizable(e.target.checked)} />Cho tự thiết kế 3D (in tên, sticker)</label>}
          </div>
        </Section>

        <Section title="Dung tích và giá" hint="Để trống giá riêng thì tự tính: giá gốc + 20.000₫ (700ml) / + 40.000₫ (900ml).">
          {category === "binh" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
              {ALL_SIZES.map((s) => (
                <div key={s} style={{ padding: 12, border: "1px solid #E5E7EB", borderRadius: 10, background: sizes.includes(s) ? "#F0F9FC" : "#FAFAFA" }}>
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700, fontSize: 14 }}>
                    <input type="checkbox" checked={sizes.includes(s)} onChange={(e) => setSizes((cur) => (e.target.checked ? [...cur, s] : cur.filter((x) => x !== s)))} />
                    {s}ml
                  </label>
                  {sizes.includes(s) && (
                    <input style={{ ...input, marginTop: 8 }} inputMode="numeric" value={prices[s] ?? ""} onChange={(e) => setPrices((p) => ({ ...p, [s]: e.target.value.replace(/\D/g, "") }))} placeholder={`${priceFor(s).toLocaleString("vi-VN")}₫`} aria-label={`Giá ${s}ml`} />
                  )}
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <label><span style={label}>{category !== "binh" ? "Giá bán *" : "Giá gốc (dung tích nhỏ nhất) *"}</span><input style={input} inputMode="numeric" value={base} onChange={(e) => setBase(e.target.value.replace(/\D/g, ""))} /></label>
            <label><span style={label}>Giá trước giảm (để trống nếu không giảm)</span><input style={input} inputMode="numeric" value={compareAt} onChange={(e) => setCompareAt(e.target.value.replace(/\D/g, ""))} /></label>
          </div>
        </Section>

        <Section title="Màu" hint="Mã màu dùng để dựng ảnh và mô hình 3D khi chưa có ảnh chụp.">
          {colors.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "44px minmax(0, 1fr) 120px 36px", gap: 8, alignItems: "center" }}>
              <input type="color" value={c.hex} onChange={(e) => setColors((cs) => cs.map((x, j) => (j === i ? { ...x, hex: e.target.value.toUpperCase() } : x)))} style={{ width: 44, height: 40, padding: 2, border: "1px solid #D1D5DB", borderRadius: 8, background: "#fff" }} aria-label="Chọn mã màu" />
              <input style={input} value={c.name} onChange={(e) => setColors((cs) => cs.map((x, j) => (j === i ? { ...x, name: e.target.value, id: isEditing && product?.colors.some((pc) => pc.id === x.id) ? x.id : toSlug(e.target.value) } : x)))} placeholder="Tên màu" />
              <input style={input} value={c.hex} onChange={(e) => setColors((cs) => cs.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))} aria-label="Mã hex" />
              <button type="button" onClick={() => setColors((cs) => cs.filter((_, j) => j !== i))} style={{ ...smallBtn, padding: 0, width: 36, justifyContent: "center" }} aria-label={`Xóa màu ${c.name}`}><Icon name="trash-2" size={15} /></button>
            </div>
          ))}
          <div><button type="button" style={smallBtn} onClick={() => setColors((cs) => [...cs, { id: "", name: "", hex: "#888888" }])}><Icon name="plus" size={15} />Thêm màu</button></div>
        </Section>

        <Section title="Tồn kho" hint="Để trống = còn nhiều (không giới hạn). Nhập 0 = hết hàng.">
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", fontSize: 13, minWidth: 360 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "6px 10px 6px 0", color: "#6B7280" }}>Màu</th>
                  {sizeKeys.map((s) => <th key={s} style={{ padding: 6, color: "#6B7280" }}>{s === "-" ? "Số lượng" : `${s}ml`}</th>)}
                </tr>
              </thead>
              <tbody>
                {colors.map((c, i) => (
                  <tr key={i}>
                    <td style={{ padding: "4px 10px 4px 0", whiteSpace: "nowrap" }}><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 99, background: c.hex, marginRight: 6, verticalAlign: -1, border: "1px solid #0002" }} />{c.name || "(chưa đặt tên)"}</td>
                    {sizeKeys.map((s) => {
                      const k = `${s}|${c.id || toSlug(c.name)}`;
                      return (
                        <td key={s} style={{ padding: 4 }}>
                          <input style={{ ...input, width: 84, height: 34, textAlign: "center" }} inputMode="numeric" value={stock[k] ?? ""} onChange={(e) => setStock((st) => ({ ...st, [k]: e.target.value.replace(/\D/g, "") }))} placeholder="∞" aria-label={`Tồn kho ${c.name} ${s}`} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Ảnh và video" hint="Chưa có ảnh chụp thì website tự dựng ảnh theo màu. Ảnh phụ: ghi tên màu vào chú thích để ảnh đó hiện khi khách chọn màu.">
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 110, height: 136, borderRadius: 10, overflow: "hidden", background: "#FDF2DF", border: "1px solid #E5E7EB", flexShrink: 0 }}>
              {ph ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ph.startsWith("/") || ph.startsWith("http") || ph.startsWith("data:") ? ph : `/uploads/${ph}`} alt="Ảnh chính" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <BottleRender shape={shape} hex={previewHex} size={sizes.includes("700") ? "700" : sizes[0] ?? "700"} label="Ảnh dựng" />
              )}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <span style={label}>Ảnh chính (màu đầu tiên)</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" style={smallBtn} disabled={uploading} onClick={() => mainFile.current?.click()}><Icon name="upload" size={15} />{uploading ? "Đang tải…" : "Tải ảnh lên"}</button>
                {ph && <button type="button" style={smallBtn} onClick={() => setPh("")}>Dùng ảnh dựng</button>}
              </div>
              <input ref={mainFile} type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; setUploading(true); setPh(await upload(f)); setUploading(false); e.target.value = ""; }} />
            </div>
          </div>
          {gallery.map((g, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "56px minmax(0, 1fr) 36px", gap: 8, alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.ph.startsWith("/") || g.ph.startsWith("http") || g.ph.startsWith("data:") ? g.ph : `/uploads/${g.ph}`} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid #E5E7EB" }} />
              <input style={input} value={g.alt} onChange={(e) => setGallery((gs) => gs.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} placeholder="Chú thích, VD: Kem cát mặt sau" />
              <button type="button" style={{ ...smallBtn, padding: 0, width: 36, justifyContent: "center" }} onClick={() => setGallery((gs) => gs.filter((_, j) => j !== i))} aria-label="Xóa ảnh"><Icon name="trash-2" size={15} /></button>
            </div>
          ))}
          <div>
            <button type="button" style={smallBtn} disabled={uploading} onClick={() => galleryFile.current?.click()}><Icon name="image" size={15} />Thêm ảnh phụ</button>
            <input ref={galleryFile} type="file" accept="image/*" multiple hidden onChange={async (e) => { const files = Array.from(e.target.files ?? []); setUploading(true); for (const f of files) { const url = await upload(f); setGallery((gs) => [...gs, { ph: url, alt: "" }]); } setUploading(false); e.target.value = ""; }} />
          </div>
          <label><span style={label}>Video (link nhúng YouTube hoặc file .mp4)</span><input style={input} value={video} onChange={(e) => setVideo(e.target.value)} placeholder="https://www.youtube.com/embed/…" /></label>
        </Section>

        <Section title="Mô tả chi tiết">
          <textarea style={{ ...input, height: 110, padding: 12, resize: "vertical" }} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Chất liệu, cảm giác cầm, dùng khi nào…" />
        </Section>

        <Section title="Thông số kỹ thuật">
          {specs.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr) 36px", gap: 8 }}>
              <input style={input} value={s.label} onChange={(e) => setSpecs((ss) => ss.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} placeholder="Tên thông số" />
              <input style={input} value={s.value} onChange={(e) => setSpecs((ss) => ss.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} placeholder="Giá trị" />
              <button type="button" style={{ ...smallBtn, padding: 0, width: 36, justifyContent: "center" }} onClick={() => setSpecs((ss) => ss.filter((_, j) => j !== i))} aria-label="Xóa dòng"><Icon name="trash-2" size={15} /></button>
            </div>
          ))}
          <div><button type="button" style={smallBtn} onClick={() => setSpecs((ss) => [...ss, { label: "", value: "" }])}><Icon name="plus" size={15} />Thêm thông số</button></div>
        </Section>

        <Section title="Hướng dẫn sử dụng và bảo quản" hint="Mỗi dòng một ý.">
          <textarea style={{ ...input, height: 120, padding: 12, resize: "vertical" }} value={care} onChange={(e) => setCare(e.target.value)} />
        </Section>

        {error && <div role="alert" style={{ margin: "4px 0 12px", padding: "10px 12px", borderRadius: 8, background: "#FEF2F2", color: "#B91C1C", fontSize: 13.5 }}>{error}</div>}
        <div style={{ position: "sticky", bottom: 0, display: "flex", justifyContent: "flex-end", gap: 10, padding: "14px 0 0", background: "#fff", borderTop: "1px solid #F3F4F6" }}>
          <button type="button" style={{ ...smallBtn, height: 42, padding: "0 18px" }} onClick={onClose}>Hủy</button>
          <button type="submit" disabled={saving} style={{ ...smallBtn, height: 42, padding: "0 20px", background: "#05708F", borderColor: "#05708F", color: "#fff" }}>{saving ? "Đang lưu…" : isEditing ? "Lưu thay đổi" : "Thêm sản phẩm"}</button>
        </div>
      </form>
    </Dialog>
  );
}
