# Hướng Dẫn Deploy Dự Án Lam Trà Lên Render (Từng Bước Chi Tiết)

Tài liệu này hướng dẫn chi tiết cách triển khai (deploy) toàn bộ hệ thống website thương mại điện tử **Lam Trà** lên nền tảng đám mây **[Render.com](https://render.com)**.

---

## 1. Tổng quan Kiến trúc Triển khai

Dự án Lam Trà được cấu trúc theo dạng Monorepo gồm **Frontend (Next.js 15 App Router)** và **Backend (Fastify API)**. Khi triển khai lên Render, bạn có 2 mô hình lựa chọn:

| Tiêu chí | Mô hình 1: All-in-One (Khuyên Dùng) | Mô hình 2: Tách biệt 2 Web Services |
| :--- | :--- | :--- |
| **Số lượng Service** | **1 Web Service duy nhất** | 2 Web Services (1 Backend + 1 Frontend) |
| **Phù hợp Free Tier** | **Tối ưu 100%** (1 service chạy đủ 750 giờ/tháng) | Dễ chạm trần hạn mức giờ miễn phí nếu cả 2 cùng chạy |
| **Độ trễ Cold-start** | Chỉ khởi động 1 lần khi có người truy cập | Phải đợi cả 2 service cùng "thức dậy" |
| **Quản lý Uploads / Data**| Chung tệp nội bộ, hiển thị ảnh tải lên lập tức | Cần thiết lập phân vùng lưu trữ đám mây ngoài |
| **CORS / Kết nối** | Next.js rewrite nội bộ qua `127.0.0.1:4000` (Không sợ lỗi CORS) | Cần cấu hình tên miền chéo chính xác |

> [!TIP]
> **Khuyến nghị:** Đối với gói **Render Free Tier**, hãy sử dụng **Mô hình 1 (All-in-One)**. Dự án đã được thiết lập sẵn file khởi chạy tối ưu [`tools/render-start.mjs`](file:///d:/Github/LamTraE-Com/tools/render-start.mjs) và tệp Blueprint [`render.yaml`](file:///d:/Github/LamTraE-Com/render.yaml).

---

## 2. Chuẩn bị Trước khi Deploy

1. **Đẩy mã nguồn lên GitHub**:
   Đảm bảo toàn bộ mã nguồn mới nhất của dự án đã được commit và push lên kho lưu trữ GitHub của bạn:
   ```bash
   git add .
   git commit -m "feat: chuẩn bị cấu hình deploy render và chính sách bán hàng"
   git push origin main
   ```
2. **Đăng ký tài khoản Render**:
   - Truy cập **[https://render.com](https://render.com)** và chọn **Get Started**.
   - Khuyên dùng: Đăng nhập bằng tài khoản **GitHub** để cấp quyền kết nối repository nhanh chóng.

---

## 3. Cách 1: Deploy Tự Động Bằng Render Blueprint (Nhanh Nhất)

Trong dự án đã có sẵn file [`render.yaml`](file:///d:/Github/LamTraE-Com/render.yaml), Render sẽ tự động cấu hình toàn bộ thông số cho bạn.

1. Đăng nhập vào **Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com).
2. Nhấn nút **New +** ở góc trên bên phải ➔ Chọn **Blueprint**.
3. Chọn kho lưu trữ **`LamTraE-Com`** (nếu chưa thấy, nhấn *Configure account* để cấp quyền cho repo).
4. Render sẽ quét file `render.yaml` và hiển thị bản đồ dịch vụ:
   - **Service Name**: `lam-tra-ecom`
   - **Region**: `Singapore` (tối ưu tốc độ cho người dùng Việt Nam)
   - **Plan**: `Free`
5. Nhập hoặc điều chỉnh các biến môi trường nếu muốn:
   - `ADMIN_SECRET_KEY`: Khóa bí mật đăng nhập trang quản trị (mặc định Render sẽ tự sinh chuỗi bảo mật ngẫu nhiên, bạn nhập mật mã riêng (≥ 12 ký tự)).
6. Nhấn nút **Apply**. Render sẽ tự động thực hiện build và khởi chạy ứng dụng!

---

## 4. Cách 2: Tạo Web Service Thủ Công trên Render

Nếu bạn muốn cấu hình từng bước thủ công qua giao diện Web:

### Bước 1: Tạo Web Service mới
1. Tại Dashboard, nhấn **New +** ➔ Chọn **Web Service**.
2. Chọn tùy chọn **Build and deploy from a Git repository** ➔ Nhấn **Next**.
3. Chọn repository `LamTraE-Com` của bạn ➔ Nhấn **Connect**.

### Bước 2: Điền thông số cấu hình
- **Name**: `lam-tra-ecom` (hoặc tên thương hiệu bạn thích)
- **Region**: `Singapore (Southeast Asia)` *(Rất quan trọng: giúp website mở nhanh từ Thái Nguyên, Hà Nội và toàn Việt Nam với ping ~35ms)*.
- **Branch**: `main`
- **Root Directory**: *Để trống* (Render sẽ chạy tại thư mục gốc).
- **Runtime**: `Node`
- **Build Command**:
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```
- **Instance Type**: Chọn **Free** ($0/month).

### Bước 3: Cấu hình biến môi trường (Environment Variables)
Cuộn xuống phần **Environment Variables**, nhấn **Add Environment Variable** và thêm các biến sau:

| Key (Khóa) | Value (Giá trị) | Ghi chú |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Bật chế độ tối ưu hiệu năng |
| `ADMIN_SECRET_KEY` | `<mật-khẩu-riêng ≥ 12 ký tự>` | Mật khẩu để đăng nhập vào trang `/quan-tri` |
| `BACKEND_INTERNAL_PORT` | `4000` | Cổng nội bộ cho API Fastify |

### Bước 4: Khởi động Deploy
Nhấn nút **Deploy Web Service** ở cuối trang. Render sẽ bắt đầu clone code, cài đặt thư viện, build Next.js/Fastify và cấp phát địa chỉ URL công khai dạng:
`https://lam-tra-ecom.onrender.com`

---

## 5. Cách 3: Triển khai 2 Services Riêng Biệt (Dành cho bản Nâng Cao)

Nếu bạn muốn tách độc lập Backend và Frontend thành 2 máy chủ riêng:

### 1. Dịch vụ Backend (`lam-tra-backend`)
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT`: `10000`
  - `HOST`: `0.0.0.0`
  - `ADMIN_SECRET_KEY`: `<mật-khẩu-riêng ≥ 12 ký tự>`
  - `CORS_ORIGIN`: `https://lam-tra-frontend.onrender.com`
- Sau khi deploy xong, sao chép URL Backend (ví dụ: `https://lam-tra-backend.onrender.com`).

### 2. Dịch vụ Frontend (`lam-tra-frontend`)
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT`: `10000`
  - `BACKEND_URL`: `https://lam-tra-backend.onrender.com` (dán URL của Backend vừa tạo ở trên).

---

## 6. Lưu ý Quan trọng về Render Free Tier & Mẹo Tối Ưu

### 1. Hiện tượng "Ngủ đông" (Spin down sau 15 phút không có khách)
- **Đặc điểm**: Trên gói Free của Render, nếu không có lượt truy cập trong 15 phút, máy chủ sẽ tạm chuyển sang trạng thái ngủ (Sleep). Khi có khách truy cập lại, web sẽ mất khoảng 40 – 50 giây để khởi động lại (Cold-start).
- **Mẹo giữ web luôn online 24/7 hoàn toàn miễn phí**:
  1. Đăng ký tài khoản miễn phí tại **[UptimeRobot](https://uptimerobot.com)** hoặc **[Cron-job.org](https://cron-job.org)**.
  2. Tạo 1 monitor dạng **HTTP(s)** ping vào đường dẫn:
     `https://<ten-web-cua-ban>.onrender.com/api/health`
  3. Cài đặt tần suất ping: **10 phút / lần**.
  4. Web sẽ liên tục nhận ping nhẹ và không bao giờ bị rơi vào trạng thái ngủ đông!

### 2. Về tính bền vững của Tệp (Storage)
- File sản phẩm mặc định `products.json` được lưu trực tiếp trong mã nguồn Git nên **luôn được bảo toàn nguyên vẹn 100%**.
- Nếu bạn tải ảnh mới hoặc tạo đơn hàng, dữ liệu được ghi vào ổ đĩa container cục bộ. Khi Render deploy lại bản mới (redeploy), các tệp sinh ra lúc chạy có thể bị đặt lại nếu không gắn Disk.
- Nếu muốn lưu trữ ảnh sản phẩm tải lên và đơn hàng vĩnh viễn qua mọi lần redeploy trên Render:
  - Bạn có thể vào tab **Disks** trên Render Web Service để thêm một **Persistent Disk** (chi phí rất nhỏ, chỉ khoảng 0.25$/GB/tháng) gắn vào mount path `/backend/data` và `/backend/uploads`.

---

## 7. Kiểm tra Sau khi Triển khai Hoàn tất

Sau khi Render báo trạng thái **Live** màu xanh, hãy kiểm tra các đường dẫn sau:

1. **Trang kiểm tra sức khỏe hệ thống (Health Check)**:
   ```text
   https://<ten-web-cua-ban>.onrender.com/api/health
   ```
   Kết quả trả về JSON dạng:
   ```json
   {"ok": true, "service": "lam-tra-api", "uptime": 12.5, "timestamp": "..."}
   ```
2. **Trang chủ & Danh mục sản phẩm**:
   ```text
   https://<ten-web-cua-ban>.onrender.com/
   https://<ten-web-cua-ban>.onrender.com/san-pham
   ```
3. **Trang Chính sách mới cập nhật**:
   ```text
   https://<ten-web-cua-ban>.onrender.com/chinh-sach
   ```
4. **Trang Quản trị Hệ thống**:
   ```text
   https://<ten-web-cua-ban>.onrender.com/quan-tri
   ```
   - Nhập mã bảo mật (mã bạn đã điền trong `ADMIN_SECRET_KEY`) để kiểm tra quản lý đơn hàng và chỉnh sửa sản phẩm.
