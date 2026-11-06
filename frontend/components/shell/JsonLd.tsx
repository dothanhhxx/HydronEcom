/** Dữ liệu có cấu trúc schema.org để Google hiển thị sao, giá, câu hỏi… */
export default function JsonLd({ data }: { data: object }) {
  // Thoát "<" để nội dung không thể đóng thẻ script.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
