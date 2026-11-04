"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Sheet } from "@/components/product/Ply";
gsap.registerPlugin(ScrollTrigger);
const SIZE = 300;
const T = 12;
/** Scroll-driven manufacturing journey: a sheet assembles as each stage is read. */
export function ProcessSequence({ steps }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const layers = gsap.utils.toArray(".ps-layer");
        const items = gsap.utils.toArray(".ps-step");
        gsap.set(layers, { autoAlpha: 0, z: (i) => -i * T + 160 });
        gsap.set(items, { opacity: 0.35 });
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 62%",
            end: "bottom 38%",
            onToggle: (self) => {
              gsap.to(item, { opacity: self.isActive ? 1 : 0.35, duration: 0.4 });
              if (self.isActive) {
                layers.forEach((l, li) =>
                  gsap.to(l, {
                    autoAlpha: li <= i ? 1 : 0,
                    z: li <= i ? -li * T : -li * T + 160,
                    duration: 0.7,
                    ease: "power3.out",
                    overwrite: true,
                  }),
                );
              }
            },
          });
        });
        gsap.fromTo(
          ".ps-bar",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".ps-list", start: "top 60%", end: "bottom 40%", scrub: true },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [steps.length]);
  return (
    <div ref={root} className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div
          className="sticky top-28 hidden h-[calc(100svh-9rem)] items-center justify-center bg-ice lg:flex"
          aria-hidden="true"
        >
          <span className="placeholder-tag">Illustrative render</span>
          <div style={{ perspective: 2000 }}>
            <div
              className="relative"
              style={{
                width: SIZE,
                height: SIZE,
                transformStyle: "preserve-3d",
                transform: "rotateX(58deg) rotateZ(-40deg)",
              }}
            >
              {steps.map((_, i) => (
                <Sheet
                  key={i}
                  className="ps-layer"
                  tone={i === steps.length - 1 ? "ember" : i % 2 ? "pine" : "birch"}
                  seed={i * 9 + 1}
                  size={SIZE}
                  thickness={T}
                  cross={i % 2 === 1}
                  style={{ transform: `translateZ(${-i * T}px)` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <ol className="ps-list relative lg:col-span-6 lg:col-start-7">
        <span aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-ink/10" />
        <span aria-hidden="true" className="ps-bar absolute left-0 top-0 h-full w-px origin-top bg-walnut" />
        {steps.map((s, i) => (
          <li key={s.id} className="ps-step relative py-14 pl-10 first:pt-2 lg:py-[18vh]">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-walnut">
              STAGE {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-3 text-h2">{s.title}</h2>
            <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-ink/70">{s.body}</p>
            {s.imageUrl ? (
              <div className="relative mt-8 aspect-16/10 overflow-hidden" data-reveal-img data-parallax-img>
                <Image
                  src={s.imageUrl}
                  alt={s.title}
                  fill
                  sizes="(min-width:1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
