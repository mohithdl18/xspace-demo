"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { SectionHead } from "@/components/ui/SectionHead";
import { grainUrl } from "@/lib/grain";
import { StickyDim } from "@/components/motion/StickyDim";

/** Placeholder textures until real photos are set in src/data/applications.json (imageUrl) */
const TONES = ["birch", "oak", "walnut", "ember", "pine"];

const EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";

/**
 * Home — applications / spaces. Fills one screen (full width, 100svh) and
 * stays fixed while "Work with us" slides up over it.
 * Five rounded cards in one row. Each starts with an image on the top 60%
 * and its heading in the bottom 40%. On hover (or tap on touch screens, or
 * keyboard focus) the image collapses away, the heading rises to the top and
 * the description appears under it, followed by the best-fit plywood and uses.
 *
 * Best-fit plywood comes from each application's "productSlugs" in
 * src/data/applications.json. An entry can be a product slug (shown as a link
 * to that product, e.g. "mr-eco-gold-grade") or any label (shown as a tag,
 * e.g. "MR - 18mm").
 * On phones/tablets the row scrolls sideways.
 */
/** Card photos by application slug (an `imageUrl` in applications.json overrides these) */
const IMAGES = {
  interiors: "/images/applications/interiors.jpg",
  "furniture-kitchens": "/images/applications/furniture-kitchens.jpg",
  "commercial-public": "/images/applications/commercial-public.jpg",
  "industrial-transport": "/images/applications/industrial-transport.jpg",
  specialist: "/images/applications/specialist.jpg",
};

export function SpacesMain({ apps, products }) {
  const [active, setActive] = useState(-1);
  const pressing = useRef(false);
  const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));

  return (
    <section
      aria-labelledby="apps-title"
      className="sticky top-0 z-0 flex min-h-svh w-full flex-col justify-center bg-white py-14 md:py-16 [@media(max-height:780px)]:py-8"
    >
      <div className="frame">
        <SectionHead id="apps-title" eyebrow="Applications" title="Where each grade does its best work." />

        <ul
          className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:mt-10 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 xl:gap-5 [@media(max-height:780px)]:lg:mt-6 [&::-webkit-scrollbar]:hidden"
          data-reveal-stagger
        >
          {apps.map((a, i) => {
            const open = active === i;
            // product slug → link to the product; anything else (e.g. "MR - 18mm") → plain tag
            const best = a.productSlugs.filter(Boolean).map((s) => bySlug[s] ?? { label: s });
            return (
              <li key={a.slug} className="w-[74%] shrink-0 snap-start sm:w-[42%] md:w-[34%] lg:w-auto">
                <article
                  tabIndex={0}
                  aria-labelledby={`space-${a.slug}`}
                  data-open={open ? "true" : "false"}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && setActive((v) => (v === i ? -1 : v))}
                  onPointerDown={() => {
                    pressing.current = true;
                  }}
                  onFocus={() => {
                    if (!pressing.current) setActive(i);
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setActive((v) => (v === i ? -1 : v));
                  }}
                  onClick={(e) => {
                    pressing.current = false;
                    // touch: tap toggles the card (links inside still work once it's open)
                    if (e.target.closest("a")) return;
                    setActive((v) => (v === i ? -1 : i));
                  }}
                  className={`relative flex h-[min(56svh,520px)] cursor-pointer flex-col overflow-hidden rounded-[24px] outline-offset-4 transition-[background-color,color,box-shadow] duration-500 [@media(max-height:780px)]:h-[54svh] ${
                    open
                      ? "bg-walnut text-white shadow-[0_24px_50px_-24px_rgba(105,69,48,0.7)]"
                      : "bg-ice text-ink shadow-[0_10px_30px_-22px_rgba(17,17,17,0.35)]"
                  }`}
                >
                  {/* image: 60% → 0 */}
                  <div
                    aria-hidden="true"
                    className={`relative shrink-0 overflow-hidden transition-[height] duration-700 ${EASE}`}
                    style={{ height: open ? "0%" : "60%" }}
                  >
                    <div
                      className={`absolute inset-0 transition-transform duration-700 ${EASE} ${open ? "scale-110" : "scale-100"}`}
                    >
                      {a.imageUrl || IMAGES[a.slug] ? (
                        <Image
                          src={a.imageUrl || IMAGES[a.slug]}
                          alt=""
                          fill
                          sizes="(min-width:1024px) 20vw, 70vw"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ backgroundImage: grainUrl(TONES[i % TONES.length], i * 13 + 5), backgroundSize: "520px" }}
                        >
                          <div className="ply-edge absolute inset-x-0 bottom-0 h-3" style={{ ["--ply"]: "1.5px" }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* heading (rises to the top when the image collapses), then the description,
                      uses and best-fit plywood directly beneath it */}
                  <div className="flex min-h-0 flex-1 flex-col p-5 xl:p-6">
                    <p
                      className={`text-[12px] font-semibold tracking-[0.2em] transition-colors duration-500 ${
                        open ? "text-sky" : "text-walnut"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 id={`space-${a.slug}`} className="mt-2 text-[20px] font-medium leading-tight xl:text-[22px]">
                      {a.name}
                    </h3>

                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-700 ${EASE} ${
                        open ? "grid-rows-[1fr] opacity-100 delay-150" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="pt-3 text-[14px] leading-relaxed text-white/85 xl:text-[15px]">{a.summary}</p>
                        {best.length > 0 && (
                          <div className="mt-4">
                            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">Best fit plywood</p>
                            <ul className="mt-2.5 flex flex-wrap gap-2">
                              {best.map((p) => (
                                <li key={p.slug ?? p.label}>
                                  {p.slug ? (
                                    <Link
                                      href={`/products/${p.slug}`}
                                      tabIndex={open ? 0 : -1}
                                      className="inline-flex min-h-[34px] items-center gap-2 rounded-full bg-white/12 px-3 text-[12px] font-medium text-white transition-colors hover:bg-white hover:text-walnut"
                                    >
                                      {p.grade && <span className="font-semibold">{p.grade}</span>}
                                      <span>{p.name}</span>
                                    </Link>
                                  ) : (
                                    <span className="inline-flex min-h-[34px] items-center rounded-full bg-white/12 px-3 text-[12px] font-semibold text-white">
                                      {p.label}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {a.uses.length > 0 && (
                          <p className="mt-4 border-t border-white/20 pt-4 text-[12px] leading-relaxed text-white/60">
                            {a.uses.join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
      {/* darkens slightly as "Work with us" slides up over this section */}
      <StickyDim max={0.18} cover="#work-with-us" />
    </section>
  );
}
