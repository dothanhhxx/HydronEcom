import type { FastifyPluginAsync } from "fastify";
import { adminAuthGuard } from "../../middleware/auth-guard.js";
import { ProductService } from "./product.service.js";
import type { Product } from "../../shared/types/product.types.js";

export const productsRoutes: FastifyPluginAsync = async (fastify) => {
  // Public: Lấy danh sách sản phẩm hiển thị trên storefront
  fastify.get("/api/products", async (_request, reply) => {
    const products = await ProductService.getAllProducts(false);
    reply.header("Cache-Control", "no-cache, no-store, must-revalidate");
    return { ok: true, products };
  });

  // Public: Lấy chi tiết sản phẩm theo slug
  fastify.get<{ Params: { slug: string } }>("/api/products/:slug", async (request, reply) => {
    const { slug } = request.params;
    const product = await ProductService.getProductBySlug(slug, false);
    if (!product) {
      return reply.status(404).send({ ok: false, error: "Không tìm thấy sản phẩm." });
    }
    return { ok: true, product };
  });

  // Admin: Lấy toàn bộ sản phẩm (kể cả sản phẩm tạm ẩn)
  fastify.get("/api/admin/products", { preHandler: [adminAuthGuard] }, async () => {
    const products = await ProductService.getAllProducts(true);
    return { ok: true, products };
  });

  // Admin: Tạo mới sản phẩm
  fastify.post("/api/admin/products", { preHandler: [adminAuthGuard] }, async (request, reply) => {
    const body = (request.body as Partial<Product>) || {};
    const result = await ProductService.createProduct(body);
    if (!result.ok) {
      return reply.status(400).send({ ok: false, error: result.error });
    }
    return { ok: true, product: result.product };
  });

  // Admin: Cập nhật toàn diện sản phẩm
  fastify.put("/api/admin/products", { preHandler: [adminAuthGuard] }, async (request, reply) => {
    const body = (request.body as Partial<Product> & { currentSlug?: string }) || {};
    const { currentSlug, ...productData } = body;
    const slug = currentSlug || productData.slug;
    if (!slug) {
      return reply.status(400).send({ ok: false, error: "Thiếu mã sản phẩm (slug)." });
    }

    const result = await ProductService.updateProduct(slug, productData);
    if (!result.ok) {
      return reply.status(400).send({ ok: false, error: result.error });
    }
    return { ok: true, product: result.product };
  });

  // Admin: Cập nhật nhanh inline (giá, tồn kho, ẩn/hiện)
  fastify.patch("/api/admin/products", { preHandler: [adminAuthGuard] }, async (request, reply) => {
    const body =
      (request.body as {
        slug?: string;
        base?: number;
        compareAt?: number;
        active?: boolean;
        stock?: Record<string, number>;
      }) || {};

    const { slug, base, compareAt, active, stock } = body;
    if (!slug) {
      return reply.status(400).send({ ok: false, error: "Thiếu mã sản phẩm (slug)." });
    }

    const result = await ProductService.updateQuick(slug, { base, compareAt, active, stock });
    if (!result.ok) {
      return reply.status(400).send({ ok: false, error: result.error });
    }
    return { ok: true, product: result.product };
  });

  // Admin: Xóa sản phẩm
  fastify.delete("/api/admin/products", { preHandler: [adminAuthGuard] }, async (request, reply) => {
    const query = (request.query as { slug?: string }) || {};
    const body = (request.body as { slug?: string }) || {};
    const slug = query.slug || body.slug;

    if (!slug) {
      return reply.status(400).send({ ok: false, error: "Thiếu mã sản phẩm cần xóa." });
    }

    const result = await ProductService.deleteProduct(slug);
    if (!result.ok) {
      return reply.status(400).send({ ok: false, error: result.error });
    }
    return { ok: true };
  });

  // Admin: Đồng bộ hoặc khôi phục danh mục sản phẩm chuẩn
  fastify.post("/api/admin/products/sync", { preHandler: [adminAuthGuard] }, async (request) => {
    const body = (request.body as { forceReset?: boolean }) || {};
    const result = await ProductService.syncDefaults(!!body.forceReset);
    return result;
  });

  fastify.get("/api/admin/products/sync", { preHandler: [adminAuthGuard] }, async (request) => {
    const query = (request.query as { forceReset?: string }) || {};
    const result = await ProductService.syncDefaults(query.forceReset === "true");
    return result;
  });
};

