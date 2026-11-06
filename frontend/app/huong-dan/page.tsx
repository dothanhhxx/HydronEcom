import type { Metadata } from "next";
import QrGuideHub from "@/components/info/QrGuideHub";
import { ProductApiService } from "@/services/products.api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cẩm nang thưởng trà & Hướng dẫn pha trà",
  description:
    "Xem video hướng dẫn pha trà Thái Nguyên chuẩn vị, đồng hồ bấm giờ hãm trà, cách bảo quản và kết nối nhanh với Facebook, Zalo Lam Trà.",
};

export default async function QrGuidePage({
  searchParams,
}: {
  searchParams: Promise<{ tra?: string; sp?: string }>;
}) {
  const params = await searchParams;
  const products = await ProductApiService.getAllProducts(false);
  const initialSlug = params.tra || params.sp;

  return <QrGuideHub products={products} initialSlug={initialSlug} />;
}

