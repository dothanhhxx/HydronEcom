"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ds";
import type { ContactMessage, ContactType, MessageMetrics, MessageStatus } from "@/shared";

export function MessageManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [metrics, setMetrics] = useState<MessageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (typeFilter) q.set("type", typeFilter);
      if (statusFilter) q.set("status", statusFilter);
      if (search.trim()) q.set("search", search.trim());

      const res = await fetch(`/api/admin/messages?${q.toString()}`);
      const data = await res.json();
      if (data.ok) {
        setMessages(data.messages || []);
        setMetrics(data.metrics || null);
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách tin nhắn:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [typeFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMessages();
  };

  const handleUpdateStatus = async (id: string, newStatus: MessageStatus, note?: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, adminNote: note }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, status: newStatus, adminNote: note !== undefined ? note : m.adminNote } : m
          )
        );
        fetchMessages();
      }
    } catch (e) {
      console.error("Lỗi cập nhật tin nhắn:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNote = async (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    await handleUpdateStatus(id, msg.status || "pending", tempNote);
    setEditingNoteId(null);
  };

  const typeTabs: { label: string; value: string }[] = [
    { label: "Tất cả tin nhắn", value: "" },
    { label: "🎁 Báo giá quà tặng", value: "bao-gia" },
    { label: "💬 Hỏi đáp tư vấn", value: "lien-he" },
    { label: "⭐ Đánh giá khách hàng", value: "danh-gia" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "var(--font-ui)" }}>
      {/* Metrics Banner - 2x2 on Mobile */}
      {metrics && (
        <div className="lt-admin-metrics-grid">
          <div className="lt-admin-metric-card">
            <div className="lt-metric-label" style={{ fontSize: 13, color: "#6B7280" }}>Chờ tư vấn phản hồi</div>
            <div className="lt-metric-value" style={{ fontSize: 22, fontWeight: 700, color: "#D97706", marginTop: 4 }}>
              {metrics.pendingCount}
            </div>
            <div className="lt-metric-sub" style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Khách đang đợi liên hệ</div>
          </div>

          <div className="lt-admin-metric-card">
            <div className="lt-metric-label" style={{ fontSize: 13, color: "#6B7280" }}>Yêu cầu báo giá quà</div>
            <div className="lt-metric-value" style={{ fontSize: 22, fontWeight: 700, color: "#0D2219", marginTop: 4 }}>
              {metrics.quoteCount}
            </div>
            <div className="lt-metric-sub" style={{ fontSize: 12, color: "#047857", marginTop: 4 }}>Quà doanh nghiệp & đoàn thể</div>
          </div>

          <div className="lt-admin-metric-card">
            <div className="lt-metric-label" style={{ fontSize: 13, color: "#6B7280" }}>Đã tư vấn chăm sóc</div>
            <div className="lt-metric-value" style={{ fontSize: 22, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>
              {metrics.contactedCount}
            </div>
            <div className="lt-metric-sub" style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Đã phản hồi khách</div>
          </div>

          <div className="lt-admin-metric-card">
            <div className="lt-metric-label" style={{ fontSize: 13, color: "#6B7280" }}>Tổng số lượt gửi</div>
            <div className="lt-metric-value" style={{ fontSize: 22, fontWeight: 700, color: "#111827", marginTop: 4 }}>
              {metrics.totalMessages}
            </div>
            <div className="lt-metric-sub" style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Form web & liên hệ</div>
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
        {/* Type Filter (Horizontal Scrollable Chips on Mobile) */}
        <div className="lt-admin-tabs-scroll">
          {typeTabs.map((tab) => {
            const active = typeFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setTypeFilter(tab.value)}
                className="lt-admin-tab-chip"
                style={{
                  padding: "7px 14px",
                  borderRadius: 6,
                  border: `1px solid ${active ? "var(--tra-500)" : "#E5E7EB"}`,
                  background: active ? "var(--tra-500)" : "#FFFFFF",
                  color: active ? "#0D2219" : "#4B5563",
                  fontWeight: active ? 600 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 120ms ease",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Status Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: 40,
              padding: "0 10px",
              borderRadius: 6,
              border: "1px solid #D1D5DB",
              background: "#FAF8F5",
              fontSize: 13,
              color: "#374151",
              flexShrink: 0,
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ phản hồi</option>
            <option value="contacted">Đã liên hệ</option>
          </select>

          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 6, flex: "1 1 240px", maxWidth: "100%" }}>
            <input
              type="text"
              placeholder="Tìm tên, SĐT, công ty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                height: 40,
                padding: "0 12px",
                borderRadius: 6,
                border: "1px solid #D1D5DB",
                background: "#FAF8F5",
                fontSize: 13,
                flex: 1,
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
        </div>
      </div>

      {/* Messages List / Table */}
      <div style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>Đang tải tin nhắn...</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: "50px 20px", textAlign: "center", color: "#6B7280" }}>
            <Icon name="receipt" size={32} />
            <div style={{ marginTop: 10, fontSize: 15, fontWeight: 500, color: "#374151" }}>Chưa có tin nhắn nào</div>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
              Các yêu cầu báo giá hộp quà và tin nhắn từ form liên hệ sẽ xuất hiện tại đây.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {messages.map((m) => {
              const isContacted = m.status === "contacted";
              const isEditingThisNote = editingNoteId === m.id;
              const isUpdating = updatingId === m.id;

              const typeBadge =
                m.type === "bao-gia"
                  ? { label: "Báo giá quà Tết/DN", bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" }
                  : m.type === "danh-gia"
                  ? { label: "Đánh giá sản phẩm", bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE" }
                  : { label: "Hỏi đáp tư vấn", bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" };

              return (
                <div
                  key={m.id || m.createdAt}
                  style={{
                    padding: "16px 16px",
                    borderBottom: "1px solid #F3F4F6",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    background: isContacted ? "#FFFFFF" : "#FCFDFD",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Header Row: Sender name, badge, time, status */}
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: 999,
                          fontSize: 11.5,
                          fontWeight: 600,
                          background: typeBadge.bg,
                          color: typeBadge.color,
                          border: `1px solid ${typeBadge.border}`,
                        }}
                      >
                        {typeBadge.label}
                      </span>

                      <span style={{ fontSize: 15.5, fontWeight: 700, color: "#111827" }}>{m.name}</span>

                      {m.company && (
                        <span style={{ fontSize: 12, color: "#6B7280", background: "#F3F4F6", padding: "2px 7px", borderRadius: 4 }}>
                          🏢 {m.company}
                        </span>
                      )}

                      <span style={{ fontSize: 11.5, color: "#9CA3AF" }}>
                        {new Date(m.createdAt).toLocaleString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <span
                      style={{
                        padding: "3px 9px",
                        borderRadius: 999,
                        fontSize: 11.5,
                        fontWeight: 600,
                        background: isContacted ? "#ECFDF5" : "#FFFBEB",
                        color: isContacted ? "#047857" : "#B45309",
                        border: `1px solid ${isContacted ? "#A7F3D0" : "#FDE68A"}`,
                      }}
                    >
                      {isContacted ? "✓ Đã liên hệ" : "⏳ Chờ phản hồi"}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(m.id || "", isContacted ? "pending" : "contacted")}
                      style={{
                        height: 38,
                        padding: "0 12px",
                        borderRadius: 6,
                        border: "1px solid #D1D5DB",
                        background: "#FFFFFF",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: isContacted ? "#4B5563" : "#047857",
                      }}
                    >
                      {isContacted ? "Đánh dấu chưa xử lý" : "✓ Đánh dấu đã liên hệ"}
                    </button>

                    {/* Phone quick call */}
                    {m.phone && (
                      <a
                        href={`tel:${m.phone}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          height: 38,
                          padding: "0 12px",
                          borderRadius: 6,
                          border: "1px solid #D1D5DB",
                          background: "#FFFFFF",
                          color: "#0D2219",
                          fontSize: 12.5,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        <Icon name="phone" size={13} />
                        <span>Gọi {m.phone}</span>
                      </a>
                    )}

                    {/* Zalo quick chat */}
                    {m.phone && (
                      <a
                        href={`https://zalo.me/${m.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          height: 38,
                          padding: "0 12px",
                          borderRadius: 6,
                          border: "1px solid #0068FF",
                          background: "rgba(0, 104, 255, 0.08)",
                          color: "#0068FF",
                          fontSize: 12.5,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        <Icon name="arrow-right" size={13} />
                        <span>Chat Zalo</span>
                      </a>
                    )}
                  </div>

                  {/* Quote Metadata Bar if exists */}
                  {(m.quantity || m.budget || m.date || m.product || m.stars) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: "8px 12px", borderRadius: 6, background: "#FAF8F5", border: "1px solid #EFE8DC", fontSize: 12.5 }}>
                      {m.quantity && (
                        <div>
                          <span style={{ color: "#6B7280" }}>Số lượng: </span>
                          <strong style={{ color: "#0D2219" }}>{m.quantity} suất/hộp</strong>
                        </div>
                      )}
                      {m.budget && (
                        <div>
                          <span style={{ color: "#6B7280" }}>Ngân sách: </span>
                          <strong style={{ color: "#0D2219" }}>{m.budget}</strong>
                        </div>
                      )}
                      {m.date && (
                        <div>
                          <span style={{ color: "#6B7280" }}>Cần hàng: </span>
                          <strong style={{ color: "#0D2219" }}>{m.date}</strong>
                        </div>
                      )}
                      {m.product && (
                        <div>
                          <span style={{ color: "#6B7280" }}>Sản phẩm: </span>
                          <strong style={{ color: "#0D2219" }}>{m.product}</strong>
                        </div>
                      )}
                      {m.stars && (
                        <div>
                          <span style={{ color: "#6B7280" }}>Đánh giá: </span>
                          <strong style={{ color: "#D97706" }}>{"⭐".repeat(m.stars)} ({m.stars}/5)</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Content */}
                  <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6, background: "#F9FAFB", padding: "10px 14px", borderRadius: 8, whiteSpace: "pre-wrap" }}>
                    {m.message}
                  </div>

                  {/* Customer Contact Details & Internal Admin Note */}
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, fontSize: 12.5 }}>
                    <div style={{ display: "flex", gap: 14, color: "#6B7280", flexWrap: "wrap" }}>
                      {m.phone && <span>📞 SĐT: <strong style={{ color: "#111827" }}>{m.phone}</strong></span>}
                      {m.email && <span>✉️ Email: <strong style={{ color: "#111827" }}>{m.email}</strong></span>}
                    </div>

                    {/* Internal Note */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 260px", justifyContent: "flex-end" }}>
                      {isEditingThisNote ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", maxWidth: 360 }}>
                          <input
                            type="text"
                            placeholder="Ghi chú nội bộ..."
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            style={{ height: 34, padding: "0 10px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 12.5, flex: 1, minWidth: 0 }}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveNote(m.id || "")}
                            style={{ height: 34, padding: "0 12px", borderRadius: 6, border: 0, background: "#0D2219", color: "#FFF", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
                          >
                            Lưu
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            style={{ height: 34, padding: "0 10px", borderRadius: 6, border: "1px solid #D1D5DB", background: "#FFF", fontSize: 12, cursor: "pointer", flexShrink: 0 }}
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {m.adminNote ? (
                            <span style={{ fontSize: 12, color: "#92400E", background: "#FEF3C7", padding: "3px 8px", borderRadius: 4 }}>
                              📌 {m.adminNote}
                            </span>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNoteId(m.id || "");
                              setTempNote(m.adminNote || "");
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: 4,
                              border: "1px dashed #D1D5DB",
                              background: "#FAF8F5",
                              color: "#6B7280",
                              fontSize: 11.5,
                              cursor: "pointer",
                            }}
                          >
                            {m.adminNote ? "Sửa ghi chú" : "+ Thêm ghi chú"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
