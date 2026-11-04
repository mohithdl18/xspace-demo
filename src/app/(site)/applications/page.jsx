import Link from "next/link";
import Image from "next/image";
import { PageIntro } from "@/components/ui/PageIntro";
import { ArrowRight } from "@/components/ui/Icon";
import { grainUrl } from "@/lib/grain";
import { getApplications, getProducts } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { SplitWords } from "@/components/ui/SplitWords";
export function generateMetadata() {
  return pageMetadata("/applications", { title: "Applications", description: "Where XSpace products are used." });
}
const TONES = ["birch", "oak", "ember", "walnut", "pine"];
export default function ApplicationsPage() {
  const apps = getApplications();
  const products = getProducts();
  return (
    <>
      <PageIntro
        eyebrow="Applications"
        title="The right grade for every space."
        intro="Uses listed against each XSpace grade, grouped by the kind of project. Pick an area to see which products are made for it."
      />
      <nav aria-label="Application areas" className="frame pb-10">
        <ul className="flex flex-wrap gap-2">
          {apps.map((a) => (
            <li key={a.slug}>
              <a href={`#${a.slug}`} className="chip min-h-[44px] hover:border-ink">
                {a.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pb-20">
        {apps.map((a, i) => {
          const linked = a.productSlugs.map((s) => products.find((p) => p.slug === s)).filter(Boolean);
          return (
            <section
              key={a.slug}
              id={a.slug}
              aria-labelledby={`${a.slug}-t`}
              className={`py-20 md:py-28 ${i % 2 ? "bg-ice" : ""}`}
            >
              <div className="frame grid items-center gap-12 lg:grid-cols-12">
                <div
                  className={`relative aspect-4/3 overflow-hidden lg:col-span-6 ${i % 2 ? "lg:order-2 lg:col-start-7" : ""}`}
                  data-reveal-img
                  data-parallax-img
                >
                  {a.imageUrl ? (
                    <>
                      <Image
                        src={a.imageUrl}
                        alt={a.name}
                        fill
                        sizes="(min-width:1024px) 45vw, 100vw"
                        className="object-cover"
                      />
                      {a.imageIsInspiration && (
                        <span className="placeholder-tag">Inspiration image — not an XSpace project</span>
                      )}
                    </>
                  ) : (
                    <div
                      className="absolute inset-0"
                      data-parallax-bg="120"
                      style={{
                        backgroundImage: grainUrl(TONES[i % TONES.length], i * 13 + 5),
                        backgroundSize: "720px",
                      }}
                      aria-hidden="true"
                    >
                      <span className="placeholder-tag">Material texture — placeholder for project imagery</span>
                      <div className="ply-edge absolute inset-x-0 bottom-0 h-5" style={{ ["--ply"]: "2px" }} />
                    </div>
                  )}
                </div>
                <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : "lg:col-start-8"}`}>
                  <p className="text-[12px] font-semibold tracking-[0.2em] text-walnut" data-reveal>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 id={`${a.slug}-t`} className="mt-3 text-h2" data-split>
                    <SplitWords>{a.name}</SplitWords>
                  </h2>
                  <p className="mt-4 text-[17px] leading-relaxed text-ink/70" data-reveal>
                    {a.summary}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2" data-reveal>
                    {a.uses.map((u) => (
                      <li key={u} className="chip">
                        {u}
                      </li>
                    ))}
                  </ul>
                  {linked.length > 0 && (
                    <div className="mt-10 border-t border-ink/10" data-reveal>
                      <p className="pt-5 text-[12px] uppercase tracking-[0.16em] text-ink/55">Recommended products</p>
                      <ul>
                        {linked.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/products/${p.slug}`}
                              className="group flex min-h-[56px] items-center justify-between border-b border-ink/10 text-[17px] font-medium"
                            >
                              <span>
                                {p.name} {p.grade && <span className="badge ml-2 align-middle">{p.grade}</span>}
                              </span>
                              <ArrowRight className="arrow h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
