import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/posts";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => SITE.url + path;
  const pages = ["", "/san-pham", "/thiet-ke-3d", "/gioi-thieu", "/cam-nang", "/hoi-dap", "/lien-he", "/chinh-sach"];
  return [
    ...pages.map((p) => ({ url: u(p), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...CATEGORIES.map((c) => ({ url: u(`/san-pham?danh-muc=${c.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...PRODUCTS.map((p) => ({ url: u(`/san-pham/${p.slug}`), lastModified: p.addedAt, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...POSTS.map((p) => ({ url: u(`/cam-nang/${p.slug}`), lastModified: p.date, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
