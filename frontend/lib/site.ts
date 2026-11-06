// Thông tin cửa hàng dùng chung (footer, liên hệ, nút Zalo, VietQR, pháp lý).
// TODO: thay số điện thoại, Zalo, tài khoản ngân hàng, thông tin doanh nghiệp và link mạng xã hội thật trước khi chạy chính thức.
export const SITE = {
  name: "Lam Trà",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Trọn vị trà Việt, trọn tấm lòng trao gửi.",
  /** 4 từ khoá slogan hiển thị ở góc phải chân trang */
  slogan: ["Trọn vị", "Trà Việt", "Tấm lòng", "Trao gửi"],
  address: "Xã Tân Cương, tỉnh Thái Nguyên",
  phone: "0949 992 493",
  zalo: "0949992493",
  email: "Lamtra.tea@gmail.com",
  hours: "8:00 – 21:00 · Thứ 2 – Chủ nhật",
  facebook: "https://facebook.com/",
  tiktok: "https://tiktok.com/",
  /** Tài khoản nhận chuyển khoản. bankId là mã ngân hàng theo danh sách của VietQR (VCB, TCB, MB, ACB…). */
  bank: {
    bankId: "VCB",
    bankName: "Vietcombank",
    account: "0000000000",
    holder: "LAM TRA",
    /** Ảnh QR của chủ shop (tải từ app ngân hàng), đặt vào public/assets/. Nếu chưa có file, trang tự tạo mã VietQR từ số tài khoản. */
    qrImage: "/assets/qr-thanh-toan.png",
  },
  /** Thời gian chủ shop đối soát chuyển khoản và xác nhận đơn */
  confirmWithin: "30 phút",
  /** Thông tin pháp lý ở chân trang và trang chính sách. Đây là dự án sinh viên nên chưa có giấy phép/mã số thuế. */
  legal: {
    company: "Lam Trà",
    notice: "Student project – E-Business, Hanoi University",
    /** Link hồ sơ trên online.gov.vn sau khi được duyệt thông báo website */
    moitUrl: "",
  },
};

export const zaloLink = () => `https://zalo.me/${SITE.zalo}`;
export const telLink = () => `tel:${SITE.phone.replace(/\s/g, "")}`;

export const NAV = [
  { label: "Trang chủ", href: "/" },
  { label: "Câu chuyện", href: "/cau-chuyen" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Chứng nhận", href: "/chung-nhan" },
  { label: "Trà đàm", href: "/tra-dam" },
  { label: "Liên hệ", href: "/lien-he" },
];

export function vietQrImage(amount: number, info: string) {
  const { bankId, account, holder } = SITE.bank;
  const q = new URLSearchParams({ amount: String(amount), addInfo: info, accountName: holder });
  // Gọi thẳng .svg: link .png bị chuyển hướng 301 sang .svg mà bước chuyển hướng không có header CORS,
  // nên fetch() (dùng cho nút tải QR) sẽ bị chặn.
  return `https://img.vietqr.io/image/${bankId}-${account}-compact2.svg?${q}`;
}
