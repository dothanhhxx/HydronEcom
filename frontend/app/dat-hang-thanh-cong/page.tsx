import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "@/components/order/OrderPages";

export const metadata: Metadata = { title: "Đặt hàng thành công", robots: { index: false } };

export default function Page() {
  return (
    <>
      <Suspense><OrderSuccess /></Suspense>
    </>
  );
}
