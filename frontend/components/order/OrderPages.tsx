"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Icon, Input, Panel, Skeleton, formatVND } from "@/components/ds";
import { TeaGrid } from "@/components/catalog/TeaCard";
import { useCart } from "@/lib/cart";
import { ORDER_STEPS, formatDateTime, isPhone, normalizePhone, type Order } from "@/lib/checkout";
import { localOrder, localOrders, removeAddress, savedAddresses, type SavedAddress } from "@/lib/orders-store";
import { PRODUCTS } from "@/lib/products";
import { zaloLink } from "@/lib/site";
import OrderView from "./OrderView";

const Loading = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <Skeleton h={32} w="50%" />
    <Skeleton h={120} />
    <Skeleton h={200} />
  </div>
);

/** /dat-hang-thanh-cong?ma=… */
export function OrderSuccess() {
  const code = useSearchParams().get("ma") ?? "";
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => setOrder(localOrder(code) ?? null), [code]);
  return (
    <div className="lt-container" style={{ paddingTop: "32px", paddingBottom: "80px", maxWidth: 900 }}>
      {order === undefined ? (
        <Loading />
      ) : order ? (
        <OrderView order={order} fresh />
      ) : (
        <Panel style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>Không tìm thấy đơn {code} trên thiết bị này. Bạn tra cứu bằng mã đơn và số điện thoại nhé.</p>
          <Button href="/tra-cuu-don">Tra cứu đơn hàng</Button>
        </Panel>
      )}
    </div>
  );
}

/** /tra-cuu-don: không cần đăng nhập, chỉ cần mã đơn + SĐT. */
export function OrderLookup() {
  const params = useSearchParams();
  const [code, setCode] = useState(params.get("ma") ?? "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  const find = async () => {
    const c = code.trim().toUpperCase();
    if (!c) return setError("Bạn nhập mã đơn, ví dụ LTAB12CD.");
    if (!isPhone(phone)) return setError("Số điện thoại chưa đúng.");
    setError(undefined);
    setBusy(true);
    const p = normalizePhone(phone);
    let found: Order | undefined;
    try {
      const r = await fetch(`/api/orders?ma=${encodeURIComponent(c)}&sdt=${encodeURIComponent(p)}`);
      if (r.ok) found = (await r.json()).order;
    } catch {
      /* mất mạng: thử dữ liệu trên máy */
    }
    if (!found) {
      const local = localOrder(c);
      if (local && (local.buyer.phone === p || local.recipient?.phone === p)) found = local;
    }
    setBusy(false);
    setOrder(found);
    if (!found) setError("Không tìm thấy đơn với mã và số điện thoại này. Bạn kiểm tra lại, hoặc nhắn Zalo để Lam Trà tra giúp.");
  };

  return (
    <div className="lt-container" style={{ paddingTop: "8px", paddingBottom: "80px", maxWidth: 900, display: "flex", flexDirection: "column", gap: 32 }}>
      <form onSubmit={(e) => { e.preventDefault(); find(); }} style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 200px" }}>
          <Input label="Mã đơn" value={code} onChange={(e) => setCode(e.target.value)} placeholder="LTAB12CD" style={{ textTransform: "uppercase" }} />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <Input label="Số điện thoại đặt hàng" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <Button type="submit" disabled={busy} iconLeft="search" style={{ marginTop: 25, height: 48 }}>{busy ? "Đang tìm…" : "Tra cứu"}</Button>
      </form>
      {error && (
        <div role="alert" style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--danger)" }}>
          <Icon name="info" size={18} />
          <span>{error} <a href={zaloLink()}>Nhắn Zalo</a></span>
        </div>
      )}
      {order && <OrderView key={order.code} order={order} />}
    </div>
  );
}

