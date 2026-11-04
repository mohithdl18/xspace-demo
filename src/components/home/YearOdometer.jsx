"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Each digit window is taller than the 0.82 line box so glyphs are never
// clipped; the negative margins give the extra height back, so the layout
// is identical to plain text.
const ITEM = 1.1; // em — height of one digit slot
const TRIM = (ITEM - 0.82) / 2; // em — matches the heading's leading-[0.82]

/** Every digit a column shows while counting from `from` down to `to`. */
function reelFor(from, to, place) {
  const out = [];
  for (let y = from; y >= to; y--) {
    const d = Math.floor(y / place) % 10;
    if (out[out.length - 1] !== d) out.push(d);
  }
  return out; // first = starting digit, last = final digit
}

/**
 * Odometer-style year: rolls back from `from` (e.g. 2026) to `to` (e.g. 1959)
 * when it scrolls into view. Each column spins through every digit it passes,
 * like a real odometer — the ones column spins fastest, all land together.
 *
 * Renders the final year on the server, so it reads correctly without
 * JavaScript and for screen readers. Replays each time it scrolls into view.
 * `duration` is in seconds (default 4.5) — higher is slower.
 *
 * `grain` (a CSS background-image, e.g. grainUrl("walnut", 11)) is painted
 * onto each digit reel with background-clip: text — directly on the element
 * that owns the text, which renders reliably in Chrome, Safari and Firefox.
 * `parallax` makes that grain drift on scroll (px), like data-parallax-bg.
 */
export function YearOdometer({ from, to, duration = 4.5, grain, grainSize = "600px", parallax }) {
  const root = useRef(null);
  const digits = String(to).length;
  const places = Array.from({ length: digits }, (_, i) => 10 ** (digits - 1 - i));
  const reels = places.map((place) => reelFor(from, to, place));

  useEffect(() => {
    const el = root.current;
    if (!el || from <= to) return;

    const ctx = gsap.context(() => {
      const strips = [...el.querySelectorAll("[data-strip]")];
      const steps = strips.map((s) => Number(s.dataset.steps));
      // Mechanical odometer: a column only turns while the column to its right
      // is passing zero, so higher digits click over crisply instead of sliding.
      const turns = (v, P) => Math.floor(v / P) + Math.min(1, Math.max(0, (v % P) - (P - 1)));
      const place = (v) =>
        strips.forEach((s, i) => {
          const P = places[i];
          const k = turns(from, P) - turns(v, P); // steps rolled back so far
          // Moved with `top` (no transform layer), so the grain stays clipped to the digits.
          s.style.top = `${-(steps[i] - k) * ITEM}em`;
        });

      const state = { v: from };
      const roll = gsap.to(state, {
        v: to,
        duration,
        ease: "power3.inOut",
        paused: true,
        onUpdate: () => place(state.v),
      });
      place(from);

      // If the page loads with the year already on screen (e.g. refresh mid-page),
      // wait for the heading's fade-in before rolling, so the roll is actually seen.
      const r = el.getBoundingClientRect();
      const visibleAtLoad = r.top < window.innerHeight && r.bottom > 0;
      let first = true;
      const play = () => {
        const delay = first && visibleAtLoad ? 0.9 : 0.25;
        first = false;
        roll.pause(0);
        gsap.delayedCall(delay, () => roll.play(0));
      };

      // Roll each time the year comes into view from below…
      ScrollTrigger.create({ trigger: el, start: "top 75%", onEnter: play });
      // …and reset to the start year once it's fully below the screen again,
      // so scrolling back down replays it.
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        onLeaveBack: () => {
          gsap.killTweensOf(play);
          roll.pause(0);
          place(from);
        },
      });
    }, el);

    return () => {
      ctx.revert();
      // leave the final year showing when unmounted / re-run
      el.querySelectorAll("[data-strip]").forEach((s) => (s.style.top = "0em"));
    };
  }, [from, to, duration]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={root} className="inline-flex">
      <span className="sr-only">{to}</span>
      {reels.map((reel, i) => {
        // top-to-bottom: final digit first … starting digit last, so the strip
        // slides downward as the year counts back
        const strip = [...reel].reverse();
        return (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block"
            // clip-path window: shows one digit slot of the moving reel
            style={{ height: `${ITEM}em`, marginBlock: `-${TRIM}em`, lineHeight: `${ITEM}em`, clipPath: "inset(0)" }}
          >
            <span
              data-strip
              data-steps={strip.length - 1}
              {...(parallax ? { "data-parallax-bg": parallax } : {})}
              className="relative block"
              style={
                grain
                  ? {
                      backgroundImage: grain,
                      backgroundSize: grainSize,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }
                  : undefined
              }
            >
              {strip.map((d, j) => (
                <span key={j} className="block text-center" style={{ height: `${ITEM}em` }}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}