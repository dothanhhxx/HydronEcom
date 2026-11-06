// Đánh giá mẫu. Giai đoạn 3: lấy từ database, chỉ khách đã mua mới được đánh giá (nhãn "Đã mua hàng").
export type Review = { slug: string; name: string; stars: number; date: string; text: string; verified: boolean; variant?: string };

export const REVIEWS: Review[] = [
  { slug: "tra-dinh-sen", name: "Chị Hạnh", stars: 5, date: "12/10/2026", variant: "300g · Hạng 1", verified: true, text: "Trà thơm đúng mùi sen, đóng gói cẩn thận. Mua biếu bố mẹ, ông bà rất thích." },
  { slug: "tra-dinh-sen", name: "Anh Quân", stars: 5, date: "02/10/2026", variant: "150g · Hạng 1", verified: true, text: "Hương sen không bị gắt như loại tẩm hương. Pha tới nước thứ tư vẫn còn thơm." },
  { slug: "tra-dinh-sen", name: "Chị Lan", stars: 4, date: "21/09/2026", variant: "150g · Hạng 2", verified: false, text: "Ngon, giá hợp lý. Mong có hộp thiếc để bảo quản tiện hơn." },
  { slug: "tra-moc-cau", name: "Anh Tuấn", stars: 5, date: "03/10/2026", variant: "500g · Hạng 2", verified: true, text: "Nước pha đến lần thứ tư vẫn còn ngọt. Giao nhanh, có nhắn Zalo xác nhận." },
  { slug: "tra-moc-cau", name: "Cô Bình", stars: 5, date: "15/09/2026", variant: "300g · Hạng 1", verified: true, text: "Uống quen trà Tân Cương mấy chục năm, trà này đúng vị, cánh xoăn đều." },
  { slug: "tra-moc-cau", name: "Minh Thư", stars: 4, date: "28/09/2026", variant: "150g · Hạng 1", verified: true, text: "Hương dịu, hợp uống buổi sáng. Mong có thêm gói nhỏ 100g." },
  { slug: "tra-non-tom", name: "Anh Đức", stars: 5, date: "08/10/2026", variant: "150g · Hạng 1", verified: true, text: "Nước xanh trong, vị thanh, hậu ngọt rõ. Đóng túi zip tiện bảo quản." },
  { slug: "tra-non-tom", name: "Chị Mai", stars: 5, date: "19/09/2026", variant: "300g · Hạng 1", verified: true, text: "Mua tặng sếp nhân 20/10, được khen trà ngon. Thiệp viết tay rất có tâm." },
  { slug: "dinh-thuong-hang", name: "Anh Khoa", stars: 5, date: "11/10/2026", variant: "150g · Hạng 1", verified: true, text: "Búp nhỏ đều, pha ấm nhỏ thấy hậu ngọt rất lâu. Đáng tiền." },
  { slug: "hop-qua-trao-gui", name: "Chị Thảo", stars: 5, date: "05/10/2026", verified: true, text: "Hộp sơn mài đẹp, gói quà chỉn chu. Lam Trà giao thẳng tới nhà bà ngoại, không kèm hóa đơn đúng như mình dặn." },
  { slug: "hop-qua-trao-gui", name: "Anh Hùng", stars: 5, date: "20/09/2026", verified: true, text: "Đặt 20 hộp làm quà Trung thu cho khách hàng, được báo giá riêng và giao đúng hẹn." },
];

export const reviewsOf = (slug: string) => REVIEWS.filter((r) => r.slug === slug);

/** Lời nhận xét hiển thị trên trang chủ. */
export const TESTIMONIALS = [REVIEWS[0], REVIEWS[3], REVIEWS[9]];
