import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { ArrowRight, Download, Plus } from "@/components/ui/Icon";
import { getDocuments, getFaqs, getInsights } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { SplitWords } from "@/components/ui/SplitWords";
export function generateMetadata() {
  return pageMetadata("/resources", { title: "Resources", description: "Brochures, technical documents and FAQs." });
}
const KIND = { brochure: "Brochure", technical: "Technical document", certificate: "Certificate" };
export default function ResourcesPage() {
  const docs = getDocuments();
  const faqs = getFaqs();
  const insights = getInsights();
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
      <PageIntro
        eyebrow="Resources"
        title="Everything you need to specify."
        intro="Brochures and technical documents, answers to common questions, and insights from the XSpace team."
      />

      <section aria-labelledby="docs-title" className="frame pb-24">
        <h2 id="docs-title" className="text-h2" data-split>
          <SplitWords>Downloads</SplitWords>
        </h2>
        <ul className="mt-10 border-t border-cream/10">
          {docs.map((d) => (
            <li key={d.id} className="grid items-center gap-4 border-b border-cream/10 py-6 md:grid-cols-12" data-reveal>
              <span className="text-[12px] uppercase tracking-[0.16em] text-sand md:col-span-2">
                {KIND[d.kind] ?? d.kind}
              </span>
              <div className="md:col-span-7">
                <p className="text-[18px] font-medium">{d.title}</p>
                {d.description && <p className="mt-1 text-[14px] text-cream/65">{d.description}</p>}
              </div>
              <div className="md:col-span-3 md:text-right">
                {d.fileUrl ? (
                  <a href={d.fileUrl} download className="btn btn-outline min-h-[44px]!">
                    <Download /> Download{d.fileSize && ` · ${d.fileSize}`}
                  </a>
                ) : (
                  <Link
                    href="/#contact"
                    className="btn btn-outline min-h-[44px]!"
                  >
                    Request a copy
                  </Link>
                )}
              </div>
            </li>
          ))}
          {docs.length === 0 && <li className="py-8 text-cream/60">Documents will appear here soon.</li>}
        </ul>
      </section>

      <section aria-labelledby="faq-title" className="section bg-panel">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow" data-reveal>
              FAQs
            </p>
            <h2 id="faq-title" className="mt-5 text-h2" data-split>
              <SplitWords>Common questions.</SplitWords>
            </h2>
            <p className="mt-5 text-[16px] text-cream/70" data-reveal>
              Can’t find your answer?{" "}
              <Link href="/#contact" className="link-u font-medium text-cream">
                Ask us directly.
              </Link>
            </p>
          </div>
          <div className="lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.id} className="group border-b border-cream/15 first:border-t" data-reveal>
                <summary className="flex min-h-[72px] cursor-pointer list-none items-center justify-between gap-6 py-5 text-[18px] font-medium [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <Plus className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-cream/70">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="ins-title" className="section">
        <div className="frame">
          <h2 id="ins-title" className="text-h2" data-split>
            <SplitWords>Insights</SplitWords>
          </h2>
          {insights.length ? (
            <ul className="mt-10 grid gap-8 md:grid-cols-3">
              {insights.map((i) => (
                <li key={i.id} className="border-t border-cream pt-6" data-reveal>
                  <p className="text-[12px] text-cream/55">
                    {i.publishedAt ? new Date(i.publishedAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : ""}
                  </p>
                  <h3 className="mt-3 text-h3">
                    <Link href={`/resources/insights/${i.slug}`} className="link-u">
                      {i.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-cream/70">{i.excerpt}</p>
                  <Link
                    href={`/resources/insights/${i.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
                    aria-label={`Read ${i.title}`}
                  >
                    Read <ArrowRight />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-xl text-[16px] text-cream/65" data-reveal>
              Articles from the XSpace team are on the way.
            </p>
          )}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
