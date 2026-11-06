"use client";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "@/components/ui/Icon";
gsap.registerPlugin(ScrollTrigger);

/** Default hero photo; override with `heroImageUrl` in src/data/home.json. */
const DEFAULT_IMAGE = "/images/hero/hero-logs.jpg";

export function Hero({ eyebrow, headline, copy, imageUrl }) {
  const root = useRef(null);
  // one line per sentence, words animate individually
  const lines = headline.split(/(?<=\.)\s+/).map((l) => l.split(" "));
  const src = imageUrl || DEFAULT_IMAGE;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-hero]", { visibility: "visible" });
      const mm = gsap.matchMedia();
      mm.add("all", () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".hero-bg", { scale: 1.14, duration: 2.4, ease: "power2.out" }, 0)
          .from(".hero-eyebrow", { y: 16, autoAlpha: 0, duration: 0.8 }, 0.2)
          .from(".hero-word", { yPercent: 110, duration: 1.1, stagger: 0.07 }, "-=0.5")
          .from(".hero-copy", { y: 20, autoAlpha: 0, duration: 0.9 }, "-=0.7")
          .from(".hero-meta > *", { autoAlpha: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
          .from(".hero-cue", { y: -10, autoAlpha: 0, duration: 0.8 }, "-=0.5");
        // scroll: the hero stays put while the next section slides up over it —
        // the photo pushes in slightly, the text lifts away and the scene dims
        const cover = { trigger: el, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".hero-bg-wrap", { scale: 1.08, ease: "none", scrollTrigger: cover });
        gsap.to(".hero-content", { yPercent: -12, autoAlpha: 0, ease: "none", scrollTrigger: cover });
        gsap.fromTo(".hero-dim", { opacity: 0 }, { opacity: 0.6, ease: "none", scrollTrigger: cover });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      data-no-auto-reveal
      data-nav-theme="dark"
      className="on-dark sticky top-0 z-0 flex min-h-svh items-center overflow-hidden bg-deep pb-16 pt-28 text-white md:pt-32"
    >
      {/* Full-screen background photo */}
      <div aria-hidden="true" className="hero-bg-wrap absolute inset-0">
        <div className="hero-bg absolute inset-0">
          <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" style={{ objectPosition: "center" }} />
        </div>
      </div>
      {/* Readability: darker on the text side and at the top/bottom edges */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.82)_0%,rgba(17,17,17,0.6)_45%,rgba(17,17,17,0.25)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.55)_0%,rgba(17,17,17,0)_22%,rgba(17,17,17,0)_70%,rgba(17,17,17,0.6)_100%)]"
      />

      {/* architectural grid lines */}
      {/* <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="frame grid h-full grid-cols-4 md:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`border-l border-white/[0.07] ${i >= 4 ? "hidden md:block" : ""}`} />
          ))}
        </div>
      </div> */}

      <div className="hero-content frame relative">
        <div className="min-w-0 max-w-4xl">
          <p data-hero className="hero-eyebrow eyebrow text-sand!">
            {eyebrow}
          </p>
          <h1 data-hero className="mt-6 text-display font-medium">
            {lines.map((words, li) => (
              <span key={li} className="block">
                {words.map((w, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                    <span className="hero-word inline-block">
                      {w}
                      {i < words.length - 1 ? " " : ""}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p
            data-hero
            className="hero-copy mt-8 max-w-xl text-[17px] leading-relaxed text-white/80 md:text-lg md:leading-[1.75rem]"
          >
            {copy}
          </p>
        </div>

        {/* Bottom row: key facts (left) · scroll cue (centre) */}
        <div className="mt-10 grid gap-10 xl:grid-cols-[1fr_auto_1fr] xl:items-end xl:gap-8">
          <dl
            data-hero
            className="hero-meta grid w-full max-w-xl grid-cols-3 gap-6 border-t border-white/20 pt-6 text-sm xl:justify-self-start"
          >
            <div>
              <dt className="text-white/60">Heritage</dt>
              <dd className="mt-1 font-medium">Since 1959</dd>
            </div>
            <div>
              <dt className="text-white/60">Grades</dt>
              <dd className="mt-1 font-medium">MR · BWP · BWR</dd>
            </div>
            <div>
              <dt className="text-white/60">Made in</dt>
              <dd className="mt-1 font-medium">Hassan, Karnataka</dd>
            </div>
          </dl>

          <a
            data-hero
            href="#intro"
            className="hero-cue cue-nudge hidden flex-col items-center gap-2 pb-1 text-[11px] uppercase tracking-[0.24em] text-white/60 hover:text-white xl:flex"
          >
            Scroll <ArrowDown />
          </a>
        </div>
      </div>

      {/* darkens as the next section slides over (driven on scroll) */}
      <div aria-hidden="true" className="hero-dim pointer-events-none absolute inset-0 bg-deep opacity-0" />
    </section>
  );
}
