"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitWords } from "@/components/ui/SplitWords";

gsap.registerPlugin(ScrollTrigger);

/**
 * Home — manufacturing journey.
 *
 * One full-screen stage that docks under the header and stays put while you
 * scroll through 7 scenes (intro + 6 stages):
 *   • the photo stays still;
 *   • scrolling moves only the text — the current text travels up and out
 *     while the next stage's text rises from below;
 *   • once the incoming text reaches the middle of the screen, the photo
 *     crossfades to the next one.
 *
 * Without JavaScript, the same 7 scenes simply stack as full-screen blocks —
 * identical total height, all content readable.
 *
 * Background photos: replace the files in /public/images/process/ to change them.
 */
/** The six manufacturing stages (edit here to change the copy) */
const STEPS = [
  {
    id: 27,
    title: "Responsible timber",
    body: "Responsibly sourced timber, carefully debarked and peeled into veneers.",
    imageUrl: "",
    sortOrder: 0,
  },
  {
    id: 28,
    title: "Veneer Peeling",
    body: "Debarked logs are precisely peeled into thin, uniform veneers, forming the foundation of our plywood.",
    imageUrl: "",
    sortOrder: 1,
  },
  {
    id: 29,
    title: "Veneer Preparation",
    body: "Controlled drying removes excess moisture, preparing veneers for strong, consistent bonding.",
    imageUrl: "",
    sortOrder: 2,
  },
  {
    id: 30,
    title: "Bonding",
    body: "Imported adhesives create strong, lasting bonds between every veneer layer.",
    imageUrl: "",
    sortOrder: 3,
  },
  {
    id: 31,
    title: "Pressing & calibration",
    body: "Heat pressing strengthens bonding, while precision calibration ensures uniform thickness.",
    imageUrl: "",
    sortOrder: 4,
  },
  {
    id: 32,
    title: "Finishing",
    body: "Precision sanding creates a smooth, uniform surface, ready for laminates, veneers or polish.",
    imageUrl: "",
    sortOrder: 5,
  },
].sort((a, b) => a.sortOrder - b.sortOrder);

/** Background photo per scene: intro first, then one per stage (a stage's own imageUrl wins) */
const SCENE_IMAGES = [
  { src: "/images/process/process-intro.jpg", alt: "Cross-section of a log showing its growth rings" },
  { src: "/images/process/process-1.png", alt: "Timber workshop with benches and hand tools" },
  { src: "/images/process/process-2.png", alt: "Timber logs stacked in a yard" },
  { src: "/images/process/process-3.png", alt: "Loader stacking freshly cut logs" },
  { src: "/images/process/process-4.png", alt: "Close-up of flowing wood grain" },
  { src: "/images/process/process-5.png", alt: "Managed plantation forest" },
  { src: "/images/process/process-6.png", alt: "End grain of a large stack of logs" },
];

const INTRO =
  "Every XSpace sheet moves through the same six stages, from carefully sourced timber to precise pressing and treatment. Scroll through the journey.";

const HOLD = 0.3; // timeline units the text rests, centred, before moving on
const DUR = 0.7; // timeline units the text takes to scroll from one stage to the next
const FADE_AT = 0.5; // photo crossfade starts when the incoming text is this far through its rise
const FADE_LEN = 0.3; // …and takes this fraction of the move

const pad = (n) => String(n).padStart(2, "0");

/** Background photo + readability gradient for one scene */
function Photo({ i }) {
  const fallback = SCENE_IMAGES[i] ?? SCENE_IMAGES[SCENE_IMAGES.length - 1];
  const own = i > 0 ? STEPS[i - 1]?.imageUrl : "";
  const img = own ? { src: own, alt: STEPS[i - 1].title } : fallback;
  return (
    <>
      <div data-kb className="absolute inset-0">
        <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-cover" />
      </div>
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className={`absolute inset-0 hidden lg:block ${
            i === 0
              ? "bg-[linear-gradient(90deg,rgba(17,17,17,0.82)_0%,rgba(17,17,17,0.45)_55%,rgba(17,17,17,0.15)_100%)]"
              : "bg-[linear-gradient(270deg,rgba(17,17,17,0.82)_0%,rgba(17,17,17,0.45)_50%,rgba(17,17,17,0.1)_100%)]"
          }`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.35)_0%,rgba(17,17,17,0.25)_40%,rgba(17,17,17,0.88)_100%)] lg:hidden" />
      </div>
    </>
  );
}

