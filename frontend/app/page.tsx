import HomeSections from "@/components/landing/HomeSections";
import Landing from "@/components/landing/Landing";
import JsonLd from "@/components/shell/JsonLd";
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
          logo: SITE.url + "/assets/lam-tra-emblem.svg",
          image: SITE.url + "/assets/photos/hero.jpg",
          telephone: SITE.phone,
          email: SITE.email,
          address: { "@type": "PostalAddress", streetAddress: SITE.address, addressCountry: "VN" },
          sameAs: [SITE.facebook, SITE.tiktok],
        }}
      />
      <Landing products={products} />
      <HomeSections products={products} />
    </>
  );
}
