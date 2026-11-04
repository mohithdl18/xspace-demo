"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drop inside a sticky section: darkens it slightly as the next section
 * slides up over it, which sells the depth of the "cover" effect.
 *
 * By default the dim follows this section scrolling past. Pass `cover` (a CSS
 * selector for the section that slides over) to dim only while that section
 * is actually rising into view — useful when there's a scroll hold in between.
 */
export function StickyDim({ max = 0.18, color = "#111111", cover }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section) return;
    const coverEl = cover ? document.querySelector(cover) : null;
    const scrollTrigger = coverEl
      ? { trigger: coverEl, start: "top bottom", end: "top top", scrub: true }
      : { trigger: section, start: "top top", end: "bottom top", scrub: true };
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(el, { opacity: 0 }, { opacity: max, ease: "none", scrollTrigger });
    });
    return () => mm.revert();
  }, [max, cover]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 opacity-0"
      style={{ backgroundColor: color }}
    />
  );
}
