import type { Metadata } from "next";
import CheckoutForm from "@/components/order/CheckoutForm";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Đặt hàng", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader plain title="Đặt hàng" crumbs={[{ label: "Đặt hàng" }]} desc="Không cần tài khoản. Hydron xác nhận qua Zalo trong 30 phút." />
      <CheckoutForm />
    </>
  );
}
