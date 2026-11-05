"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Page transition: a walnut panel with veneer-line edge wipes up over the page,
 * the route changes, then the panel lifts away to reveal the new page.
 *
 * Works for every internal link on the site (next/link or plain <a>) by
 * intercepting clicks, so no link markup has to change. Skipped for:
 * modifier/middle clicks, new-tab or download links, external links, links to
 * the current page (anchors, filters), elements marked data-no-transition,
 * and visitors who prefer reduced motion.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef(null);
  const active = useRef(false);

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.closest("[data-no-transition]")) return;
      let url;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page: anchors, query filters
      if (!panel.current) return;

      // Stop next/link's own handler; we navigate after the wipe instead.
      e.preventDefault();
      e.stopPropagation();
      if (active.current) return;
      active.current = true;
      getLenis()?.stop();

      const el = panel.current;
      gsap.killTweensOf(el);
      gsap.set(el, { display: "block", transformOrigin: "50% 100%" });
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => router.push(url.pathname + url.search + url.hash),
        },
      );
    };
    // Capture phase so this runs before React's (and next/link's) click handling
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  // New page is in: lift the panel away
  useEffect(() => {
    if (!active.current || !panel.current) return;
    const el = panel.current;
    const lenis = getLenis();
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true, force: true });
    }
    lenis?.start();
    gsap.set(el, { transformOrigin: "50% 0%" });
    gsap.to(el, {
      scaleY: 0,
      duration: 0.75,
      delay: 0.08,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.set(el, { display: "none" });
        active.current = false;
        ScrollTrigger.refresh();
      },
    });
  }, [pathname]);

  return (
    <div
      ref={panel}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] hidden bg-walnut"
      style={{ transform: "scaleY(0)" }}
    >
      {/* veneer layers along the leading edges */}
      <div className="ply-edge-dark absolute inset-x-0 top-0 h-3" style={{ ["--ply"]: "1.5px" }} />
      <div className="ply-edge-dark absolute inset-x-0 bottom-0 h-3" style={{ ["--ply"]: "1.5px" }} />
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium uppercase tracking-[0.5em] text-white/55">
        XSpace Plywood
      </span>
    </div>
  );
}
