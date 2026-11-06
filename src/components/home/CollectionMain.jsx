import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/SectionHead";
import { GradeAccordion } from "@/components/home/GradeAccordion";
import { StickyDim } from "@/components/motion/StickyDim";

/**
 * Home — featured collection. Sticky: stays in place while the manufacturing
 * section slides up over it. Fills exactly one screen (full width, 100svh
 * height) on an ice-blue background, with rounded top corners so it reads as
 * a sheet sliding up over the (sticky) About section.
 * The grades are an expanding image accordion — hover a panel to open it.
 */
export function CollectionMain({ featured }) {
  return (
    <section
      aria-labelledby="collection-title"
      className="sticky top-0 z-0 flex min-h-svh w-full flex-col justify-center rounded-t-[28px] bg-panel py-12 shadow-[0_-28px_60px_-18px_rgba(17,17,17,0.35)] md:rounded-t-[44px] md:py-14 [@media(max-height:780px)]:py-8"
    >
      <div className="frame">
        <SectionHead
          id="collection-title"
          eyebrow="The collection"
          title="Three plywood grades. One standard of care."
          action={
            <Link href="/products" className="btn btn-outline">
              All products <ArrowRight />
            </Link>
          }
        />

        <div className="mt-8 lg:mt-10 [@media(max-height:780px)]:lg:mt-6" data-reveal>
          <GradeAccordion products={featured} className="h-[min(62svh,660px)] [@media(max-height:780px)]:h-[58svh]" />
        </div>

      </div>
      {/* darkens slightly as the manufacturing section slides up over this one */}
      <StickyDim max={0.18} cover="#process" />
    </section>
  );
}
