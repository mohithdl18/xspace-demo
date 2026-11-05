"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 *
 *  • wheelMultiplier 0.5 — every wheel notch travels half as far
 *    (two scrolls = one ordinary scroll), so the page feels slower and heavier
 *  • lerp 0.06 — each scroll glides out softly instead of stopping dead
 *
 * Always on (the reduce-motion setting is not applied). Touch devices keep
 * their native momentum scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.06,
      wheelMultiplier: 0.5,
      smoothWheel: true,
      respectReducedMotion: false,
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
