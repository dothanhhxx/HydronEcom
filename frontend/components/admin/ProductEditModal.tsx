"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, Icon } from "@/components/ds";
import { fold } from "@/lib/text";
import type { Category, Product, Spec } from "@/shared";
import { CATEGORIES, OCCASIONS, PURPOSES, photo } from "@/lib/products";

const DEFAULT_SPECS: Spec[] = [
  { label: "Vùng trồng", value: "Tân Cương, Thái Nguyên" },
  { label: "Mùa hái", value: "Vụ xuân, tháng 3 – 5" },
  { label: "Chế biến", value: "Sao tay chảo gang truyền thống" },
  { label: "Hương vị", value: "Hương cốm non dịu, tiền chát hậu ngọt sâu" },
  { label: "Màu nước", value: "Xanh vàng trong, sánh" },
  { label: "Hạn dùng", value: "12 tháng kể từ ngày đóng gói" },
  { label: "Bảo quản", value: "Giữ trong túi zip hoặc hũ kín, để nơi khô mát" },
];

export function ProductEditModal({
  product,
  open,
  onClose,
  onSaved,
}: {
  product: Product | null; // null = tạo mới, có object = chỉnh sửa
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEditing = !!product;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("tra-xanh");
  const [kind, setKind] = useState("Trà xanh");
  const [note, setNote] = useState("");
  const [base, setBase] = useState<number | string>(180000);
  const [compareAt, setCompareAt] = useState<number | string>("");
  const [fixed, setFixed] = useState(false);
  const [origin, setOrigin] = useState("Tân Cương · Thái Nguyên");
  const [ph, setPh] = useState("moccau");
  const [desc, setDesc] = useState("");
  const [active, setActive] = useState(true);

  // File upload state & ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageTab, setImageTab] = useState<"upload" | "library">("upload");

  // Brew guide
  const [temp, setTemp] = useState("80 – 85°C");
  const [amount, setAmount] = useState("5g cho ấm 150ml");
  const [time, setTime] = useState("Tráng trà, hãm 20 – 30 giây");
  const [infusions, setInfusions] = useState("4 – 5 nước");
  const [tip, setTip] = useState("Không dùng nước sôi già để giữ hương cốm non.");

  // Purposes & Occasions
  const [purposes, setPurposes] = useState<string[]>(["hang-ngay"]);
  const [occasions, setOccasions] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file hình ảnh (JPG, PNG, WebP...).");
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.ok && data.url) {
        setPh(data.url);
      } else {
        // Fallback to data URL
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setPh(ev.target.result as string);
          }
        };
        reader.readAsDataURL(file);
        if (data.error) {
          setError(`Lưu ý: Tải lên server (${data.error}), ảnh đã được lưu tạm trực tiếp.`);
        }
      }
    } catch {
      // Fallback to data URL
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPh(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSlug(product.slug || "");
      setCategory(product.category || "tra-xanh");
      setKind(product.kind || "Trà xanh");
      setNote(product.note || "");
      setBase(product.base || 0);
      setCompareAt(product.compareAt || "");
      setFixed(!!product.fixed);
      setOrigin(product.origin || "Tân Cương · Thái Nguyên");
      setPh(product.ph || "moccau");
      setDesc(product.desc || "");
      setActive(product.active !== false);

      if (product.brew) {
        setTemp(product.brew.temp || "");
        setAmount(product.brew.amount || "");
        setTime(product.brew.time || "");
        setInfusions(product.brew.infusions || "");
        setTip(product.brew.tip || "");
      }

      setPurposes(product.purposes || ["hang-ngay"]);
      setOccasions(product.occasions || []);
    } else {
      // Reset form cho tạo mới
      setName("");
      setSlug("");
      setCategory("tra-xanh");
      setKind("Trà xanh");
      setNote("");
      setBase(200000);
      setCompareAt("");
      setFixed(false);
      setOrigin("Tân Cương · Thái Nguyên");
      setPh("moccau");
      setDesc("");
      setActive(true);
      setTemp("80 – 85°C");
      setAmount("5g cho ấm 150ml");
      setTime("Tráng trà, hãm 25 giây");
      setInfusions("4 – 5 nước");
      setTip("Nước sau tăng thêm 10 giây hãm.");
      setPurposes(["hang-ngay"]);
      setOccasions([]);
    }
    setError(null);
  }, [product, open]);

  // Tự động tạo slug khi gõ tên sản phẩm (nếu đang ở chế độ tạo mới)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generated = fold(val)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const handlePurposeToggle = (val: string) => {
    setPurposes((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
  };

  const handleOccasionToggle = (val: string) => {
    setOccasions((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!slug.trim()) {
      setError("Vui lòng nhập mã đường dẫn (slug).");
      return;
    }
    const numBase = Number(base);
    if (isNaN(numBase) || numBase <= 0) {
      setError("Giá bán cơ sở phải là số lớn hơn 0.");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Product> & { currentSlug?: string } = {
        name: name.trim(),
        slug: slug.trim(),
        category,
        kind,
        note: note.trim(),
        base: numBase,
        compareAt: compareAt ? Number(compareAt) : undefined,
        fixed,
        origin: origin.trim(),
        ph,
        desc: desc.trim(),
        active,
        purposes: purposes as Product["purposes"],
        occasions: occasions as Product["occasions"],
        brew: { temp, amount, time, infusions, tip },
        specs: product?.specs?.length ? product.specs : DEFAULT_SPECS,
      };

      let res: Response;
      if (isEditing) {
        payload.currentSlug = product.slug;
        res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Có lỗi xảy ra khi lưu sản phẩm.");
        setSaving(false);
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError("Lỗi kết nối máy chủ khi lưu sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  const photoOptions = [
    { value: "moccau", label: "Trà Móc Câu (moccau)" },
    { value: "nontom", label: "Trà Nõn Tôm (nontom)" },
    { value: "sen", label: "Trà Đinh Sen (sen)" },
    { value: "dinhth", label: "Đinh Thượng Hạng (dinhth)" },
    { value: "hopqua", label: "Hộp quà biếu (hopqua)" },
    { value: "hero", label: "Đồi chè Tân Cương (hero)" },
  ];

  return (
    <Dialog open={open} onClose={onClose} title={isEditing ? `Sửa sản phẩm: ${product.name}` : "Thêm sản phẩm mới"} maxWidth={740}>
      <form onSubmit={handleSubmit} style={{ padding: "14px 16px 20px", display: "flex", flexDirection: "column", gap: 16, fontFamily: "var(--font-ui)", boxSizing: "border-box" }}>
        {error && (
          <div style={{ padding: "10px 14px", borderRadius: 6, background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", fontSize: 13, fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Section 1: Thông tin cơ bản */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Tên sản phẩm *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Trà Shan Tuyết Cổ Thụ"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13.5 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Mã đường dẫn (Slug) *
            </label>
            <input
              type="text"
              required
              placeholder="VD: tra-shan-tuyet-co-thu"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13.5, background: "#FAF8F5" }}
            />
          </div>
        </div>

        {/* Section 2: Danh mục, Loại trà, Nguồn gốc */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Danh mục
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                const c = CATEGORIES.find((x) => x.slug === e.target.value);
                if (c) setKind(c.name);
              }}
              style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13.5, background: "#FFFFFF" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Tên loại trà
            </label>
            <input
              type="text"
              placeholder="VD: Trà xanh, Trà sen, Quà tặng"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13.5 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Xuất xứ
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13.5 }}
            />
          </div>
        </div>

        {/* Section 3: Giá bán & Tuỳ chọn */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, background: "#FAF8F5", padding: "14px 16px", borderRadius: 8, border: "1px solid #E5E7EB" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Giá bán cơ sở (VND) *
            </label>
            <input
              type="number"
              step={1000}
              required
              placeholder="VD: 250000"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 14, fontWeight: 700, color: "#0D2219" }}
            />
            <span style={{ fontSize: 11.5, color: "#6B7280" }}>Giá cho gói 150g (hoặc cả hộp nếu giá cố định)</span>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Giá niêm yết cũ / Gốc (VND)
            </label>
            <input
              type="number"
              step={1000}
              placeholder="Để trống nếu không giảm giá"
              value={compareAt}
              onChange={(e) => setCompareAt(e.target.value)}
              style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 14 }}
            />
            <span style={{ fontSize: 11.5, color: "#6B7280" }}>Hiện gạch ngang tạo cảm giác ưu đãi</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", cursor: "pointer" }}>
              <input type="checkbox" checked={fixed} onChange={(e) => setFixed(e.target.checked)} />
              <span>Giá cố định (không chọn khối lượng 150g/300g/500g)</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#047857", fontWeight: 600, cursor: "pointer" }}>
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              <span>Mở bán hiển thị ra website</span>
            </label>
          </div>
        </div>

        {/* Section 4: Câu tóm tắt & Ảnh đại diện */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
              Câu tóm tắt đặc trưng (Note)
            </label>
            <input
              type="text"
              placeholder="VD: Hương cốm non, chát dịu, hậu ngọt"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: "100%", height: 38, padding: "0 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13.5 }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgb(55, 65, 81)", marginBottom: 5 }}>
              Ảnh sản phẩm
            </label>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#FAF8F5", padding: "10px 14px", borderRadius: 8, border: "1px solid #E5E7EB" }}>
              {/* Preview Thumbnail */}
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 6,
                  border: "1.5px solid rgba(188, 154, 108, 0.5)",
                  background: "#FFFFFF",
                  backgroundImage: `url('${photo(ph)}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {uploadingImage && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 11, textAlign: "center", padding: 2 }}>
                    Đang tải...
                  </div>
                )}
              </div>

              {/* Upload & Choose controls */}
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      borderRadius: 6,
                      border: "1.2px solid #0D2219",
                      background: "#0D2219",
                      color: "#F7F0E3",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      transition: "all 150ms ease",
                    }}
                  >
                    <Icon name="upload" size={14} />
                    <span>{uploadingImage ? "Đang lưu ảnh..." : "Tự tải ảnh từ máy lên"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageTab(imageTab === "library" ? "upload" : "library")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: "1px solid #D1D5DB",
                      background: imageTab === "library" ? "#E5E7EB" : "#FFFFFF",
                      color: "#374151",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {imageTab === "library" ? "Đóng mẫu" : "Chọn ảnh mẫu có sẵn"}
                  </button>
                </div>

                {imageTab === "library" ? (
                  <select
                    value={ph.startsWith("/uploads/") || ph.startsWith("data:") ? "" : ph}
                    onChange={(e) => {
                      if (e.target.value) setPh(e.target.value);
                    }}
                    style={{ width: "100%", height: 32, padding: "0 8px", borderRadius: 5, border: "1px solid #D1D5DB", fontSize: 12, background: "#FFFFFF", marginTop: 2 }}
                  >
                    <option value="" disabled>-- Chọn ảnh mẫu có sẵn --</option>
                    {photoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div style={{ fontSize: 11.5, color: "#6B7280", wordBreak: "break-all" }}>
                    {ph?.startsWith("/uploads/") ? (
                      <span style={{ color: "#047857", fontWeight: 600 }}>✓ File đã tải lên: {ph}</span>
                    ) : ph?.startsWith("data:") ? (
                      <span style={{ color: "#047857", fontWeight: 600 }}>✓ Đã chọn ảnh từ thiết bị</span>
                    ) : (
                      <span>Ảnh đang dùng: <code>{ph}</code> (hỗ trợ JPG, PNG, WebP)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Mô tả câu chuyện sản phẩm */}
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
            Mô tả chi tiết sản phẩm
          </label>
          <textarea
            rows={3}
            placeholder="Kể về búp trà, quy trình sao chảo gang hoặc cảm giác khi nhấp ngụm đầu..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13.5, lineHeight: 1.5 }}
          />
        </div>

        {/* Section 6: Hướng dẫn pha trà */}
        <div style={{ background: "#F9FAFB", padding: "14px 16px", borderRadius: 8, border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 10 }}>🍵 Hướng dẫn cách pha chuẩn:</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            <div>
              <span style={{ fontSize: 12, color: "#6B7280" }}>Nhiệt độ nước:</span>
              <input
                type="text"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                style={{ width: "100%", height: 34, padding: "0 8px", borderRadius: 4, border: "1px solid #D1D5DB", fontSize: 12.5 }}
              />
            </div>
            <div>
              <span style={{ fontSize: 12, color: "#6B7280" }}>Lượng trà:</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ width: "100%", height: 34, padding: "0 8px", borderRadius: 4, border: "1px solid #D1D5DB", fontSize: 12.5 }}
              />
            </div>
            <div>
              <span style={{ fontSize: 12, color: "#6B7280" }}>Thời gian hãm:</span>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ width: "100%", height: 34, padding: "0 8px", borderRadius: 4, border: "1px solid #D1D5DB", fontSize: 12.5 }}
              />
            </div>
            <div>
              <span style={{ fontSize: 12, color: "#6B7280" }}>Số lần châm nước:</span>
              <input
                type="text"
                value={infusions}
                onChange={(e) => setInfusions(e.target.value)}
                style={{ width: "100%", height: 34, padding: "0 8px", borderRadius: 4, border: "1px solid #D1D5DB", fontSize: 12.5 }}
              />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 12, color: "#6B7280" }}>Mẹo pha ngon:</span>
            <input
              type="text"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              style={{ width: "100%", height: 34, padding: "0 8px", borderRadius: 4, border: "1px solid #D1D5DB", fontSize: 12.5 }}
            />
          </div>
        </div>

        {/* Section 7: Mục đích & Dịp tặng */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Mục đích sử dụng:
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PURPOSES.map((p) => {
                const checked = purposes.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handlePurposeToggle(p.value)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      border: `1px solid ${checked ? "#0D2219" : "#D1D5DB"}`,
                      background: checked ? "#0D2219" : "#FFFFFF",
                      color: checked ? "#FFFFFF" : "#4B5563",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Dịp biếu tặng phù hợp:
            </label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {OCCASIONS.map((o) => {
                const checked = occasions.includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => handleOccasionToggle(o.value)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 999,
                      border: `1px solid ${checked ? "#047857" : "#D1D5DB"}`,
                      background: checked ? "#ECFDF5" : "#FFFFFF",
                      color: checked ? "#047857" : "#4B5563",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons - Sticky bottom footer */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            padding: "12px 16px",
            background: "#FFFFFF",
            borderTop: "1px solid #E5E7EB",
            margin: "12px -16px -20px",
            boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{
              height: 42,
              padding: "0 18px",
              borderRadius: 6,
              border: "1px solid #D1D5DB",
              background: "#FFFFFF",
              color: "#374151",
              fontSize: 13.5,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              height: 42,
              padding: "0 22px",
              borderRadius: 6,
              border: 0,
              background: "#0D2219",
              color: "#FFFFFF",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {saving ? "Đang lưu..." : isEditing ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
