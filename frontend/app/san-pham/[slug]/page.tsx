import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/catalog/ProductDetail";
import JsonLd from "@/components/shell/JsonLd";
import { Breadcrumbs } from "@/components/shell/PageHeader";
import { getCategory, maxQtyOf, priceRange } from "@/lib/products";
import { SITE } from "@/lib/site";
import { ProductApiService } from "@/services/products.api";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ mau?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const p = await ProductApiService.getProductBySlug(slug, false);
  if (!p) return {};
  return { title: `${p.name} – ${p.kind}`, description: `${p.note}. ${p.desc}`.slice(0, 160), alternates: { canonical: `/san-pham/${p.slug}` } };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const slug = (await params).slug;
  const { mau } = await searchParams;
  const [p, all] = await Promise.all([ProductApiService.getProductBySlug(slug, false), ProductApiService.getAllProducts(false)]);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const [lo, hi] = priceRange(p);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.desc,
          sku: p.sku,
          brand: { "@type": "Brand", name: SITE.name },
          category: p.kind,
          color: p.colors.map((c) => c.name).join(", "),
          offers: {
            "@type": "AggregateOffer",
            url: `${SITE.url}/san-pham/${p.slug}`,
            priceCurrency: "VND",
            lowPrice: lo,
            highPrice: hi,
            availability: maxQtyOf(p) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }}
      />
      <div className="lt-container" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <Breadcrumbs crumbs={[{ label: "Sản phẩm", href: "/san-pham" }, ...(cat ? [{ label: cat.name, href: `/san-pham?danh-muc=${cat.slug}` }] : []), { label: p.name }]} />
      </div>
      <ProductDetail product={p} products={all} initialColor={mau} />
    </>
  );
}
