"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide declarative motion. Content is fully visible without JS; animations
 * are only attached when the visitor allows motion.
 *
 *   data-reveal              fade + rise when scrolled into view
 *   data-reveal-stagger      children animate in sequence
 *   data-split               heading words slide up out of masks (use <SplitWords>)
 *   data-reveal-img          visual wipes open from the bottom (="down" wipes from the top);
 *                            a photo inside, or any [data-reveal-scale] child, settles from a zoom
 *   data-parallax="0.15"     gentle scroll-linked drift of the element (desktop only)
 *   data-parallax-img        the photo inside drifts within its frame (desktop only)
 *   data-parallax-bg="140"   wood-grain background texture drifts by N px (desktop only)
 *   <details> in the page    open and close with a smooth height animation
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const mm = gsap.matchMedia();

    const id = requestAnimationFrame(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ── Fade + rise ────────────────────────────────────────────────────
        gsap.utils.toArray("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 32,
            opacity: 0, // opacity, not autoAlpha: hidden elements can't receive keyboard focus
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        gsap.utils.toArray("[data-reveal-stagger]").forEach((el) => {
          gsap.from(el.children, {
            y: 28,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });
        });

        // ── Headlines: words slide up out of their masks ──────────────────
        gsap.utils.toArray("[data-split]").forEach((el) => {
          const words = el.querySelectorAll(".split-word");
          if (!words.length) return;
          gsap.from(words, {
            yPercent: 110,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        // ── Visuals: clip-path wipe, with the contents settling from a zoom ─
        gsap.utils.toArray("[data-reveal-img]").forEach((el) => {
          const fromTop = el.dataset.revealImg === "down";
          const inner = el.querySelectorAll(":scope img, :scope [data-reveal-scale]");
          const parallaxing = el.hasAttribute("data-parallax-img") && window.innerWidth >= 1024;
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
          tl.fromTo(
            el,
            { clipPath: fromTop ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut", clearProps: "clipPath" },
          );
          if (inner.length) {
            tl.fromTo(
              inner,
              { scale: 1.18 },
              // keep a little headroom when the photo also parallaxes, so edges never show
              { scale: parallaxing ? 1.1 : 1, duration: 1.8, ease: "power3.out" },
              0,
            );
          }
        });
      });

      // Reduced motion: text and visuals still reveal on scroll, as a soft fade
      // that comes into focus (no sliding, zooming or wiping).
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const soft = (targets, trigger, extra = {}) =>
          gsap.from(targets, {
            opacity: 0,
            filter: "blur(8px)",
            duration: 1.1,
            ease: "power2.out",
            clearProps: "filter",
            scrollTrigger: { trigger, start: "top 90%", once: true },
            ...extra,
          });
        gsap.utils.toArray("[data-reveal], [data-split]").forEach((el) => soft(el, el));
        gsap.utils.toArray("[data-reveal-stagger]").forEach((el) => soft(el.children, el, { stagger: 0.12 }));
        gsap.utils.toArray("[data-reveal-img]").forEach((el) =>
          soft(el, el, { filter: "none", duration: 1.3 }),
        );
      });

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
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
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
