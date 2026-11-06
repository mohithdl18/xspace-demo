"use client";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sheet } from "@/components/product/Ply";
import { ArrowRight } from "@/components/ui/Icon";
gsap.registerPlugin(ScrollTrigger);
const LAYERS = 7;
const SIZE = 340;
const T = 10;
const SPREAD = 46; // exploded gap between plies
/** Annotations: construction principle + technologies verified for MR Eco & Gold Grade. */
const NOTES = [
  { k: "01", title: "Face veneer", body: "Calibrated veneers help eliminate warping, blisters and gaps." },
  {
    k: "02",
    title: "Cross-banded plies",
    body: "Alternate plies run at right angles to each other — the principle that gives plywood its stability.",
  },
  { k: "03", title: "Power Seal bond", body: "Power Seal adhesive locks the layers together." },
  { k: "04", title: "ATBS protection", body: "Vacuum-impregnated anti-termite and borer protection." },
  { k: "05", title: "Hydro Shield core", body: "Hydro Shield technology stabilises cores in humid climates." },
];
export function ExplodedPly() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const layers = gsap.utils.toArray(".x-layer");
        const notes = gsap.utils.toArray(".x-note");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "+=150%", scrub: 0.6, pin: ".x-pin", anticipatePin: 1 },
        });
        // start as one solid sheet
        layers.forEach((l, i) => gsap.set(l, { z: -i * T }));
        gsap.set(notes, { autoAlpha: 0.25 });
        gsap.set(".x-progress", { scaleY: 0 });
        tl.to(".x-stage", { rotateZ: -32, duration: 1 }, 0)
          .to(layers, { z: (i) => -i * (T + SPREAD), duration: 1, ease: "power2.inOut" }, 0)
          .to(".x-progress", { scaleY: 1, duration: 1 }, 0);
        notes.forEach((n, i) => {
          tl.to(n, { autoAlpha: 1, duration: 0.12 }, i * 0.18).to(
            n,
            { autoAlpha: i === notes.length - 1 ? 1 : 0.35, duration: 0.12 },
            i * 0.18 + 0.2,
          );
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} aria-labelledby="construction-title" className="relative bg-panel">
      <div className="x-pin flex min-h-svh items-center py-20 lg:py-0">
        <div className="frame grid items-center gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <p className="eyebrow">Inside the sheet</p>
            <h2 id="construction-title" className="mt-5 text-h2">
              Strength is built in layers.
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-cream/70">
              Scroll to open up a sheet of MR Eco &amp; Gold Grade and see where each technology works.
            </p>
            <ol className="relative mt-10 space-y-6 border-l border-cream/15 pl-6">
              <span
                aria-hidden="true"
                className="x-progress absolute -left-px top-0 h-full w-px origin-top bg-walnut"
              />
              {NOTES.map((n) => (
                <li key={n.k} className="x-note">
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-sand">{n.k}</p>
                  <p className="mt-1 text-[17px] font-medium">{n.title}</p>
                  <p className="mt-1 max-w-sm text-[14px] leading-relaxed text-cream/65">{n.body}</p>
                </li>
              ))}
            </ol>
            <Link
              href="/products/mr-eco-gold-grade"
              className="link-u mt-10 inline-flex items-center gap-2 text-sm font-medium"
            >
              View MR Eco &amp; Gold Grade <ArrowRight />
            </Link>
          </div>

          <div
            className="relative flex h-[440px] min-w-0 items-center justify-center overflow-hidden sm:h-[560px] lg:col-span-7 lg:h-[720px] lg:overflow-visible"
            aria-hidden="true"
          >
            <div className="shrink-0 origin-center scale-[0.62] sm:scale-[0.85] lg:scale-100">
              <div style={{ perspective: 2200 }}>
                <div
                  className="x-stage relative"
                  style={{
                    width: SIZE,
                    height: SIZE,
                    transformStyle: "preserve-3d",
                    transform: "rotateX(60deg) rotateZ(-38deg)",
                  }}
                >
                  {Array.from({ length: LAYERS }).map((_, i) => (
                    <Sheet
                      key={i}
                      className="x-layer"
                      tone={i === 0 ? "birch" : i === LAYERS - 1 ? "oak" : "pine"}
                      seed={i * 5 + 2}
                      size={SIZE}
                      thickness={T}
                      cross={i % 2 === 1}
                      style={{ transform: `translateZ(${-i * (T + SPREAD)}px)` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="absolute bottom-4 right-0 max-w-[260px] text-right text-[11px] leading-relaxed text-cream/60">
              Illustrative diagram. Actual ply count varies by thickness and grade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
