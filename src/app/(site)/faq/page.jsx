import Link from "next/link";
import { SplitWords } from "@/components/ui/SplitWords";
import { Plus } from "@/components/ui/Icon";
import { getFaqs } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata() {
  return pageMetadata("/faq", {
    title: "FAQ | XSpace Plywood",
    description: "Answers to common questions about XSpace plywood grades, thicknesses, applications and enquiries.",
  });
}

export default function FaqPage() {
  const faqs = getFaqs();
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <section aria-label="Frequently asked questions" className="pb-24 pt-36 md:pb-32 md:pt-44">
        <div className="frame grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* left: heading (stays in view while the questions scroll) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow" data-reveal>
                FAQ
              </p>
              <h1 className="mt-6 text-h1" data-split>
                <SplitWords>Common questions.</SplitWords>
              </h1>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink/70 md:text-lg md:leading-[1.75rem]" data-reveal>
                Grades, thicknesses, applications and how to order — quick answers from the XSpace team.
              </p>
              <p className="mt-8 text-[16px] leading-relaxed text-ink/70" data-reveal>
                Can’t find your answer?{" "}
                <Link href="/#contact" className="link-u font-medium text-ink">
                  Ask us directly.
                </Link>
              </p>
            </div>
          </div>

          {/* right: questions */}
          <div className="lg:col-span-7">
            {faqs.map((f) => (
              <details key={f.id} className="group border-b border-ink/15 first:border-t" data-reveal>
                <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-6 py-5 text-[18px] font-medium [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <Plus className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-ink/70">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
