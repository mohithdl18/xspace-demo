import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { PlyStack } from "@/components/product/Ply";
import { ArrowRight } from "@/components/ui/Icon";
import { grainUrl } from "@/lib/grain";
import { getCompany, getHome } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { SplitWords } from "@/components/ui/SplitWords";
export function generateMetadata() {
  return pageMetadata("/about", {
    title: "About XSpace Plywood",
    description: "Heritage since 1959, powered by C Nanjappa Timbers.",
  });
}
const VALUES = [
  {
    title: "Responsible sourcing",
    body: "Timber from agroforestry plantations with strict traceability, alongside carefully selected raw materials.",
  },
  { title: "Precision", body: "Calibrated veneers and cores — down to ±0.2mm on MR Value – Accurate 16mm." },
  { title: "Protection", body: "Termite, borer, moisture and fire protection matched to the grade that needs it." },
  { title: "Trust", body: "A heritage that began in 1959, and a team you can call directly." },
];
export default function AboutPage() {
  const c = getCompany();
  const home = getHome();
  return (
    <>
      <PageIntro
        eyebrow="About"
        title={`Powered by ${c.poweredBy}. Trusted since ${c.foundedYear}.`}
        intro={home.introBody}
        tone="walnut"
      />

      <section className="section rule">
        <div className="frame grid items-center gap-16 lg:grid-cols-12">
          <div
            className="relative flex h-[320px] min-w-0 items-center justify-center overflow-hidden bg-ice sm:h-[460px] lg:col-span-6"
            data-reveal-img
            aria-hidden="true"
          >
            <span className="placeholder-tag">Illustrative render</span>
            <div className="shrink-0 scale-[0.6] sm:scale-90" data-reveal-scale>
              <PlyStack tone="walnut" count={5} size={320} thickness={18} />
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow" data-reveal>
              Our story
            </p>
            <h2 className="mt-5 text-h2" data-split>
              <SplitWords>A timber heritage, engineered for modern interiors.</SplitWords>
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-ink/70" data-reveal>
              XSpace Plywood is a name in premium commercial plywood and blockboard, powered by {c.poweredBy}. The brand
              carries a heritage that dates to {c.foundedYear} and operates from {c.addressLines[0]}, {c.city}.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-ink/70" data-reveal>
              We source quality raw materials and work with advanced manufacturing technology, aiming for consistency,
              precision and reliability in every sheet.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-ice" aria-labelledby="timeline-title">
        <div className="frame">
          <p className="eyebrow" data-reveal>
            Timeline
          </p>
          <h2 id="timeline-title" className="mt-5 text-h2" data-split>
            <SplitWords>Six decades, one direction.</SplitWords>
          </h2>
          <ol className="mt-14 grid gap-px bg-ink/10 md:grid-cols-2" data-reveal-stagger>
            <li className="bg-ice p-8 md:p-12">
              <p className="text-h1 font-medium text-walnut">{c.foundedYear}</p>
              <p className="mt-4 text-[17px] font-medium">The heritage begins</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
                The {c.poweredBy} story starts — the foundation XSpace is built on.
              </p>
            </li>
            <li className="bg-ice p-8 md:p-12">
              <p className="text-h1 font-medium text-walnut">Today</p>
              <p className="mt-4 text-[17px] font-medium">XSpace Plywood</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
                Plywood, blockboard, doors, MDF, laminates, PVC foam boards, particle boards and timber from {c.city},
                Karnataka.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="values-title">
        <div className="frame">
          <p className="eyebrow" data-reveal>
            What we stand for
          </p>
          <h2 id="values-title" className="mt-5 max-w-2xl text-h2" data-split>
            <SplitWords>Quality you can specify, not just hear about.</SplitWords>
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
            {VALUES.map((v, i) => (
              <article key={v.title} className="border-t border-ink pt-6">
                <div
                  className="mb-6 h-16 w-16"
                  style={{
                    backgroundImage: grainUrl(["birch", "oak", "walnut", "ember"][i], i + 4),
                    backgroundSize: "cover",
                  }}
                  aria-hidden="true"
                />
                <h3 className="text-[19px] font-medium">{v.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{v.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap gap-3" data-reveal>
            <Link href="/products" className="btn btn-primary">
              Explore our plywood <ArrowRight />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Visit or contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
