"use client";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/lib/lenis";

/**
 * Anchor for the home page contact section ("/#contact").
 *
 * The contact section sits inside stacked sticky layers, so the browser's own
 * jump-to-anchor can land in the wrong place. This marker sits in normal flow
 * exactly where the section begins, and scrolls there:
 *   • arriving from another page at /#contact → jumps straight to it
 *   • clicking a "/#contact" link while already on the home page → glides to it
 */
const HASH = "#contact";

function targetTop() {
  const el = document.getElementById("contact");
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
}

/** Instant jump that keeps Lenis in sync */
function jump() {
  const top = targetTop();
  if (top == null) return;
  const lenis = getLenis();
  const wasStopped = lenis?.isStopped;
  lenis?.stop(); // cancels any glide in progress
  window.scrollTo(0, top);
  if (lenis && !wasStopped) lenis.start();
}

/** Re-check shortly after, in case late layout (pinned sections, images) moved the target */
function settle(delays) {
  delays.forEach((d) =>
    setTimeout(() => {
      const t = targetTop();
      const lenis = getLenis();
      const busy = lenis && lenis.isScrolling === "native"; // visitor is scrolling — leave them be
      if (t != null && !busy && window.location.hash === HASH && Math.abs(window.scrollY - t) > 4) jump();
    }, d),
  );
}

function glide() {
  const top = targetTop();
  if (top == null) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(top, { duration: 1.4, force: true });
  else window.scrollTo({ top, behavior: "smooth" });
  settle([1900]);
}

export function ContactAnchor() {
  useEffect(() => {
    // arrived with #contact: wait for the pinned sections to size themselves first
    let t;
    if (window.location.hash === HASH) {
      t = setTimeout(() => {
        ScrollTrigger.refresh();
        jump();
        settle([400, 1000]);
      }, 150);
    }

    // same-page clicks on any "/#contact" link (nav, mobile menu, buttons)
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a) return;
      let url;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash !== HASH) return;
      e.preventDefault();
      e.stopPropagation();
      history.replaceState(null, "", HASH);
      window.dispatchEvent(new Event("xspace:close-menu"));
      // let the mobile menu close (and unlock scrolling) first
      setTimeout(glide, 60);
    };
    document.addEventListener("click", onClick, true);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return <div id="contact" aria-hidden="true" />;
}
