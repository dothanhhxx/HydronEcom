// Bài viết "Trà đàm". Tĩnh trong code; sau này có thể chuyển sang CMS.
export type Figure = { src: string; alt: string; w: number; h: number };
export type Block = { h?: string; img?: Figure; p?: string; list?: string[] };

// Ảnh hành trình (đã cắt bỏ khung, logo, chữ trong ảnh gốc)
export const JOURNEY_PHOTOS = {
  vungTrong: { src: "/assets/journey/vung-trong.webp", alt: "Đồi chè Tân Cương xanh mướt dưới nắng sớm", w: 562, h: 180 },
  thuHai: { src: "/assets/journey/thu-hai.webp", alt: "Người dân đội nón lá hái chè trên đồi", w: 569, h: 174 },
  cheBien: { src: "/assets/journey/che-bien.webp", alt: "Thợ chè đảo búp chè trong lồng sao", w: 572, h: 164 },
  thuongTra: { src: "/assets/journey/thuong-tra.webp", alt: "Rót trà từ ấm đất ra những chén nhỏ", w: 392, h: 194 },
  rotTra: { src: "/assets/journey/rot-tra.webp", alt: "Rót trà xanh vào chén gốm, bên cạnh trà khô", w: 556, h: 215 },
  voChe: { src: "/assets/journey/vo-che.webp", alt: "Búp chè non quay trong lồng sao", w: 526, h: 348 },
};
const J = JOURNEY_PHOTOS;

// Ảnh thương hiệu (ảnh chứng nhận đã cắt bỏ dải logo đơn vị khác ở trên cùng)
export const STORY_PHOTOS = {
  boSuuTap: { src: "/assets/story/bo-suu-tap-tinh-hoa-tra-viet.webp", alt: "Bốn hộp trà Lam Trà: Trà Đinh, Trà Nõn Tôm, Trà Nhài, Trà Móc Câu", w: 810, h: 540 },
  chungNhan: { src: "/assets/chung-nhan/tong-hop.webp", alt: "Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm, Giấy chứng nhận VietGAP và Giấy chứng nhận đăng ký hợp tác xã của Hợp tác xã Chè Thanh Huyền Trà", w: 1254, h: 1104 },
};
const S = STORY_PHOTOS;
export type Post = { slug: string; title: string; excerpt: string; date: string; ph: string; readMin: number; related: string[]; body: Block[] };

