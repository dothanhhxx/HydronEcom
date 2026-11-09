import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderLookup } from "@/components/order/OrderPages";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Tra cứu đơn hàng", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader plain title="Tra cứu đơn hàng" crumbs={[{ label: "Tra cứu đơn hàng" }]} desc="Nhập số điện thoại đặt hàng để xem tất cả đơn và đơn đang ở bước nào. Có mã đơn thì tra bằng mã để xem đủ địa chỉ và thông tin chuyển khoản." />
      <Suspense><OrderLookup /></Suspense>
    </>
  );
}
