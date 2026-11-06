// Đọc/ghi localStorage an toàn: chế độ ẩn danh hoặc dữ liệu hỏng thì trả về giá trị mặc định.
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* hết dung lượng hoặc bị chặn: bỏ qua */
  }
}