/** Text for one scene (intro on the left, stages on the right) */
function Copy({ i, step }) {
  if (i === 0) {
    return (
      <div className="frame relative flex min-h-svh items-end pb-28 pt-28 lg:items-center lg:pb-0">
        <div className="max-w-2xl">
          <p className="eyebrow text-sky!">Manufacturing</p>
          <h2 id="process-heading" className="mt-6 text-h1 text-white">
            <SplitWords>From responsible timber to a calibrated sheet.</SplitWords>
          </h2>
          <div className="mt-6 max-w-lg">
            <p className="text-[17px] leading-relaxed text-white/80">{INTRO}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="frame relative flex min-h-svh items-end pb-28 pt-28 lg:items-center lg:justify-end lg:pb-0">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 left-5 hidden select-none text-[clamp(8rem,17vw,15rem)] font-semibold leading-none tracking-[-0.06em] text-white/15 sm:left-8 lg:left-12 lg:block"
      >
        {pad(i)}
      </span>
      <div className="max-w-md">
        <p className="eyebrow text-sky!">Stage {pad(i)}</p>
        <h3 className="mt-5 text-h2 text-white">{step.title}</h3>
        <p className="mt-5 text-[17px] leading-relaxed text-white/80">{step.body}</p>
      </div>
    </div>
  );
}

// `steps` from the page is ignored — the stages are defined in STEPS above
// eslint-disable-next-line no-unused-vars
export function ProcessMain({ steps: _ignored }) {
  const steps = STEPS;
  const root = useRef(null);
  const stage = useRef(null);
  const [pinned, setPinned] = useState(false);
  const sceneCount = steps.length + 1;

  // Switch from the stacked (no-JS) layout to the pinned journey once JS runs.
  // Everything here moves only as the visitor scrolls (nothing plays on its
  // own), so it runs even when the device asks for reduced motion.
  useEffect(() => {
    setPinned(true);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const el = root.current;
    const ctx = gsap.context(() => {
      const photos = gsap.utils.toArray("[data-photo]");
      const copies = gsap.utils.toArray("[data-copy]");
      const labels = gsap.utils.toArray("[data-step-label]");
      const vh = () => stage.current.offsetHeight;

      // initial states: only the first photo shows; later texts wait below the screen
      gsap.set(photos.slice(1), { opacity: 0 });
      gsap.set(copies.slice(1), { y: () => vh() });
      gsap.set(labels, { opacity: 0.45 });

      const total = HOLD + steps.length * (DUR + HOLD);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
      });

      // slow drift on every photo across its time on screen (clamped to the
      // journey length so the scroll mapping stays exact)
      photos.forEach((ph, i) => {
        const start = i === 0 ? 0 : HOLD + (i - 1) * (HOLD + DUR);
        const duration = Math.min(HOLD + DUR * 2, total - start);
        tl.fromTo(ph.querySelector("[data-kb]"), { scale: 1.1 }, { scale: 1, duration }, start);
      });

      // progress line across the whole journey
      tl.fromTo("[data-progress]", { scaleX: 0 }, { scaleX: 1, duration: total }, 0);

      for (let k = 1; k < sceneCount; k++) {
        const a = HOLD + (k - 1) * (DUR + HOLD);

        // text scrolls: current text goes up and out, next text rises into place
        tl.to(copies[k - 1], { y: () => -vh(), duration: DUR }, a);
        tl.to(copies[k], { y: 0, duration: DUR }, a);

        // once the new text is about mid-way up, the photo crossfades
        const f = a + DUR * FADE_AT;
        tl.to(photos[k], { opacity: 1, duration: DUR * FADE_LEN, ease: "power1.inOut" }, f);
        tl.to(photos[k - 1], { opacity: 0, duration: DUR * FADE_LEN, ease: "power1.inOut" }, f);

        // step labels under the progress line
        tl.to(labels[k - 1], { opacity: 1, duration: 0.1 }, f);
        if (k > 1) tl.to(labels[k - 2], { opacity: 0.45, duration: 0.1 }, f);
      }

      // the stage's top corners flatten as it docks under the header
      const r = window.innerWidth >= 768 ? 44 : 28;
      gsap.fromTo(
        stage.current,
        { borderTopLeftRadius: r, borderTopRightRadius: r },
        {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
        },
      );
    }, el);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [pinned, sceneCount, steps.length]);

  const scenes = Array.from({ length: sceneCount }, (_, i) => i);

  return (
    <section
      ref={root}
      id="process"
      data-nav-theme="dark"
      aria-labelledby="process-heading"
      className={`on-dark relative w-full text-white ${
        pinned ? "" : "overflow-hidden rounded-t-[28px] bg-ink md:rounded-t-[44px]"
      }`}
      style={pinned ? { height: `${sceneCount * 100}svh` } : undefined}
    >
      {pinned ? (
        <div
          ref={stage}
          className="sticky top-0 h-svh w-full overflow-hidden bg-ink shadow-[0_-28px_60px_-18px_rgba(17,17,17,0.45)]"
        >
          {/* photos: stacked, crossfaded */}
          {scenes.map((i) => (
            <div key={`p${i}`} data-photo className="absolute inset-0" style={{ zIndex: i + 1 }}>
              <Photo i={i} />
            </div>
          ))}

          {/* text: each block scrolls through the fixed stage */}
          {scenes.map((i) => (
            <div
              key={`c${i}`}
              data-copy
              className="pointer-events-none absolute inset-0 [&_a]:pointer-events-auto"
              style={{ zIndex: 20 + i }}
            >
              <Copy i={i} step={steps[i - 1]} />
            </div>
          ))}

          {/* journey progress */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 z-50 lg:bottom-8">
            <div className="frame">
              <div className="relative h-px w-full bg-white/20">
                <div data-progress className="absolute inset-0 origin-left bg-white" style={{ transform: "scaleX(0)" }} />
              </div>
              {/* labels spread edge to edge with equal gaps between them */}
              <ol className="mt-3 hidden justify-between gap-6 text-[11px] uppercase tracking-[0.18em] text-white lg:flex">
                {steps.map((s, i) => (
                  <li key={s.id ?? i} data-step-label className="whitespace-nowrap opacity-45">
                    {pad(i + 1)} · {s.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ) : (
        // stacked fallback: one full-screen block per scene
        scenes.map((i) => (
          <div key={i} className="relative min-h-svh overflow-hidden">
            <div className="absolute inset-0">
              <Photo i={i} />
            </div>
            <div className="relative">
              <Copy i={i} step={steps[i - 1]} />
            </div>
          </div>
        ))
      )}
    </section>
  );
}