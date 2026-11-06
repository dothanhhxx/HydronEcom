"use client";

import { useEffect, useState } from "react";
import { formatVND } from "@/components/ds";
import { OrderDetailModal } from "./OrderDetailModal";
import { StatusBadge } from "./StatusBadge";
import type { Order, OrderMetrics, OrderStatus } from "@/shared";

export function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (statusFilter !== "") q.set("status", statusFilter);
      if (search.trim()) q.set("search", search.trim());

      const res = await fetch(`/api/admin/orders?${q.toString()}`);
      const data = await res.json();
      if (data.ok) {
        setOrders(data.orders || []);
        setMetrics(data.metrics || null);
      }
    } catch (e) {
      console.error("Lỗi lấy đơn hàng:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (code: string, newStatus: OrderStatus, note?: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, status: newStatus, note }),
      });
      const data = await res.json();
      if (data.ok) {
        // Cập nhật trạng thái trực tiếp trên view
        setOrders((prev) =>
          prev.map((o) => (o.code === code ? { ...o, status: newStatus, internalNote: note } : o))
        );
        if (selectedOrder && selectedOrder.code === code) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus, internalNote: note } : null));
        }
        fetchOrders();
      }
    } catch (e) {
      console.error("Lỗi cập nhật trạng thái:", e);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("Không có đơn hàng nào để xuất.");
      return;
    }
    const headers = [
      "Mã đơn",
      "Ngày đặt",
      "Khách hàng",
      "Số điện thoại",
      "Địa chỉ",
      "Tỉnh thành",
      "Thanh toán",
      "Mã giảm giá",
      "Sản phẩm",
      "Tạm tính",
      "Giảm giá",
      "Phí ship",
      "Tổng tiền",
      "Trạng thái",
      "Gói quà",
      "Lời nhắn thiệp",
      "Ghi chú khách",
      "Ghi chú nội bộ",
    ];

    const rows = orders.map((o) => {
      const statusLabel =
        o.status === 0
          ? "Mới đặt"
          : o.status === 1
          ? "Đã xác nhận"
          : o.status === 2
          ? "Đang giao"
          : o.status === 3
          ? "Hoàn thành"
          : "Đã hủy";

      const itemsSummary = (o.items || [])
        .map((it) => `${it.name} (${it.variant || ""}) x${it.qty}`)
        .join("; ");

      return [
        `"${o.code}"`,
        `"${new Date(o.createdAt).toLocaleString("vi-VN")}"`,
        `"${(o.buyer?.name || "").replace(/"/g, '""')}"`,
        `"${o.buyer?.phone || ""}"`,
        `"${(o.address || "").replace(/"/g, '""')}"`,
        `"${(o.province || "").replace(/"/g, '""')}"`,
        `"${o.payment === "vietqr" ? "VietQR Chuyển khoản" : "COD Tiền mặt"}"`,
        `"${o.coupon || ""}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        o.totals?.subtotal || 0,
        o.totals?.discount || 0,
        o.totals?.shipping || 0,
        o.totals?.total || 0,
        `"${statusLabel}"`,
        `"${o.gift?.wrap ? "Có gói quà" : "Không"}"`,
        `"${(o.gift?.message || "").replace(/"/g, '""')}"`,
        `"${(o.note || "").replace(/"/g, '""')}"`,
        `"${(o.internalNote || "").replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LamTra_DonHang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { label: "Tất cả", value: "" },
    { label: "Mới đặt", value: "0" },
    { label: "Đã xác nhận", value: "1" },
    { label: "Đang giao", value: "2" },
    { label: "Hoàn thành", value: "3" },
    { label: "Đã hủy", value: "-1" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Metric Cards - 2x2 on Mobile, 4-col on Desktop */}
      {metrics && (
        <div className="lt-admin-metrics-grid">
          <div className="lt-admin-metric-card">
            <div className="lt-metric-label" style={{ fontSize: 13, color: "#6B7280" }}>Doanh thu tạm tính</div>
            <div className="lt-metric-value" style={{ fontSize: 22, fontWeight: 700, color: "#0D2219", marginTop: 4 }}>
              {formatVND(metrics.totalRevenue)}
            </div>
            <div className="lt-metric-sub" style={{ fontSize: 12, color: "#10B981", marginTop: 4 }}>{metrics.totalOrders} đơn hàng tổng cộng</div>
          </div>

          <div className="lt-admin-metric-card">
            <div className="lt-metric-label" style={{ fontSize: 13, color: "#6B7280" }}>Đơn mới chờ duyệt</div>
            <div className="lt-metric-value" style={{ fontSize: 22, fontWeight: 700, color: "#D97706", marginTop: 4 }}>
              {metrics.pendingCount}
            </div>
            <div className="lt-metric-sub" style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Cần xác nhận VietQR/COD</div>
          </div>

          <div className="lt-admin-metric-card">
            <div className="lt-metric-label" style={{ fontSize: 13, color: "#6B7280" }}>Đang giao hàng</div>
            <div className="lt-metric-value" style={{ fontSize: 22, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>
              {metrics.shippingCount}
            </div>
            <div className="lt-metric-sub" style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Bưu cục đang phát</div>
          </div>

          <div className="lt-admin-metric-card">
            <div className="lt-metric-label" style={{ fontSize: 13, color: "#6B7280" }}>Giao thành công</div>
            <div className="lt-metric-value" style={{ fontSize: 22, fontWeight: 700, color: "#059669", marginTop: 4 }}>
              {metrics.completedCount}
            </div>
            <div className="lt-metric-sub" style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Khách đã nhận trà</div>
          </div>
        </div>
      )}

      {/* Control Bar: Filter Tabs & Search */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "14px 16px",
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Status Filter Tabs (Horizontal Scrollable Chips on Mobile) */}
        <div className="lt-admin-tabs-scroll">
          {tabs.map((tab) => {
            const active = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className="lt-admin-tab-chip"
                style={{
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: active ? "1px solid var(--primary)" : "1px solid #E5E7EB",
                  background: active ? "#0D2219" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#374151",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Actions: Search & Export CSV */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 8, flex: "1 1 240px", maxWidth: "100%" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã đơn, tên, số điện thoại…"
              style={{
                flex: 1,
                height: 40,
                padding: "0 12px",
                borderRadius: 6,
                border: "1px solid #D1D5DB",
                fontSize: 13.5,
                outline: "none",
                background: "#FAF8F5",
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 6,
                border: 0,
                background: "#0D2219",
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Tìm
            </button>
          </form>

          <button
            type="button"
            onClick={handleExportCSV}
            style={{
              height: 40,
              padding: "0 14px",
              borderRadius: 6,
              border: "1px solid #D1D5DB",
              background: "#FFFFFF",
              color: "#047857",
              fontSize: 13,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <span>📥 Xuất Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Main Order Content */}
      {loading ? (
        <div style={{ background: "#FFFFFF", padding: "40px 20px", borderRadius: 10, border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280", fontSize: 14 }}>
          Đang tải dữ liệu đơn hàng...
        </div>
      ) : orders.length === 0 ? (
        <div style={{ background: "#FFFFFF", padding: "50px 20px", borderRadius: 10, border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#374151" }}>Chưa có đơn hàng nào</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Khi khách chốt đơn trên website, thông tin sẽ tự động hiển thị tại đây.</div>
        </div>
      ) : (
        <>
          {/* ─── 1. DESKTOP VIEW: BẢNG DỮ LIỆU ĐẦY ĐỦ (≥ 768px) ─── */}
          <div className="lt-admin-desktop-table" style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", color: "#4B5563" }}>
                    <th style={{ padding: "12px 16px" }}>Mã đơn</th>
                    <th style={{ padding: "12px 16px" }}>Thời gian</th>
                    <th style={{ padding: "12px 16px" }}>Khách hàng</th>
                    <th style={{ padding: "12px 16px" }}>Tỉnh/Thành</th>
                    <th style={{ padding: "12px 16px" }}>Thanh toán</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Tổng tiền</th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>Trạng thái</th>
                    <th style={{ padding: "12px 16px", textAlign: "center" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.code} style={{ borderBottom: "1px solid #F3F4F6", transition: "background 120ms ease" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#0D2219" }}>
                        #{o.code}
                        {o.gift?.wrap && (
                          <span title="Có gói quà thiệp" style={{ marginLeft: 4, cursor: "help" }}>🎁</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#6B7280", fontSize: 12.5 }}>
                        {new Date(o.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, color: "#111827" }}>{o.buyer.name}</div>
                        <a href={`tel:${o.buyer.phone}`} style={{ fontSize: 12.5, color: "#047857", textDecoration: "none" }}>
                          {o.buyer.phone}
                        </a>
                        {o.internalNote && (
                          <div style={{ marginTop: 4, fontSize: 11.5, color: "#92400E", background: "#FEF3C7", padding: "2px 6px", borderRadius: 4, display: "inline-block" }}>
                            📌 {o.internalNote}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#374151" }}>{o.province}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: o.payment === "vietqr" ? "#047857" : "#B45309" }}>
                          {o.payment === "vietqr" ? "VietQR" : "COD"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: "#111827" }}>
                        {formatVND(o.totals.total)}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <StatusBadge status={o.status} />
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(o)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              border: "1px solid #D1D5DB",
                              background: "#FFFFFF",
                              fontSize: 12.5,
                              fontWeight: 500,
                              cursor: "pointer",
                            }}
                          >
                            Chi tiết
                          </button>
                          {o.status === 0 && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(o.code, 1)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                border: 0,
                                background: "#047857",
                                color: "#FFFFFF",
                                fontSize: 12.5,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Duyệt
                            </button>
                          )}
                          {o.status === 1 && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(o.code, 2)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                border: 0,
                                background: "#1D4ED8",
                                color: "#FFFFFF",
                                fontSize: 12.5,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Giao
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── 2. MOBILE VIEW: DANH SÁCH THẺ ĐƠN HÀNG THÔNG MINH (< 768px) ─── */}
          <div className="lt-admin-mobile-cards">
            {orders.map((o) => (
              <div key={o.code} className="lt-admin-card-item">
                {/* Header row: Code, status, time */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#0D2219" }}>
                      #{o.code}
                    </span>
                    {o.gift?.wrap && (
                      <span title="Có gói quà thiệp" style={{ fontSize: 14 }}>🎁</span>
                    )}
                  </div>
                  <StatusBadge status={o.status} />
                </div>

                {/* Customer row with 1-tap call & zalo */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 10px", background: "#FAF8F5", borderRadius: 8, border: "1px solid #EFE8DC" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{o.buyer.name}</div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>{o.province}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <a
                      href={`tel:${o.buyer.phone}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: "#047857",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: "none",
                        minHeight: 34,
                      }}
                    >
                      <span>📞 Gọi</span>
                    </a>
                    <a
                      href={`https://zalo.me/${o.buyer.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "6px 10px",
                        borderRadius: 6,
                        background: "#0068FF",
                        color: "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: "none",
                        minHeight: 34,
                      }}
                    >
                      <span>Zalo</span>
                    </a>
                  </div>
                </div>

                {/* Details row: Payment & Total */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: o.payment === "vietqr" ? "rgba(4, 120, 87, 0.1)" : "rgba(180, 83, 9, 0.1)",
                        color: o.payment === "vietqr" ? "#047857" : "#B45309",
                        border: `1px solid ${o.payment === "vietqr" ? "rgba(4, 120, 87, 0.25)" : "rgba(180, 83, 9, 0.25)"}`,
                      }}
                    >
                      {o.payment === "vietqr" ? "VietQR" : "COD"}
                    </span>
                    <span style={{ fontSize: 11.5, color: "#9CA3AF" }}>
                      {new Date(o.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>

                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0D2219" }}>
                    {formatVND(o.totals.total)}
                  </div>
                </div>

                {/* Internal note if present */}
                {o.internalNote && (
                  <div style={{ fontSize: 12, color: "#92400E", background: "#FEF3C7", padding: "4px 8px", borderRadius: 4 }}>
                    📌 {o.internalNote}
                  </div>
                )}

                {/* Action buttons row (Touch-friendly 44px min height) */}
                <div style={{ display: "grid", gridTemplateColumns: o.status === 0 || o.status === 1 ? "1fr 1fr" : "1fr", gap: 8, marginTop: 4, paddingTop: 8, borderTop: "1px dashed #E5E7EB" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(o)}
                    style={{
                      height: 42,
                      borderRadius: 6,
                      border: "1px solid #D1D5DB",
                      background: "#FFFFFF",
                      color: "#374151",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Xem chi tiết
                  </button>

                  {o.status === 0 && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(o.code, 1)}
                      style={{
                        height: 42,
                        borderRadius: 6,
                        border: 0,
                        background: "#047857",
                        color: "#FFFFFF",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      ✓ Duyệt đơn
                    </button>
                  )}

                  {o.status === 1 && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(o.code, 2)}
                      style={{
                        height: 42,
                        borderRadius: 6,
                        border: 0,
                        background: "#1D4ED8",
                        color: "#FFFFFF",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      🚚 Bàn giao phát
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
