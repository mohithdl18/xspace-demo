import { Suspense } from "react";
import { Catalogue, CatalogueWithParams } from "@/components/product/Catalogue";
import { PageIntro } from "@/components/ui/PageIntro";
import { getCategories, getProducts } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
export function generateMetadata() {
  return pageMetadata("/products", { title: "Products", description: "XSpace plywood grades and interior materials." });
}
export default function ProductsPage() {
  // only the three featured plywood grades (MR · BWR · BWP)
  const products = getProducts({ featured: true });
  const used = new Set(products.map((p) => p.category.slug));
  const categories = getCategories()
    .filter((c) => used.has(c.slug))
    .map(({ slug, name }) => ({ slug, name }));
  return (
    <>
      <PageIntro
        panel={false}
        eyebrow="Products"
        title="The XSpace range."
        intro="Plywood in moisture resistant, boiling water proof, calibrated and fire retardant grades — alongside blockboard, doors, MDF, laminates, PVC foam boards, particle boards and timber."
      />
      <section className="frame pb-28">
        <Suspense fallback={<Catalogue products={products} categories={categories} />}>
          <CatalogueWithParams products={products} categories={categories} />
        </Suspense>
      </section>
    </>
  );
}
