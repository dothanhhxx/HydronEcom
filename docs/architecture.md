# Kiến Trúc Hệ Thống Fullstack E-Commerce — Lam Trà

Tài liệu thiết kế kiến trúc chuẩn hóa theo phương pháp **Software Architecture & Domain-Driven Design (DDD)** lấy cảm hứng từ bộ nguyên tắc `agency-agents` (`engineering-software-architect` & `engineering-backend-architect`).

---

## 1. Sơ Đồ Kiến Trúc Tổng Thể (System Architecture)

```mermaid
flowchart TD
    subgraph ClientLayer ["1. Presentation Layer (Giao diện người dùng)"]
        GuestUser["Khách mua trà vãng lai"] -->|Không cần đăng nhập| StorefrontUI["Storefront UI (Next.js 15)"]
        AdminUser["Chủ cửa hàng"] -->|Nhập Master Passcode| AdminUI["Admin Portal UI (/quan-tri)"]
    end

    subgraph SecurityGateway ["2. Security & Routing Layer"]
        Middleware["Next.js Middleware (web/middleware.ts)"]
        StorefrontUI --> Router["App Router (Public Pages)"]
        AdminUI -->|Bảo vệ Cookie HttpOnly| Middleware
        Middleware -->|Token hợp lệ| AdminRouter["Admin Pages (/quan-tri/*)"]
    end

    subgraph ApiLayer ["3. Controller / API Layer (web/app/api)"]
        Router --> PublicApi["Public API (/api/orders, /api/contact)"]
        AdminRouter --> ProtectedApi["Protected API (/api/admin/*)"]
    end

    subgraph DomainServiceLayer ["4. Backend Domain & Services Layer (web/server/services)"]
        PublicApi --> OrderService["OrderService"]
        ProtectedApi --> OrderService
        ProtectedApi --> ProductService["ProductService"]
        ProtectedApi --> AuthService["AuthService (HMAC SHA-256)"]
        OrderService --> NotificationService["NotificationService (Webhook)"]
    end

    subgraph DataAccessLayer ["5. Repository & Data Layer (web/server/repositories)"]
        OrderService --> OrderRepo["OrderRepository"]
        ProductService --> ProductRepo["ProductRepository"]
        OrderRepo --> FileStorage[(".data/orders.jsonl & status.jsonl")]
        ProductRepo --> OverrideStorage[(".data/products-override.json")]
        NotificationService -.->|Webhook POST| ExternalServices["Telegram Bot / Google Sheets"]
    end

    subgraph SharedLayer ["6. Shared Core (web/shared)"]
        SharedTypes["Types: Order, Product, Auth, Api"]
        SharedConstants["Constants: OrderStatus, Shipping, VietQR"]
        SharedLayer -.-> ClientLayer
        SharedLayer -.-> DomainServiceLayer
    end
```

---

## 2. Tổ Chức Thư Mục Chuẩn Hóa (Directory Structure)

