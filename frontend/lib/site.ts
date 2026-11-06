// Thông tin cửa hàng dùng chung (footer, liên hệ, nút Zalo, VietQR, pháp lý).
// TODO trước khi chạy chính thức: thay số điện thoại, Zalo, email, tài khoản ngân hàng,
// địa chỉ kho và link mạng xã hội thật (phiếu thông tin mục 1 và 11 chưa điền).
export const SITE = {
  name: "Hydron",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Bình giữ nhiệt in tên riêng, tự thiết kế 3D.",
  address: "Hà Nội",
  phone: "0900 000 000",
  zalo: "0900000000",
  messenger: "https://m.me/",
  email: "hello@hydron.example",
  hours: "8:00 – 21:00 · Thứ 2 – Chủ nhật",
  facebook: "https://facebook.com/",
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/",
  shopee: "https://shopee.vn/",
  /** Tài khoản nhận chuyển khoản. bankId là mã ngân hàng theo danh sách của VietQR (VCB, TCB, MB, ACB…). */
  bank: {
    bankId: "MB",
    bankName: "MB Bank",
    account: "0000000000",
    holder: "HYDRON",
    /** Ảnh QR của chủ shop (tải từ app ngân hàng), đặt vào public/assets/. Nếu chưa có file, trang tự tạo mã VietQR từ số tài khoản. */
    qrImage: "",
  },
  /** Thời gian chủ shop đối soát chuyển khoản và xác nhận đơn */
  confirmWithin: "30 phút",
  legal: {
    company: "Hydron",
    /** Điền tên pháp lý + mã số thuế khi có (phiếu thông tin mục 1) */
    notice: "",
    /** Link hồ sơ trên online.gov.vn sau khi được duyệt thông báo website */
    moitUrl: "",
  },
};

export const zaloLink = () => `https://zalo.me/${SITE.zalo}`;
export const telLink = () => `tel:${SITE.phone.replace(/\s/g, "")}`;

export const NAV = [
  { label: "Bình giữ nhiệt", href: "/san-pham?danh-muc=binh" },
  { label: "Phụ kiện", href: "/san-pham?danh-muc=phu-kien" },
  { label: "Móc khóa", href: "/san-pham?danh-muc=moc-khoa" },
  { label: "Thiết kế 3D", href: "/thiet-ke-3d" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Cẩm nang", href: "/cam-nang" },
];

export function vietQrImage(amount: number, info: string) {
  const { bankId, account, holder } = SITE.bank;
  const q = new URLSearchParams({ amount: String(amount), addInfo: info, accountName: holder });
  // Gọi thẳng .svg: link .png bị chuyển hướng 301 sang .svg mà bước chuyển hướng không có header CORS.
  return `https://img.vietqr.io/image/${bankId}-${account}-compact2.svg?${q}`;
}
