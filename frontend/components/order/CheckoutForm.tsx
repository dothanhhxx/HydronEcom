"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button, Choice, Icon, Input, Panel, Select, Skeleton, formatVND } from "@/components/ds";
import { postJSON } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { EXPRESS_FEE, GIFT_WRAP_FEE, GIFT_WRAP_FREE_MIN, PROVINCES, SHIPPING_DAYS, newOrderCode, quote, regionOf, validateOrder, type Order, type OrderInput, type Payment } from "@/lib/checkout";
import { saveAddress, saveLocalOrder, savedAddresses, type SavedAddress } from "@/lib/orders-store";
import { SITE } from "@/lib/site";
import { ItemRow, Totals } from "./Summary";
import TransferInfo from "./TransferInfo";

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 28, marginBottom: 28, borderBottom: "1px solid var(--border-hairline)" }}>
      <h2 style={{ margin: 0, display: "flex", alignItems: "center", gap: 12, fontSize: 18, fontWeight: 500, color: "var(--text-strong)" }}>
        <span style={{ width: 28, height: 28, borderRadius: 999, background: "var(--primary)", color: "var(--text-on-primary)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const two = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 } as const;

export default function CheckoutForm() {
  const router = useRouter();
  const { items, lines, ready, coupon, clear } = useCart();
  const [book, setBook] = useState<SavedAddress[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [toOther, setToOther] = useState(false);
  const [rName, setRName] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [province, setProvince] = useState("");
  const [address, setAddress] = useState("");
  const [express, setExpress] = useState(false);
  const [wrap, setWrap] = useState(false);
  const [message, setMessage] = useState("");
  const [hidePrice, setHidePrice] = useState(false);
  const [payment, setPayment] = useState<Payment>("vietqr");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  // Mã đơn tạo trước để khách ghi vào nội dung chuyển khoản ngay trên trang này.
  const [code, setCode] = useState<string>();
  useEffect(() => setCode(newOrderCode()), []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [failure, setFailure] = useState<string>();
  const [tried, setTried] = useState(false);

  const fill = (a: SavedAddress) => {
    setName(a.name);
    setPhone(a.phone);
    setEmail(a.email ?? "");
    setProvince(a.province);
    setAddress(a.address);
  };
  useEffect(() => {
    const b = savedAddresses();
    setBook(b);
    if (b[0]) fill(b[0]);
  }, []);

  // Đơn có hộp quà thì mặc định bật gói quà.
  useEffect(() => {
    if (items.some((i) => i.slug === "hop-qua-trao-gui")) setWrap(true);
  }, [items]);

  const q = useMemo(() => quote({ items, coupon, province, express, giftWrap: wrap }), [items, coupon, province, express, wrap]);
  const region = regionOf(province);

  const input = (): OrderInput => ({
    code,
    lines,
    buyer: { name, phone, email: email || undefined },
    recipient: toOther ? { name: rName, phone: rPhone } : undefined,
    province,
    address,
    express,
    gift: wrap || hidePrice || message ? { wrap, message: wrap ? message || undefined : undefined, hidePrice } : undefined,
    payment,
    coupon: coupon || undefined,
    note: note || undefined,
  });

  // Sau lần bấm đặt hàng đầu tiên, kiểm tra lại ngay khi khách sửa để lỗi cũ tự mất.
  useEffect(() => {
    if (tried) setErrors(validateOrder(input()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tried, name, phone, email, toOther, rName, rPhone, province, address, message, payment, note, lines]);

  const submit = async () => {
    setFailure(undefined);
    setTried(true);
    const data = input();
    const errs = validateOrder(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setBusy(true);
    const r = await postJSON<{ order: Order }>("/api/orders", { ...data, website });
    setBusy(false);
    if (!r.ok) {
      if (r.errors) setErrors(r.errors);
      setFailure(r.error ?? "Lam Trà chưa nhận được đơn. Bạn kiểm tra lại thông tin, hoặc nhắn Zalo để đặt trực tiếp.");
      return;
    }
    const order = r.data.order;
    saveLocalOrder(order);
    saveAddress({ name, phone, email: email || undefined, province, address });
    setPlaced(true);
    clear();
    router.replace(`/dat-hang-thanh-cong?ma=${order.code}`);
  };

  if (!ready || placed)
    return (
      <div className="lt-container" style={{ paddingTop: "16px", paddingBottom: "80px", display: "flex", flexDirection: "column", gap: 14, maxWidth: 640 }}>
        <Skeleton h={28} w="40%" />
        <Skeleton h={48} />
        <Skeleton h={48} />
        <Skeleton h={48} />
      </div>
    );

  if (!items.length)
    return (
      <div className="lt-container" style={{ paddingTop: "16px", paddingBottom: "80px" }}>
        <Panel style={{ padding: "32px 28px", maxWidth: 560, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>Giỏ hàng đang trống nên chưa thể đặt hàng.</p>
          <Button href="/san-pham" iconRight="arrow-right">Chọn trà</Button>
        </Panel>
      </div>
    );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="lt-container"
      style={{ paddingTop: "8px", paddingBottom: "80px", display: "flex", flexWrap: "wrap", gap: "32px clamp(28px,4vw,56px)", alignItems: "flex-start" }}
    >
      <div style={{ flex: "1 1 480px", minWidth: 0 }}>
        <Step n={1} title="Người đặt hàng">
          {book.length > 1 && (
            <Select aria-label="Chọn địa chỉ đã dùng" placeholder="Dùng thông tin đã lưu…" value="" onChange={(e) => e.target.value && fill(book[Number(e.target.value)])} options={book.map((a, i) => ({ value: String(i), label: `${a.name} · ${a.phone} · ${a.province}` }))} />
          )}
          <div style={two}>
            <Input label="Họ và tên" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors["buyer.name"]} />
            <Input label="Số điện thoại" required type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors["buyer.phone"]} hint="Lam Trà xác nhận đơn qua Zalo số này." />
          </div>
          <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors["buyer.email"]} hint="Không bắt buộc. Để nhận hóa đơn và cập nhật đơn." />
          {/* Bẫy bot: người thật không nhìn thấy ô này */}
          <input tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} name="website" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
        </Step>

        <Step n={2} title="Giao tới">
          <Choice type="checkbox" checked={toOther} onChange={setToOther} icon="gift" title="Gửi tặng: giao tới người nhận khác" desc="Lam Trà gọi người nhận trước khi giao. Bạn vẫn nhận tin nhắn cập nhật đơn." />
          {toOther && (
            <div style={two}>
              <Input label="Tên người nhận" required value={rName} onChange={(e) => setRName(e.target.value)} error={errors["recipient.name"]} />
              <Input label="SĐT người nhận" required type="tel" inputMode="tel" value={rPhone} onChange={(e) => setRPhone(e.target.value)} error={errors["recipient.phone"]} />
            </div>
          )}
          <Select label="Tỉnh, thành phố" required placeholder="Chọn tỉnh, thành phố" value={province} onChange={(e) => setProvince(e.target.value)} error={errors.province} options={PROVINCES.map((p) => ({ value: p.name, label: p.name }))} />
          <Input label="Địa chỉ" required autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} error={errors.address} placeholder="Số nhà, đường, phường/xã" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Choice name="ship" checked={!express} onChange={() => setExpress(false)} title="Giao tiêu chuẩn" desc={region ? `Dự kiến ${SHIPPING_DAYS[region]}` : "1 – 5 ngày tùy tỉnh"} aside={q.shipping === 0 && !express ? "Miễn phí" : undefined} />
            <Choice name="ship" checked={express} onChange={() => setExpress(true)} title="Giao nhanh" desc="Ưu tiên đóng gói trong ngày, giao sớm hơn 1 ngày" aside={`+${formatVND(EXPRESS_FEE)}`} />
          </div>
        </Step>

        <Step n={3} title="Gói quà và lời nhắn">
          <Choice
            type="checkbox"
            checked={wrap}
            onChange={setWrap}
            icon="gift"
            title="Gói quà kèm thiệp viết tay"
            desc={`Giấy dó, dây lạt, thiệp Lam Trà. Miễn phí cho đơn từ ${formatVND(GIFT_WRAP_FREE_MIN)}.`}
            aside={q.subtotal >= GIFT_WRAP_FREE_MIN ? "Miễn phí" : `+${formatVND(GIFT_WRAP_FEE)}`}
          />
          {wrap && (
            <Input label="Lời nhắn trên thiệp" textarea rows={3} maxLength={300} value={message} onChange={(e) => setMessage(e.target.value)} error={errors["gift.message"]} hint={`${message.length}/300 · Lam Trà viết tay đúng như bạn ghi.`} placeholder="Kính chúc bố mẹ năm mới mạnh khỏe…" />
          )}
          <Choice type="checkbox" checked={hidePrice} onChange={setHidePrice} title="Không kèm hóa đơn, ẩn giá trong gói hàng" desc="Phù hợp khi gửi biếu. Hóa đơn vẫn gửi riêng cho bạn qua Zalo/email." />
        </Step>

        <Step n={4} title="Thanh toán">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Choice name="pay" checked={payment === "vietqr"} onChange={() => setPayment("vietqr")} icon="qr-code" title="Chuyển khoản ngân hàng" desc={`Quét mã QR ở phần tóm tắt đơn. Lam Trà xác nhận trong vòng ${SITE.confirmWithin} sau khi nhận tiền.`} />
            <Choice name="pay" checked={payment === "cod"} onChange={() => setPayment("cod")} icon="banknote" title="Thanh toán khi nhận hàng (COD)" desc={toOther && hidePrice ? "Người nhận sẽ phải trả tiền. Với quà biếu, bạn nên chọn chuyển khoản." : "Trả tiền mặt cho người giao hàng."} />
          </div>
          {errors.payment && <span style={{ fontSize: 12, color: "var(--danger)" }}>{errors.payment}</span>}
          <Input label="Ghi chú cho Lam Trà" textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} error={errors.note} placeholder="Giờ nhận hàng, xuất hóa đơn công ty…" />
        </Step>
      </div>

      <aside style={{ flex: "1 1 320px", maxWidth: 440, minWidth: 0, position: "sticky", top: 88 }}>
        <Panel style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: "var(--text-strong)" }}>Đơn hàng ({items.length})</h2>
            <Link href="/gio-hang" style={{ fontSize: 13 }}>Sửa giỏ</Link>
          </div>
          <div style={{ marginTop: -12 }}>
            {items.map((it) => (
              <ItemRow key={it.key} item={it} link={false} />
            ))}
          </div>
          <Totals q={q} />
          {payment === "vietqr" && <TransferInfo amount={q.total} code={code} />}
          {errors.lines && <span style={{ fontSize: 13, color: "var(--danger)" }}>{errors.lines}</span>}
          {failure && (
            <div role="alert" style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.5, color: "var(--danger)" }}>
              <Icon name="triangle-alert" size={18} />
              {failure}
            </div>
          )}
          <Button type="submit" size="lg" fullWidth disabled={busy} iconRight={busy ? undefined : "arrow-right"}>
            {busy ? "Đang gửi đơn…" : "Xác nhận đặt hàng"}
          </Button>
          <span style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text-muted)" }}>
            Bấm đặt hàng là bạn đồng ý với <Link href="/chinh-sach#dieu-khoan">điều khoản</Link> và <Link href="/chinh-sach#bao-mat">chính sách bảo mật</Link> của Lam Trà.
          </span>
        </Panel>
      </aside>
    </form>
  );
}
