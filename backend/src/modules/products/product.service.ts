import { ProductRepository } from "./product.repository.js";
import type { Product } from "../../shared/types/product.types.js";

export class ProductService {
  /** Lấy danh sách sản phẩm (storefront: chỉ lấy active, admin: lấy toàn bộ trừ deleted) */
  static async getAllProducts(includeInactive = false): Promise<Product[]> {
    const list = await ProductRepository.findAll();
    return list.filter((p) => {
      if (p.deleted) return false;
      if (!includeInactive && p.active === false) return false;
      return true;
    });
  }

  /** Lấy chi tiết một sản phẩm theo slug */
  static async getProductBySlug(slug: string, includeInactive = false): Promise<Product | null> {
    const p = await ProductRepository.findBySlug(slug);
    if (!p || p.deleted) return null;
    if (!includeInactive && p.active === false) return null;
    return p;
  }

  /** Thêm mới một sản phẩm */
  static async createProduct(data: Partial<Product>): Promise<{ ok: boolean; product?: Product; error?: string }> {
    if (!data.name || !data.name.trim()) {
      return { ok: false, error: "Tên sản phẩm không được để trống." };
    }

    const slug = (data.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      return { ok: false, error: "Đường dẫn (slug) không hợp lệ." };
    }

    const existing = await ProductRepository.findBySlug(slug);
    if (existing && !existing.deleted) {
      return { ok: false, error: `Mã đường dẫn "${slug}" đã tồn tại. Vui lòng chọn slug khác.` };
    }

    const base = Number(data.base);
    if (isNaN(base) || base <= 0) {
      return { ok: false, error: "Giá bán cơ sở phải là số lớn hơn 0." };
    }

    const product: Product = {
      slug,
      name: data.name.trim(),
      category: data.category || "tra-xanh",
      kind: data.kind || "Trà xanh",
      note: data.note || "",
      base,
      compareAt: data.compareAt ? Number(data.compareAt) : undefined,
      fixed: !!data.fixed,
      rating: data.rating || 5.0,
      reviews: data.reviews || 0,
      sold: data.sold || 0,
      isNew: data.isNew !== undefined ? data.isNew : true,
      addedAt: data.addedAt || new Date().toISOString().slice(0, 10),
      origin: data.origin || "Tân Cương · Thái Nguyên",
      ph: data.ph || "moccau",
      gallery: data.gallery || [],
      desc: data.desc || "",
      purposes: data.purposes || ["hang-ngay"],
      occasions: data.occasions || [],
      specs: data.specs || [],
      brew: data.brew,
      stock: data.stock || {},
      active: data.active !== undefined ? data.active : true,
      deleted: false,
    };

    const saved = await ProductRepository.save(product);
    return { ok: true, product: saved };
  }

  /** Cập nhật thông tin toàn diện của sản phẩm */
  static async updateProduct(
    currentSlug: string,
    data: Partial<Product>
  ): Promise<{ ok: boolean; product?: Product; error?: string }> {
    const existing = await ProductRepository.findBySlug(currentSlug);
    if (!existing || existing.deleted) {
      return { ok: false, error: "Không tìm thấy sản phẩm cần cập nhật." };
    }

    const newSlug = data.slug
      ? data.slug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      : currentSlug;

    if (newSlug !== currentSlug) {
      const slugCheck = await ProductRepository.findBySlug(newSlug);
      if (slugCheck && !slugCheck.deleted) {
        return { ok: false, error: `Mã đường dẫn "${newSlug}" đã được sử dụng bởi sản phẩm khác.` };
      }
    }

    const base = data.base !== undefined ? Number(data.base) : existing.base;
    if (isNaN(base) || base <= 0) {
      return { ok: false, error: "Giá bán cơ sở phải là số lớn hơn 0." };
    }

    const merged: Product = {
      ...existing,
      ...data,
      slug: newSlug,
      base,
      compareAt: data.compareAt ? Number(data.compareAt) : undefined,
      active: data.active !== undefined ? data.active : existing.active,
      deleted: false,
    };

    const saved = await ProductRepository.save(merged, currentSlug);
    return { ok: true, product: saved };
  }

  /** Xóa sản phẩm */
  static async deleteProduct(slug: string): Promise<{ ok: boolean; error?: string }> {
    const existing = await ProductRepository.findBySlug(slug);
    if (!existing || existing.deleted) {
      return { ok: false, error: "Không tìm thấy sản phẩm cần xóa." };
    }

    await ProductRepository.delete(slug);
    return { ok: true };
  }

  /** Cập nhật nhanh giá và trạng thái (inline edit) */
  static async updateQuick(
    slug: string,
    patch: { base?: number; compareAt?: number; active?: boolean; stock?: Record<string, number> }
  ): Promise<{ ok: boolean; product?: Product; error?: string }> {
    const updated = await ProductRepository.updateQuick(slug, patch);
    if (!updated) {
      return { ok: false, error: "Không tìm thấy sản phẩm." };
    }
    return { ok: true, product: updated };
  }

  /** Đồng bộ danh mục sản phẩm chuẩn vào hệ thống */
  static async syncDefaults(forceReset = false): Promise<{ ok: boolean; count: number; products: Product[] }> {
    const products = await ProductRepository.syncDefaults(forceReset);
    return { ok: true, count: products.length, products };
  }
}

