/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:4000";

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
