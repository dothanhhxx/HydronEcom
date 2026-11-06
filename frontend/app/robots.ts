import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/gio-hang", "/thanh-toan", "/dat-hang-thanh-cong", "/tai-khoan", "/yeu-thich", "/tra-cuu-don"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
