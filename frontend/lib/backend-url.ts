// Chuẩn hoá BACKEND_URL: chấp nhận "4000", "127.0.0.1:4000" hoặc URL đầy đủ; trống thì dùng backend nội bộ cổng 4000.
// (Giữ đồng bộ với hàm cùng tên trong next.config.mjs.)
export function backendUrl(raw = process.env.BACKEND_URL) {
  const v = (raw ?? "").trim().replace(/\/+$/, "");
  if (!v) return "http://127.0.0.1:4000";
  if (/^\d+$/.test(v)) return `http://127.0.0.1:${v}`;
  if (!/^https?:\/\//i.test(v)) return `http://${v}`;
  return v;
}

export const BACKEND_URL = backendUrl();
