import { ORDER_STATUS_METADATA } from "@/shared";

export function StatusBadge({ status }: { status: number }) {
  const meta = ORDER_STATUS_METADATA[status] || {
    label: "Không xác định",
    bg: "#F3F4F6",
    fg: "#4B5563",
    border: "#E5E7EB",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        background: meta.bg,
        color: meta.fg,
        border: `1px solid ${meta.border}`,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: meta.fg,
        }}
      />
      {meta.label}
    </span>
  );
}
