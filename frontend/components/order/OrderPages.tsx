"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Icon, Input, Panel, Skeleton, formatVND } from "@/components/ds";
import { ProductGridList } from "@/components/catalog/ProductCard";
import { useCart } from "@/lib/cart";
import { ORDER_STEPS, formatDateTime, isPhone, normalizePhone, type Order } from "@/lib/checkout";
import { RESET_DAYS, clearCurrentUser, currentUser, historyResetAt, localOrder, localOrders, removeAddress, savedAddresses, setCurrentUser, sweepHistories, type SavedAddress } from "@/lib/orders-store";
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

/** Trạng thái theo cách khách hiểu: đơn đang ở đâu, không phải mã nội bộ. */
const STATUS_TEXT: Record<number, { label: string; tone: "neutral" | "new" | "accent" | "success" | "sale" }> = {
  0: { label: "Chờ xác nhận", tone: "neutral" },
  1: { label: "Đang chuẩn bị hàng", tone: "new" },
  2: { label: "Đang trên đường giao", tone: "accent" },
  3: { label: "Đã giao", tone: "success" },
  [-1]: { label: "Đã hủy", tone: "sale" },
};

/** Thanh 4 nấc gọn cho từng dòng đơn; chữ trạng thái nằm ở Badge, thanh này chỉ minh họa. */
function MiniTrack({ status }: { status: number }) {
  return (
    <span aria-hidden style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, width: "100%", maxWidth: 240 }}>
      {ORDER_STEPS.map((s, i) => (
        <span key={s} style={{ height: 4, borderRadius: 2, background: status >= i ? "var(--primary)" : "var(--border-strong)" }} />
      ))}
    </span>
  );
}

function OrderRow({ order, onOpen, rowRef }: { order: Order; onOpen: () => void; rowRef: (el: HTMLButtonElement | null) => void }) {
  const st = STATUS_TEXT[order.status] ?? STATUS_TEXT[0];
  const qty = order.items.reduce((n, i) => n + i.qty, 0);
  return (
    <li style={{ borderBottom: "1px solid var(--border-hairline)" }}>
      <button ref={rowRef} type="button" onClick={onOpen} className="hd-order-row" aria-label={`Xem đơn ${order.code}, ${st.label}`}>
        <span style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, flex: "1 1 auto" }}>
          <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
            <strong style={{ fontSize: 16, fontWeight: 700, letterSpacing: ".04em", color: "var(--text-strong)" }}>{order.code}</strong>
            <Badge tone={st.tone}>{st.label}</Badge>
          </span>
          <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--text-body)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {qty} sản phẩm: {order.items.map((i) => i.name).join(", ")}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Đặt lúc {formatDateTime(order.createdAt)}</span>
          {order.status >= 0 && <MiniTrack status={order.status} />}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, flex: "none", fontSize: 15, fontWeight: 500, color: "var(--text-strong)" }}>
          {formatVND(order.totals.total)}
          <Icon name="chevron-right" size={18} color="var(--text-muted)" />
        </span>
      </button>
    </li>
  );
}

const fetchJSON = async <T,>(url: string): Promise<T | undefined> => {
  try {
    const r = await fetch(url);
    return r.ok ? ((await r.json()) as T) : undefined;
  } catch {
    return undefined; // mất mạng: nơi gọi tự thử dữ liệu trên máy
  }
};

