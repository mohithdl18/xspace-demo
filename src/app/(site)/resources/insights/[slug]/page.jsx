import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getInsight, getInsights } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";
export function generateStaticParams() {
  return getInsights().map((i) => ({ slug: i.slug }));
}
export async function generateMetadata({ params }) {
  const i = getInsight((await params).slug);
  if (!i) return { title: "Not found" };
  return {
    title: i.title,
    description: i.excerpt,
    alternates: { canonical: `${SITE_URL}/resources/insights/${i.slug}` },
  };
}
export default async function InsightPage({ params }) {
  const i = getInsight((await params).slug);
  if (!i) notFound();
  return (
    <article className="frame max-w-3xl pb-28 pt-36 md:pt-44">
      <Link href="/resources" className="link-u text-[13px] text-cream/60">
        ← Resources
      </Link>
      <h1 className="mt-8 text-h1">{i.title}</h1>
      {i.publishedAt && (
        <p className="mt-4 text-[13px] text-cream/55">
          {new Date(i.publishedAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
        </p>
      )}
      {i.coverUrl && (
        <div className="relative mt-10 aspect-video overflow-hidden">
          <Image src={i.coverUrl} alt="" fill sizes="768px" className="object-cover" priority />
        </div>
      )}
      <div className="mt-10 space-y-5 text-[17px] leading-[1.8] text-cream/80">
        {i.body.split(/\n{2,}/).map((para, k) =>
          para.startsWith("## ") ? (
            <h2 key={k} className="pt-4 text-h3 text-cream">
              {para.slice(3)}
            </h2>
          ) : (
            <p key={k}>{para}</p>
          ),
        )}
      </div>
    </article>
  );
}
