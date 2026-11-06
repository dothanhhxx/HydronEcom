import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ds";
import JsonLd from "@/components/shell/JsonLd";
import { PageHeader } from "@/components/shell/PageHeader";
import { zaloLink } from "@/lib/site";

export const metadata: Metadata = { title: "Hỏi đáp", description: "Hạn dùng, cách bảo quản, phân biệt Hạng 1 và Hạng 2, giao hàng, thanh toán VietQR và đổi trả tại Lam Trà." };

const FAQ: { group: string; items: [string, string][] }[] = [
  {
    group: "Về trà",
    items: [
      ["Hạng 1 và Hạng 2 khác nhau thế nào?", "Cùng một loại trà, sau khi sao được chia hạng. Hạng 1 cánh nhỏ, đều, hương đậm, hợp biếu tặng và thưởng trà. Hạng 2 cánh to và không đều hơn, vị nhẹ hơn, giá mềm hơn, hợp pha ấm lớn uống hằng ngày."],
      ["Trà để được bao lâu?", "Hạn dùng 12 tháng kể từ ngày đóng gói, in trên mỗi túi. Trà ngon nhất trong 6 tháng đầu, riêng trà sen nên dùng sớm để giữ hương."],
      ["Bảo quản trà thế nào?", "Ép hết không khí trong túi zip sau mỗi lần dùng, để nơi khô mát, tránh nắng và tránh để gần đồ có mùi như cà phê, gia vị. Gói lớn nên chia ra hũ kín nhỏ."],
      ["Trà có hương liệu hay phẩm màu không?", "Không. Trà xanh chỉ có búp chè sao tay. Trà sen được ướp bằng gạo sen tươi, không dùng tinh dầu hay hương sen tổng hợp."],
      ["Mua 150g hay 300g thì hợp?", "Một người uống mỗi sáng dùng khoảng 150g mỗi tháng. Gói 300g và 500g có giá mỗi gam tốt hơn, nhưng nên chia nhỏ để giữ hương."],
    ],
  },
  {
    group: "Đặt hàng và giao hàng",
    items: [
      ["Tôi có cần tạo tài khoản không?", "Không cần. Bạn chỉ cần tên, số điện thoại và địa chỉ. Lam Trà xác nhận đơn qua Zalo, bạn tra cứu đơn bằng mã đơn và số điện thoại."],
      ["Bao lâu thì nhận được hàng?", "Thái Nguyên 1 ngày, miền Bắc 1 – 2 ngày, miền Trung 2 – 4 ngày, miền Nam 3 – 5 ngày. Đơn đặt trước 15:00 được gửi trong ngày."],
      ["Tôi muốn gửi quà tới người khác?", "Ở bước đặt hàng, bạn chọn “Gửi tặng”, nhập tên và số điện thoại người nhận, ghi lời nhắn trên thiệp và chọn không kèm hóa đơn nếu muốn."],
      ["Đặt số lượng lớn cho công ty được không?", "Được. Bạn gửi yêu cầu ở mục quà doanh nghiệp, Lam Trà báo giá trong một ngày làm việc."],
    ],
  },
  {
    group: "Thanh toán và đổi trả",
    items: [
      ["Thanh toán chuyển khoản như thế nào?", "Ở bước đặt hàng, bạn chọn “Chuyển khoản ngân hàng”, mã QR và mã đơn hiện ngay bên cạnh tổng tiền. Bạn mở app ngân hàng, quét mã, nhập đúng số tiền và ghi mã đơn vào nội dung, rồi bấm “Xác nhận đặt hàng”. Lam Trà kiểm tra và xác nhận qua Zalo trong vòng 30 phút."],
      ["Chuyển khoản rồi mà chưa thấy xác nhận?", "Lam Trà đối soát trong giờ làm việc, thường dưới 30 phút. Nếu lâu hơn, bạn nhắn Zalo kèm ảnh giao dịch nhé."],
      ["Trà bị ẩm hoặc giao sai thì sao?", "Bạn chụp ảnh và nhắn Zalo trong 7 ngày. Lam Trà đổi gói mới hoặc hoàn tiền, chịu toàn bộ phí gửi lại."],
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
      <PageHeader title="Hỏi đáp" crumbs={[{ label: "Hỏi đáp" }]} desc="Những câu khách hay hỏi Lam Trà. Chưa thấy câu của bạn? Nhắn Zalo nhé." />
      <div className="lt-container" style={{ paddingTop: 24, paddingBottom: 80, maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
        {FAQ.map((g) => (
          <section key={g.group} style={{ marginBottom: 40 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 500, color: "var(--text-strong)" }}>{g.group}</h2>
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
        <p style={{ marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>Muốn hiểu thêm về trà? Đọc <Link href="/tra-dam">Trà đàm</Link>.</p>
      </div>
    </>
  );
}
