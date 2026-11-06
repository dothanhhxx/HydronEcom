"use client";

// Chat hỗ trợ nhanh: trả lời tự động các câu hay gặp, chuyển sang Zalo / Messenger / gọi điện khi cần người thật.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, formatVND } from "@/components/ds";
import { CUSTOM_LEAD_TIME, EXPRESS_FEE, FREE_SHIP_MIN, SHIPPING_FEE } from "@/lib/checkout";
import { CUSTOM_STICKER_FEE, CUSTOM_TEXT_FEE, CUSTOM_TEXT_MAX } from "@/lib/products";
import { SITE, telLink, zaloLink } from "@/lib/site";
import { fold } from "@/lib/text";

type Msg = { from: "bot" | "me"; text: string; link?: { href: string; label: string } };

const ANSWERS: { keys: string[]; text: string; link?: Msg["link"] }[] = [
  {
    keys: ["dung tich", "size", "500", "700", "900", "chon co", "bao nhieu ml", "ml"],
    text: "500ml hợp đi học, để túi xách. 700ml đủ cho một ngày làm việc. 900ml cho phòng gym, đi phượt hoặc dùng chung. Bảng kích thước chi tiết có ở trang từng sản phẩm.",
    link: { href: "/san-pham?danh-muc=binh", label: "Xem các mẫu bình" },
  },
  {
    keys: ["in ten", "khac", "custom", "thiet ke", "3d", "sticker", "in so", "logo"],
    text: `In tên hoặc số (tối đa ${CUSTOM_TEXT_MAX} ký tự) thêm ${formatVND(CUSTOM_TEXT_FEE)}, sticker thêm ${formatVND(CUSTOM_STICKER_FEE)}. Bạn xem trước trên mô hình 3D rồi mới đặt. Đơn in riêng cần thêm ${CUSTOM_LEAD_TIME} để in.`,
    link: { href: "/thiet-ke-3d", label: "Mở trình thiết kế 3D" },
  },
  {
    keys: ["gia", "bao nhieu tien", "re", "khuyen mai", "giam", "ma", "coupon", "voucher"],
    text: "Bình Hydron từ 150.000₫ (500ml) đến 190.000₫ (900ml). Đơn đầu tiên nhập mã HYDRON10 để giảm 10%.",
    link: { href: "/san-pham", label: "Xem bảng giá" },
  },
  {
    keys: ["ship", "giao", "van chuyen", "bao lau", "may ngay", "phi"],
    text: `Hà Nội ${formatVND(SHIPPING_FEE["noi-tinh"])}, giao 1 ngày. Tỉnh khác từ ${formatVND(SHIPPING_FEE.bac)}, 1 – 5 ngày. Miễn phí cho đơn từ ${formatVND(FREE_SHIP_MIN)}. Cần gấp: chọn giao nhanh +${formatVND(EXPRESS_FEE)}.`,
  },
  {
    keys: ["doi", "tra", "hoan", "bao hanh", "loi", "hong", "mat nhiet"],
    text: "Đổi trả trong 7 ngày nếu bình lỗi hoặc giao sai. Bảo hành lớp chân không 12 tháng: bình mất giữ nhiệt được đổi mới. Bình đã in tên riêng chỉ đổi khi lỗi từ Hydron.",
    link: { href: "/chinh-sach#doi-tra", label: "Đọc chính sách" },
  },
  {
    keys: ["thanh toan", "chuyen khoan", "cod", "qr", "tra tien"],
    text: "Bạn chọn chuyển khoản qua mã VietQR (hiện ngay ở bước đặt hàng) hoặc trả tiền mặt khi nhận hàng (COD).",
  },
  {
    keys: ["don hang", "tra cuu", "kiem tra don", "ma don"],
    text: "Bạn nhập mã đơn (bắt đầu bằng HD) và số điện thoại đặt hàng để xem trạng thái.",
    link: { href: "/tra-cuu-don", label: "Tra cứu đơn" },
  },
  {
    keys: ["giu nhiet", "giu lanh", "nong", "lanh", "da", "bao lau lanh"],
    text: "Lõi thép 304 hai lớp hút chân không: giữ lạnh đến 24 giờ, giữ nóng đến 12 giờ. Tráng nước nóng 1 phút trước khi rót đồ uống nóng để giữ lâu hơn.",
  },
  {
    keys: ["rua", "ve sinh", "may rua bat", "bao quan"],
    text: "Rửa bằng nước ấm và cọ mềm, tháo gioăng silicon rửa mỗi tuần. Không dùng máy rửa bát, lò vi sóng hay ngăn đá.",
  },
  {
    keys: ["si", "so luong lon", "cong ty", "doanh nghiep", "qua tang", "su kien"],
    text: "Hydron nhận in logo công ty, tên từng nhân viên cho đơn từ 20 bình. Bạn để lại yêu cầu, Hydron báo giá trong một ngày làm việc.",
    link: { href: "/lien-he#dat-so-luong", label: "Gửi yêu cầu báo giá" },
  },
];

