import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/catalog/ProductDetail";
import JsonLd from "@/components/shell/JsonLd";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { PRODUCTS, getCategory, maxQtyOf, photo, priceOf } from "@/lib/products";
import { reviewsOf } from "@/lib/reviews";
import { SITE } from "@/lib/site";
import { ProductApiService } from "@/services/products.api";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const p = await ProductApiService.getProductBySlug(slug, false);
  if (!p) return {};
  return { title: p.name, description: p.desc, alternates: { canonical: `/san-pham/${p.slug}` }, openGraph: { title: p.name, description: p.note, images: [photo(p.ph)] } };
}

const toIso = (d: string) => d.split("/").reverse().join("-");

export default async function ProductPage({ params }: Props) {
  const slug = (await params).slug;
  const p = await ProductApiService.getProductBySlug(slug, false);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const crumbs = [
    { label: "Sản phẩm", href: "/san-pham" },
    ...(cat ? [{ label: cat.name, href: `/san-pham?danh-muc=${cat.slug}` }] : []),
    { label: p.name },
  ];
  const url = `${SITE.url}/san-pham/${p.slug}`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.desc,
          image: [p.ph, ...p.gallery.map((g) => g.ph)].map((x) => SITE.url + photo(x)),
          brand: { "@type": "Brand", name: SITE.name },
          category: p.kind,
          aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
          review: reviewsOf(p.slug).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            datePublished: toIso(r.date),
            reviewBody: r.text,
            reviewRating: { "@type": "Rating", ratingValue: r.stars, bestRating: 5 },
          })),
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "VND",
            price: priceOf(p),
            availability: maxQtyOf(p) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: { "@type": "Organization", name: SITE.name },
          },
        }}
      />
      <div className="lt-container" style={{ paddingTop: 24, paddingBottom: 8 }}>
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <ProductDetail product={p} />
    </>
  );
}
