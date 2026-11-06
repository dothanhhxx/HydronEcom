# Đề xuất cấu trúc thư mục – Lam Trà E-Com (Frontend + Backend)

> Chỉ là **đề xuất**, chưa di chuyển file nào. Duyệt xong mới thực hiện.

**Đã chốt:** Backend Node.js + TypeScript (Fastify) · Giữ lưu trữ JSON tạm thời (làm DB ở giai đoạn sau) · Trang `/quan-tri` nằm trong frontend, gọi API backend.

## 1. Hiện trạng & điểm chưa hợp lý

| # | Vấn đề | Vị trí |
|---|--------|--------|
| 1 | Logic server nằm **2 nơi**: `web/server/` và `web/lib/server/store.ts` | `web/lib`, `web/server` |
| 2 | `lib/` trộn client + server + dữ liệu tĩnh (`cart.tsx`, `checkout.ts`, `orders-store.ts`, `products.ts`) | `web/lib` |
| 3 | API nằm trong `web/app/api/*` → frontend và backend dính nhau, không deploy/scale riêng được | `web/app/api` |
| 4 | `components/` chia theo loại trang, không theo nghiệp vụ | `web/components` |
| 5 | Ảnh upload lưu `public/uploads`, dữ liệu ở `web/.data/*.json` → mất khi deploy serverless | `public/uploads`, `.data` |
| 6 | Root rải rác: `agency-agents/`, `brand/`, `design/`, `de_xuat_trang_admin.md` (trùng bản trong `docs/`) | root |

## 2. Cấu trúc đề xuất

```
LamTraE-Com/
├─ frontend/                          # Next.js – storefront + admin UI (KHÔNG chứa logic nghiệp vụ server)
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ (store)/                  # layout Header/Footer/Tabbar
│  │  │  │  ├─ page.tsx  san-pham/  qua-bieu/  gio-hang/  thanh-toan/
│  │  │  │  ├─ dat-hang-thanh-cong/  tra-cuu-don/  yeu-thich/  tai-khoan/
│  │  │  │  └─ cau-chuyen/  tra-dam/  hoi-dap/  chinh-sach/  lien-he/
│  │  │  ├─ (admin)/quan-tri/         # layout AdminShell, noindex
│  │  │  │  └─ don-hang/  san-pham/  lien-he/
│  │  │  ├─ layout.tsx  not-found.tsx  robots.ts  sitemap.ts
│  │  ├─ features/
│  │  │  ├─ catalog/  cart/  checkout/  orders/  reviews/  content/
│  │  │  └─ admin/  (products, orders, messages)
│  │  ├─ components/
│  │  │  ├─ ui/                       # design system (từ components/ds)
│  │  │  └─ layout/                   # Header, Footer, Tabbar, AdminShell
│  │  ├─ services/                    # API client gọi backend (products.api.ts, orders.api.ts, admin.api.ts…)
│  │  ├─ lib/                         # format, text, site config, photo()
│  │  ├─ styles/                      # tokens.css, header.css, admin.css
│  │  └─ middleware.ts                # chỉ chặn route /quan-tri bằng cookie
│  ├─ public/assets/                  # logo, ảnh tĩnh
│  ├─ next.config.ts                  # rewrites: /api/* → BACKEND_URL (dev), /uploads/* → backend
│  ├─ .env.example                    # NEXT_PUBLIC_API_URL, BACKEND_URL
│  └─ package.json  tsconfig.json
│
├─ backend/                           # Fastify + TypeScript – REST API
│  ├─ src/
│  │  ├─ main.ts                      # khởi tạo server, CORS, cookie, rate-limit
│  │  ├─ config/                      # env.ts (validate bằng zod)
│  │  ├─ modules/                     # mỗi module: route → controller → service → repository
│  │  │  ├─ products/   products.routes.ts  product.service.ts  product.repository.ts
│  │  │  ├─ orders/     (public tạo/tra cứu đơn + admin quản lý)
│  │  │  ├─ messages/   (liên hệ / báo giá)
│  │  │  ├─ auth/       (đăng nhập admin, session token HMAC)
│  │  │  ├─ uploads/    (nhận ảnh, lưu qua storage adapter)
│  │  │  └─ notifications/
│  │  ├─ infrastructure/
│  │  │  ├─ persistence/   json-store.ts  (giữ JSON tạm; sau thay bằng db/ mà không đổi service)
│  │  │  └─ storage/       local-disk.ts   (sau thêm s3.ts / cloudinary.ts)
│  │  ├─ middleware/        auth-guard.ts  error-handler.ts
│  │  └─ shared/            types/ constants/ validators/
│  ├─ data/                 products.json  orders.json  messages.json  (thay web/.data)
│  ├─ uploads/              ảnh tải lên (git-ignored)
│  ├─ tests/
│  ├─ .env.example          PORT, ADMIN_SECRET_KEY, CORS_ORIGIN
│  └─ package.json  tsconfig.json
│
├─ packages/shared/                   # (tuỳ chọn) types + zod schema dùng chung 2 phía
│  └─ src/types/  src/constants/  src/validators/
│
├─ docs/                              # architecture.md, api.md, de_xuat_*.md
├─ design/                            # brand/ + mockups/
├─ tools/agency-agents/
├─ package.json                       # npm workspaces: frontend, backend, packages/*
└─ README.md  .gitignore
```

