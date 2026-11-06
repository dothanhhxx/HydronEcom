# Hydron E-Commerce

Website bán bình giữ nhiệt Hydron: bình thép 304 dung tích 500 – 900ml, khách tự thiết kế 3D (in tên, số, sticker) ngay trên web.

- **Frontend**: Next.js 15 (App Router) + React 19, three.js cho trình thiết kế 3D
- **Backend**: Fastify + TypeScript REST API, lưu file JSON hoặc Supabase

## Chạy local

```bash
npm install
npm run dev          # backend :4000 + frontend :3000
```

- Cửa hàng: http://localhost:3000
- Trình thiết kế 3D: http://localhost:3000/thiet-ke-3d
- Quản trị: http://localhost:3000/quan-tri (mật khẩu: `ADMIN_SECRET_KEY` trong `backend/.env`; để trống khi chạy local thì dùng `Hydron@Dev2026`)
- Kiểm tra API: http://localhost:4000/api/health

Lưu ý: đừng chạy `next build` vào thư mục `.next` khi `next dev` đang chạy. Muốn build thử song song: `NEXT_DIST_DIR=.next-verify npx next build`.

## Tính năng

| Nhóm | Có gì |
|---|---|
| Sản phẩm | Biến thể dung tích × màu, giá riêng từng dung tích, tồn kho theo biến thể, giá khuyến mãi, bảng dung tích vẽ cùng tỉ lệ, thông số, hướng dẫn bảo quản, ảnh/ảnh theo màu/video, xem 3D |
| Ảnh sản phẩm | Chưa có ảnh chụp thì tự dựng ảnh theo màu và dung tích (`components/bottle/BottleRender.tsx`); tải ảnh thật lên ở trang quản trị |
| Ảnh chụp có sẵn | `frontend/public/assets/products/` (Hydron Dune, túi xách ly 4 màu, 5 móc khóa linh vật), khung 4:5 WebP. Ảnh theo màu: chú thích ảnh phụ chứa tên màu |
| Móc khóa & sticker linh vật | Danh mục `moc-khoa`; 5 sticker gấu, thỏ, capybara, mèo, gấu trúc trong trình thiết kế 3D (`components/bottle/stickers.tsx`) |
| Tự thiết kế 3D | Chọn mẫu → dung tích → màu → chữ/số (14 ký tự, 3 kiểu chữ, 5 màu mực) → sticker; xoay/zoom, tải ảnh thiết kế; phí in chữ 30.000₫, sticker 20.000₫ |
| Mua sắm | Tìm kiếm gợi ý khi gõ (phím `/`), lọc loại/dung tích/màu/giá, sắp xếp, xem nhanh, yêu thích, giỏ hàng, mã giảm giá |
| Đặt hàng | Không cần tài khoản, gửi tặng người khác, hộp quà + thiệp, giao nhanh, VietQR (mã QR tự điền số tiền + mã đơn) hoặc COD, tra cứu đơn bằng mã + SĐT |
| Hỗ trợ | Chat trả lời tự động các câu hay gặp, chuyển sang Zalo / Messenger / gọi điện; đặt nhanh qua Zalo ở trang sản phẩm |
| Nội dung | Giới thiệu, Cẩm nang (SEO), Hỏi đáp, Chính sách (vận chuyển, đổi trả, bảo hành, in riêng, thanh toán, bảo mật, điều khoản), Liên hệ + form báo giá in logo số lượng lớn |
| Quản trị | Đơn hàng (hiện nội dung in của từng bình), sản phẩm (dung tích, màu, tồn kho, ảnh), tin nhắn & báo giá |

## Cấu trúc

```
frontend/
  shared/            # types, catalog.ts (giá, biến thể, phần in), checkout.ts (ship, mã giảm, kiểm tra đơn), default-products.ts
  components/bottle/ # ảnh dựng SVG, cảnh 3D three.js, sticker
  components/studio/ # trình thiết kế 3D
  components/catalog # thẻ sản phẩm, xem nhanh, danh mục, trang chi tiết
  components/order/  # giỏ, đặt hàng, đơn hàng, VietQR
  app/               # các trang
backend/src/
  shared/            # bản sao catalog.ts, checkout.ts, types (đuôi import .js) — sửa cả hai nơi
  modules/           # auth, products, orders, messages, uploads
```

Màu thương hiệu lấy từ logo: xanh Hydron `#0688AE`, kem `#FDF2DF`, mực `#0B2A36` (`frontend/app/tokens.css`). Chữ: Unbounded (tiêu đề), Be Vietnam Pro (nội dung), Dancing Script (kiểu chữ viết tay khi in).

## Cần bổ sung trước khi mở bán

Các thông tin phiếu yêu cầu chưa điền, đang dùng giá trị tạm trong `frontend/lib/site.ts`: số điện thoại/Zalo, email, địa chỉ kho (đang giả định Hà Nội để tính phí ship), tài khoản ngân hàng nhận VietQR, link mạng xã hội, tên pháp lý + mã số thuế, nội dung giới thiệu, điều kiện đổi trả cụ thể. Ảnh chụp sản phẩm thật tải lên ở /quan-tri/san-pham.

## Deploy

Xem `render.yaml` và `docs/huong_dan_deploy_render.md`. Biến môi trường webhook đổi tên thành `HYDRON_WEBHOOK_URL` (vẫn đọc `LAMTRA_WEBHOOK_URL` cũ).
