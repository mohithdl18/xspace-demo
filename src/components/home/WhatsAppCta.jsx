"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { WhatsApp, ArrowRight } from "@/components/ui/Icon";

/**
 * Big WhatsApp call-to-action. On devices with a mouse, the pointer turns into
 * a large circle with "Open WhatsApp" inside while it's over the panel; a
 * click opens the chat. Touch and keyboard users get a normal link.
 */
export function WhatsAppCta({ href, number, className = "" }) {
  const root = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    const el = root.current;
    const c = ring.current;
    if (!el || !c) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set(c, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    const xTo = gsap.quickTo(c, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(c, "y", { duration: 0.45, ease: "power3" });
    const pos = (e) => {
      const r = el.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    const enter = (e) => {
      const [x, y] = pos(e);
      gsap.set(c, { x, y });
      xTo(x);
      yTo(y);
      gsap.to(c, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)", overwrite: "auto" });
    };
    const move = (e) => {
      const [x, y] = pos(e);
      xTo(x);
      yTo(y);
    };
    const leave = () => gsap.to(c, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
    const down = () => gsap.to(c, { scale: 0.85, duration: 0.15, overwrite: "auto" });
    const up = () => gsap.to(c, { scale: 1, duration: 0.25, ease: "back.out(2)", overwrite: "auto" });

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <a
      ref={root}
      data-cursor-hide
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with XSpace Plywood on WhatsApp, ${number}`}
      className={`group relative flex min-h-[150px] flex-col justify-between rounded-[28px] bg-[#1F7A4D] p-6 text-white shadow-[0_28px_50px_-30px_rgba(31,122,77,0.9)] transition-colors duration-500 hover:bg-[#1A6B43] lg:p-8 [@media(hover:hover)_and_(pointer:fine)]:cursor-none ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-3 text-sm font-medium">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <WhatsApp className="h-5 w-5" />
          </span>
          WhatsApp
        </span>
        <span className="text-[13px] text-white/75 sm:text-sm">{number}</span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <p className="text-[clamp(1.75rem,3vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          Chat with us
          <br />
          on WhatsApp
        </p>
        <ArrowRight className="h-7 w-7 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
      </div>

      {/* custom cursor (mouse devices only) */}
      <span
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] text-[#1F7A4D] opacity-0 shadow-[0_18px_40px_-12px_rgba(17,17,17,0.45)]"
      >
        <WhatsApp className="mb-1.5 h-6 w-6" />
        Open
        <br />
        WhatsApp
      </span>
    </a>
  );
}