> `packages/shared` giúp frontend và backend dùng **cùng một định nghĩa** `Product`, `Order`… Nếu muốn đơn giản ban đầu, có thể bỏ và copy `shared/types` vào cả hai.

## 3. Hợp đồng API (backend)

| Nhóm | Endpoint | Quyền |
|------|----------|-------|
| Công khai | `GET /api/products`, `GET /api/products/:slug` | public |
| | `POST /api/orders`, `GET /api/orders/lookup?code=&phone=` | public |
| | `POST /api/contact` | public |
| Admin | `POST/DELETE /api/admin/auth` | – / cookie |
| | `GET/POST/PUT/DELETE /api/admin/products` | admin |
| | `GET/PATCH /api/admin/orders`, `GET/PATCH /api/admin/messages` | admin |
| | `POST /api/admin/upload`, `GET /uploads/:file` | admin / public |
| Hệ thống | `GET /api/health` | public |

Cookie `lt_admin_session` phát từ backend; frontend dev dùng `rewrites` để cùng origin (tránh lỗi CORS/cookie).

## 4. Ánh xạ file hiện tại → mới

| Hiện tại | Mới |
|----------|-----|
| `web/app/**` (trang) | `frontend/src/app/(store)` / `(admin)` |
| `web/app/api/**` | `backend/src/modules/*/*.routes.ts` |
| `web/components/ds/*` | `frontend/src/components/ui/*` |
| `web/components/shell/*` | `frontend/src/components/layout/*` |
| `web/components/{catalog,order,landing,info,admin}` | `frontend/src/features/*` |
| `web/lib/cart.tsx`, `lib/checkout.ts` (phần client) | `frontend/src/features/{cart,checkout}` |
| `web/lib/{format,text,site}.ts` | `frontend/src/lib/*` |
| `web/lib/api.ts` | `frontend/src/services/*.api.ts` |
| `web/lib/products.ts` (dữ liệu + hàm giá) | seed → `backend/data/products.json`; hàm hiển thị giá → `packages/shared` |
| `web/server/services/*` | `backend/src/modules/*/*.service.ts` |
| `web/server/repositories/*`, `lib/server/store.ts`, `lib/orders-store.ts` | `backend/src/modules/*/*.repository.ts` + `infrastructure/persistence` |
| `web/server/services/auth.service.ts` | `backend/src/modules/auth/` |
| `web/shared/{types,constants}` | `packages/shared/src/*` |
| `web/.data/*.json` | `backend/data/*.json` |
| `web/public/uploads` | `backend/uploads` |
| `web/middleware.ts` | `frontend/src/middleware.ts` |
| `agency-agents/` | `tools/agency-agents/` |

## 5. Cần xử lý khi tách (rủi ro thật)

1. **Trang storefront đang đọc dữ liệu trực tiếp** (`force-dynamic` + `ProductService`). Sau khi tách phải `fetch` từ backend (server components dùng `BACKEND_URL`, client dùng `/api` qua rewrite).
2. **Giỏ hàng tính lại giá phía server** (`/api/products`, checkout) → chuyển sang backend, frontend chỉ hiển thị.
3. **Realtime admin ↔ store** hiện hoạt động vì cùng process. Sau tách vẫn đúng vì cả hai đọc cùng backend; không cần cache dài (`cache: "no-store"` hoặc `revalidate` ngắn).
4. **Ảnh upload**: backend phục vụ `/uploads/*`; `photo()` ở frontend cần ghép `NEXT_PUBLIC_API_URL` (hoặc dùng rewrite `/uploads`).
5. **Auth cookie** phải cấu hình `sameSite`/`secure` đúng khi frontend và backend khác domain khi deploy.
6. **Deploy**: frontend → Vercel; backend cần máy chủ chạy liên tục (Render/Railway/VPS) vì còn ghi file JSON/ảnh lên đĩa. Chuyển Postgres + object storage ở giai đoạn sau sẽ gỡ ràng buộc này.

## 6. Lộ trình (mỗi bước chạy `tsc` + build + test tay)

| Bước | Việc | Rủi ro |
|------|------|--------|
| 1 | Tạo `frontend/`, `backend/`, workspace root; chuyển `web/` → `frontend/` (chưa đổi logic) | Thấp |
| 2 | Dựng `backend/` Fastify, copy `server/services`+`repositories`, đổi sang module + routes; chạy cổng 4000 | Trung bình |
| 3 | Chuyển toàn bộ `app/api/*` sang backend, thêm rewrites ở frontend | Trung bình |
| 4 | Thay các lời gọi trực tiếp `ProductService`… trong trang bằng `services/*.api.ts` | Trung bình–Cao |
| 5 | Tách `packages/shared` (types, hàm giá) | Thấp |
| 6 | Tổ chức lại `components/` → `features/`, `ui/`, `layout/`; route group `(store)/(admin)` | Thấp |
| 7 | Dọn root (`tools/`, `design/`, xoá file trùng), cập nhật README + `docs/architecture.md`, script `npm run dev` chạy cả hai | Thấp |
| 8 | (Sau) Postgres + object storage, deploy riêng | Cao hơn |

URL công khai (`/san-pham`, `/quan-tri`, …) giữ nguyên nên SEO không bị ảnh hưởng.

## 7. Cách chạy sau khi tách

```bash
npm install                 # ở root (workspaces)
npm run dev                 # chạy song song: backend :4000 và frontend :3000
```
