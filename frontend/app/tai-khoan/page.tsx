import type { Metadata } from "next";
import { AccountPage } from "@/components/order/OrderPages";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Tài khoản", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader title="Tài khoản" crumbs={[{ label: "Tài khoản" }]} />
      <AccountPage />
    </>
  );
}
