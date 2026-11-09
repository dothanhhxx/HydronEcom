// Đơn hàng và sổ địa chỉ đã dùng trên thiết bị này (localStorage).
// Giai đoạn 3 có tài khoản thì lấy từ server; hiện dùng để xem lại đơn, mua lại và điền nhanh địa chỉ.
import type { Order } from "./checkout";
import { normalizePhone } from "./checkout";
import { readJSON, writeJSON } from "./storage";

// Lịch sử mua hàng tách riêng cho từng người dùng, nhận diện bằng SĐT người đặt (chưa có đăng nhập).
// Mỗi người có một chu kỳ riêng: tính từ đơn đầu tiên của chu kỳ, đủ RESET_DAYS ngày thì xoá sạch và bắt đầu lại.
// Chỉ xoá bản lưu trên trình duyệt; đơn trên server vẫn còn và tra cứu được bằng mã đơn + SĐT.
const LEGACY_ORDERS_KEY = "hydron-orders-v1";
const HISTORY_PREFIX = "hydron-history-v1:";
const CURRENT_USER_KEY = "hydron-current-user-v1";
const ADDR_KEY = "hydron-addresses-v1";
export const RESET_DAYS = 3;
const RESET_MS = RESET_DAYS * 24 * 60 * 60 * 1000;

export type SavedAddress = { name: string; phone: string; email?: string; province: string; address: string };
type History = { startedAt: string; orders: Order[] };

const historyKey = (phone: string) => HISTORY_PREFIX + normalizePhone(phone);
const expired = (h: History) => Date.now() - new Date(h.startedAt).getTime() >= RESET_MS;

function historyKeys() {
  const keys: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(HISTORY_PREFIX)) keys.push(k);
    }
  } catch {
    /* localStorage bị chặn */
  }
  return keys;
}

function removeKey(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* bỏ qua */
  }
}

// Chuyển dữ liệu cũ (mọi đơn chung một danh sách) sang lịch sử riêng theo SĐT người đặt.
function migrateLegacy() {
  const old = readJSON<Order[] | null>(LEGACY_ORDERS_KEY, null);
  if (!old) return;
  const groups = new Map<string, Order[]>();
  for (const o of old) {
    const p = normalizePhone(o.buyer?.phone ?? "");
    if (p) groups.set(p, [...(groups.get(p) ?? []), o]);
  }
  groups.forEach((orders, phone) => {
    const oldest = orders.reduce((a, o) => (o.createdAt < a ? o.createdAt : a), orders[0].createdAt);
    writeJSON(historyKey(phone), { startedAt: oldest, orders });
  });
  if (!currentUser() && old[0]?.buyer?.phone) setCurrentUser(old[0].buyer.phone);
  removeKey(LEGACY_ORDERS_KEY);
}

function readHistory(key: string): History | null {
  const h = readJSON<History | null>(key, null);
  if (!h) return null;
  if (expired(h)) {
    removeKey(key);
    return null;
  }
  return h;
}

/** Xoá lịch sử đã hết chu kỳ của mọi người dùng trên máy này. */
export function sweepHistories() {
  migrateLegacy();
  historyKeys().forEach(readHistory);
}

export const currentUser = () => readJSON<string>(CURRENT_USER_KEY, "");
export const setCurrentUser = (phone: string) => writeJSON(CURRENT_USER_KEY, normalizePhone(phone));
export const clearCurrentUser = () => removeKey(CURRENT_USER_KEY);

/** Ngày lịch sử của người dùng sẽ được làm mới (undefined nếu chưa có đơn nào trong chu kỳ). */
export function historyResetAt(phone = currentUser()) {
  if (!phone) return undefined;
  migrateLegacy();
  const h = readHistory(historyKey(phone));
  return h ? new Date(new Date(h.startedAt).getTime() + RESET_MS) : undefined;
}

/** Đơn trong chu kỳ hiện tại của người dùng (mặc định: người đang dùng máy). */
export function localOrders(phone = currentUser()) {
  if (!phone) return [];
  migrateLegacy();
  return readHistory(historyKey(phone))?.orders ?? [];
}

/** Tìm đơn theo mã: ưu tiên người dùng hiện tại, sau đó tới lịch sử khác trên máy. */
export function localOrder(code: string) {
  migrateLegacy();
  const mine = localOrders().find((o) => o.code === code);
  if (mine) return mine;
  for (const k of historyKeys()) {
    const found = readHistory(k)?.orders.find((o) => o.code === code);
    if (found) return found;
  }
  return undefined;
}

export function saveLocalOrder(o: Order) {
  const phone = normalizePhone(o.buyer.phone);
  migrateLegacy();
  const key = historyKey(phone);
  const h = readHistory(key) ?? { startedAt: new Date().toISOString(), orders: [] };
  writeJSON(key, { ...h, orders: [o, ...h.orders.filter((x) => x.code !== o.code)].slice(0, 30) });
  setCurrentUser(phone);
}

export function patchLocalOrder(code: string, patch: Partial<Order>) {
  migrateLegacy();
  for (const k of historyKeys()) {
    const h = readHistory(k);
    if (h?.orders.some((o) => o.code === code)) {
      writeJSON(k, { ...h, orders: h.orders.map((o) => (o.code === code ? { ...o, ...patch } : o)) });
    }
  }
}

export const savedAddresses = () => readJSON<SavedAddress[]>(ADDR_KEY, []);

export function saveAddress(a: SavedAddress) {
  const same = (x: SavedAddress) => x.phone === a.phone && x.address === a.address && x.province === a.province;
  writeJSON(ADDR_KEY, [a, ...savedAddresses().filter((x) => !same(x))].slice(0, 5));
}

export function removeAddress(i: number) {
  writeJSON(ADDR_KEY, savedAddresses().filter((_, j) => j !== i));
}
