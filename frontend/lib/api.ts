// Gọi API nội bộ từ trình duyệt, gom lỗi về một dạng.
export type ApiResult<T = Record<string, unknown>> = { ok: true; data: T; error?: undefined; errors?: undefined } | { ok: false; error?: string; errors?: Record<string, string>; data?: undefined };

export async function postJSON<T = Record<string, unknown>>(url: string, body: unknown, method = "POST"): Promise<ApiResult<T>> {
  try {
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    if (r.ok) return { ok: true, data };
    return { ok: false, error: data.error, errors: data.errors };
  } catch {
    return { ok: false, error: "Mạng đang chập chờn. Bạn kiểm tra kết nối rồi thử lại nhé." };
  }
}
