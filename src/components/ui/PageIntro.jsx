import { grainUrl } from "@/lib/grain";
import { SplitWords } from "@/components/ui/SplitWords";
export function PageIntro({ eyebrow, title, intro, children, tone = "birch", panel = true }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-20 md:pt-44">
      {panel && (
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 hidden h-full w-[22%] opacity-90 lg:block"
          data-reveal-img="down"
          data-parallax-bg="160"
          style={{ backgroundImage: grainUrl(tone, 21), backgroundSize: "640px" }}
        >
          <div className="ply-edge-v absolute inset-y-0 left-0 w-3" style={{ ["--ply"]: "1.5px" }} />
        </div>
      )}
      <div className="frame relative">
        <div className="max-w-4xl lg:max-w-[70%]">
          <p className="eyebrow" data-reveal>
            {eyebrow}
          </p>
          <h1 className="mt-6 text-h1" data-split>
            <SplitWords>{title}</SplitWords>
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink/70 md:text-lg md:leading-[1.75rem]" data-reveal>
              {intro}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
