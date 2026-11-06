"use client";

// Giỏ hàng + danh sách yêu thích phía trình duyệt, lưu localStorage.
// Danh sách sản phẩm lấy từ backend để giá/tồn kho luôn khớp với trang quản trị.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { keyOf, normalizeCode, toItems, type CartItem, type CartLine } from "./checkout";
import { PRODUCTS, defaultColor, defaultSize, findProduct, maxQtyOf, normalizeCustom, type Customization, type Product } from "./products";
import { readJSON, writeJSON } from "./storage";

export type { CartItem, CartLine };

type Toast = { message: string; action?: { label: string; href: string } };

type AddInput = { slug: string; size?: string; color?: string; qty?: number; custom?: Customization };

type CartCtx = {
  products: Product[];
  lines: CartLine[];
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (input: AddInput) => boolean;
  addMany: (lines: CartLine[]) => number;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  coupon: string;
  setCoupon: (code: string) => void;
  wishlist: string[];
  isWished: (slug: string) => boolean;
  toggleWish: (slug: string) => void;
  toast: Toast | null;
  notify: (message: string, action?: Toast["action"]) => void;
  dismissToast: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const CART_KEY = "hydron-cart-v1";
const COUPON_KEY = "hydron-coupon-v1";
const WISH_KEY = "hydron-wishlist-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [coupon, setCouponState] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const productsRef = useRef(products);
  productsRef.current = products;

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.products) && d.products.length) setProducts(d.products);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLines(readJSON<CartLine[]>(CART_KEY, []).filter((l) => l && typeof l.slug === "string" && typeof l.color === "string"));
    setCouponState(readJSON<string>(COUPON_KEY, ""));
    setWishlist(readJSON<string[]>(WISH_KEY, []).filter((s) => typeof s === "string"));
    setReady(true);
    return () => clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (ready) writeJSON(CART_KEY, lines);
  }, [lines, ready]);
  useEffect(() => {
    if (ready) writeJSON(COUPON_KEY, coupon);
  }, [coupon, ready]);
  useEffect(() => {
    if (ready) writeJSON(WISH_KEY, wishlist);
  }, [wishlist, ready]);

  const notify = useCallback<CartCtx["notify"]>((message, action) => {
    clearTimeout(timer.current);
    setToast({ message, action });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const merge = useCallback((ls: CartLine[], line: CartLine) => {
    const p = findProduct(productsRef.current, line.slug);
    const max = p ? maxQtyOf(p, line.size, line.color) : 1;
    const k = keyOf(line);
    const hit = ls.find((l) => keyOf(l) === k);
    return hit ? ls.map((l) => (keyOf(l) === k ? { ...l, qty: Math.min(max, l.qty + line.qty) } : l)) : [...ls, { ...line, qty: Math.min(max, line.qty) }];
  }, []);

  const add = useCallback<CartCtx["add"]>(({ slug, size, color, qty = 1, custom }) => {
    const p = findProduct(productsRef.current, slug);
    if (!p) return false;
    const line: CartLine = {
      slug,
      size: p.sizes.length ? size ?? defaultSize(p) : "-",
      color: p.colors.length ? color ?? defaultColor(p) : "-",
      qty,
    };
    const c = normalizeCustom(custom, p);
    if (c) line.custom = c;
    if (maxQtyOf(p, line.size, line.color) < 1) {
      notify(`${p.name} bản này tạm hết hàng`);
      return false;
    }
    setLines((ls) => merge(ls, line));
    notify(c ? `Đã thêm ${p.name} kèm thiết kế riêng` : `Đã thêm ${p.name} vào giỏ`, { label: "Xem giỏ", href: "/gio-hang" });
    return true;
  }, [notify, merge]);

  const addMany = useCallback<CartCtx["addMany"]>((src) => {
    const ok = src.filter((l) => {
      const p = findProduct(productsRef.current, l.slug);
      return p && maxQtyOf(p, l.size, l.color) > 0;
    });
    if (ok.length) {
      setLines((ls) => ok.reduce(merge, ls));
      notify(`Đã thêm ${ok.length} sản phẩm vào giỏ`, { label: "Xem giỏ", href: "/gio-hang" });
    } else notify("Các sản phẩm này tạm hết hàng");
    return ok.length;
  }, [notify, merge]);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((ls) => ls.map((l) => {
      if (keyOf(l) !== key) return l;
      const p = findProduct(productsRef.current, l.slug);
      const max = p ? maxQtyOf(p, l.size, l.color) : 1;
      return { ...l, qty: Math.max(1, Math.min(max, qty)) };
    }));
  }, []);
  const remove = useCallback((key: string) => setLines((ls) => ls.filter((l) => keyOf(l) !== key)), []);
  const clear = useCallback(() => {
    setLines([]);
    setCouponState("");
  }, []);
  const setCoupon = useCallback((code: string) => setCouponState(normalizeCode(code)), []);

  const toggleWish = useCallback((slug: string) => {
    const p = findProduct(productsRef.current, slug);
    const on = wishlist.includes(slug);
    setWishlist((w) => (on ? w.filter((s) => s !== slug) : [...w.filter((s) => s !== slug), slug]));
    notify(on ? `Đã bỏ ${p?.name} khỏi yêu thích` : `Đã lưu ${p?.name} vào yêu thích`, on ? undefined : { label: "Xem", href: "/yeu-thich" });
  }, [wishlist, notify]);

  const value = useMemo<CartCtx>(() => {
    const items = toItems(lines, products);
    return {
      products, lines, items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.total, 0),
      ready, add, addMany, setQty, remove, clear, coupon, setCoupon,
      wishlist, isWished: (slug) => wishlist.includes(slug), toggleWish,
      toast, notify, dismissToast: () => setToast(null),
    };
  }, [products, lines, ready, add, addMany, setQty, remove, clear, coupon, setCoupon, wishlist, toggleWish, toast, notify]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart phải nằm trong <CartProvider>");
  return c;
}
