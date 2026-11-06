import { SplitWords } from "@/components/ui/SplitWords";
export function SectionHead({ id, eyebrow, title, intro, action }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="eyebrow" data-reveal>
          {eyebrow}
        </p>
        <h2 id={id} className="mt-5 text-h2" data-split>
          <SplitWords>{title}</SplitWords>
        </h2>
        {intro && (
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-cream/70" data-reveal>
            {intro}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0" data-reveal>
          {action}
        </div>
      )}
    </div>
  );
}
