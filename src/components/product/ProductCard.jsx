import Link from "next/link";
import Image from "next/image";
import { grainUrl } from "@/lib/grain";
import { CompareButton } from "./CompareButton";
/** Catalogue card: a material swatch whose plies fan out on hover. */
/** `mediaClassName` sizes the image area (default 4:3). */
export function ProductCard({ p, priority = false, mediaClassName = "aspect-4/3" }) {
  return (
    <article className="group relative flex h-full flex-col">
      <div className={`relative overflow-hidden bg-ice ${mediaClassName}`} data-reveal-img>
        {p.imageUrl ? (
          <Image
            src={p.imageUrl}
            alt={p.imageAlt}
            fill
            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
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
        <div className="absolute right-3 top-3 z-10 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
          <CompareButton slug={p.slug} name={p.name} />
        </div>
      </div>
      <div className="flex flex-1 flex-col border-b border-ink/10 pb-6 pt-5">
        <div className="flex items-center gap-2">
          {p.grade && <span className="badge">{p.grade}</span>}
          <span className="text-[12px] uppercase tracking-[0.16em] text-ink/55">{p.gradeLabel || p.category.name}</span>
        </div>
        <h3 className="mt-3 text-h3">
          <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
            <span className="link-u">{p.name}</span>
          </Link>
        </h3>
        {p.tagline && <p className="mt-2 text-[14px] leading-relaxed text-ink/65">{p.tagline}</p>}
        {p.thicknesses.length > 0 && (
          <p className="mt-auto pt-4 text-[12px] text-ink/55">{p.thicknesses.join(" · ")}</p>
        )}
      </div>
    </article>
  );
}
