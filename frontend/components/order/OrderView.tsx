"use client";

import { useState } from "react";
import { Badge, Button, CopyButton, Icon, OrderTracker, Panel } from "@/components/ds";
import { postJSON } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { formatDateTime, type Order } from "@/lib/checkout";
import { patchLocalOrder } from "@/lib/orders-store";
import { SITE, zaloLink } from "@/lib/site";
import { ItemRow, Totals } from "./Summary";
import TransferInfo from "./TransferInfo";

function PayBlock({ order, onClaimed }: { order: Order; onClaimed: (at: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const claim = async () => {
    setBusy(true);
    const r = await postJSON<{ paidClaimedAt: string }>("/api/orders", { code: order.code, phone: order.buyer.phone }, "PATCH");
    setBusy(false);
    if (r.ok) onClaimed(r.data.paidClaimedAt);
    else setError(r.error ?? "Chưa gửi được. Bạn nhắn Zalo kèm ảnh chuyển khoản giúp Lam Trà nhé.");
  };
  return (
    <Panel style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <TransferInfo amount={order.totals.total} code={order.code} />
      {order.paidClaimedAt ? (
        <div role="status" style={{ display: "flex", gap: 8, fontSize: 14, lineHeight: 1.5, color: "var(--success)" }}>
          <Icon name="circle-check" size={18} />
          Bạn đã báo chuyển khoản lúc {formatDateTime(order.paidClaimedAt)}. Lam Trà sẽ đối soát và xác nhận qua Zalo trong vòng {SITE.confirmWithin}.
        </div>
      ) : (
        <Button onClick={claim} disabled={busy} iconLeft="check">{busy ? "Đang gửi…" : "Tôi đã chuyển khoản"}</Button>
      )}
      {error && <span role="alert" style={{ fontSize: 13, color: "var(--danger)" }}>{error}</span>}
    </Panel>
  );
}

export default function OrderView({ order: initial, fresh }: { order: Order; fresh?: boolean }) {
  const [order, setOrder] = useState(initial);
  const { addMany } = useCart();
  const cancelled = order.status < 0;
  const showQr = order.payment === "vietqr" && order.status === 0;
  const to = order.recipient ?? order.buyer;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {fresh && (
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Icon name="circle-check" size={36} color="var(--success)" />
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(24px,3vw,32px)", lineHeight: 1.25, fontWeight: 500, color: "var(--text-strong)" }}>Cảm ơn bạn, Lam Trà đã nhận đơn</h1>
            <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--text-body)" }}>
              Lam Trà sẽ xác nhận và nhắn tin qua Zalo số {order.buyer.phone} trong vòng {SITE.confirmWithin} (8:00 – 21:00).
              {order.payment === "vietqr" ? (order.paidClaimedAt ? "" : " Nếu chưa chuyển khoản, bạn quét mã bên dưới để đơn được đóng gói ngay.") : ""}
            </p>
          </div>
        </div>
      )}

      <Panel style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Mã đơn</span>
            <strong style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".04em", color: "var(--text-strong)" }}>{order.code}</strong>
            <CopyButton text={order.code} />
          </div>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Đặt lúc {formatDateTime(order.createdAt)}</span>
        </div>
        {cancelled ? <Badge tone="sale">Đơn đã hủy</Badge> : <OrderTracker current={order.status} times={[formatDateTime(order.createdAt).split(" · ")[0]]} />}
      </Panel>

      {showQr && (
        <PayBlock
          order={order}
          onClaimed={(at) => {
            patchLocalOrder(order.code, { paidClaimedAt: at });
            setOrder({ ...order, paidClaimedAt: at });
          }}
        />
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
        <Panel style={{ flex: "1 1 320px", minWidth: 0, padding: 20 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 500, color: "var(--text-strong)" }}>Sản phẩm</h2>
          {order.items.map((it) => (
            <ItemRow key={it.key} item={it} />
          ))}
          <div style={{ marginTop: 16 }}>
            <Totals q={order.totals} />
          </div>
        </Panel>
        <Panel style={{ flex: "1 1 280px", minWidth: 0, padding: 20, display: "flex", flexDirection: "column", gap: 14, fontSize: 14, lineHeight: 1.55 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500, color: "var(--text-strong)" }}>Giao hàng</h2>
          <div>
            <strong style={{ fontWeight: 500 }}>{to.name}</strong> · {to.phone}
            <br />
            {order.address}, {order.province}
            {order.recipient && <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>Người đặt: {order.buyer.name} · {order.buyer.phone}</span>}
          </div>
          <div>
            {order.express ? "Giao nhanh" : "Giao tiêu chuẩn"} · {order.payment === "vietqr" ? "Chuyển khoản ngân hàng" : "Thanh toán khi nhận hàng"}
          </div>
          {order.gift?.wrap && (
            <div style={{ display: "flex", gap: 8 }}>
              <Icon name="gift" size={18} color="var(--accent)" />
              <span>Gói quà kèm thiệp{order.gift.message ? `: “${order.gift.message}”` : ""}</span>
            </div>
          )}
          {order.gift?.hidePrice && <div style={{ color: "var(--text-muted)" }}>Không kèm hóa đơn trong gói hàng</div>}
          {order.note && <div style={{ color: "var(--text-muted)" }}>Ghi chú: {order.note}</div>}
        </Panel>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <Button variant="secondary" iconLeft="repeat" onClick={() => addMany(order.items.map(({ slug, size, grade, qty }) => ({ slug, size, grade, qty })))}>Mua lại đơn này</Button>
        <Button variant="ghost" iconLeft="message-circle" href={zaloLink()}>Nhắn Zalo về đơn</Button>
      </div>
    </div>
  );
}
