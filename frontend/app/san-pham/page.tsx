import type { Metadata } from "next";
import { Suspense } from "react";
import ProductGrid from "@/components/catalog/ProductGrid";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { ProductApiService } from "@/services/products.api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bình giữ nhiệt và phụ kiện",
  description: "Bình giữ nhiệt Hydron 500, 700, 900ml: nắp vặn, nắp ống hút, nắp bật. Lọc theo dung tích, màu, giá. In tên riêng trên mọi bình.",
};

export default async function CatalogPage() {
  const products = await ProductApiService.getAllProducts(false);
  return (
    <>
      <div className="lt-container" style={{ paddingTop: 20 }}>
        <Breadcrumbs crumbs={[{ label: "Sản phẩm" }]} />
      </div>
      <Suspense>
        <ProductGrid initialProducts={products} />
      </Suspense>
    </>
  );
}
