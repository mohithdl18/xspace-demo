"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide declarative motion. Content is fully visible without JS.
 * Motion always plays (the device's reduce-motion setting is not applied —
 * the site is designed to be felt in motion).
 *
 * Things slide in from the side they sit on: left-hand content comes in from
 * the left, right-hand content from the right.
 *
 *   data-reveal              slide in from its side + fade, when scrolled into view
 *   data-reveal-stagger      children slide in one after another, each from its own side
 *   data-split               heading drifts in from its side while words rise out of masks
 *                            (use <SplitWords>)
 *   data-reveal-img          visual wipes open from its side (="down" wipes from the top);
 *                            a photo inside, or any [data-reveal-scale] child, settles from a zoom
 *   data-parallax="0.15"     gentle scroll-linked drift of the element (desktop only)
 *   data-parallax-img        the photo inside drifts within its frame (desktop only)
 *   data-parallax-bg="140"   wood-grain background texture drifts by N px (desktop only)
 *   <details> in the page    open and close with a smooth height animation
 *
 * Automatic: any heading, paragraph, list, form or table in <main> that isn't
 * already covered above also slides in. Opt a block out with
 * data-no-auto-reveal (on it or any ancestor).
 */

// already animated by their own attributes / components
const COVERED =
  "[data-reveal], [data-reveal-stagger], [data-split], [data-reveal-img], [data-hero], [data-no-auto-reveal], #process, details > :not(summary), nav, [aria-hidden='true']";
const AUTO = "h1, h2, h3, h4, p, dl, ul, ol, form, table, blockquote";

/** -1 = comes in from the left, 1 = from the right */
function sideOf(el) {
  const r = el.getBoundingClientRect();
  const vw = window.innerWidth;
  if (!r.width) return -1;
  return r.left > vw * 0.42 ? 1 : -1;
}
const shift = () => (window.innerWidth >= 1024 ? 70 : 32);

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const mm = gsap.matchMedia();

    const id = requestAnimationFrame(() => {
      mm.add("all", () => {
        const d = shift();

        // ── Slide in from the side ─────────────────────────────────────────
        const slideIn = (el, trigger = el, extra = {}) =>
          gsap.from(el, {
            x: sideOf(el) * d,
            opacity: 0, // opacity, not autoAlpha: hidden elements can't receive keyboard focus
            duration: 1.25,
            ease: "power3.out",
            scrollTrigger: { trigger, start: "top 88%", once: true },
            ...extra,
          });

        gsap.utils.toArray("[data-reveal]").forEach((el) => slideIn(el));

        gsap.utils.toArray("[data-reveal-stagger]").forEach((el) => {
          const kids = Array.from(el.children);
          if (!kids.length) return;
          gsap.from(kids, {
            x: (i) => sideOf(kids[i]) * d,
            opacity: 0,
            duration: 1.15,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });
        });

        // ── Headlines: drift in from the side while words rise ─────────────
        gsap.utils.toArray("[data-split]").forEach((el) => {
          const words = el.querySelectorAll(".split-word");
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } });
          tl.from(el, { x: sideOf(el) * d * 0.7, opacity: 0, duration: 1.3, ease: "power3.out" }, 0);
          if (words.length) tl.from(words, { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.06 }, 0);
        });

        // ── Visuals: clip-path wipe from their side, contents settle from a zoom
        gsap.utils.toArray("[data-reveal-img]").forEach((el) => {
          const fromTop = el.dataset.revealImg === "down";
          const side = sideOf(el);
          const from = fromTop
            ? "inset(0% 0% 100% 0%)"
            : side < 0
              ? "inset(0% 100% 0% 0%)"
              : "inset(0% 0% 0% 100%)";
          const inner = el.querySelectorAll(":scope img, :scope [data-reveal-scale]");
          const parallaxing = el.hasAttribute("data-parallax-img") && window.innerWidth >= 1024;
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
          tl.fromTo(
            el,
            { clipPath: from },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut", clearProps: "clipPath" },
          );
          if (inner.length) {
            tl.fromTo(
              inner,
              { scale: 1.18 },
              // keep a little headroom when the photo also parallaxes, so edges never show
              { scale: parallaxing ? 1.1 : 1, duration: 1.9, ease: "power3.out" },
              0,
            );
          }
        });

        // ── Everything else in the page: slide in from its side ────────────
        const picked = [];
        document.querySelectorAll("main").forEach((main) => {
          main.querySelectorAll(AUTO).forEach((el) => {
            if (el.closest(COVERED)) return;
            if (picked.some((p) => p.contains(el))) return; // its block already animates
            picked.push(el);
          });
        });
        picked.forEach((el) => slideIn(el, el, { duration: 1.15 }));

        // ── Footer: its two columns come in from either side ───────────────
        gsap.utils.toArray("[data-footer-col]").forEach((el) =>
          slideIn(el, el.closest("footer"), { scrollTrigger: { trigger: el.closest("footer"), start: "top 85%", once: true } }),
        );
      });

      mm.add("(min-width: 1024px)", () => {
        gsap.utils.toArray("[data-parallax]").forEach((el) => {
          const amt = parseFloat(el.dataset.parallax || "0.12");
          gsap.fromTo(
            el,
            { yPercent: amt * 100 },
            {
              yPercent: -amt * 100,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Photos drift inside their frame (frame must be overflow-hidden)
        gsap.utils.toArray("[data-parallax-img]").forEach((frame) => {
          const img = frame.querySelector("img");
          if (!img) return;
          gsap.set(img, { scale: 1.1 });
          gsap.fromTo(
            img,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Wood-grain textures drift, so material surfaces feel alive
        gsap.utils.toArray("[data-parallax-bg]").forEach((el) => {
          const px = parseFloat(el.dataset.parallaxBg || "120");
          gsap.fromTo(
            el,
            { backgroundPositionY: `${px / 2}px` },
            {
              backgroundPositionY: `${-px / 2}px`,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      // ── Accordions: smooth open/close for every <details> on the page ────
      mm.add("all", () => {
        const offs = [];
        document.querySelectorAll("main details").forEach((d) => {
          const summary = d.querySelector(":scope > summary");
          const body = summary?.nextElementSibling;
          if (!summary || !body) return;
          let busy = false;
          const onClick = (e) => {
            e.preventDefault();
            if (busy) return;
            busy = true;
            if (!d.open) {
              d.open = true;
              gsap.fromTo(
                body,
                { height: 0, autoAlpha: 0, overflow: "hidden" },
                {
                  height: "auto",
                  autoAlpha: 1,
                  duration: 0.55,
                  ease: "power3.out",
                  clearProps: "height,overflow",
                  onComplete: () => {
                    busy = false;
                    ScrollTrigger.refresh();
                  },
                },
              );
            } else {
              gsap.to(body, {
                height: 0,
                autoAlpha: 0,
                overflow: "hidden",
                duration: 0.4,
                ease: "power3.inOut",
                onComplete: () => {
                  d.open = false;
                  gsap.set(body, { clearProps: "all" });
                  busy = false;
                  ScrollTrigger.refresh();
                },
              });
            }
          };
          summary.addEventListener("click", onClick);
          offs.push(() => summary.removeEventListener("click", onClick));
        });
        return () => offs.forEach((off) => off());
      });

      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(id);
      mm.revert();
    };
  }, [pathname]);

  return null;
}
