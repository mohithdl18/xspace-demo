import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ProductVisual } from "@/components/product/Ply";
import { CompareSync } from "@/components/product/CompareSync";
import { getProducts } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";
export const metadata = {
  title: "Compare products",
  description: "Compare XSpace products side by side.",
  alternates: { canonical: `${SITE_URL}/compare` },
  robots: { index: false, follow: true },
};
export default async function ComparePage({ searchParams }) {
  const slugs = ((await searchParams).items || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const all = getProducts();
  const items = slugs.map((s) => all.find((p) => p.slug === s)).filter((p) => Boolean(p));
  const specLabels = [...new Set(items.flatMap((p) => p.specs.map((s) => s.label)))].filter(
    (l) => l !== "Grade" && l !== "Thickness",
  );
  const NA = <span className="text-cream/45">Not specified</span>;
  const list = (xs) => (xs.length ? xs.join(", ") : NA);
  const rows = [
    { label: "Category", cell: (p) => p.category.name },
    { label: "Grade", cell: (p) => (p.grade ? `${p.grade}${p.gradeLabel ? ` — ${p.gradeLabel}` : ""}` : NA) },
    { label: "Thickness", cell: (p) => list(p.thicknesses) },
    ...specLabels.map((label) => ({ label, cell: (p) => p.specs.find((s) => s.label === label)?.value ?? NA })),
    { label: "Technologies", cell: (p) => list(p.technologies) },
    {
      label: "Key benefits",
      cell: (p) =>
        p.benefits.length ? (
          <ul className="space-y-2">
            {p.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        ) : (
          NA
        ),
    },
    { label: "Applications", cell: (p) => list(p.applications) },
  ];
  return (
    <>
      <CompareSync slugs={items.map((p) => p.slug)} />
      <PageIntro
        eyebrow="Compare"
        title="Side by side."
        intro="Compare up to three products using published specifications. Where a detail hasn’t been published, we say so."
      />
      <section className="frame pb-28">
        {items.length === 0 ? (
          <div className="bg-panel px-8 py-16 text-center">
            <p className="text-h3">Nothing to compare yet.</p>
            <p className="mt-2 text-[15px] text-cream/65">Use “Compare” on any product to add it here.</p>
            <Link href="/products" className="btn btn-primary mt-6">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[640px] table-fixed border-collapse text-left text-[14px]">
              <caption className="sr-only">Product comparison</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-[22%] align-bottom pb-6 text-[12px] font-medium uppercase tracking-[0.16em] text-cream/55"
                  >
                    Product
                  </th>
                  {items.map((p) => (
                    <th key={p.slug} scope="col" className="px-3 pb-6 align-top font-normal">
                      <ProductVisual
                        imageUrl={p.imageUrl}
                        alt={p.imageAlt}
                        tone={p.tone}
                        label={false}
                        className="aspect-4/3 w-full"
                        sizes="25vw"
                      />
                      <Link href={`/products/${p.slug}`} className="link-u mt-4 block text-[17px] font-medium">
                        {p.name}
                      </Link>
                      <Link
                        href={`/compare?items=${items
                          .filter((x) => x.slug !== p.slug)
                          .map((x) => x.slug)
                          .join(",")}`}
                        className="mt-2 inline-block text-[12px] text-cream/55 hover:text-cream"
                      >
                        Remove
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-cream/10 align-top">
                    <th scope="row" className="py-4 pr-4 font-medium text-cream/60">
                      {r.label}
                    </th>
                    {items.map((p) => (
                      <td key={p.slug} className="px-3 py-4 leading-relaxed">
                        {r.cell(p)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-cream/10">
                  <th scope="row" />
                  {items.map((p) => (
                    <td key={p.slug} className="px-3 py-6">
                      <Link href="/#contact" className="btn btn-primary min-h-[44px]! w-full">
                        Quote
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
