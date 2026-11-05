"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowRight } from "@/components/ui/Icon";

/**
 * Home — "Work with us". Fills one screen (full width, 100svh) on ice blue.
 *
 * Four rounded cards hang on strings from a walnut rail, each at a different
 * drop below the heading. They behave like real pendulums:
 *   • as the section comes into view they swing out to 30° (alternating
 *     left / right) and settle with a gentle idle sway;
 *   • scrolling nudges them again (strongest when you change speed);
 *   • moving the mouse across a card pushes it in that direction.
 * Each string length has its own natural rhythm, so they never move in lockstep.
 */
const PATHWAYS = [
  {
    audience: "architect",
    title: "Architects & designers",
    body: "Grade specifications, thickness ranges and documents for your drawings and BOQs.",
    drop: [12, 28], // string length in px: [phones/tablets, desktop]
    period: 1.9, // seconds per swing
  },
  {
    audience: "contractor",
    title: "Contractors & builders",
    body: "Project quantities, delivery planning and a single point of contact for quotations.",
    drop: [48, 120],
    period: 2.3,
  },
  {
    audience: "dealer",
    title: "Dealers & distributors",
    body: "Talk to us about stocking the XSpace range in your market.",
    drop: [28, 64],
    period: 2.05,
  },
  {
    audience: "homeowner",
    title: "Homeowners",
    body: "Not sure which grade you need? Tell us about the room and we’ll guide you.",
    drop: [64, 160],
    period: 2.5,
  },
];

const DAMPING = 0.55; // per second — how quickly swings die down
const IDLE = 2.5; // degrees of gentle idle sway

export function WorkWithUs() {
  const root = useRef(null);
  const swings = useRef([]);
  const state = useRef([]);

  useEffect(() => {
    const el = root.current;
    const items = swings.current.filter(Boolean);
    if (!el || !items.length) return;

    const MAX = 30;
    state.current = PATHWAYS.map((p, i) => ({
      th: 0, // angle (deg)
      w: 0, // angular velocity (deg/s)
      k: (2 * Math.PI / p.period) ** 2,
      phase: i * 1.7,
      period: p.period,
    }));

    let visible = false;
    let started = false;
    let t = 0;
    let lastY = window.scrollY;
    let lastV = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        lastY = window.scrollY;
        lastV = 0;
        // first time it's properly in view: swing out to 30°, alternating sides
        if (!started && entry.intersectionRatio >= 0.35) {
          started = true;
          state.current.forEach((s, i) => {
            s.th = (i % 2 ? -1 : 1) * MAX * (0.8 + Math.random() * 0.2);
            s.w = 0;
          });
        }
      },
      { threshold: [0, 0.35] },
    );
    io.observe(el);

    const tick = (time, deltaTime) => {
      if (!visible) return;
      const dt = Math.min(deltaTime / 1000, 0.05);
      if (dt <= 0) return;
      t += dt;

      // scroll changes of speed push the cards (alternate directions)
      const y = window.scrollY;
      const v = (y - lastY) / dt;
      const a = (v - lastV) / dt;
      lastY = y;
      lastV = v;
      const scrollForce = Math.max(-500, Math.min(500, -a * 0.035));

      state.current.forEach((s, i) => {
        const idle = IDLE * Math.sin((t * 2 * Math.PI) / (s.period * 1.9) + s.phase);
        const acc = -s.k * (s.th - idle) - DAMPING * s.w + scrollForce * (i % 2 ? -1 : 1);
        s.w = Math.max(-260, Math.min(260, s.w + acc * dt));
        s.th += s.w * dt;
        if (s.th > MAX) {
          s.th = MAX;
          s.w *= -0.35;
        } else if (s.th < -MAX) {
          s.th = -MAX;
          s.w *= -0.35;
        }
        items[i].style.transform = `rotate(${s.th.toFixed(3)}deg)`;
      });
    };
    gsap.ticker.add(tick);

    return () => {
      io.disconnect();
      gsap.ticker.remove(tick);
      items.forEach((it) => (it.style.transform = ""));
    };
  }, []);

  // mouse moving across a card pushes it that way
  const push = (i) => (e) => {
    if (e.pointerType !== "mouse") return;
    const s = state.current[i];
    if (s) s.w += Math.max(-40, Math.min(40, e.movementX * 0.9));
  };

  return (
    <section
      ref={root}
      id="work-with-us"
      aria-labelledby="paths-title"
      className="relative flex min-h-svh w-full flex-col justify-center overflow-hidden rounded-t-[28px] bg-ice py-10 shadow-[0_-28px_60px_-18px_rgba(17,17,17,0.35)] md:rounded-t-[44px] md:py-16 [@media(max-height:780px)]:py-8"
    >
      <div className="frame">
        <SectionHead id="paths-title" eyebrow="Work with us" title="A direct line for every kind of project." />

        <ul data-reveal-stagger className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-y-10 sm:gap-x-5 lg:mt-14 lg:grid-cols-4 lg:gap-x-6 [@media(max-height:780px)]:lg:mt-8">
          {PATHWAYS.map((p, i) => (
            <li key={p.audience} className="relative pt-1">
              {/* walnut rail — segments join into one rod across each row */}
              <span
                aria-hidden="true"
                className="absolute -left-1.5 -right-1.5 top-0 h-[3px] rounded-full bg-walnut/85 shadow-[0_2px_4px_rgba(17,17,17,0.15)] sm:-left-2.5 sm:-right-2.5 lg:-left-3 lg:-right-3"
              />

              {/* everything below the pin swings together */}
              <div
                ref={(node) => (swings.current[i] = node)}
                onPointerMove={push(i)}
                className="relative origin-top will-change-transform"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-[60%] rounded-full bg-ink"
                />
                <span
                  aria-hidden="true"
                  className="mx-auto block h-(--d) w-px bg-ink/35 lg:h-(--dl)"
                  style={{ ["--d"]: `${p.drop[0]}px`, ["--dl"]: `${p.drop[1]}px` }}
                />
                <Link
                  href={`/contact?audience=${p.audience}#quote`}
                  className="group relative block rounded-[20px] bg-white p-4 pt-7 shadow-[0_24px_40px_-26px_rgba(17,17,17,0.4)] transition-colors duration-500 hover:bg-walnut hover:text-white sm:rounded-[22px] sm:p-5 sm:pt-8 lg:rounded-[26px] lg:p-6 lg:pt-9"
                >
                  {/* hanging hole */}
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-3 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-ink/25 transition-colors group-hover:border-white/50"
                  />
                  <span className="text-[12px] font-semibold tracking-[0.2em] text-walnut transition-colors group-hover:text-sky">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[16px] font-medium leading-tight sm:mt-3 sm:text-[19px] lg:text-h3">{p.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-snug text-ink/70 transition-colors group-hover:text-white/80 sm:mt-3 sm:text-[14px] sm:leading-relaxed lg:text-[15px]">
                    {p.body}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium sm:mt-5 lg:text-sm">
                    <span className="sr-only whitespace-nowrap sm:not-sr-only">Start an enquiry</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
