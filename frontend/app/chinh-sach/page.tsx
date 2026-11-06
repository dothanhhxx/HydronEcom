import type { Metadata } from "next";
import Link from "next/link";
import { PolicyToc } from "@/components/info/PolicyToc";
import { PageHeader } from "@/components/shell/PageHeader";
import {
  COUPONS,
  CUSTOM_LEAD_TIME,
  EXPRESS_FEE,
  FREE_SHIP_MIN,
  GIFT_WRAP_FEE,
  GIFT_WRAP_FREE_MIN,
  SHIPPING_DAYS,
  SHIPPING_FEE,
  formatVND,
  type Region,
} from "@/lib/checkout";
import { CUSTOM_STICKER_FEE, CUSTOM_TEXT_FEE } from "@/lib/products";
import { SITE, telLink, zaloLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chính sách vận chuyển, đổi trả, bảo hành",
  description: `Phí giao hàng theo khu vực, miễn phí từ ${formatVND(FREE_SHIP_MIN)}; đổi trả 7 ngày; bảo hành giữ nhiệt 12 tháng; chính sách in riêng, thanh toán, bảo mật và điều khoản của Hydron.`,
};

const TOC = [
  { id: "van-chuyen", label: "Vận chuyển", icon: "truck" },
  { id: "doi-tra", label: "Đổi trả 7 ngày", icon: "rotate-ccw" },
  { id: "bao-hanh", label: "Bảo hành 12 tháng", icon: "shield-check" },
  { id: "in-rieng", label: "Bình in riêng", icon: "pencil" },
  { id: "thanh-toan", label: "Thanh toán", icon: "banknote" },
  { id: "uu-dai", label: "Mã ưu đãi", icon: "ticket-percent" },
  { id: "bao-mat", label: "Bảo mật thông tin", icon: "eye" },
  { id: "dieu-khoan", label: "Điều khoản", icon: "file-text" },
];

const REGIONS: { r: Region; label: string }[] = [
  { r: "noi-tinh", label: "Hà Nội" },
  { r: "bac", label: "Các tỉnh miền Bắc" },
  { r: "trung", label: "Miền Trung, Tây Nguyên" },
  { r: "nam", label: "Miền Nam" },
];