/** /tai-khoan: tạm dùng dữ liệu trên thiết bị cho tới khi có đăng nhập (GĐ3). */
export function AccountPage() {
  const { wishlist, addMany } = useCart();
  const [orders, setOrders] = useState<Order[]>();
  const [book, setBook] = useState<SavedAddress[]>([]);
  useEffect(() => {
    setOrders(localOrders());
    setBook(savedAddresses());
  }, []);

  const h2 = { margin: "0 0 16px", fontSize: 20, fontWeight: 500, color: "var(--text-strong)" } as const;

  return (
    <div className="lt-container" style={{ paddingTop: "8px", paddingBottom: "80px", display: "flex", flexDirection: "column", gap: 48 }}>
      <Panel tone="info" style={{ padding: "16px 20px", display: "flex", gap: 12, fontSize: 14, lineHeight: 1.6 }}>
        <Icon name="info" size={20} color="var(--primary)" />
        <span>
          Bạn không cần tài khoản để mua trà. Trang này lưu đơn hàng, địa chỉ và trà yêu thích ngay trên điện thoại hoặc máy tính bạn đang dùng.
          Để xem đơn đặt từ máy khác, bạn dùng <Link href="/tra-cuu-don">tra cứu đơn</Link>.
        </span>
      </Panel>

      <section>
        <h2 style={h2}>Đơn hàng của bạn</h2>
        {orders === undefined ? (
          <Loading />
        ) : orders.length === 0 ? (
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-body)" }}>Chưa có đơn nào trên thiết bị này. <Link href="/san-pham">Chọn trà</Link></p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {orders.map((o) => (
              <div key={o.code} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 0", borderBottom: "1px solid var(--border-hairline)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text-strong)" }}>
                    {o.code} · {formatVND(o.totals.total)}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {formatDateTime(o.createdAt)} · {o.items.map((i) => i.name).join(", ")}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--primary)" }}>{o.status < 0 ? "Đã hủy" : ORDER_STEPS[o.status]}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="ghost" size="sm" href={`/dat-hang-thanh-cong?ma=${o.code}`}>Chi tiết</Button>
                  <Button variant="secondary" size="sm" iconLeft="repeat" onClick={() => addMany(o.items.map(({ slug, size, grade, qty }) => ({ slug, size, grade, qty })))}>Mua lại</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={h2}>Sổ địa chỉ</h2>
        {book.length === 0 ? (
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-body)" }}>Địa chỉ bạn dùng khi đặt hàng sẽ được lưu ở đây để lần sau điền nhanh.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {book.map((a, i) => (
              <Panel key={i} style={{ padding: 16, fontSize: 14, lineHeight: 1.55, display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>
                  <strong style={{ fontWeight: 500 }}>{a.name}</strong> · {a.phone}
                  <br />
                  {a.address}, {a.province}
                </span>
                <button type="button" aria-label="Xóa địa chỉ" onClick={() => { removeAddress(i); setBook(savedAddresses()); }} style={{ border: 0, background: "transparent", color: "var(--text-muted)", cursor: "pointer", alignSelf: "flex-start", padding: 4 }}>
                  <Icon name="trash-2" size={16} />
                </button>
              </Panel>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={h2}>Trà yêu thích ({wishlist.length})</h2>
        <Link href="/yeu-thich">Xem danh sách yêu thích</Link>
      </section>
    </div>
  );
}

/** /yeu-thich */
export function WishlistPage() {
  const { wishlist, ready } = useCart();
  const list = PRODUCTS.filter((p) => wishlist.includes(p.slug));
  return (
    <div className="lt-container" style={{ paddingTop: "8px", paddingBottom: "80px" }}>
      {!ready ? (
        <Loading />
      ) : list.length === 0 ? (
        <Panel style={{ padding: "32px 28px", maxWidth: 560, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <Icon name="heart" size={28} color="var(--accent)" />
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>Bạn chưa lưu loại trà nào. Bấm biểu tượng trái tim trên ảnh trà để lưu lại và quay lại sau.</p>
          <Button href="/san-pham" iconRight="arrow-right">Xem các loại trà</Button>
        </Panel>
      ) : (
        <TeaGrid products={list} />
      )}
    </div>
  );
}
