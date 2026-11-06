# Lam Trà E-Commerce · Kiến trúc Frontend & Backend Chuẩn Doanh Nghiệp

Hệ thống bán lẻ đặc sản Trà Thái Nguyên cao cấp Lam Trà, xây dựng theo kiến trúc phân tách rõ ràng **Frontend (Next.js 15 App Router)** và **Backend (Node.js + Fastify + TypeScript REST API)**.

---

## 🏗️ Cấu trúc thư mục Monorepo

```text
LamTraE-Com/
├── frontend/                            # 🌐 Storefront + Admin UI (Next.js 15)
│   ├── app/                             #   Storefront pages & Admin pages (/quan-tri)
│   ├── components/                      #   Design System & Feature UI Components
│   │   ├── admin/                       #     AdminShell, ProductManager, OrderTable, MessageManager
│   │   ├── catalog/                     #     ProductGrid, ProductDetail, TeaCard
│   │   ├── order/                       #     CheckoutForm, CartPage, OrderView
│   │   └── shell/                       #     Header, Footer, StoreShell
│   ├── services/                        #   API Service gọi backend (products.api.ts...)
│   ├── lib/                             #   Client helpers, checkout calculation, auth
│   ├── shared/                          #   TypeScript types & constants
│   ├── middleware.ts                    #   Edge protection cho route /quan-tri
│   ├── next.config.ts                   #   Proxy rewrites (/api/* & /uploads/* → Backend :4000)
│   └── package.json
│
├── backend/                             # ⚡ REST API Engine (Node.js + Fastify + TypeScript)
│   ├── src/
│   │   ├── main.ts                      #   Server bootstrap, CORS, cookie, multipart, static
│   │   ├── config/                      #   Biến môi trường (env.ts)
│   │   ├── modules/                     #   Modules: routes -> controller -> service -> repository
│   │   │   ├── auth/                    #     Xác thực passcode, JWT/HMAC session token
│   │   │   ├── products/                #     CRUD sản phẩm, cập nhật giá nhanh inline
│   │   │   ├── orders/                  #     Tạo đơn, tra cứu đơn, duyệt trạng thái
│   │   │   ├── messages/                #     Liên hệ, báo giá doanh nghiệp, đánh giá
│   │   │   ├── uploads/                 #     Tải ảnh sản phẩm, lưu trữ disk
│   │   │   └── notifications/           #     Webhook thông báo đơn & thanh toán
│   │   ├── infrastructure/              #   Lưu trữ file JSON và disk storage adapter
│   │   ├── middleware/                  #   auth-guard.ts (bảo vệ các endpoint /api/admin/*)
│   │   └── shared/                      #   Types, constants, checkout calculations
│   ├── data/                            #   Dữ liệu lưu trữ (products.json, orders.jsonl...)
│   ├── uploads/                         #   Ảnh upload thực tế (phục vụ tại /uploads/*)
│   └── package.json
│
├── design/                              # 📐 Brand guidelines, logo, vector nhận diện
├── docs/                                # 📚 Tài liệu kiến trúc & các đề xuất kỹ thuật
├── tools/                               # 🛠️ Công cụ hỗ trợ & agency-agents
├── package.json                         # 📦 NPM Workspaces quản lý cả Frontend và Backend
└── README.md
```

---

## 🚀 Khởi chạy dự án

Ở thư mục gốc dự án:

```bash
# 1. Cài đặt toàn bộ dependencies (workspaces)
npm install

# 2. Khởi chạy đồng thời cả Backend (:4000) và Frontend (:3000)
npm run dev
```

Nếu muốn chạy riêng từng ứng dụng:
- **Chạy riêng Backend**: `npm run dev:backend` (Cổng `http://localhost:4000`)
- **Chạy riêng Frontend**: `npm run dev:frontend` (Cổng `http://localhost:3000`)

---

## 🔗 Liên kết & Thông tin truy cập

- **Cửa hàng (Khách mua)**: [http://localhost:3000](http://localhost:3000) (Guest Checkout, cập nhật realtime theo giá backend)
- **Cổng Quản trị (Chủ shop)**: [http://localhost:3000/quan-tri](http://localhost:3000/quan-tri)
  - Mật mã Master: Xem cấu hình `ADMIN_SECRET_KEY` trong file `backend/.env` (chạy local để trống thì dùng mật khẩu thử nghiệm; production bắt buộc đặt mật khẩu riêng ≥ 12 ký tự)
  - Quản lý sản phẩm & giá: [http://localhost:3000/quan-tri/san-pham](http://localhost:3000/quan-tri/san-pham)
  - Quản lý đơn hàng: [http://localhost:3000/quan-tri/don-hang](http://localhost:3000/quan-tri/don-hang)
  - Quản lý liên hệ & báo giá: [http://localhost:3000/quan-tri/lien-he](http://localhost:3000/quan-tri/lien-he)
- **Backend API Health Check**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 🚀 Triển khai (Deploy lên Render)

Dự án đã được cấu hình sẵn để triển khai lên [Render.com](https://render.com) qua Blueprint hoặc Web Service miễn phí:
- **Tệp cấu hình Blueprint**: [`render.yaml`](file:///d:/Github/LamTraE-Com/render.yaml)
- **Tài liệu hướng dẫn chi tiết từng bước**: [`docs/huong_dan_deploy_render.md`](file:///d:/Github/LamTraE-Com/docs/huong_dan_deploy_render.md)
- **Lệnh chạy Production**: `npm run build` && `npm start` (tự động chạy cả Backend API & Next.js trên cùng 1 Web Service Free).