// TODO: chủ shop duyệt lại nội dung (phiếu thông tin mục 8 chưa điền: điều kiện đổi trả, ai chịu phí, thời gian xử lý).
export default function PolicyPage() {
  return (
    <>
      <PageHeader title="Chính sách mua hàng" crumbs={[{ label: "Chính sách" }]} desc="Giao hàng, đổi trả, bảo hành, in riêng và bảo mật: những điều bạn cần biết trước khi đặt bình Hydron." />
      <div className="lt-container lt-policy-container" style={{ paddingTop: 40, paddingBottom: 96 }}>
        <PolicyToc items={TOC} />
        <div className="lt-prose" style={{ maxWidth: 760 }}>
          <section id="van-chuyen">
            <h2>Vận chuyển</h2>
            <p>Hydron gửi hàng từ kho Hà Nội đi 34 tỉnh, thành qua đơn vị vận chuyển. Đơn bình trơn đặt trước 15:00 được gửi trong ngày; đơn in riêng gửi sau {CUSTOM_LEAD_TIME}.</p>
            <table>
              <thead>
                <tr><th>Khu vực</th><th>Phí</th><th>Thời gian</th></tr>
              </thead>
              <tbody>
                {REGIONS.map(({ r, label }) => (
                  <tr key={r}><td>{label}</td><td>{formatVND(SHIPPING_FEE[r])}</td><td>{SHIPPING_DAYS[r]}</td></tr>
                ))}
              </tbody>
            </table>
            <ul>
              <li>Miễn phí vận chuyển cho đơn từ <strong>{formatVND(FREE_SHIP_MIN)}</strong> (sau giảm giá).</li>
              <li>Giao nhanh: cộng {formatVND(EXPRESS_FEE)}, ưu tiên đóng gói và giao sớm hơn khoảng một ngày.</li>
              <li>Bạn được xem hàng trước khi nhận. Hộp móp méo, bình móp: từ chối nhận và báo Hydron qua Zalo.</li>
            </ul>
          </section>

          <section id="doi-tra">
            <h2>Đổi trả trong 7 ngày</h2>
            <p>Trong 7 ngày kể từ khi nhận hàng, Hydron đổi bình mới hoặc hoàn tiền nếu:</p>
            <ul>
              <li>Bình móp, trầy sơn, nắp hở do vận chuyển hoặc lỗi sản xuất.</li>
              <li>Giao sai mẫu, dung tích, màu hoặc sai nội dung in so với bản thiết kế bạn đã đặt.</li>
              <li>Bình không giữ nhiệt (mặt ngoài nóng lên khi đựng nước nóng).</li>
            </ul>
            <p>Bạn chụp ảnh hoặc quay video bình, nhắn <a href={zaloLink()}>Zalo {SITE.phone}</a> kèm mã đơn. Với lỗi từ Hydron, Hydron chịu toàn bộ phí gửi đi và gửi lại.</p>
            <p>Bình trơn chưa sử dụng, còn nguyên hộp, bạn muốn đổi mẫu hoặc màu khác: được đổi một lần trong 7 ngày, bạn chịu phí vận chuyển hai chiều.</p>
          </section>

          <section id="bao-hanh">
            <h2>Bảo hành 12 tháng</h2>
            <p>Lớp chân không của mọi bình Hydron được bảo hành 12 tháng kể từ ngày nhận. Bình mất giữ nhiệt không do rơi, va đập mạnh được đổi bình mới cùng mẫu (bình in riêng được in lại nội dung cũ, miễn phí).</p>
            <p>Không bảo hành: bình bị rơi móp, cho vào máy rửa bát, lò vi sóng, ngăn đá; trầy sơn do sử dụng. Gioăng silicon và nắp được bán riêng khi cần thay.</p>
          </section>

          <section id="in-rieng">
            <h2>Bình in riêng</h2>
            <ul>
              <li>Phí in chữ hoặc số: {formatVND(CUSTOM_TEXT_FEE)} mỗi bình. Sticker: {formatVND(CUSTOM_STICKER_FEE)} mỗi bình.</li>
              <li>Hydron in đúng nội dung, kiểu chữ, màu mực trong bản thiết kế 3D bạn đặt, và nhắn Zalo ảnh bình thật trước khi giao.</li>
              <li>Bình đã in tên không đổi trả vì lý do đổi ý; vẫn được đổi trả và bảo hành khi lỗi từ Hydron như mục trên.</li>
              <li>Hydron từ chối in nội dung vi phạm pháp luật, xúc phạm người khác hoặc logo, thương hiệu bạn không có quyền sử dụng.</li>
              <li>Muốn sửa nội dung in: nhắn Zalo trước khi đơn chuyển sang trạng thái “Đã xác nhận”.</li>
            </ul>
          </section>

          <section id="thanh-toan">
            <h2>Thanh toán</h2>
            <ul>
              <li><strong>Chuyển khoản qua VietQR:</strong> mã QR có sẵn số tiền và mã đơn hiện ở bước đặt hàng. Hydron xác nhận trong vòng {SITE.confirmWithin} sau khi nhận tiền (8:00 – 21:00).</li>
              <li><strong>Tiền mặt khi nhận hàng (COD):</strong> trả cho người giao hàng. Đơn in riêng giá trị lớn có thể được Hydron gọi xác nhận trước khi in.</li>
            </ul>
            <p>Hộp quà kèm thiệp viết tay: {formatVND(GIFT_WRAP_FEE)}, miễn phí cho đơn từ {formatVND(GIFT_WRAP_FREE_MIN)}.</p>
            <p>Nhân viên Hydron không bao giờ hỏi mã OTP, mật khẩu ngân hàng hay yêu cầu chuyển khoản tới tài khoản khác với tài khoản hiện trên trang đặt hàng.</p>
          </section>

          <section id="uu-dai">
            <h2>Mã ưu đãi</h2>
            <table>
              <thead>
                <tr><th>Mã</th><th>Ưu đãi</th></tr>
              </thead>
              <tbody>
                {Object.entries(COUPONS).map(([code, c]) => (
                  <tr key={code}><td><strong>{code}</strong></td><td>{c.label}</td></tr>
                ))}
              </tbody>
            </table>
            <p>Mỗi đơn dùng một mã. Nhập mã ở trang giỏ hàng.</p>
          </section>

          <section id="bao-mat">
            <h2>Bảo mật thông tin</h2>
            <p>Hydron thu thập họ tên, số điện thoại, email và địa chỉ chỉ để giao hàng, xác nhận đơn và chăm sóc sau bán, theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.</p>
            <ul>
              <li>Thông tin chỉ chia sẻ với đơn vị vận chuyển ở mức cần để giao hàng.</li>
              <li>Hydron không bán hay cho thuê dữ liệu khách hàng.</li>
              <li>Giỏ hàng, sản phẩm yêu thích và sổ địa chỉ được lưu trên trình duyệt của bạn; xóa dữ liệu trình duyệt là xóa các thông tin này.</li>
              <li>Bạn có quyền yêu cầu xem, sửa hoặc xóa thông tin của mình qua email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</li>
            </ul>
          </section>

          <section id="dieu-khoan">
            <h2>Điều khoản sử dụng</h2>
            <ul>
              <li>Đơn hàng được xác lập khi Hydron xác nhận qua Zalo, email hoặc điện thoại.</li>
              <li>Giá trên website đã gồm VAT (nếu có) và có thể thay đổi; đơn đã xác nhận giữ nguyên giá lúc đặt.</li>
              <li>Hydron có thể hủy đơn khi không liên lạc được với người đặt sau 3 lần gọi, hoặc khi sản phẩm hết hàng; tiền đã chuyển được hoàn đủ trong 3 ngày làm việc.</li>
              <li>Hình ảnh, logo, mô hình 3D và nội dung trên website thuộc quyền của Hydron.</li>
            </ul>
            <p>Thắc mắc về chính sách: gọi <a href={telLink()}>{SITE.phone}</a> hoặc xem <Link href="/hoi-dap">Hỏi đáp</Link>.</p>
          </section>
        </div>
      </div>
    </>
  );
}
