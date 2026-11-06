// Hồ sơ chứng nhận của đối tác sản xuất. Thông tin chép nguyên văn từ bản chụp giấy tờ do Hợp tác xã cung cấp.
// Khi có bản gia hạn hoặc giấy mới: cập nhật `issued`, `expires`, `fields` và thay ảnh trong /public/assets/chung-nhan.

export type CertField = { label: string; value: string };
export type Certificate = {
  slug: string;
  /** Tên ngắn hiển thị lớn */
  short: string;
  title: string;
  issuer: string;
  number: string;
  /** ISO yyyy-mm-dd */
  issued: string;
  /** ISO yyyy-mm-dd; bỏ trống nếu giấy không có thời hạn */
  expires?: string;
  scope: string;
  image: { src: string; w: number; h: number; alt: string };
  fields: CertField[];
};

export const PARTNER = {
  name: "Hợp tác xã Chè Thanh Huyền Trà",
  short: "HTX Chè Thanh Huyền Trà",
  taxCode: "4601607685",
  firstRegistered: "2023-07-13",
  address: "Xóm Nam Thái, xã Tân Cương, thành phố Thái Nguyên, tỉnh Thái Nguyên",
  representative: "Phạm Thị Thu Huyền – Chủ tịch Hội đồng quản trị",
  mainBusiness: "Sản xuất chè (mã ngành 1076)",
  stats: [
    { value: "19", unit: "hộ", label: "Hộ thành viên" },
    { value: "5,58", unit: "ha", label: "Diện tích sản xuất" },
    { value: "85", unit: "tấn/năm", label: "Sản lượng dự kiến" },
    { value: "17", unit: "ngành", label: "Ngành nghề đăng ký" },
  ],
};

export const CERTIFICATES: Certificate[] = [
  {
    slug: "vietgap",
    short: "VietGAP",
    title: "Giấy chứng nhận VietGAP",
    issuer: "Trung tâm Dịch vụ Kỹ thuật và Huấn luyện Nghiệp vụ Chất lượng Nông Lâm Thủy sản – Chi cục Quản lý Chất lượng Nông Lâm sản và Thủy sản tỉnh Thái Nguyên",
    number: "DVCL-VG-TT-24-19-22",
    issued: "2024-09-13",
    expires: "2026-09-12",
    scope: "Chè búp tươi",
    image: { src: "/assets/chung-nhan/vietgap.webp", w: 373, h: 624, alt: "Giấy chứng nhận VietGAP cho chè búp tươi của Hợp tác xã Chè Thanh Huyền Trà" },
    fields: [
      { label: "Sản phẩm chứng nhận", value: "Chè búp tươi" },
      { label: "Cơ sở sản xuất", value: "Hợp tác xã Chè Thanh Huyền Trà" },
      { label: "Địa điểm sản xuất", value: "Xóm Nam Thái – Hồng Thái 2 – Đội Cấn, xã Tân Cương, thành phố Thái Nguyên, tỉnh Thái Nguyên" },
      { label: "Số hộ thành viên", value: "19 hộ" },
      { label: "Diện tích sản xuất", value: "5,58 ha" },
      { label: "Sản lượng dự kiến", value: "85 tấn/năm" },
      { label: "Tiêu chuẩn", value: "TCVN 11892-1:2017 – Thực hành sản xuất nông nghiệp tốt (VietGAP), Phần 1: Trồng trọt" },
    ],
  },
  {
    slug: "an-toan-thuc-pham",
    short: "An toàn thực phẩm",
    title: "Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm",
    issuer: "Phòng Kinh tế thành phố Thái Nguyên",
    number: "25/2023/NNPTNT-TNg",
    issued: "2023-11-03",
    expires: "2026-11-03",
    scope: "Chế biến, kinh doanh chè",
    image: { src: "/assets/chung-nhan/an-toan-thuc-pham.webp", w: 374, h: 624, alt: "Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm của Hợp tác xã Chè Thanh Huyền Trà" },
    fields: [
      { label: "Cơ sở", value: "Hợp tác xã Chè Thanh Huyền Trà" },
      { label: "Người đại diện", value: "Phạm Thị Thu Huyền – Chủ tịch Hội đồng quản trị" },
      { label: "Địa chỉ", value: "Tổ 10, phường Hoàng Văn Thụ, thành phố Thái Nguyên" },
      { label: "Đủ điều kiện để", value: "Chế biến, kinh doanh chè" },
      { label: "Người ký", value: "KT. Trưởng phòng – Phó Trưởng phòng Nguyễn Ngọc Tân" },
    ],
  },
  {
    slug: "dang-ky-hop-tac-xa",
    short: "Đăng ký HTX",
    title: "Giấy chứng nhận đăng ký hợp tác xã",
    issuer: "Phòng Tài chính – Kế hoạch, UBND thành phố Thái Nguyên",
    number: "4601607685",
    issued: "2023-07-13",
    scope: "Sản xuất chè (ngành chính) và 16 ngành nghề khác",
    image: { src: "/assets/chung-nhan/dang-ky-hop-tac-xa.webp", w: 386, h: 622, alt: "Giấy chứng nhận đăng ký hợp tác xã của Hợp tác xã Chè Thanh Huyền Trà" },
    fields: [
      { label: "Tên hợp tác xã", value: "Hợp tác xã Chè Thanh Huyền Trà (HTX Chè Thanh Huyền Trà)" },
      { label: "Mã số hợp tác xã", value: "4601607685" },
      { label: "Đăng ký lần đầu", value: "13/07/2023" },
      { label: "Trụ sở chính", value: "Xóm Nam Thái, xã Tân Cương, thành phố Thái Nguyên, tỉnh Thái Nguyên" },
      { label: "Ngành chính", value: "Sản xuất chè (1076)" },
      { label: "Một số ngành khác", value: "Trồng cây chè (0127), Bán buôn thực phẩm (4632), Bán lẻ thực phẩm (4722), Bán buôn tổng hợp (4690)" },
    ],
  },
];

export type CertStatus = { tone: "valid" | "soon" | "expired" | "permanent"; label: string };

/** Trạng thái tính theo ngày hiện tại: còn hiệu lực, sắp hết hạn (≤ 60 ngày), đã hết hạn, hoặc không thời hạn. */
export function statusOf(c: Certificate, today = new Date()): CertStatus {
  if (!c.expires) return { tone: "permanent", label: "Không thời hạn" };
  const end = new Date(c.expires + "T23:59:59+07:00");
  const days = Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return { tone: "expired", label: "Đã hết hạn" };
  if (days <= 60) return { tone: "soon", label: `Còn ${days} ngày` };
  return { tone: "valid", label: "Còn hiệu lực" };
}

export const vnDate = (iso: string) => iso.split("-").reverse().join("/");
