import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icon";
import { SplitWords } from "@/components/ui/SplitWords";
import { YearOdometer } from "@/components/home/YearOdometer";
import { grainUrl } from "@/lib/grain";
import { StickyDim } from "@/components/motion/StickyDim";

/**
 * Home — heritage / about section. Sticky: stays in place while the
 * collection slides up over it. Fills exactly one screen (full width,
 * 100svh height) with its content centred; it only grows taller if the
 * content can't fit (e.g. small phones), so nothing is ever cut off.
 */
export function AboutMain({ company, home, years, categoryCount }) {
  return (
    <section
      id="intro"
      className="sticky top-0 z-0 flex min-h-svh w-full items-center overflow-hidden rounded-t-[28px] bg-white py-20 md:rounded-t-[44px] md:py-24"
    >
      <div className="frame grid w-full gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>
            Our heritage
          </p>
          <p
            data-reveal
            className="mt-6 select-none text-[clamp(6rem,16vw,15rem)] font-semibold leading-[0.82] tracking-[-0.06em] text-transparent"
            aria-label={`Since ${company.foundedYear}`}
          >
            {/* walnut grain is painted on the rolling digits themselves */}
            <YearOdometer
              from={new Date().getFullYear()}
              to={company.foundedYear}
              grain={grainUrl("walnut", 11)}
              grainSize="600px"
              parallax="140"
              duration={4.5}
            />
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-16">
          <h2 className="text-h2" data-split>
            <SplitWords>{home.introHeading}</SplitWords>
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-ink/70" data-reveal>
            {home.introBody}
          </p>
          <dl className="mt-12 grid grid-cols-3 gap-8 border-t border-ink/10 pt-8" data-reveal-stagger>
            <div>
              <dt className="text-[13px] text-ink/55">Years of heritage</dt>
              <dd className="mt-2 text-h2 font-medium">{years}+</dd>
            </div>
            <div>
              <dt className="text-[13px] text-ink/55">Happy customers</dt>
              <dd className="mt-2 text-h2 font-medium">10K+</dd>
            </div>
            <div>
              <dt className="text-[13px] text-ink/55">Product categories</dt>
              <dd className="mt-2 text-h2 font-medium">3</dd>
            </div>
          </dl>
          <Link href="/about" className="link-u mt-10 inline-flex items-center gap-2 text-sm font-medium" data-reveal>
            Our story <ArrowRight />
          </Link>
        </div>
      </div>
      {/* darkens slightly as the collection slides up over this section */}
      <StickyDim max={0.16} />
    </section>
  );
}
