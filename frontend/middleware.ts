import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

// Backend là nơi duy nhất giữ ADMIN_SECRET_KEY: middleware hỏi backend cookie có hợp lệ không,
// thay vì tự kiểm bằng một bản sao khoá (hai bản lệch nhau sẽ đá người dùng về trang đăng nhập).
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:4000";

async function isAdminSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/auth`, {
      headers: { cookie: `${ADMIN_COOKIE_NAME}=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { authenticated?: boolean };
    return data.authenticated === true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Chỉ áp dụng kiểm tra bảo mật cho các đường dẫn quản trị (/quan-tri và /api/admin)
  const isAdminPage = pathname.startsWith("/quan-tri");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // 2. Ngoại lệ: API xác thực đăng nhập không bị chặn
  if (pathname === "/api/admin/auth") {
    return NextResponse.next();
  }

  // 3. Kiểm tra token phiên từ cookie (backend xác thực)
  const isAuthenticated = await isAdminSession(req);

  // 4. Nếu là trang chủ /quan-tri (màn hình nhập passcode):
  // Nếu đã đăng nhập rồi -> chuyển hướng vào trang quản lý đơn hàng
  if (pathname === "/quan-tri") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/quan-tri/don-hang", req.url));
    }
    return NextResponse.next();
  }

  // 5. Nếu chưa xác thực mà cố truy cập các trang con (/quan-tri/*) hoặc API admin:
  if (!isAuthenticated) {
    if (isAdminApi) {
      return NextResponse.json(
        { ok: false, error: "Yêu cầu quyền quản trị viên." },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/quan-tri", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/quan-tri/:path*", "/api/admin/:path*"],
};
