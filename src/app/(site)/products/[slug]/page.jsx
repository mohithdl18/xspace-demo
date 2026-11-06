import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductVisual } from "@/components/product/Ply";
import { CompareButton } from "@/components/product/CompareButton";
import { ArrowRight, Download, WhatsApp } from "@/components/ui/Icon";
import { getCompany, getDocuments, getProduct, getProducts } from "@/lib/queries";
import { SITE_URL, whatsappLink } from "@/lib/site";
export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const p = getProduct((await params).slug);
  if (!p) return { title: "Product not found" };
  const title = p.seoTitle || `${p.name}${p.gradeLabel ? ` — ${p.gradeLabel}` : ""}`;
  const description = p.seoDescription || p.description.slice(0, 160);
  const url = `${SITE_URL}/products/${p.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", ...(p.imageUrl && { images: [{ url: p.imageUrl }] }) },
  };
}
export default async function ProductPage({ params }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const company = getCompany();
  const docs = getDocuments(p.id);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: p.name,
        description: p.description,
        category: p.category.name,
        brand: { "@type": "Brand", name: company.name },
        manufacturer: { "@id": `${SITE_URL}/#business` },
        url: `${SITE_URL}/products/${p.slug}`,
        ...(p.imageUrl && { image: new URL(p.imageUrl, SITE_URL).toString() }),
        ...(p.specs.length && {
          additionalProperty: p.specs.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Products", item: `${SITE_URL}/products` },
          {
            "@type": "ListItem",
            position: 2,
            name: p.category.name,
            item: `${SITE_URL}/products?category=${p.category.slug}`,
          },
          { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}/products/${p.slug}` },
        ],
      },
    ],
  };
  const pending = <span className="text-cream/50">To be confirmed — ask our team</span>;
  return (
    <>
      <section className="pb-16 pt-28 md:pt-36">
        <div className="frame">
          <nav aria-label="Breadcrumb" className="text-[13px] text-cream/60">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/products" className="link-u">
                  Products
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/products?category=${p.category.slug}`} className="link-u">
                  {p.category.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-cream">
                {p.name}
              </li>
            </ol>
          </nav>

          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7" data-reveal-img>
              <ProductVisual
                imageUrl={p.imageUrl}
                alt={p.imageAlt}
                tone={p.tone}
                priority
                className="aspect-4/3 w-full"
              />
            </div>
            <div className="lg:col-span-5 lg:pt-6">
              <div className="flex flex-wrap items-center gap-2">
                {p.grade && <span className="badge">{p.grade}</span>}
                <span className="text-[12px] uppercase tracking-[0.16em] text-cream/60">
                  {p.gradeLabel || p.category.name}
                </span>
              </div>
              <h1 className="mt-5 text-h1">{p.name}</h1>
              {p.tagline && <p className="mt-4 text-[19px] text-sand">{p.tagline}</p>}
              <p className="mt-6 text-[16px] leading-relaxed text-cream/75">{p.description}</p>

              {p.thicknesses.length > 0 && (
                <div className="mt-8">
                  <p className="eyebrow">Available thickness</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {p.thicknesses.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={`https://wa.me/919686348614?text=Hello%20XSpace%2C%20I'd%20like%20to%20know%20more%20about%20${encodeURIComponent(p.name)}`} className="btn btn-primary">
                  Request a Quote <WhatsApp className="h-4 w-4" />
                </Link>
                {/* {company.whatsapp && (
                  <a
                    className="btn btn-outline"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={whatsappLink(
                      company.whatsapp,
                      `Hello XSpace, I'd like a quotation for ${p.name}. Thickness: ___ Quantity: ___ Location: ___`,
                    )}
                  >
                    <WhatsApp className="h-4 w-4" /> WhatsApp
                  </a>
                )} */}
                {/* <CompareButton slug={p.slug} name={p.name} className="min-h-[48px]! px-5" /> */}
              </div>
              {!p.verified && (
                <p className="mt-6 border-l-2 border-oak bg-panel px-4 py-3 text-[13px] text-cream/60">
                  Detailed specifications for this product are being added. Contact us for current grades and sizes.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rule bg-base py-20 md:py-24">
        <div className="frame grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="text-h3">Specifications</h2>
            <dl className="mt-6 border-t border-cream/10">
              {p.specs.length ? (
                p.specs.map((s) => (
                  <div
                    key={s.label}
                    className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-cream/10 py-4 text-[15px]"
                  >
                    <dt className="text-cream/60">{s.label}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))
              ) : (
                <div className="border-b border-cream/10 py-4 text-[15px]">{pending}</div>
              )}
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-cream/10 py-4 text-[15px]">
                <dt className="text-cream/60">Thickness</dt>
                <dd className="font-medium">{p.thicknesses.length ? p.thicknesses.join(", ") : pending}</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-12 lg:col-span-5 lg:col-start-8">
            <div>
              <h2 className="text-h3">Key benefits</h2>
              {p.benefits.length ? (
                <ul className="mt-6 space-y-4">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex gap-4 text-[15px] leading-relaxed">
                      <span aria-hidden="true" className="mt-2 h-px w-5 shrink-0 bg-walnut" />
                      {b}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-[15px]">{pending}</p>
              )}
            </div>
            <div>
              <h2 className="text-h3">Applications</h2>
              {p.applications.length ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.applications.map((a) => (
                    <li key={a}>
                      <Link href={`/products?application=${encodeURIComponent(a)}`} className="chip hover:border-cream">
                        {a}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-[15px]">{pending}</p>
              )}
            </div>
            {p.technologies.length > 0 && (
              <div>
                <h2 className="text-h3">Technologies</h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {p.technologies.map((t) => (
                    <li key={t} className="badge">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h2 className="text-h3">Documents</h2>
              {docs.length ? (
                <ul className="mt-6 border-t border-cream/10">
                  {docs.map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-4 border-b border-cream/10 py-4">
                      <span className="text-[15px]">{d.title}</span>
                      {d.fileUrl ? (
                        <a
                          href={d.fileUrl}
                          download
                          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium"
                        >
                          <Download /> Download
                        </a>
                      ) : (
                        <span className="text-[13px] text-cream/50">Coming soon</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-[15px] text-cream/70">
                  Need a technical sheet?{" "}
                  <Link href="/faq" className="link-u font-medium text-cream">
                    See our FAQs
                  </Link>{" "}
                  or{" "}
                  <Link href="/#contact" className="link-u font-medium text-cream">
                    ask us directly
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}