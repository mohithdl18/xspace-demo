"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger (reveals,
 * pinned exploded-ply and manufacturing sequences) stays perfectly in sync.
 * Not started at all when the visitor prefers reduced motion — native
 * scrolling is used instead. Touch devices keep native momentum scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      // Same-page anchor links (e.g. "#quote") scroll through Lenis, offset for the fixed header
      anchors: { offset: -92 },
      // Let scrollable panels (mobile menu, compare tray, long selects) scroll natively
      prevent: (node) => !!node.closest?.("[data-lenis-prevent], #mobile-menu"),
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
