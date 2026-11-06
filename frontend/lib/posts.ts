// Bài viết Cẩm nang (SEO). Sau này có thể chuyển sang CMS; hiện viết sẵn trong code.
import type { Customization, Shape } from "@/shared/types/product.types";

export type Block = { h?: string; p?: string; list?: string[] };
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  minutes: number;
  cover: { hex: string; shape: Shape; size: string; custom?: Customization; bg: string };
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "chon-dung-tich-binh-giu-nhiet",
    title: "Chọn bình giữ nhiệt 500, 700 hay 900ml?",
    excerpt: "Tính theo lượng nước bạn uống, nơi bạn để bình và việc có muốn mang đá theo hay không.",
    date: "2026-10-28",
    minutes: 4,
    cover: { hex: "#0688AE", shape: "classic", size: "700", bg: "#D2EBF3" },
    body: [
      { p: "Người trưởng thành cần khoảng 2 lít nước mỗi ngày, nhiều hơn nếu tập luyện hoặc làm việc ngoài trời. Dung tích bình quyết định bạn phải rót thêm bao nhiêu lần, và bình nặng bao nhiêu khi đầy." },
      { h: "500ml: gọn, nhẹ, vừa túi xách", p: "Cao khoảng 22,5 cm, nặng 320 g khi rỗng. Vừa hộc xe máy, ngăn bên ba lô học sinh và túi xách nữ. Hợp người uống cà phê, trà buổi sáng hoặc trẻ đi học." },
      { h: "700ml: đủ cho một ngày làm việc", p: "Rót đầy ba lần là đủ 2 lít. Đựng được một ly đá lớn và vẫn còn chỗ cho nước. Đây là cỡ khách Hydron chọn nhiều nhất cho dân văn phòng." },
      { h: "900ml: phòng gym, đi phượt, dùng chung", p: "Giữ đá cả ngày nắng, rót cho hai ba người trong chuyến dã ngoại. Đổi lại bình nặng hơn khi đầy (gần 1,4 kg), nên dùng thêm quai đeo hoặc túi canvas." },
      { h: "Mẹo nhỏ", list: ["Đi xe máy nhiều: chọn 500 hoặc 700ml để vừa hộc.", "Uống đá: chọn lớn hơn một cỡ vì đá chiếm chỗ.", "Đồ uống nóng: bình nhỏ giữ nhiệt tốt hơn khi chỉ đầy một nửa."] },
    ],
  },
  {
    slug: "ve-sinh-binh-giu-nhiet-dung-cach",
    title: "Vệ sinh bình giữ nhiệt đúng cách, hết mùi sau 10 phút",
    excerpt: "Baking soda, giấm và một chiếc cọ mềm là đủ. Ba điều không nên làm để bình không mất nhiệt.",
    date: "2026-10-14",
    minutes: 3,
    cover: { hex: "#E6D8BF", shape: "flip", size: "500", bg: "#F5E6CA" },
    body: [
      { p: "Bình thép 304 không bám mùi như nhựa, nhưng gioăng silicon và cặn cà phê, trà có thể để lại mùi nếu không rửa kỹ." },
      { h: "Rửa hằng ngày", list: ["Tráng nước ấm ngay sau khi uống xong.", "Dùng nước rửa chén và cọ mềm cán dài.", "Úp ngược, mở nắp cho khô hẳn trước khi đóng."] },
      { h: "Khử mùi mỗi tuần", p: "Cho một thìa baking soda và nước ấm vào bình, lắc đều, để 10 phút rồi tráng sạch. Cặn trà, cà phê lâu ngày: thêm hai thìa giấm, ngâm 15 phút." },
      { h: "Ba điều không nên làm", list: ["Cho vào máy rửa bát: nhiệt cao làm hỏng lớp chân không và bong sơn.", "Dùng miếng cọ kim loại: trầy lòng bình và phần in tên.", "Ngâm cả bình trong nước qua đêm: nước có thể lọt vào khe ren đáy."] },
    ],
  },
  {
    slug: "y-tuong-in-ten-len-binh",
    title: "12 ý tưởng in tên lên bình làm quà tặng",
    excerpt: "Tên viết tay cho mẹ, số áo cho đồng đội, logo nhỏ cho đồng nghiệp: cách chọn chữ, màu mực cho từng dịp.",
    date: "2026-09-30",
    minutes: 5,
    cover: { hex: "#262B2E", shape: "sport", size: "700", custom: { text: "07", font: "block", ink: "#C8A15A", sticker: "sao" }, bg: "#E8D4B1" },
    body: [
      { p: "Một cái tên trên bình khiến món quà có chủ, không lẫn ở văn phòng hay lớp học. Trình thiết kế 3D cho bạn thử từng kiểu trước khi đặt." },
      { h: "Cho gia đình", list: ["Tên viết tay (kiểu chữ Viết tay) màu nhũ vàng trên bình Kem cát.", "“Bố”, “Mẹ” kèm sticker tim.", "Tên bé và số lớp trên Hydron Kids để không lẫn ở trường."] },
      { h: "Cho đội thể thao", list: ["Số áo cỡ lớn kiểu Khối trên Hydron Sport.", "Tên đội + sticker tia sét, cả đội cùng một màu.", "Biệt danh ngắn dưới 8 ký tự để chữ to, dễ đọc."] },
      { h: "Cho đồng nghiệp, khách hàng", list: ["Tên từng người, cùng mẫu cùng màu: đơn từ 20 bình có giá riêng.", "Logo công ty in một mặt, tên người nhận mặt còn lại (liên hệ Hydron).", "Màu Xanh đêm hoặc Đen than với mực trắng trông chỉn chu."] },
      { h: "Chọn màu mực dễ đọc", p: "Bình màu đậm hợp mực trắng hoặc nhũ vàng; bình Trắng sứ, Kem cát hợp mực đen. Trình thiết kế tự đổi mực khi bạn chọn bình màu sáng." },
    ],
  },
  {
    slug: "giu-nhiet-24-gio-hoat-dong-the-nao",
    title: "Vì sao bình giữ lạnh được 24 giờ?",
    excerpt: "Hai lớp thép, khoảng chân không ở giữa và một chiếc nắp kín: nguyên lý đơn giản đằng sau bình giữ nhiệt.",
    date: "2026-09-12",
    minutes: 3,
    cover: { hex: "#5B6C55", shape: "classic", size: "900", bg: "#DCE3D6" },
    body: [
      { p: "Nhiệt truyền qua ba cách: dẫn nhiệt, đối lưu và bức xạ. Bình giữ nhiệt chặn cả ba." },
      { h: "Lớp chân không", p: "Giữa hai lớp thép 304 là khoảng chân không. Không có không khí thì không có dẫn nhiệt và đối lưu qua thành bình. Vì vậy mặt ngoài không nóng, không đọng nước dù bên trong là nước đá." },
      { h: "Lớp phản xạ", p: "Mặt trong lớp ngoài được phủ đồng mỏng để phản xạ bức xạ nhiệt trở lại." },
      { h: "Nắp là điểm yếu", p: "Phần lớn nhiệt thoát qua nắp. Gioăng silicon phải khít và sạch. Mở nắp càng ít, đồ uống giữ nhiệt càng lâu." },
      { h: "Khi nào bình mất nhiệt?", p: "Bình rơi mạnh có thể làm hở lớp chân không: mặt ngoài sẽ ấm lên khi đựng nước nóng. Bình Hydron được bảo hành 12 tháng cho trường hợp này." },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
