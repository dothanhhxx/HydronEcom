// Đơn hàng và sổ địa chỉ đã dùng trên thiết bị này (localStorage).
// Giai đoạn 3 có tài khoản thì lấy từ server; hiện dùng để xem lại đơn, mua lại và điền nhanh địa chỉ.
import type { Order } from "./checkout";
import { readJSON, writeJSON } from "./storage";

const ORDERS_KEY = "lamtra-orders-v1";
const ADDR_KEY = "lamtra-addresses-v1";
// Số ngày giữ lịch sử đơn trên máy, tính theo ngày lịch: 1 = chỉ trong hôm nay (qua 0h là xoá), 3 = hôm nay và 2 ngày trước.
// Chỉ xoá bản lưu trên trình duyệt; đơn trên server vẫn còn và tra cứu được bằng mã đơn + SĐT.
const KEEP_DAYS = 3;

export type SavedAddress = { name: string; phone: string; email?: string; province: string; address: string };

function keepFrom() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (KEEP_DAYS - 1));
  return d.getTime();
}

export function localOrders() {
  const all = readJSON<Order[]>(ORDERS_KEY, []);
  const from = keepFrom();
  const kept = all.filter((o) => new Date(o.createdAt).getTime() >= from);
  if (kept.length !== all.length) writeJSON(ORDERS_KEY, kept);
  return kept;
}
export const localOrder = (code: string) => localOrders().find((o) => o.code === code);

export function saveLocalOrder(o: Order) {
  writeJSON(ORDERS_KEY, [o, ...localOrders().filter((x) => x.code !== o.code)].slice(0, 30));
}

export function patchLocalOrder(code: string, patch: Partial<Order>) {
  writeJSON(ORDERS_KEY, localOrders().map((o) => (o.code === code ? { ...o, ...patch } : o)));
}

export const savedAddresses = () => readJSON<SavedAddress[]>(ADDR_KEY, []);

export function saveAddress(a: SavedAddress) {
  const same = (x: SavedAddress) => x.phone === a.phone && x.address === a.address && x.province === a.province;
  writeJSON(ADDR_KEY, [a, ...savedAddresses().filter((x) => !same(x))].slice(0, 5));
}

export function removeAddress(i: number) {
  writeJSON(ADDR_KEY, savedAddresses().filter((_, j) => j !== i));
}