/** /tra-cuu-don: không cần đăng nhập. Tra bằng SĐT (xem danh sách đơn) hoặc mã đơn + SĐT (xem đủ chi tiết). */
export function OrderLookup() {
  const params = useSearchParams();
  const [mode, setMode] = useState<"phone" | "code">(params.get("ma") ? "code" : "phone");
  const [code, setCode] = useState(params.get("ma") ?? "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<Order>();
  const [list, setList] = useState<{ phone: string; orders: Order[] }>();
  const [openIdx, setOpenIdx] = useState<number>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const backRef = useRef<HTMLDivElement>(null);
  const lastOpened = useRef<number | undefined>(undefined);

  // Mở đơn: đưa focus tới nút quay lại; quay lại: trả focus về đúng dòng vừa mở.
  useEffect(() => {
    if (openIdx !== undefined) backRef.current?.querySelector("button")?.focus();
    else if (lastOpened.current !== undefined) rows.current[lastOpened.current]?.focus();
  }, [openIdx]);

  const switchMode = (m: "phone" | "code") => {
    setMode(m);
    setError(undefined);
  };

  const findByPhone = async () => {
    if (!isPhone(phone)) return setError("Số điện thoại chưa đúng, ví dụ 0912 345 678.");
    setError(undefined);
    setBusy(true);
    const p = normalizePhone(phone);
    const data = await fetchJSON<{ orders: Order[] }>(`/api/orders/by-phone?sdt=${encodeURIComponent(p)}`);
    const orders = data?.orders ?? localOrders(p);
    setBusy(false);
    setOpenIdx(undefined);
    lastOpened.current = undefined;
    setList({ phone: p, orders });
    if (!data && orders.length === 0) setError("Chưa tải được danh sách đơn. Bạn kiểm tra kết nối rồi thử lại, hoặc nhắn Zalo để Hydron tra giúp.");
  };

  const findByCode = async () => {
    const c = code.trim().toUpperCase();
    if (!c) return setError("Bạn nhập mã đơn, ví dụ HDAB12CD.");
    if (!isPhone(phone)) return setError("Số điện thoại chưa đúng, ví dụ 0912 345 678.");
    setError(undefined);
    setBusy(true);
    const p = normalizePhone(phone);
    let found = (await fetchJSON<{ order: Order }>(`/api/orders?ma=${encodeURIComponent(c)}&sdt=${encodeURIComponent(p)}`))?.order;
    if (!found) {
      const local = localOrder(c);
      if (local && (local.buyer.phone === p || local.recipient?.phone === p)) found = local;
    }
    setBusy(false);
    setOrder(found);
    if (!found) setError("Không tìm thấy đơn với mã và số điện thoại này. Bạn kiểm tra lại, hoặc nhắn Zalo để Hydron tra giúp.");
  };

  const phoneInput = (
    <Input label="Số điện thoại đặt hàng" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912 345 678" />
  );
  const opened = list && openIdx !== undefined ? list.orders[openIdx] : undefined;
  const active = list?.orders.filter((o) => o.status === 1 || o.status === 2).length ?? 0;

  return (
    <div className="lt-container" style={{ paddingTop: "8px", paddingBottom: "80px", maxWidth: 900, display: "flex", flexDirection: "column", gap: 28 }}>
      <div role="group" aria-label="Cách tra cứu" className="hd-seg">
        <button type="button" aria-pressed={mode === "phone"} onClick={() => switchMode("phone")}>
          <Icon name="phone" size={16} /> Bằng số điện thoại
        </button>
        <button type="button" aria-pressed={mode === "code"} onClick={() => switchMode("code")}>
          <Icon name="receipt" size={16} /> Bằng mã đơn
        </button>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (mode === "phone") findByPhone(); else findByCode(); }}
        style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }}
      >
        {mode === "code" && (
          <div style={{ flex: "1 1 200px" }}>
            <Input label="Mã đơn" value={code} onChange={(e) => setCode(e.target.value)} placeholder="HDAB12CD" style={{ textTransform: "uppercase" }} />
          </div>
        )}
        <div style={{ flex: "1 1 220px" }}>{phoneInput}</div>
        <Button type="submit" disabled={busy} iconLeft="search" style={{ marginTop: 25, height: 48 }}>
          {busy ? "Đang tìm…" : mode === "phone" ? "Xem đơn của số này" : "Tra cứu"}
        </Button>
      </form>

      {error && (
        <div role="alert" style={{ display: "flex", gap: 8, fontSize: 14, color: "var(--danger)" }}>
          <Icon name="info" size={18} />
          <span>{error} <a href={zaloLink()}>Nhắn Zalo</a></span>
        </div>
      )}

      {mode === "code" && order && <OrderView key={order.code} order={order} />}

      {mode === "phone" && list && (
        opened ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div ref={backRef} style={{ alignSelf: "flex-start" }}>
              <Button variant="ghost" size="sm" iconLeft="arrow-left" onClick={() => setOpenIdx(undefined)}>
                Tất cả đơn của số {list.phone}
              </Button>
            </div>
            <OrderView key={`${openIdx}-${opened.code}`} order={opened} />
          </div>
        ) : list.orders.length === 0 ? (
          !error && (
            <Panel style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
              <p role="status" style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
                Chưa có đơn nào đặt bằng số {list.phone}. Nếu bạn đặt bằng số khác hoặc nhờ người khác đặt giúp, thử lại với số đó.
              </p>
              <Button variant="secondary" href={zaloLink()} iconLeft="message-circle">Nhắn Zalo để Hydron tra giúp</Button>
            </Panel>
          )
        ) : (
          <section aria-labelledby="order-list-title" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h2 id="order-list-title" style={{ margin: 0, fontSize: 18, fontWeight: 500, color: "var(--text-strong)" }}>
              {list.orders.length} đơn đặt bằng số {list.phone}
            </h2>
            <p role="status" style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>
              {active > 0 ? `${active} đơn đang được xử lý hoặc giao. ` : ""}Chọn một đơn để xem đang ở bước nào.
            </p>
            <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, borderTop: "1px solid var(--border-hairline)" }}>
              {list.orders.map((o, i) => (
                <OrderRow
                  key={`${i}-${o.code}`}
                  order={o}
                  rowRef={(el) => { rows.current[i] = el; }}
                  onOpen={() => { lastOpened.current = i; setOpenIdx(i); }}
                />
              ))}
            </ul>
          </section>
        )
      )}
    </div>
  );
}

