import { AdminShell } from "@/components/admin/AdminShell";
import { ProductManager } from "@/components/admin/ProductManager";

export const metadata = {
  title: "Quản lý danh mục & giá · Hydron Admin",
};

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <ProductManager />
    </AdminShell>
  );
}
