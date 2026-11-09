// Gọi API nội bộ từ trình duyệt, gom lỗi về một dạng.
export type ApiResult<T = Record<string, unknown>> = { ok: true; data: T; error?: undefined; errors?: undefined } | { ok: false; error?: string; errors?: Record<string, string>; data?: undefined };

export async function postJSON<T = Record<string, unknown>>(url: string, body: unknown, method = "POST"): Promise<ApiResult<T>> {
  try {
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    if (r.ok) return { ok: true, data };
    // Fastify 500 trả {error: "Internal Server Error", message}; proxy/Render lỗi trả HTML (data rỗng).
    // Kèm mã HTTP để biết lỗi nằm ở đâu thay vì chỉ hiện câu chung chung.
    if (data.errors) return { ok: false, error: data.error, errors: data.errors };
    const detail = r.status >= 500 && data.message ? data.message : data.error;
    return { ok: false, error: detail ? `${detail} (mã lỗi ${r.status})` : `Máy chủ đang gặp sự cố (mã lỗi ${r.status}). Bạn thử lại sau ít phút, hoặc nhắn Zalo để đặt trực tiếp.` };
  } catch {
    return { ok: false, error: "Mạng đang chập chờn. Bạn kiểm tra kết nối rồi thử lại nhé." };
  }
}
