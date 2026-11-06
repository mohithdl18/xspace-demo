import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ProcessSequence } from "@/components/pages/ProcessSequence";
import { ArrowRight } from "@/components/ui/Icon";
import { getProcessSteps } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { SplitWords } from "@/components/ui/SplitWords";
export function generateMetadata() {
  return pageMetadata("/manufacturing", {
    title: "Manufacturing & Quality",
    description: "How XSpace plywood is made.",
  });
}
export default function ManufacturingPage() {
  const steps = getProcessSteps();
  return (
    <>
      <PageIntro
        eyebrow="Manufacturing & quality"
        title="Built layer by layer, checked at every stage."
        intro="Each stage below reflects technologies XSpace lists for its grades — from how timber is sourced to how a fire-retardant board is treated."
        tone="oak"
      />
      <section className="frame pb-24">
        <ProcessSequence steps={steps} />
      </section>
      <section className="section bg-panel">
        <div className="frame grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="eyebrow" data-reveal>
              Quality approach
            </p>
            <h2 className="mt-5 text-h2" data-split>
              <SplitWords>Clear grades, so the right board goes to the right job.</SplitWords>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-[17px] leading-relaxed text-cream/70" data-reveal>
              Moisture resistant, boiling water proof, calibrated and fire retardant plywood are each made for different
              conditions. Specify by grade and thickness, and our team will confirm the technical details for your
              application.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal>
              <Link href="/products?category=plywood" className="btn btn-primary">
                Compare grades <ArrowRight />
              </Link>
              <Link href="/resources" className="btn btn-outline">
                Documents
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
