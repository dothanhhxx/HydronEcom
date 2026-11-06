import Landing from "@/components/landing/Landing";
import JsonLd from "@/components/shell/JsonLd";
import { POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";
import { ProductApiService } from "@/services/products.api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const products = await ProductApiService.getAllProducts(false);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: SITE.name,
          slogan: SITE.tagline,
          url: SITE.url,
          logo: SITE.url + "/assets/brand/hydron-logo.png",
          email: SITE.email,
          priceRange: "45.000₫ – 199.000₫",
          sameAs: [SITE.facebook, SITE.tiktok],
        }}
      />
      <Landing products={products} posts={POSTS} />
    </>
  );
}
