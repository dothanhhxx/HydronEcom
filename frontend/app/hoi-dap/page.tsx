import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ds";
import JsonLd from "@/components/shell/JsonLd";
import { PageHeader } from "@/components/shell/PageHeader";
import { CUSTOM_LEAD_TIME, FREE_SHIP_MIN, formatVND } from "@/lib/checkout";
import { CUSTOM_STICKER_FEE, CUSTOM_TEXT_FEE, CUSTOM_TEXT_MAX } from "@/lib/products";
import { SITE, zaloLink } from "@/lib/site";

export const metadata: Metadata = { title: "Hỏi đáp", description: "Chọn dung tích, giữ nhiệt bao lâu, in tên lên bình, giao hàng, thanh toán VietQR, đổi trả và bảo hành tại Hydron." };

const FAQ: { group: string; items: [string, string][] }[] = [
  {
    group: "Về bình",
    items: [
      ["Bình giữ nóng, giữ lạnh được bao lâu?", "Giữ lạnh đến 24 giờ (đá còn sau khoảng 18 giờ ở 30°C), giữ nóng đến 12 giờ trên 60°C. Tráng nước nóng 1 phút trước khi rót đồ uống nóng để giữ lâu hơn."],
      ["Chọn 500, 700 hay 900ml?", "500ml cho đi học, túi xách; 700ml đủ một ngày làm việc; 900ml cho phòng gym, đi phượt hoặc dùng chung. Trang mỗi sản phẩm có bảng chiều cao, đường kính và cân nặng."],
      ["Bình có đựng được trà, cà phê, nước ép không?", "Được. Không đựng đồ uống có ga; sữa và nước trái cây nên uống hết trong 6 giờ. Nắp ống hút (Hydron Sport, Kids) dùng cho đồ uống lạnh."],
      ["Rửa bình bằng máy rửa bát được không?", "Không nên. Nhiệt độ cao làm hỏng lớp chân không và sơn ngoài. Rửa tay bằng nước ấm, nước rửa chén và cọ mềm."],
    ],
  },
  {
    group: "In tên, tự thiết kế",
    items: [
      ["In được những gì lên bình?", `Chữ hoặc số tối đa ${CUSTOM_TEXT_MAX} ký tự (có dấu tiếng Việt), 3 kiểu chữ, 5 màu mực, và một sticker. In chữ ${formatVND(CUSTOM_TEXT_FEE)}, sticker ${formatVND(CUSTOM_STICKER_FEE)} mỗi bình.`],
      ["Bản in có giống bản xem trước 3D không?", "Hydron in đúng nội dung, kiểu chữ, màu mực và vị trí như bản xem trước, rồi nhắn Zalo ảnh bình thật cho bạn trước khi giao. Màu mực trên màn hình có thể chênh nhẹ so với thực tế."],
      ["In tên mất bao lâu?", `Thêm ${CUSTOM_LEAD_TIME} so với bình trơn, sau đó gửi đi như đơn thường.`],
      ["Muốn in logo công ty cho nhiều người?", "Đơn từ 20 bình có giá riêng, in logo một mặt và tên từng người. Bạn gửi yêu cầu ở trang Liên hệ, Hydron báo giá trong một ngày làm việc."],
    ],
  },
  {
    group: "Đặt hàng, giao hàng",
    items: [
      ["Tôi có cần tạo tài khoản không?", "Không cần. Bạn chỉ cần tên, số điện thoại và địa chỉ. Hydron xác nhận đơn qua Zalo; bạn tra cứu đơn bằng mã đơn và số điện thoại."],
      ["Bao lâu thì nhận được hàng?", "Hà Nội 1 ngày, miền Bắc 1 – 3 ngày, miền Trung 2 – 4 ngày, miền Nam 3 – 5 ngày. Đơn in riêng cộng thêm thời gian in."],
      ["Phí giao hàng bao nhiêu?", `Từ ${formatVND(20000)} tùy khu vực, miễn phí cho đơn từ ${formatVND(FREE_SHIP_MIN)}.`],
      ["Tôi muốn gửi tặng người khác?", "Ở bước đặt hàng, chọn “Gửi tặng”, nhập tên và số điện thoại người nhận, thêm hộp quà kèm thiệp và chọn không kèm hóa đơn nếu muốn."],
    ],
  },
  {
    group: "Thanh toán, đổi trả",
    items: [
      ["Thanh toán chuyển khoản như thế nào?", `Chọn “Chuyển khoản ngân hàng” ở bước đặt hàng, mã VietQR có sẵn số tiền và mã đơn hiện ngay cạnh tổng tiền. Quét bằng app ngân hàng rồi bấm “Xác nhận đặt hàng”. Hydron xác nhận trong vòng ${SITE.confirmWithin}.`],
      ["Bình lỗi hoặc giao sai thì sao?", "Chụp ảnh và nhắn Zalo trong 7 ngày kể từ khi nhận. Hydron đổi bình mới hoặc hoàn tiền, chịu toàn bộ phí gửi lại."],
      ["Bình in tên có đổi trả được không?", "Chỉ đổi khi lỗi từ Hydron (in sai nội dung, bình lỗi, mất nhiệt). Bình in riêng không đổi vì lý do đổi ý."],
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.flatMap((g) => g.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))),
        }}
      />
      <PageHeader title="Hỏi đáp" crumbs={[{ label: "Hỏi đáp" }]} desc="Những câu khách hay hỏi Hydron. Chưa thấy câu của bạn? Nhắn Zalo nhé." />
      <div className="lt-container" style={{ paddingTop: 40, paddingBottom: 96, maxWidth: 860 }}>
        {FAQ.map((g) => (
          <section key={g.group} style={{ marginBottom: 44 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>{g.group}</h2>
            {g.items.map(([q, a]) => (
              <details key={q} className="lt-details">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </section>
        ))}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Button href={zaloLink()} iconLeft="message-circle">Nhắn Zalo</Button>
          <Button href="/chinh-sach" variant="secondary">Xem chính sách</Button>
        </div>
        <p style={{ marginTop: 24, fontSize: 14.5, color: "var(--text-muted)" }}>Đọc thêm trong <Link href="/cam-nang">Cẩm nang</Link>.</p>
      </div>
    </>
  );
}
