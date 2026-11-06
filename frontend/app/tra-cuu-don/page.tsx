import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderLookup } from "@/components/order/OrderPages";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Tra cứu đơn hàng", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader title="Tra cứu đơn hàng" crumbs={[{ label: "Tra cứu đơn hàng" }]} desc="Nhập mã đơn (trong tin nhắn Zalo hoặc email) và số điện thoại đặt hàng." />
      <Suspense><OrderLookup /></Suspense>
    </>
  );
}
