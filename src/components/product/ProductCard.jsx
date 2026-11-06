import Link from "next/link";
import Image from "next/image";
import { grainUrl } from "@/lib/grain";
/**
 * Catalogue card with rounded corners. `mediaClassName` sizes the image area (default 4:3).
 *
 * Mouse devices: on hover (or keyboard focus) a walnut panel rises over the photo
 * listing the available thicknesses; they aren't repeated under the card.
 * (Mouse-only classes use the [@media(hover:hover)_and_(pointer:fine)] variant.)
 * Touch devices: no hover panel — the thicknesses show under the card, highlighted.
 */
export function ProductCard({ p, priority = false, mediaClassName = "aspect-4/3" }) {
  const sizes = p.thicknesses || [];
  return (
    <article className="group relative flex h-full flex-col">
      <div
        className={`relative overflow-hidden rounded-[24px] bg-panel [transform:translateZ(0)] ${mediaClassName}`}
        data-reveal-img
      >
        {p.imageUrl ? (
          <Image
            src={p.imageUrl}
            alt={p.imageAlt}
            fill
            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]"
          />
        ) : (
          <>
            <div className="absolute inset-x-[14%] bottom-[16%] top-[22%]" aria-hidden="true">
              {[2, 1, 0].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-transform duration-700 ease-out"
                  style={{ transform: `translate(${i * 10}px, ${i * 10}px)`, zIndex: 3 - i }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:transform-(--fan)"
                    style={{ ["--fan"]: `translate(${i * 16}px, ${i * -14}px) rotate(${i * -2.2}deg)` }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ backgroundImage: grainUrl(p.tone, i * 4 + 3), backgroundSize: "cover" }}
                    />
                    <div
                      className="ply-edge absolute inset-x-0 bottom-0 h-[10px] translate-y-full"
                      style={{ ["--ply"]: "1.4px" }}
                    />
                    <div
                      className="ply-edge-v absolute inset-y-0 right-0 w-[10px] translate-x-full brightness-90"
                      style={{ ["--ply"]: "1.4px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* hover (mouse devices): thickness panel rises over the photo */}
        {sizes.length > 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[5] hidden translate-y-full flex-col justify-end bg-walnut p-6 text-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 md:p-8 [@media(hover:hover)_and_(pointer:fine)]:flex"
          >
            <div
              className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
              style={{ backgroundImage: grainUrl(p.tone || "walnut", 11), backgroundSize: "640px" }}
            />
            <div className="relative translate-y-6 opacity-0 transition-[translate,opacity] delay-0 duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-200 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:delay-200">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sand">Available thickness</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {sizes.map((t) => (
                  <li
                    key={t}
                    className="inline-flex min-h-[38px] items-center rounded-full border border-white/25 bg-white/10 px-4 text-[15px] font-medium md:text-[16px]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 inline-flex items-center gap-2 text-[13px] text-white/75">
                View product <span aria-hidden="true">→</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col border-b border-cream/10 pb-6 pt-5">
        <div className="flex items-center gap-2">
          {p.grade && <span className="badge">{p.grade}</span>}
          <span className="text-[12px] uppercase tracking-[0.16em] text-cream/55">{p.gradeLabel || p.category.name}</span>
        </div>
        <h3 className="mt-3 text-h3">
          <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
            <span className="link-u">{p.name}</span>
          </Link>
        </h3>
        {p.tagline && <p className="mt-2 text-[14px] leading-relaxed text-cream/65">{p.tagline}</p>}
        {/* touch devices: thicknesses under the card, highlighted (mouse devices see them on hover) */}
        {sizes.length > 0 && (
          <div className="mt-auto pt-5 [@media(hover:hover)_and_(pointer:fine)]:hidden">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-sand">Available thickness</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {sizes.map((t) => (
                <li
                  key={t}
                  className="inline-flex min-h-[30px] items-center rounded-full border border-sand/40 bg-walnut/40 px-3 text-[12px] font-medium text-cream"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}