```
LamTraE-Com/
├── docs/                                  # 📚 TÀI LIỆU DỰ ÁN & QUY CHUẨN
│   ├── architecture.md                    # Kiến trúc tổng thể hệ thống
│   ├── de_xuat_tinh_nang.md               # Danh mục tính năng & hiện trạng
│   └── de_xuat_trang_admin.md             # Đề xuất và giải pháp cổng quản trị
│
├── brand/                                 # 🎨 NHẬN DIỆN THƯƠNG HIỆU
│   └── (Logo, vector ấn triện, typography gốc)
│
├── design/                                # 📐 DESIGN SYSTEM & TOKENS GỐC
│   └── (Bản thảo giao diện, color tokens)
│
├── agency-agents/                         # 🎭 KHO AGENT CHUYÊN GIA
│   └── (Software Architect, Backend Architect, DevOps...)
│
└── web/                                   # 🚀 UNIFIED FULLSTACK APPLICATION (Next.js 15)
    │
    ├── shared/                            # 🟡 TẦNG CHUNG (SHARED CORE)
    │   ├── types/                         # TypeScript interfaces (Order, Product, Auth, Api)
    │   │   ├── order.types.ts
    │   │   ├── product.types.ts
    │   │   ├── auth.types.ts
    │   │   └── api.types.ts
    │   ├── constants/                     # Hằng số nghiệp vụ dùng chung
    │   │   ├── order-status.ts            # Mã trạng thái 0, 1, 2, 3, -1 & màu sắc
    │   │   └── shipping.ts                # Phí giao hàng & thời gian
    │   └── index.ts                       # Barrel export (@/shared)
    │
    ├── server/                            # 🟢 TẦNG BACKEND & DOMAIN SERVICES
    │   ├── services/                      # Business logic thuần túy (Không dính UI)
    │   │   ├── auth.service.ts            # Mã hóa, cấp/kiểm tra phiên bảo mật
    │   │   ├── order.service.ts           # Tạo đơn, duyệt đơn, tính tiền, lọc danh sách
    │   │   ├── product.service.ts         # Quản lý giá bán, khuyến mãi, tồn kho
    │   │   └── notification.service.ts    # Webhook Telegram / Google Sheets
    │   ├── repositories/                  # Data Access Layer (Trừu tượng hóa lưu trữ)
    │   │   ├── order.repository.ts        # Lưu/đọc đơn hàng & lịch sử thay đổi
    │   │   └── product.repository.ts      # Lưu/đọc cấu hình đè giá và kho
    │   └── index.ts                       # Barrel export (@/server)
    │
    ├── middleware.ts                      # 🛡️ BẢO VỆ CỔNG VÀO (Security Gateway)
    │
    ├── app/                               # 🌐 TẦNG ROUTING & CONTROLLERS
    │   ├── api/                           # Backend REST API Endpoints
    │   │   ├── orders/route.ts            # Public API: Đặt hàng & Tra cứu
    │   │   ├── contact/route.ts           # Public API: Gửi form liên hệ
    │   │   └── admin/                     # Protected Admin API
    │   │       ├── auth/route.ts          # Đăng nhập/Đăng xuất Admin
    │   │       ├── orders/route.ts        # Lấy danh sách & cập nhật đơn
    │   │       └── products/route.ts      # Cập nhật giá & tồn kho
    │   │
    │   ├── quan-tri/                      # Admin Portal Pages
    │   │   ├── page.tsx                   # Màn hình đăng nhập Master Passcode
    │   │   ├── don-hang/page.tsx          # Bảng điều khiển quản lý đơn hàng
    │   │   └── san-pham/page.tsx          # Bảng điều khiển quản lý sản phẩm
    │   │
    │   └── (Storefront Pages)/            # Storefront Pages cho khách hàng
    │       ├── page.tsx                   # Trang chủ
    │       ├── san-pham/page.tsx          # Danh mục sản phẩm
    │       ├── gio-hang/page.tsx          # Giỏ hàng
    │       ├── thanh-toan/page.tsx        # Đặt hàng (Guest Checkout)
    │       ├── tra-cuu-don/page.tsx       # Tra cứu đơn bằng SĐT
    │       └── ...                        # Các trang thông tin khác
    │
    ├── components/                        # 🖥️ TẦNG GIAO DIỆN (UI COMPONENTS)
    │   ├── ds/                            # Primitive UI Kit (Button, Input, Badge, Dialog...)
    │   ├── shell/                         # Header sticky, Footer, StoreShell, MobileTabBar
    │   ├── landing/                       # Components trang chủ
    │   ├── catalog/                       # Components trang sản phẩm
    │   ├── order/                         # Components giỏ hàng & thanh toán
    │   └── admin/                         # Components cổng quản trị
    │       ├── AdminShell.tsx             # Khung điều hướng trang quản trị
    │       ├── OrderTable.tsx             # Bảng đơn hàng, bộ lọc, tìm kiếm
    │       ├── OrderDetailModal.tsx       # Chi tiết đơn, in phiếu gửi, đổi trạng thái
    │       ├── ProductManager.tsx         # Bảng chỉnh sửa giá bán và tồn kho
    │       └── StatusBadge.tsx            # Huy hiệu trạng thái đơn hàng
    │
    └── lib/                               # 🔧 CLIENT LIBRARIES & HELPERS
        ├── cart.tsx                       # Giỏ hàng phía client (LocalStorage)
        ├── checkout.ts                    # Utility tính tiền & validate form
        ├── products.ts                    # Dữ liệu tĩnh catalogue ban đầu
        └── site.ts                        # Thông tin liên hệ cửa hàng
```

---

## 3. Ranh Giới Trách Nhiệm (Separation of Concerns)

1. **Khách hàng vãng lai (Storefront)**:
   - Tiếp tục **100% không cần đăng nhập**. Trải nghiệm đặt hàng mượt mà, lưu giỏ hàng trong LocalStorage, thanh toán VietQR / COD tức thì.
2. **Quản trị viên (Admin Portal)**:
   - Truy cập qua `/quan-tri`.
   - Xác thực bảo mật bằng **Master Passcode** cấu hình trong `ADMIN_SECRET_KEY`.
   - Cấp cookie an toàn `lt_admin_session` với chữ ký **HMAC SHA-256**, hạn dùng 30 ngày.
   - Quản trị viên duyệt đơn, đổi trạng thái, in phiếu gửi hàng, sửa giá trà và cập nhật kho trực tiếp trên giao diện web.
3. **Tách biệt Logic & Giao diện**:
   - Mọi nghiệp vụ liên quan đến dữ liệu đơn hàng và sản phẩm đều tập trung tại `web/server/services/`.
   - Các API route (`web/app/api/`) chỉ đóng vai trò Controller (nhận request, validate cơ bản, gọi Service và trả về JSON).
   - Nếu sau này chuyển sang Database đám mây (PostgreSQL/Supabase), chỉ cần thay đổi trong `web/server/repositories/` mà không cần viết lại toàn bộ giao diện hay API.

---

## 4. Quyết Định Kiến Trúc (ADR-001)

### ADR-001: Lựa chọn Unified Fullstack Architecture thay vì Microservices phân tán
- **Bối cảnh**: Website thương mại điện tử Lam Trà cần quản lý đơn hàng và sản phẩm, nhưng khách hàng không cần đăng nhập, đồng thời cần triển khai nhanh, chi phí vận hành 0đ và dễ bảo trì bởi một đội ngũ tinh gọn.
- **Quyết định**: Sử dụng kiến trúc **Unified Next.js 15 Fullstack** chia lớp rõ ràng (`server/`, `shared/`, `components/`, `app/`):
  - Chạy trên một tiến trình duy nhất (1 port, không lo cấu hình CORS).
  - Tách bạch hoàn toàn ranh giới giữa Client và Server.
  - Tầng dữ liệu được cô lập qua Repository Pattern, sẵn sàng nâng cấp database bất kỳ lúc nào.
- **Hệ quả**:
  - Không tốn tài nguyên quản lý 2 máy chủ riêng.
  - Tốc độ phát triển cực nhanh, bảo mật cao và dễ dàng mở rộng.
