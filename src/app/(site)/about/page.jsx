import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import Image from "next/image";
import { ArrowRight, Caliper, Handshake, Leaf, Shield } from "@/components/ui/Icon";
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
    Icon: Leaf,
    body: "Timber from agroforestry plantations with strict traceability, alongside carefully selected raw materials.",
  },
  { title: "Precision", Icon: Caliper, body: "Calibrated veneers and cores — down to ±0.2mm on MR Value – Accurate 16mm." },
  { title: "Protection", Icon: Shield, body: "Termite, borer, moisture and fire protection matched to the grade that needs it." },
  { title: "Trust", Icon: Handshake, body: "A heritage that began in 1959, and a team you can call directly." },
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
        panel={false}
      />

      <section className="section rule">
        <div className="frame grid items-center gap-16 lg:grid-cols-12">
          <div
            className="relative h-[320px] min-w-0 overflow-hidden rounded-[24px] bg-ice sm:h-[460px] lg:col-span-6"
            data-reveal-img
          >
            <Image
              src="/images/about/about-story.jpg"
              alt="Cross-section of a timber log showing its growth rings"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
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
          <ol className="mt-14 grid divide-y divide-ink/10 border-y border-ink/10 md:grid-cols-2 md:divide-x md:divide-y-0" data-reveal-stagger>
            <li className="bg-ice p-8 md:p-12">
              <p className="text-h1 font-medium text-walnut">{c.foundedYear}</p>
              <p className="mt-4 text-[17px] font-medium">The heritage begins</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
                Built on the legacy of C Nanjappa Timbers, XSpace found its true foundation.
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
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger>
            {VALUES.map((v) => (
              // outer wrapper slides in on scroll; the card inside handles its own hover lift,
              // so the two movements never fight and every card lands exactly on the grid
              <div key={v.title} className="flex min-w-0">
                <article className="group flex w-full flex-col rounded-[24px] border border-ink/10 bg-ice p-7 transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(17,17,17,0.35)] md:p-8">
                  <span className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-walnut text-white transition-[scale] duration-500 ease-out group-hover:scale-105">
                    <v.Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-[19px] font-medium">{v.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{v.body}</p>
                </article>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap gap-3" data-reveal>
            <Link href="/products" className="btn btn-primary">
              Explore our plywood <ArrowRight />
            </Link>
            <Link href="/#contact" className="btn btn-outline">
              Visit or contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}