const QUICK = ["Chọn dung tích nào?", "Phí in tên bao nhiêu?", "Bao lâu nhận hàng?", "Đổi trả thế nào?"];

function answer(q: string): Msg {
  const k = fold(q);
  let best: (typeof ANSWERS)[number] | undefined;
  let score = 0;
  for (const a of ANSWERS) {
    const s = a.keys.reduce((n, key) => n + (k.includes(key) ? key.length : 0), 0);
    if (s > score) {
      score = s;
      best = a;
    }
  }
  if (best) return { from: "bot", text: best.text, link: best.link };
  return { from: "bot", text: `Câu này Hydron cần người trả lời. Bạn nhắn Zalo ${SITE.phone} (${SITE.hours}) nhé.`, link: { href: zaloLink(), label: "Nhắn Zalo" } };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [log, setLog] = useState<Msg[]>([{ from: "bot", text: "Chào bạn, mình là trợ lý Hydron. Bạn cần hỏi về dung tích, in tên, giao hàng hay đổi trả?" }]);
  const end = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [log, open]);
  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    setLog((l) => [...l, { from: "me", text }, answer(text)]);
    setDraft("");
  };

  return (
    <>
      {open && (
        <section className="hd-chat" role="dialog" aria-label="Trò chuyện với Hydron">
          <header className="hd-chat-head">
            <span style={{ width: 36, height: 36, borderRadius: 999, background: "var(--blue-500)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
              <Icon name="message-circle" size={18} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <strong>Hỏi Hydron</strong>
              <span>Trả lời tự động · người thật qua Zalo</span>
            </span>
            <button type="button" className="hd-icon-btn" aria-label="Đóng trò chuyện" onClick={() => setOpen(false)} style={{ color: "var(--cream-100)" }}>
              <Icon name="x" size={20} />
            </button>
          </header>
          <div className="hd-chat-log" aria-live="polite">
            {log.map((m, i) => (
              <div key={i} className={`hd-msg ${m.from === "bot" ? "hd-msg-bot" : "hd-msg-me"}`}>
                {m.text}
                {m.link && (
                  <span style={{ display: "block", marginTop: 6 }}>
                    {m.link.href.startsWith("http") ? (
                      <a href={m.link.href} target="_blank" rel="noopener noreferrer">{m.link.label} →</a>
                    ) : (
                      <Link href={m.link.href} onClick={() => setOpen(false)}>{m.link.label} →</Link>
                    )}
                  </span>
                )}
              </div>
            ))}
            <div ref={end} />
          </div>
          <div className="hd-chat-quick">
            {QUICK.map((q) => (
              <button key={q} type="button" onClick={() => ask(q)}>{q}</button>
            ))}
          </div>
          <form className="hd-chat-form" onSubmit={(e) => { e.preventDefault(); ask(draft); }}>
            <input ref={input} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Nhập câu hỏi…" aria-label="Câu hỏi của bạn" />
            <button type="submit" className="hd-btn hd-btn-primary" style={{ minHeight: 44, width: 44, padding: 0, borderRadius: 999 }} aria-label="Gửi">
              <Icon name="arrow-right" size={18} />
            </button>
          </form>
          <nav className="hd-chat-links" aria-label="Liên hệ trực tiếp">
            <a href={zaloLink()} target="_blank" rel="noopener noreferrer"><Icon name="zalo" size={16} />Zalo</a>
            <a href={SITE.messenger} target="_blank" rel="noopener noreferrer"><Icon name="message-circle" size={16} />Messenger</a>
            <a href={telLink()}><Icon name="phone" size={16} />Gọi</a>
          </nav>
        </section>
      )}
      <button type="button" className="hd-chat-fab" aria-expanded={open} aria-label={open ? "Đóng trò chuyện" : "Hỏi Hydron"} onClick={() => setOpen((o) => !o)}>
        <Icon name={open ? "x" : "message-circle"} size={22} />
        <span>{open ? "Đóng" : "Hỏi Hydron"}</span>
      </button>
    </>
  );
}
