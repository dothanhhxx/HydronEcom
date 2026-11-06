import { JsonStore } from "../../infrastructure/persistence/json-store.js";
import type { Product } from "../../shared/types/product.types.js";
import { DEFAULT_PRODUCTS } from "./default-products.js";

const PRODUCTS_FILE = "products.json";

export class ProductRepository {
  /** Đọc toàn bộ danh sách sản phẩm từ data/products.json, tự động nạp mẫu nếu trống */
  static async findAll(): Promise<Product[]> {
    const list = await JsonStore.readJson<Product[]>(PRODUCTS_FILE, []);
    if (!list || list.length === 0) {
      await JsonStore.writeJson(PRODUCTS_FILE, DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    return list;
  }

  /** Đồng bộ danh mục sản phẩm chuẩn vào database */
  static async syncDefaults(forceReset = false): Promise<Product[]> {
    if (forceReset) {
      await JsonStore.writeJson(PRODUCTS_FILE, DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }

    const currentList = await JsonStore.readJson<Product[]>(PRODUCTS_FILE, []);
    const merged = [...currentList];

    for (const def of DEFAULT_PRODUCTS) {
      const idx = merged.findIndex((p) => p.slug === def.slug);
      if (idx < 0) {
        merged.push(def);
      } else if (merged[idx].deleted) {
        // Khôi phục lại nếu bị xóa nhầm
        merged[idx] = { ...def, active: true, deleted: false };
      }
    }

    await JsonStore.writeJson(PRODUCTS_FILE, merged);
    return merged;
  }

  /** Tìm sản phẩm theo slug */
  static async findBySlug(slug: string): Promise<Product | null> {
    const list = await this.findAll();
    return list.find((p) => p.slug === slug) || null;
  }

  /** Thêm mới hoặc cập nhật toàn diện thông tin sản phẩm */
  static async save(product: Product, oldSlug?: string): Promise<Product> {
    const list = await this.findAll();
    const targetSlug = oldSlug || product.slug;
    const index = list.findIndex((p) => p.slug === targetSlug);

    const now = new Date().toISOString().slice(0, 10);
    const fullProduct: Product = {
      ...product,
      rating: product.rating ?? 5.0,
      reviews: product.reviews ?? 0,
      sold: product.sold ?? 0,
      addedAt: product.addedAt || now,
      origin: product.origin || "Tân Cương · Thái Nguyên",
      gallery: product.gallery || [],
      purposes: product.purposes || ["hang-ngay", "bieu-tang"],
      occasions: product.occasions || [],
      specs: product.specs || [],
      active: product.active !== undefined ? product.active : true,
      deleted: false,
    };

    if (index >= 0) {
      list[index] = {
        ...list[index],
        ...fullProduct,
      };
    } else {
      list.push(fullProduct);
    }

    await JsonStore.writeJson(PRODUCTS_FILE, list);
    return fullProduct;
  }

  /** Xóa sản phẩm (Đánh dấu xóa và ẩn khỏi storefront) */
  static async delete(slug: string): Promise<boolean> {
    const list = await this.findAll();
    const index = list.findIndex((p) => p.slug === slug);
    if (index < 0) return false;

    list[index] = {
      ...list[index],
      deleted: true,
      active: false,
    };

    await JsonStore.writeJson(PRODUCTS_FILE, list);
    return true;
  }

  /** Cập nhật nhanh giá, khuyến mãi, tồn kho hoặc trạng thái */
  static async updateQuick(slug: string, patch: Partial<Product>): Promise<Product | null> {
    const list = await this.findAll();
    const index = list.findIndex((p) => p.slug === slug);
    if (index < 0) return null;

    list[index] = {
      ...list[index],
      ...patch,
    };

    await JsonStore.writeJson(PRODUCTS_FILE, list);
    return list[index];
  }
}
