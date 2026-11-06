import type { Metadata } from "next";
import CartPage from "@/components/order/CartPage";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Giỏ hàng", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader title="Giỏ hàng" crumbs={[{ label: "Giỏ hàng" }]} />
      <CartPage />
    </>
  );
}
