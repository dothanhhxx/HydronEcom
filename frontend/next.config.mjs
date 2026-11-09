// Chuẩn hoá BACKEND_URL: chấp nhận "4000", "127.0.0.1:4000" hoặc URL đầy đủ (giống lib/backend-url.ts).
// Thiếu http:// thì Next.js báo "Invalid rewrites" và build hỏng.
function backendUrl(raw = process.env.BACKEND_URL) {
  const v = (raw ?? "").trim().replace(/\/+$/, "");
  if (!v) return "http://127.0.0.1:4000";
  if (/^\d+$/.test(v)) return `http://127.0.0.1:${v}`;
  if (!/^https?:\/\//i.test(v)) return `http://${v}`;
  return v;
}
const BACKEND_URL = backendUrl();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cho phép build vào thư mục khác (kiểm thử song song khi đang chạy `next dev`).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` },
      { source: "/uploads/:path*", destination: `${BACKEND_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
