// Order Status definitions and metadata

export const ORDER_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPING: 2,
  COMPLETED: 3,
  CANCELLED: -1,
} as const;

export type OrderStatusCode = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_METADATA: Record<
  number,
  {
    label: string;
    description: string;
    tone: "neutral" | "accent" | "new" | "success" | "sale";
    bg: string;
    fg: string;
    border: string;
  }
> = {
  0: {
    label: "Mới đặt",
    description: "Khách vừa gửi đơn, chờ shop xác nhận VietQR hoặc duyệt gửi COD.",
    tone: "neutral",
    bg: "#FFF9EB",
    fg: "#B45309",
    border: "#FDE68A",
  },
  1: {
    label: "Đã xác nhận",
    description: "Đã khớp tiền chuyển khoản VietQR hoặc chốt đơn COD qua điện thoại.",
    tone: "accent",
    bg: "#ECFDF5",
    fg: "#047857",
    border: "#A7F3D0",
  },
  2: {
    label: "Đang giao",
    description: "Đã bàn giao cho bưu cục hoặc shipper đang trên đường tới người nhận.",
    tone: "new",
    bg: "#EFF6FF",
    fg: "#1D4ED8",
    border: "#BFDBFE",
  },
  3: {
    label: "Hoàn thành",
    description: "Khách đã nhận trà an toàn, đơn hàng kết thúc thành công.",
    tone: "success",
    bg: "#F0FDF4",
    fg: "#15803D",
    border: "#BBF7D0",
  },
  [-1]: {
    label: "Đã hủy",
    description: "Đơn bị hủy do khách đổi ý hoặc thông tin không thể liên lạc.",
    tone: "sale",
    bg: "#FEF2F2",
    fg: "#B91C1C",
    border: "#FECACA",
  },
};
