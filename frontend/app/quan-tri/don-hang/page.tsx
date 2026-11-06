import { AdminShell } from "@/components/admin/AdminShell";
import { OrderTable } from "@/components/admin/OrderTable";

export const metadata = {
  title: "Quản lý đơn hàng · Lam Trà Admin",
};

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <OrderTable />
    </AdminShell>
  );
}
