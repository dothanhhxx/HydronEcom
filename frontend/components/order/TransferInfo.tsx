"use client";

import { useEffect, useRef, useState } from "react";
import { CopyButton, Icon, formatVND } from "@/components/ds";
import { SITE, vietQrImage } from "@/lib/site";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Lưu ảnh QR về máy dưới dạng PNG. VietQR trả về SVG (app ngân hàng không đọc được SVG từ thư viện ảnh),
 * nên SVG được vẽ lên canvas nền trắng rồi xuất PNG. Ảnh PNG/JPG của shop thì lưu nguyên bản.
 */
async function saveQrImage(src: string, filename: string) {
  const res = await fetch(src, { mode: "cors" });
  if (!res.ok) throw new Error(`QR ${res.status}`);
  const blob = await res.blob();
  if (/png|jpe?g|webp/.test(blob.type)) return triggerDownload(blob, filename);

  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = 1200 / Math.max(img.naturalWidth || 1, img.naturalHeight || 1);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round((img.naturalWidth || 1200) * scale);
    canvas.height = Math.round((img.naturalHeight || 1200) * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/png"));
    if (!png) throw new Error("toBlob");
    triggerDownload(png, filename);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function QrDownloadButton({ src, filename }: { src: string; filename: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    if (state === "busy") return;
    setState("busy");
    try {
      await saveQrImage(src, filename);
      setState("done");
      timer.current = setTimeout(() => setState("idle"), 1800);
    } catch {
      // Không tải được (mạng, trình duyệt chặn): mở ảnh ở tab mới để khách tự lưu.
      window.open(src, "_blank", "noopener");
      setState("idle");
    }
  };

  const label = state === "done" ? "Đã lưu mã QR" : "Tải mã QR về máy";
  return (
    <button type="button" className="lt-qr-save" data-state={state} onClick={onClick} aria-label={label} title={label} aria-busy={state === "busy"}>
      <Icon name={state === "done" ? "check" : "download"} size={15} />
      <span className="lt-sr" aria-live="polite">{state === "done" ? "Đã lưu mã QR" : ""}</span>
    </button>
  );
}

/**
 * QR + thông tin chuyển khoản. Ưu tiên ảnh QR của chủ shop (SITE.bank.qrImage);
 * nếu chưa có file thì tạo mã VietQR có sẵn số tiền và nội dung.
 */
export default function TransferInfo({ amount, code }: { amount: number; code?: string }) {
  const [useOwn, setUseOwn] = useState(!!SITE.bank.qrImage);
  // Mã VietQR tự tạo đã điền sẵn số tiền + nội dung; ảnh QR tĩnh thì khách phải tự nhập.
  const prefilled = !useOwn;
  const src = useOwn ? SITE.bank.qrImage : vietQrImage(amount, code ?? "");
  const rows: { k: string; v: string; copy?: string; strong?: boolean }[] = [
    { k: "Ngân hàng", v: SITE.bank.bankName },
    { k: "Số tài khoản", v: SITE.bank.account, copy: SITE.bank.account },
    { k: "Chủ tài khoản", v: SITE.bank.holder },
    { k: "Số tiền", v: formatVND(amount), copy: String(amount), strong: true },
    { k: "Nội dung", v: code ?? "…", copy: code, strong: true },
  ];

  return (
    <section aria-labelledby="ck-title" style={{ display: "flex", flexDirection: "column", gap: 14, padding: 16, borderRadius: "var(--radius-md)", background: "var(--primary-soft)", border: "1px solid var(--reu-200)" }}>
      <h3 id="ck-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 500, color: "var(--primary)" }}>
        <Icon name="qr-code" size={18} />
        Thông tin chuyển khoản
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "stretch" }}>
        <figure style={{ flex: "0 0 auto", width: 160, boxSizing: "border-box", margin: "0 auto", padding: 8, background: "var(--surface-raised)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-hairline)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ position: "relative", display: "block" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={src}
              src={src}
              alt={`Mã QR chuyển khoản tới ${SITE.bank.bankName} ${SITE.bank.account}`}
              width={144}
              height={144}
              onError={() => setUseOwn(false)}
              style={{ display: "block", width: 144, height: 144, objectFit: "contain" }}
            />
            <QrDownloadButton src={src} filename={`lam-tra-qr-${code || "thanh-toan"}.png`} />
          </span>
          <figcaption style={{ fontSize: 11, lineHeight: 1.35, textAlign: "center", color: "var(--text-muted)" }}>Quét bằng app ngân hàng</figcaption>
        </figure>
        <dl style={{ flex: "1 1 260px", minWidth: 0, margin: 0, padding: "4px 12px", background: "var(--surface-raised)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-hairline)", fontSize: 13 }}>
          {rows.map((r, i) => (
            <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 36, borderTop: i ? "1px solid var(--border-hairline)" : 0 }}>
              <dt style={{ flex: "0 0 88px", color: "var(--text-muted)" }}>{r.k}</dt>
              <dd style={{ flex: 1, minWidth: 0, margin: 0, fontWeight: r.strong ? 700 : 500, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums", overflowWrap: "break-word" }}>{r.v}</dd>
              {r.copy && <CopyButton text={r.copy} label="Chép" />}
            </div>
          ))}
        </dl>
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--text-body)" }}>
        {prefilled
          ? "Số tiền và nội dung đã điền sẵn trong mã QR."
          : <>Bạn nhập đúng <strong>số tiền</strong> và ghi <strong>{code ?? "mã đơn"}</strong> ở nội dung chuyển khoản.</>}{" "}
        Lam Trà đối soát và xác nhận đơn qua Zalo trong vòng {SITE.confirmWithin}.
      </p>
    </section>
  );
}