export const POSTS: Post[] = [
  {
    slug: "minh-bach-nguon-goc-an-tam-chat-luong",
    title: "Minh bạch nguồn gốc, an tâm chất lượng",
    excerpt: "Lam Trà hợp tác cùng Hợp tác xã Chè Thanh Huyền Trà (Thái Nguyên), đơn vị có đầy đủ giấy chứng nhận an toàn thực phẩm, VietGAP và đăng ký hợp tác xã.",
    date: "2026-11-04", ph: S.chungNhan.src, readMin: 2, related: ["tra-moc-cau", "tra-non-tom", "dinh-thuong-hang"],
    body: [
      { p: "Tại Lam Trà, chúng tôi chú trọng lựa chọn đối tác sản xuất có thông tin rõ ràng và hồ sơ chứng nhận minh bạch." },
      { h: "Đối tác sản xuất: Hợp tác xã Chè Thanh Huyền Trà", p: "Lam Trà hợp tác cùng Hợp tác xã Chè Thanh Huyền Trà (Thái Nguyên), đơn vị hoạt động trong lĩnh vực chế biến và kinh doanh chè, có Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm do Phòng Kinh tế thành phố Thái Nguyên cấp." },
      { h: "Hồ sơ chứng nhận", img: S.chungNhan, list: ["Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm", "Giấy chứng nhận VietGAP cho sản phẩm chè búp tươi", "Giấy chứng nhận đăng ký hợp tác xã"] },
      { p: "Với sự đồng hành của đối tác sản xuất, Lam Trà hướng đến việc mang những sản phẩm trà Việt có nguồn gốc rõ ràng đến gần hơn với người tiêu dùng." },
      { p: "Lam Trà: trân trọng giá trị trà Việt, xây dựng niềm tin từ những điều minh bạch." },
    ],
  },
  {
    slug: "tinh-hoa-tra-viet-trong-tung-bup-non",
    title: "Tinh hoa trà Việt trong từng búp non",
    excerpt: "Trà Đinh, Trà Nõn Tôm, Trà Nhài, Trà Móc Câu: bốn dòng trà, bốn sắc thái hương vị, cùng hội tụ trong bộ sưu tập Lam Trà.",
    date: "2026-11-02", ph: S.boSuuTap.src, readMin: 2, related: ["dinh-thuong-hang", "tra-non-tom", "tra-moc-cau"],
    body: [
      { p: "Mỗi loại trà mang một hương vị riêng, mỗi tách trà mở ra một câu chuyện về vùng đất và văn hóa thưởng trà Việt Nam." },
      { img: S.boSuuTap, p: "Từ vị thanh khiết, hậu ngọt sâu của Trà Đinh, hương thơm dịu nhẹ của Trà Nõn Tôm, nét thanh tao của Trà Nhài đến vị đậm đà, hậu ngọt của Trà Móc Câu, mỗi lựa chọn đều mang đến một trải nghiệm thưởng trà riêng biệt." },
      { h: "Bốn dòng trà, bốn sắc thái", list: ["Trà Đinh: hương vị thanh khiết, hậu ngọt sâu, tinh tế", "Trà Nõn Tôm: hương thơm dịu nhẹ, vị ngọt thanh, đậm hậu", "Trà Nhài: hương nhài thanh khiết, vị trà dịu nhẹ, cân bằng", "Trà Móc Câu: vị trà đậm đà, hậu ngọt, thích hợp dùng hằng ngày"] },
      { h: "Điều Lam Trà giữ trong mỗi hộp", list: ["Trà Thái Nguyên chất lượng cao", "Giữ trọn hương vị truyền thống", "Thiết kế hiện đại, phù hợp làm quà tặng", "Khám phá câu chuyện văn hóa qua mã QR trên bao bì"] },
      { p: "Dù bạn yêu thích vị trà thanh nhẹ hay đậm đà, Lam Trà luôn có một lựa chọn dành cho những khoảnh khắc thưởng trà của bạn. Lam Trà: tinh hoa trà Việt trong từng búp non." },
    ],
  },
  {
    slug: "mot-am-tra-pha-duoc-bao-nhieu-lan",
    title: "Một ấm trà có thể pha được bao nhiêu lần?",
    excerpt: "Một ấm trà Tân Cương có thể pha 3 – 4 lượt nước mà vẫn giữ hương vị. Mỗi lượt mang một sắc thái riêng, và đây là cách pha để tận hưởng trọn từng lượt.",
    date: "2026-10-31", ph: J.rotTra.src, readMin: 4, related: ["tra-moc-cau", "tra-non-tom", "dinh-thuong-hang"],
    body: [
      { h: "Một ấm trà Tân Cương pha được mấy lượt?", p: "Thông thường, trà xanh Tân Cương Thái Nguyên có thể pha khoảng 3 – 4 lượt nước, tùy chất lượng lá trà, lượng trà sử dụng, nhiệt độ nước và thời gian ủ. Trà chế biến từ búp chè non, chất lượng tốt và được bảo quản đúng cách thường giữ được hương vị qua nhiều lượt pha." },
      { p: "Không phải lượt nước nào cũng giống nhau. Qua mỗi lần pha, các hợp chất tạo hương và vị trong lá trà tiếp tục hòa tan vào nước, khiến màu sắc, hương thơm và độ đậm thay đổi. Đó chính là điểm thú vị khiến thưởng trà trở thành một trải nghiệm đáng khám phá." },
      { h: "Lượt thứ nhất: đánh thức hương trà", img: J.rotTra, p: "Lá trà bắt đầu nở ra và giải phóng hương, vị. Nước trà thường có màu vàng xanh trong, hương thơm nhẹ nhàng và vị chát thanh. Với trà Tân Cương, bạn có thể cảm nhận hương gợi nhớ cốm non cùng hậu ngọt dịu sau khi uống." },
      { h: "Lượt thứ hai: đậm đà hơn", p: "Lá trà đã nở nhiều hơn, hương vị thường rõ nét hơn lượt đầu. Vị chát và hậu ngọt trở nên cân bằng, giúp bạn cảm nhận rõ đặc trưng của trà Tân Cương." },
      { h: "Lượt thứ ba: dịu nhẹ, thanh thoát", p: "Hương vị bắt đầu nhẹ dần. Vị chát giảm, nước nhạt màu hơn nhưng vẫn giữ được một phần hương thơm và hậu vị. Đây là lượt nước hợp với người thích trà nhẹ nhàng." },
      { h: "Lượt thứ tư: dư vị cuối cùng", p: "Hương và vị giảm đáng kể. Nếu trà tốt và điều chỉnh thời gian ủ phù hợp, bạn vẫn có thể thưởng thức vị trà thanh nhẹ. Khi nước đã quá nhạt, hãy thay trà mới." },
      { h: "Bí quyết pha qua nhiều lượt nước", list: ["Khoảng 5g trà cho ấm 150 – 200ml; tráng ấm và chén bằng nước nóng trước khi pha", "Dùng nước khoảng 80 – 85°C, tránh nước sôi trực tiếp vì dễ làm trà chát", "Lượt 1 ủ 30 – 45 giây, lượt 2 ủ 40 – 50 giây, lượt 3 ủ 50 – 60 giây, lượt 4 có thể ủ 60 – 90 giây", "Rót hết nước sau mỗi lượt, không để lá trà ngâm lâu trong ấm"] },
      { p: "Thời gian trên chỉ mang tính tham khảo. Bạn có thể điều chỉnh tùy loại trà và khẩu vị của mình." },
      { h: "Lưu ý để giữ hương vị", list: ["Chọn trà có nguồn gốc rõ ràng, bảo quản trong bao bì kín", "Không dùng quá nhiều trà hoặc ngâm quá lâu chỉ để tạo vị đậm", "Thưởng thức các lượt trà trong cùng một buổi, không để bã trà qua đêm rồi pha tiếp", "Để ý sự thay đổi của hương, màu nước và hậu vị để tìm cách pha hợp với mình"] },
      { p: "Lượt đầu nhẹ nhàng, lượt tiếp theo đậm đà hơn, những lượt cuối dần thanh thoát. Một ấm trà, nhiều tầng hương vị. Cùng Lam Trà khám phá nét tinh tế của trà Tân Cương qua từng lượt nước." },
    ],
  },
  {
    slug: "chen-tra-dau-cau-chuyen",
    title: "Chén trà đầu câu chuyện: nét đẹp trong văn hóa người Việt",
    excerpt: "Trong đời sống người Việt, chén trà không đơn thuần là thức uống mà còn là lời chào thân tình, thể hiện sự hiếu khách và gắn kết con người.",
    date: "2026-10-30", ph: J.thuongTra.src, readMin: 4, related: ["tra-moc-cau", "tra-non-tom"],
    body: [
      { p: "Từ những cuộc gặp gỡ đầu tiên đến những buổi sum họp gia đình, chén trà luôn mang trong mình những giá trị văn hóa giản dị mà sâu sắc." },
      { h: "Chén trà, lời chào thân tình", p: "Khi có khách đến chơi nhà, gia chủ thường mời một chén trà trước khi bắt đầu câu chuyện. Không cần lời chào hỏi cầu kỳ, một chén trà được rót bằng sự chân thành cũng đủ tạo nên bầu không khí gần gũi. Bởi vậy, mời trà không đơn thuần là mời một thức uống mà còn là lời mời mở đầu cho sự kết nối." },
      { h: "Chén trà trong những buổi sum họp", img: J.thuongTra, p: "Buổi sáng, một ấm trà nóng mở đầu ngày mới. Buổi chiều, chén trà là người bạn trong phút nghỉ ngơi. Những dịp lễ, Tết, cả nhà quây quần bên bàn trà: ông bà kể chuyện ngày xưa, cha mẹ chia sẻ chuyện cuộc sống, con cháu có dịp lắng nghe và thấu hiểu thế hệ đi trước." },
      { h: "Văn hóa mời trà: sự tinh tế trong ứng xử", p: "Gia chủ chuẩn bị trà, chén và nước nóng cẩn thận, mời trà bằng thái độ niềm nở. Người thưởng trà nhấp từng ngụm nhỏ để cảm nhận hương vị và tận hưởng cuộc trò chuyện. Văn hóa trà vì thế không chỉ nằm ở cách pha hay cách uống mà còn ở thái độ ứng xử và sự chân thành giữa người với người." },
      { h: "Trà Tân Cương: hương vị của những cuộc trò chuyện", p: "Với hương thơm gợi nhớ cốm non, vị chát dịu và hậu ngọt thanh, trà Tân Cương Thái Nguyên hợp với những cuộc gặp bạn bè, buổi tiếp khách tại gia hay phút nghỉ ngơi sau ngày làm việc. Hương trà nhẹ nhàng cùng cách thưởng thức chậm rãi tạo nên không gian để mọi người trò chuyện và sẻ chia." },
      { h: "Lam Trà: kết nối những câu chuyện qua hương vị trà Việt", p: "Lam Trà mong đưa trà truyền thống đến gần hơn với cuộc sống hiện đại qua những sản phẩm có nguồn gốc rõ ràng, bao bì tiện dụng và thiết kế mang nét đẹp văn hóa Việt. Qua mã QR trên bao bì, bạn có thể tìm hiểu thêm về vùng chè Tân Cương, hành trình làm nên búp trà và nghệ thuật thưởng trà." },
      { p: "Giữa nhịp sống hiện đại, một chén trà có thể là lý do giản dị để mọi người dành thời gian cho nhau. Một chén trà mở lời, một câu chuyện bắt đầu." },
    ],
  },
  {
    slug: "y-nghia-tang-tra-trong-van-hoa-viet",
    title: "Tặng trà có ý nghĩa gì trong văn hóa Việt Nam?",
    excerpt: "Trà không chỉ là thức uống quen thuộc mà còn là món quà thể hiện sự quan tâm, lòng kính trọng và tình cảm chân thành, dành cho gia đình, bạn bè hay đối tác.",
    date: "2026-10-29", ph: "hopqua", readMin: 4, related: ["hop-qua-trao-gui", "dinh-thuong-hang", "tra-moc-cau"],
    body: [
      { h: "Trao gửi sự trân trọng và chân thành", p: "Trong văn hóa tặng quà, trà mang ý nghĩa của sự trân trọng và quan tâm. Một hộp trà ngon không chỉ thể hiện tấm lòng người tặng mà còn gửi gắm lời chúc bình an, sức khỏe đến người nhận. Khác với những món quà mang tính hình thức, trà được dùng hằng ngày, tạo nên những khoảnh khắc thư giãn và gắn kết." },
      { h: "Tặng trà cho gia đình: món quà của sự quan tâm", p: "Những món quà dành cho ông bà, cha mẹ thường thể hiện lòng biết ơn và sự hiếu kính. Một hộp trà Tân Cương với hương thơm tự nhiên, vị chát dịu và hậu ngọt thanh hợp với người yêu trà truyền thống. Trong dịp Tết Nguyên đán, lễ Vu Lan hay những buổi đoàn viên, món quà trà còn là mong muốn dành thêm thời gian để trò chuyện cùng người thân." },
      { h: "Tặng trà cho bạn bè: gắn kết những mối quan hệ", p: "Tặng trà cho bạn không cần dịp đặc biệt: có thể là món quà nhỏ sau chuyến đi, lời cảm ơn vì sự giúp đỡ, hay đơn giản là chia sẻ một hương vị mình yêu thích. Trà Móc Câu, Nõn Tôm hay trà Nhài mang đến nhiều lựa chọn hợp với từng sở thích." },
      { h: "Tặng trà cho đối tác: lịch sự và tôn trọng", p: "Trà mang nét văn hóa truyền thống, có tính ứng dụng và dễ kết hợp với thiết kế quà tặng trang nhã. Trà Tân Cương có nguồn gốc rõ ràng, chất lượng ổn định, bao bì chỉn chu là món quà ý nghĩa trong dịp lễ, Tết, tri ân khách hàng hay gặp gỡ đối tác." },
      { h: "Quà trà từ Lam Trà", img: S.boSuuTap, p: "Lam Trà hướng đến những bộ quà tặng kết hợp trà Tân Cương chất lượng với hộp giấy cứng hiện đại, trang nhã; bên trong là hai hộp trà được chọn để hợp với nhiều dịp tặng. Mã QR trên bao bì giúp người nhận khám phá nguồn gốc trà, nét đặc trưng của vùng chè Tân Cương và những câu chuyện văn hóa gắn với sản phẩm." },
      { p: "Giá trị của món quà không chỉ nằm ở hình thức hay giá thành mà ở sự phù hợp với người nhận và tình cảm người tặng gửi gắm. Một hộp trà trao tay, một lời trân trọng gửi gắm." },
    ],
  },
  {
    slug: "nhung-ban-tay-lam-nen-chen-tra",
    title: "Từ những búp trà non: những bàn tay làm nên chén trà",
    excerpt: "Đằng sau mỗi chén trà thơm ngon không chỉ là những búp chè xanh mướt, mà còn là câu chuyện về những con người dành bao tâm huyết cho nghề làm trà.",
    date: "2026-10-28", ph: "/assets/journey/hai-bup.webp", readMin: 3, related: ["tra-non-tom", "dinh-thuong-hang"],
    body: [
      { p: "Trên những đồi chè Tân Cương, Thái Nguyên, khi sương sớm vẫn còn vương trên từng tán lá, người nông dân đã bắt đầu một ngày làm việc quen thuộc. Đôi bàn tay thoăn thoắt lựa chọn từng búp chè non, cẩn thận hái đúng độ để giữ trọn chất lượng của nguyên liệu." },
      { h: "Một nghề được gìn giữ qua nhiều thế hệ", p: "Với người dân nơi đây, làm trà không chỉ là công việc mưu sinh mà còn là một nghề truyền thống. Từ khâu chăm sóc, thu hái đến sao chè, vò chè, mỗi công đoạn đều đòi hỏi sự khéo léo, kiên nhẫn và kinh nghiệm của người làm nghề." },
      { h: "Để có một chén trà ngon", img: J.voChe, p: "Không chỉ cần những búp chè chất lượng, mà còn là cả một quá trình đầy tâm huyết:", list: ["Sự tỉ mỉ trong từng công đoạn chế biến", "Kinh nghiệm làm trà được gìn giữ qua nhiều thế hệ", "Tình yêu và sự trân trọng dành cho vùng đất chè Thái Nguyên"] },
      { p: "Để rồi khi chén trà được rót ra, hương thơm dịu nhẹ lan tỏa, vị chát thanh nơi đầu lưỡi dần nhường chỗ cho hậu ngọt sâu lắng. Nâng chén trà trên tay, ta không chỉ thưởng thức hương vị của thiên nhiên mà còn cảm nhận được câu chuyện về những con người đứng sau mỗi sản phẩm." },
      { p: "Trân trọng từng búp trà, nâng niu công sức người làm trà. Đó cũng là cách Lam Trà gìn giữ giá trị của trà Thái Nguyên." },
    ],
  },
  {
    slug: "hanh-trinh-tu-doi-che-den-tach-tra",
    title: "Hành trình từ đồi chè đến tách trà thơm ngon",
    excerpt: "Theo chân những búp chè Tân Cương, Thái Nguyên qua năm công đoạn, nơi hương vị truyền thống được gìn giữ để tạo nên những tách trà đậm đà bản sắc Việt.",
    date: "2026-10-24", ph: "/assets/journey/binh-minh.webp", readMin: 5, related: ["tra-moc-cau", "tra-non-tom", "dinh-thuong-hang"],
    body: [
      { p: "Đằng sau mỗi tách trà không chỉ là hương vị thanh dịu, đậm đà mà còn là cả một hành trình được tạo nên từ thiên nhiên, bàn tay con người và những giá trị truyền thống. Từ những đồi chè xanh mướt tại Tân Cương đến từng công đoạn thu hái, chế biến và đóng gói, mỗi bước đều góp phần tạo nên nét đặc trưng của trà Việt." },
      { h: "01. Vùng trồng: nơi khởi nguồn hương vị", img: J.vungTrong, p: "Hành trình bắt đầu tại Tân Cương, Thái Nguyên, vùng đất nổi tiếng với truyền thống trồng và chế biến chè lâu đời. Những đồi chè trải dài trên các sườn đồi là nơi nuôi dưỡng những búp chè chất lượng. Nhờ điều kiện tự nhiên phù hợp cùng kinh nghiệm canh tác tích lũy qua nhiều thế hệ, trà Tân Cương được biết đến với hương thơm tự nhiên, vị chát dịu và hậu ngọt đặc trưng." },
      { h: "02. Thu hái: sự tỉ mỉ của người làm trà", img: J.thuHai, p: "Khi búp chè đạt độ non thích hợp, người dân bắt đầu thu hái. Từng búp được lựa chọn cẩn thận để đảm bảo độ tươi trước khi đưa vào chế biến. Thu hái không đơn thuần là một hoạt động sản xuất mà còn thể hiện sự khéo léo và kinh nghiệm của người dân địa phương, góp phần giữ hương vị tự nhiên của lá chè." },
      { h: "03. Chế biến: gìn giữ hương vị truyền thống", img: J.cheBien, p: "Búp chè tươi trải qua các công đoạn làm héo, diệt men, vò và sấy khô tùy theo từng loại trà. Đây là giai đoạn đòi hỏi kiểm soát chặt nhiệt độ, thời gian và kỹ thuật để giữ được màu nước, hương thơm và vị trà. Kinh nghiệm làm trà truyền thống kết hợp với thiết bị chế biến hiện đại giúp chất lượng trà ổn định giữa các mẻ." },
      { h: "04. Đóng gói: khi truyền thống gặp hiện đại", p: "Sau khi chế biến, trà được bảo quản và đóng gói để hạn chế tác động của độ ẩm, ánh sáng và các yếu tố bên ngoài. Với Lam Trà, bao bì không chỉ bảo vệ trà mà còn là nơi kể câu chuyện thương hiệu, với thiết kế lấy cảm hứng từ thiên nhiên và văn hóa Việt Nam. Lam Trà dự kiến gắn mã QR trên bao bì, giúp bạn tìm hiểu về vùng trà, cách pha và những câu chuyện văn hóa gắn với sản phẩm." },
      { h: "05. Thưởng trà: khi hành trình trở thành trải nghiệm", img: J.thuongTra, p: "Hành trình khép lại khi lá trà khô được đánh thức bằng dòng nước nóng, lan tỏa hương thơm và tạo nên sắc nước đặc trưng. Trong văn hóa Việt, thưởng trà gắn với những lúc sum họp gia đình, tiếp đón bạn bè hay phút thư giãn sau một ngày làm việc. Một tách trà ấm có thể trở thành cầu nối giữa các thế hệ." },
      { p: "Từ Tân Cương đến khoảnh khắc thưởng thức, mỗi công đoạn đều mang dấu ấn của thiên nhiên, con người và sự tận tâm. Lam Trà mong góp phần gìn giữ giá trị trà truyền thống, đồng thời đưa trà Việt đến gần hơn với nhịp sống hiện đại." },
    ],
  },
  {
    slug: "uong-tra-hay-thuong-tra",
    title: "Uống trà hay thưởng trà?",
    excerpt: "Một ly trà mát lạnh giúp bạn giải khát trong ngày nắng. Nhưng nếu dành thêm một chút thời gian, thức uống quen thuộc này còn mở ra nhiều điều hơn.",
    date: "2026-10-19", ph: "/assets/journey/uong-tra.webp", readMin: 2, related: ["tra-moc-cau", "tra-non-tom"],
    body: [
      { h: "Uống trà", p: "Là cảm nhận hương vị theo cách gần gũi nhất, khi bạn cần một thức uống yêu thích trong cuộc sống hằng ngày." },
      { h: "Thưởng trà", img: J.rotTra, p: "Là khi bạn bắt đầu quan tâm đến hương thơm, vị trà, nguồn gốc của những búp trà và câu chuyện của những người làm nên sản phẩm." },
      { p: "Đằng sau mỗi sản phẩm trà Việt không chỉ có hương vị, mà còn có vùng đất, con người và những giá trị văn hóa được gìn giữ qua thời gian." },
      { p: "Với Lam Trà, mỗi chén trà có thể mở ra một hành trình khám phá, từ hương vị trên đầu lưỡi đến câu chuyện phía sau sản phẩm. Bởi đôi khi, hiểu thêm về trà cũng là cách để trân trọng hơn những giá trị quen thuộc của Việt Nam." },
      { p: "Còn bạn, lần gần nhất uống trà, bạn chỉ thưởng thức hương vị hay đã từng tò mò về câu chuyện phía sau chén trà ấy?" },
    ],
  },
  {
    slug: "thai-nguyen-noi-huong-tra-ke-chuyen",
    title: "Thái Nguyên: nơi hương trà kể chuyện đất Việt",
    excerpt: "Nhắc đến trà Việt Nam, Thái Nguyên là một trong những vùng đất gắn liền với truyền thống trồng chè và nghệ thuật thưởng trà lâu đời.",
    date: "2026-10-12", ph: "/assets/bg/tea-hill-thai-nguyen.webp", readMin: 3, related: ["tra-moc-cau", "dinh-thuong-hang"],
    body: [
      { p: "Nơi đây không chỉ được biết đến bởi những đồi chè xanh mướt, mà còn bởi hương vị trà mang nét riêng, được tạo nên từ điều kiện tự nhiên và kinh nghiệm của những người làm trà." },
      { h: "Điều gì tạo nên nét riêng của trà Thái Nguyên?", img: J.vungTrong, p: "Từ thổ nhưỡng, khí hậu đến giống chè và cách chăm sóc, thu hái, chế biến, mỗi yếu tố đều góp phần hình thành đặc điểm của trà. Đặc biệt, quá trình chế biến đòi hỏi sự tỉ mỉ và kinh nghiệm để giữ được đặc tính riêng của lá chè, tạo nên hương thơm, màu nước và vị trà đặc trưng." },
      { img: J.thuHai, p: "Đằng sau mỗi mẻ trà là sự cần mẫn của người trồng chè, những người gắn bó với từng luống chè, chăm chút cây chè qua từng mùa vụ và góp phần gìn giữ nghề làm trà truyền thống." },
      { h: "Với Lam Trà, trà Thái Nguyên không chỉ là một thức uống", p: "Đó còn là câu chuyện về vùng đất, con người và những giá trị văn hóa được lưu giữ qua nhiều thế hệ. Vì vậy, Lam Trà chọn trà Thái Nguyên làm dòng sản phẩm chủ lực, mang những sản phẩm có nguồn gốc rõ ràng đến gần hơn với người tiêu dùng hiện đại, đồng thời giúp câu chuyện phía sau mỗi sản phẩm được biết đến rộng rãi hơn." },
      { p: "Khi hiểu thêm về nguồn gốc và cách làm nên một sản phẩm trà, mỗi tách trà không chỉ mang đến phút giây thưởng thức mà còn mở ra cơ hội khám phá những giá trị của trà Việt." },
    ],
  },
  {
    slug: "cach-pha-tra-thai-nguyen",
    title: "Pha một ấm trà Thái Nguyên cho đúng vị",
    excerpt: "Nhiệt độ nước, lượng trà và thời gian hãm quyết định ấm trà ngọt hậu hay chát gắt. Vài bước nhỏ Lam Trà vẫn làm mỗi sáng.",
    date: "2026-10-05", ph: "moccau", readMin: 4, related: ["tra-moc-cau", "tra-non-tom"],
    body: [
      { p: "Trà xanh Thái Nguyên không khó pha, nhưng dễ pha hỏng. Phần lớn ấm trà bị chát gắt là do nước quá nóng hoặc hãm quá lâu, chứ không phải do trà." },
      { h: "Chuẩn bị", list: ["Ấm sứ hoặc ấm đất nhỏ, khoảng 150ml", "5g trà, tương đương hai thìa cà phê đầy", "Nước lọc hoặc nước suối, đun sôi rồi để nguội còn 80 – 85°C"] },
      { h: "Tráng ấm và đánh thức trà", p: "Rót nước nóng tráng ấm, chén cho ấm đều. Cho trà vào, rót một ít nước rồi chắt ra ngay. Bước này giúp cánh trà nở và rửa bớt bụi trà." },
      { h: "Hãm nước đầu", p: "Rót nước đầy ấm, đậy nắp, hãm 20 – 30 giây rồi rót hết ra chén. Không để nước đọng lại trong ấm, vì trà tiếp tục ngấm sẽ làm nước sau đắng." },
      { h: "Những nước sau", p: "Mỗi nước sau tăng thêm khoảng 10 giây. Trà Móc Câu ngon tới nước thứ tư, thứ năm; Đinh Thượng Hạng có thể tới nước thứ bảy." },
      { h: "Dấu hiệu pha đúng", list: ["Nước xanh vàng, trong, không đục", "Vị chát nhẹ ở đầu lưỡi rồi tan nhanh", "Hậu ngọt đọng lại ở cổ họng sau khi uống"] },
    ],
  },
  {
    slug: "phan-biet-moc-cau-non-tom-dinh",
    title: "Móc Câu, Nõn Tôm, Đinh: khác nhau ở đâu?",
    excerpt: "Cùng một cây chè Tân Cương, cách hái khác nhau cho ra ba loại trà với giá và vị rất khác. Đây là cách phân biệt bằng mắt và bằng vị.",
    date: "2026-09-18", ph: "dinhth", readMin: 5, related: ["tra-moc-cau", "tra-non-tom", "dinh-thuong-hang"],
    body: [
      { p: "Tên gọi của trà Thái Nguyên phần lớn đến từ cách hái: hái phần nào của ngọn chè, và hái lúc nào. Phần càng non, trà càng ít và càng đắt." },
      { h: "Trà Đinh", p: "Chỉ lấy phần búp nhỏ nhất ở đầu ngọn, khi còn cuộn chặt như chiếc đinh. Cánh trà nhỏ, nhọn, phủ lông tơ trắng. Nước xanh ánh vàng nhạt, vị đậm sâu, hậu ngọt rất lâu." },
      { h: "Trà Nõn Tôm", p: "Hái một tôm một lá: búp non và lá non ngay dưới búp. Cánh trà nhỏ, đều, cong nhẹ như con tôm. Nước xanh trong, vị thanh, dễ uống." },
      { h: "Trà Móc Câu", p: "Hái một tôm hai lá. Khi sao, cánh trà xoăn lại như lưỡi câu. Đây là loại phổ biến nhất, vị chát dịu rồi ngọt, hợp uống hằng ngày." },
      { h: "Còn Hạng 1 và Hạng 2?", p: "Ở Lam Trà, cùng một loại trà được chia hạng sau khi sao. Hạng 1 là phần cánh đều, đẹp, hương đậm. Hạng 2 cánh to và không đều hơn, vị nhẹ hơn, giá mềm hơn, hợp pha ấm lớn mỗi ngày." },
      { h: "Phân biệt nhanh", list: ["Nhìn cánh: Đinh nhỏ và thẳng nhất, Móc Câu xoăn nhất", "Nhìn nước: Đinh và Nõn Tôm trong hơn Móc Câu", "Nếm: Đinh đậm, Nõn Tôm thanh, Móc Câu chát dịu"] },
    ],
  },
  {
    slug: "bao-quan-tra-xanh",
    title: "Bảo quản trà xanh để giữ hương suốt năm",
    excerpt: "Trà là thứ hút ẩm và hút mùi rất nhanh. Bảo quản sai một tuần là mất hương cả gói. Năm điều nên và không nên.",
    date: "2026-08-30", ph: "nontom", readMin: 3, related: ["tra-dinh-sen", "tra-non-tom"],
    body: [
      { p: "Trà xanh đã sao khô có độ ẩm rất thấp, nên khi gặp không khí ẩm, trà sẽ hút nước và mất hương. Trà cũng hút mùi của mọi thứ để gần." },
      { h: "Nên", list: ["Để trong túi zip của Lam Trà, ép hết không khí sau mỗi lần dùng", "Chia nhỏ gói lớn ra hũ thủy tinh hoặc hộp thiếc kín", "Để nơi khô mát, tránh nắng, tránh bếp"] },
      { h: "Không nên", list: ["Để chung tủ với cà phê, gia vị, xà phòng", "Dùng thìa ướt xúc trà", "Để ngăn đá tủ lạnh rồi lấy ra lấy vào nhiều lần, vì hơi nước sẽ đọng lại"] },
      { h: "Trà sen cần chú ý thêm", p: "Hương sen dễ bay hơn hương trà. Bạn nên dùng trà sen trong khoảng 6 tháng đầu để giữ được hương đẹp nhất, dù hạn dùng là 12 tháng." },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

export const formatDate = (iso: string) => iso.split("-").reverse().join("/");
