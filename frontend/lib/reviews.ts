// Đánh giá của khách. Cửa hàng mới mở nên chưa có dữ liệu thật; khi có, nạp từ backend (tin nhắn loại "danh-gia" đã duyệt).
export type Review = { slug: string; name: string; stars: number; date: string; text: string; verified: boolean; variant?: string };

export const REVIEWS: Review[] = [];

export const reviewsOf = (slug: string) => REVIEWS.filter((r) => r.slug === slug);
