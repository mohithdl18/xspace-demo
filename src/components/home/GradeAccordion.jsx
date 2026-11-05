"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Expanding image accordion for the featured grades.
 * The open panel is wide, with the grade icon, name and tagline over the photo;
 * the others collapse to rounded pills showing just the icon. Hovering (or
 * keyboard-focusing) a pill opens it. On touch screens the first tap opens a
 * panel and the second tap goes to the product page.
 *
 * Widths are measured and animated in pixels with GSAP, so the open/close
 * glides smoothly in every browser (CSS width transitions can stall); before
 * JS measures, a flex fallback renders the same layout.
 */

const DURATION = 0.85; // seconds

/** collapsed pill width and gap per breakpoint (matches Tailwind sm / lg) */
function sizes() {
  if (window.matchMedia("(min-width: 1024px)").matches) return { pill: 104, gap: 20 };
  if (window.matchMedia("(min-width: 640px)").matches) return { pill: 84, gap: 16 };
  return { pill: 52, gap: 8 };
}
export function GradeAccordion({ products, className = "" }) {
  const [active, setActive] = useState(0);
  // true while a mouse/touch press is in progress, so focus from a tap
  // doesn't count as keyboard focus
  const pressing = useRef(false);
  const row = useRef(null);
  const [layout, setLayout] = useState(null); // { width, pill, gap } once measured

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => setLayout({ width: el.clientWidth, ...sizes() });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const items = useRef([]);
  const lastWidth = useRef(0); // first sizing (and resizes) snap; hover changes animate

  useEffect(() => {
    if (!layout) return;
    const openWidth = Math.max(layout.pill, layout.width - (products.length - 1) * (layout.pill + layout.gap));
    const instant = lastWidth.current !== layout.width;
    lastWidth.current = layout.width;
    items.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        width: i === active ? openWidth : layout.pill,
        duration: instant ? 0 : DURATION,
        ease: "power3.inOut",
        overwrite: true,
      });
    });
  }, [active, layout, products.length]);


  return (
    <div ref={row} className={`flex w-full gap-2 sm:gap-4 lg:gap-5 ${className}`}>
      {products.map((p, i) => {
        const open = i === active;
        return (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            aria-label={`${p.name} — ${p.gradeLabel || p.category.name}`}
            aria-expanded={open}
            // while closed, the first tap only opens the panel — keep the page transition out of it
            data-no-transition={open ? undefined : ""}
            // hover opens only for a real mouse; touch uses tap-to-open (below)
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            onPointerDown={() => {
              pressing.current = true;
            }}
            onFocus={() => {
              // keyboard (Tab) focus opens the panel; a tap is handled by onClick
              if (!pressing.current) setActive(i);
            }}
            onClick={(e) => {
              pressing.current = false;
              // touch: first tap opens the panel, second tap follows the link
              if (!open) {
                e.preventDefault();
                setActive(i);
              }
            }}
            ref={(el) => (items.current[i] = el)}
            style={layout ? { flex: "0 0 auto" } : undefined}
            className={`group relative block h-full min-w-0 overflow-hidden rounded-[22px] bg-ink shadow-[0_18px_40px_-18px_rgba(17,17,17,0.45)] lg:rounded-[28px] ${
              layout ? "" : open ? "grow basis-0" : "shrink-0 basis-[52px] sm:basis-[84px] lg:basis-[104px]"
            }`}
          >
            {p.imageUrl ? (
              <Image
                src={p.imageUrl}
                alt={p.imageAlt}
                fill
                sizes="(min-width:1024px) 70vw, 90vw"
                className={`object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.65,0,0.35,1)] ${open ? "scale-100" : "scale-110"}`}
              />
            ) : null}

            {/* readability: darker at the bottom, stronger on the open panel */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0)_40%,rgba(17,17,17,0.72)_100%)] transition-opacity duration-700 ${
                open ? "opacity-100" : "opacity-40"
              }`}
            />
            {/* collapsed pills get a soft wash, like the reference */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 bg-white transition-opacity duration-700 ${open ? "opacity-0" : "opacity-25"}`}
            />

            {/* icon + text */}
            <span
              className={`absolute bottom-3 flex items-center gap-3 sm:bottom-4 sm:gap-4 lg:bottom-6 ${
                open ? "left-3 right-3 sm:left-4 sm:right-4 lg:left-6 lg:right-6" : "left-1/2 -translate-x-1/2"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[11px] sm:h-11 sm:w-11 font-semibold tracking-[0.08em] text-walnut shadow-sm lg:h-12 lg:w-12">
                {p.grade || p.name.slice(0, 2).toUpperCase()}
              </span>
              <span
                className={`min-w-0 text-white transition-[opacity,transform] ease-out ${
                  open
                    ? "translate-y-0 opacity-100 duration-500 delay-[380ms]"
                    : "pointer-events-none absolute translate-y-3 opacity-0 duration-200 delay-0"
                }`}
              >
                <span className="line-clamp-2 block text-[16px] font-semibold leading-tight sm:truncate sm:text-[17px] lg:text-xl">{p.name}</span>
                <span className="mt-0.5 line-clamp-2 block text-[13px] text-white/85 sm:truncate lg:text-[15px]">
                  {p.tagline || p.gradeLabel}
                </span>
                {p.thicknesses?.length > 0 && (
                  <span className="mt-1 hidden truncate text-[12px] text-white/65 sm:block">
                    {p.thicknesses.join(" · ")}
                  </span>
                )}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
