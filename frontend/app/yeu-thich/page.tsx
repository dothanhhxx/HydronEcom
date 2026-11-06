import type { Metadata } from "next";
import { WishlistPage } from "@/components/order/OrderPages";
import { PageHeader } from "@/components/shell/PageHeader";

export const metadata: Metadata = { title: "Yêu thích", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader title="Trà yêu thích" crumbs={[{ label: "Yêu thích" }]} />
      <WishlistPage />
    </>
  );
}
