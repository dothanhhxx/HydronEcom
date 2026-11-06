import type { Metadata } from "next";
import { Suspense } from "react";
import Studio from "@/components/studio/Studio";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { ProductApiService } from "@/services/products.api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tự thiết kế bình 3D – in tên, số, sticker",
  description: "Chọn mẫu bình, dung tích, màu; gõ tên hoặc số, chọn kiểu chữ và sticker, xoay mô hình 3D để xem trước rồi đặt hàng.",
};

export default async function StudioPage() {
  const products = await ProductApiService.getAllProducts(false);
  return (
    <div className="lt-container" style={{ paddingTop: 20, paddingBottom: 64 }}>
      <Breadcrumbs crumbs={[{ label: "Thiết kế 3D" }]} />
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12, margin: "16px 0 24px" }}>
        <h1 style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}>Thiết kế bình của bạn</h1>
        <p style={{ maxWidth: 440, fontSize: 15, color: "var(--text-muted)" }}>Xoay mô hình để xem chữ nằm ở đâu. Bản in thật giống bản xem trước; Hydron nhắn Zalo ảnh bình trước khi giao.</p>
      </div>
      <Suspense>
        <Studio products={products} />
      </Suspense>
    </div>
  );
}
