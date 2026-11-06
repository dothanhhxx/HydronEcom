import { PRODUCTS } from "@/lib/products";
import type { Product } from "@/shared";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:4000";

export class ProductApiService {
  /**
   * Lấy danh sách sản phẩm từ backend API.
   * Nếu backend chưa bật hoặc gặp sự cố, tự động dùng danh sách mặc định dự phòng.
   */
  static async getAllProducts(includeInactive = false): Promise<Product[]> {
    try {
      const endpoint = includeInactive
        ? `${BACKEND_URL}/api/admin/products`
        : `${BACKEND_URL}/api/products`;

      const res = await fetch(endpoint, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.products)) {
          return json.products;
        }
      }
    } catch {
      // Backend tạm thời không truy cập được -> fallback dữ liệu mặc định
    }

    return PRODUCTS.filter((p) => {
      if (p.deleted) return false;
      if (!includeInactive && p.active === false) return false;
      return true;
    });
  }

  /**
   * Lấy chi tiết một sản phẩm theo slug từ backend API.
   */
  static async getProductBySlug(slug: string, includeInactive = false): Promise<Product | null> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${slug}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.ok && json.product) {
          return json.product;
        }
      }
    } catch {
      // Fallback
    }

    const p = PRODUCTS.find((x) => x.slug === slug);
    if (!p || p.deleted) return null;
    if (!includeInactive && p.active === false) return null;
    return p;
  }
}
