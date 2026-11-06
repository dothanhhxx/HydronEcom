"use client";

import { useState, type ReactNode } from "react";
import { Button, Icon, Input, Panel, Select } from "@/components/ds";
import { postJSON } from "@/lib/api";

type Field = { name: string; label: string; required?: boolean; type?: string; textarea?: boolean; placeholder?: string; hint?: string; options?: string[]; half?: boolean };

function MessageForm({ type, fields, submitLabel, done }: { type: string; fields: Field[]; submitLabel: string; done: ReactNode }) {
  const [v, setV] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string>();

  const submit = async () => {
    setBusy(true);
    setFailure(undefined);
    const r = await postJSON("/api/contact", { type, ...v });
    setBusy(false);
    if (r.ok) return setSent(true);
    setErrors(r.errors ?? {});
    if (!r.errors) setFailure(r.error ?? "Chưa gửi được, bạn thử lại hoặc nhắn Zalo nhé.");
  };

  if (sent)
    return (
      <Panel tone="info" style={{ padding: 20, display: "flex", gap: 12, fontSize: 15, lineHeight: 1.6 }}>
        <Icon name="circle-check" size={22} color="var(--primary)" />
        <span>{done}</span>
      </Panel>
    );

  const set = (k: string) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
      {fields.map((f) => {
        const common = { label: f.label, required: f.required, value: v[f.name] ?? "", error: errors[f.name], hint: f.hint, placeholder: f.placeholder };
        return (
          <div key={f.name} style={{ gridColumn: f.half ? undefined : "1 / -1" }}>
            {f.options ? (
              <Select {...common} onChange={set(f.name)} options={f.options.map((o) => ({ value: o, label: o }))} placeholder="Chọn…" />
            ) : (
              <Input {...common} type={f.type} textarea={f.textarea} onChange={set(f.name)} inputMode={f.type === "tel" ? "tel" : undefined} />
            )}
          </div>
        );
      })}
      <input tabIndex={-1} autoComplete="off" aria-hidden name="website" value={v.website ?? ""} onChange={set("website")} style={{ position: "absolute", left: -9999, opacity: 0, width: 1, height: 1 }} />
      <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
        {failure && <span role="alert" style={{ fontSize: 13, color: "var(--danger)" }}>{failure}</span>}
        <Button type="submit" disabled={busy} iconRight={busy ? undefined : "arrow-right"}>{busy ? "Đang gửi…" : submitLabel}</Button>
      </div>
    </form>
  );
}

export function ContactForm() {
  return (
    <MessageForm
      type="lien-he"
      submitLabel="Gửi tin nhắn"
      done="Lam Trà đã nhận tin nhắn của bạn và sẽ trả lời trong giờ làm việc, thường trong vài giờ."
      fields={[
        { name: "name", label: "Họ và tên", required: true, half: true },
        { name: "phone", label: "Số điện thoại", type: "tel", half: true, hint: "Hoặc để lại email bên dưới." },
        { name: "email", label: "Email", type: "email" },
        { name: "message", label: "Bạn cần Lam Trà giúp gì?", required: true, textarea: true, placeholder: "Tư vấn chọn trà, hỏi về đơn hàng, hợp tác…" },
      ]}
    />
  );
}

export function QuoteForm() {
  return (
    <MessageForm
      type="bao-gia"
      submitLabel="Nhận báo giá"
      done="Cảm ơn bạn. Lam Trà sẽ gửi báo giá và mẫu hộp trong vòng một ngày làm việc."
      fields={[
        { name: "name", label: "Người liên hệ", required: true, half: true },
        { name: "company", label: "Công ty", half: true },
        { name: "phone", label: "Số điện thoại", type: "tel", required: true, half: true },
        { name: "email", label: "Email", type: "email", half: true },
        { name: "quantity", label: "Số lượng dự kiến", half: true, options: ["10 – 30 hộp", "30 – 100 hộp", "100 – 300 hộp", "Trên 300 hộp"] },
        { name: "budget", label: "Ngân sách mỗi phần quà", half: true, options: ["Dưới 300.000₫", "300.000₫ – 600.000₫", "600.000₫ – 1.000.000₫", "Trên 1.000.000₫"] },
        { name: "date", label: "Ngày cần nhận hàng", type: "date", half: true },
        { name: "message", label: "Yêu cầu thêm", textarea: true, placeholder: "In logo công ty lên hộp, thiệp riêng, giao nhiều địa chỉ…" },
      ]}
    />
  );
}