/** /tai-khoan: tạm dùng dữ liệu trên thiết bị cho tới khi có đăng nhập (GĐ3). */
export function AccountPage() {
  const { wishlist, addMany } = useCart();
  const [orders, setOrders] = useState<Order[]>();
  const [book, setBook] = useState<SavedAddress[]>([]);
  const [user, setUser] = useState("");
  const [resetAt, setResetAt] = useState<Date>();
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState<string>();

  const load = () => {
    const u = currentUser();
    setUser(u);
    setOrders(localOrders(u));
    setResetAt(historyResetAt(u));
  };
  useEffect(() => {
    sweepHistories();
    load();
    setBook(savedAddresses());
  }, []);

  const switchUser = () => {
    if (!isPhone(phoneInput)) return setPhoneError("Số điện thoại chưa đúng, ví dụ 0912 345 678.");
    setPhoneError(undefined);
    setCurrentUser(phoneInput);
    setPhoneInput("");
    load();
  };
  const signOut = () => {
    clearCurrentUser();
    load();
  };

  const h2 = { margin: "0 0 16px", fontSize: 20, fontWeight: 500, color: "var(--text-strong)" } as const;

  return (
    <div className="lt-container" style={{ paddingTop: "8px", paddingBottom: "80px", display: "flex", flexDirection: "column", gap: 48 }}>
      <Panel tone="info" style={{ padding: "16px 20px", display: "flex", gap: 12, fontSize: 14, lineHeight: 1.6 }}>
        <Icon name="info" size={20} color="var(--primary)" />
        <span>
          Bạn không cần tài khoản để mua hàng. Trang này lưu đơn hàng (riêng theo từng số điện thoại, tự làm mới sau mỗi 3 ngày), địa chỉ và sản phẩm yêu thích ngay trên điện thoại hoặc máy tính bạn đang dùng.
          Để xem đơn đặt từ máy khác, bạn dùng <Link href="/tra-cuu-don">tra cứu đơn</Link>.
        </span>
      </Panel>

      <section>
        <h2 style={h2}>Lịch sử mua hàng</h2>
        {user ? (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16, fontSize: 14, color: "var(--text-body)" }}>
            <span>
              Số điện thoại: <strong style={{ fontWeight: 500, color: "var(--text-strong)" }}>{user}</strong>
              {resetAt ? ` · Lịch sử tự làm mới lúc ${formatDateTime(resetAt.toISOString())}` : ` · Lịch sử tự làm mới sau mỗi ${RESET_DAYS} ngày`}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>Không phải bạn?</Button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); switchUser(); }} style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start", marginBottom: 16, maxWidth: 560 }}>
            <div style={{ flex: "1 1 220px" }}>
              <Input label="Số điện thoại đặt hàng" type="tel" inputMode="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} error={phoneError} hint={`Mỗi số điện thoại có lịch sử riêng, tự làm mới sau mỗi ${RESET_DAYS} ngày.`} />
            </div>
            <Button type="submit" style={{ marginTop: 25, height: 48 }}>Xem lịch sử</Button>
          </form>
        )}
        {orders === undefined ? (
          <Loading />
        ) : !user ? null : orders.length === 0 ? (
          <p style={{ margin: 0, fontSize: 15, color: "var(--text-body)" }}>Chưa có đơn nào trong {RESET_DAYS} ngày gần đây. <Link href="/san-pham">Chọn bình</Link></p>
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
                  <span style={{ fontSize: 13, color: "var(--primary)" }}>{o.status < 0 ? "Đã hủy" : ORDER_STEPS[o.status as 0 | 1 | 2 | 3]}</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="ghost" size="sm" href={`/dat-hang-thanh-cong?ma=${o.code}`}>Chi tiết</Button>
                  <Button variant="secondary" size="sm" iconLeft="repeat" onClick={() => addMany(o.items.map(({ slug, size, color, qty, custom }) => ({ slug, size, color, qty, custom })))}>Mua lại</Button>
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
        <h2 style={h2}>Sản phẩm yêu thích ({wishlist.length})</h2>
        <Link href="/yeu-thich">Xem danh sách yêu thích</Link>
      </section>
    </div>
  );
}

/** /yeu-thich */
export function WishlistPage() {
  const { wishlist, ready, products } = useCart();
  const list = products.filter((p) => wishlist.includes(p.slug));
  return (
    <div className="lt-container" style={{ paddingTop: "8px", paddingBottom: "80px" }}>
      {!ready ? (
        <Loading />
      ) : list.length === 0 ? (
        <Panel style={{ padding: "32px 28px", maxWidth: 560, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <Icon name="heart" size={28} color="var(--accent)" />
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>Bạn chưa lưu sản phẩm nào. Bấm biểu tượng trái tim trên ảnh sản phẩm để lưu lại và quay lại sau.</p>
          <Button href="/san-pham" iconRight="arrow-right">Xem các mẫu bình</Button>
        </Panel>
      ) : (
        <ProductGridList products={list} />
      )}
    </div>
  );
}
