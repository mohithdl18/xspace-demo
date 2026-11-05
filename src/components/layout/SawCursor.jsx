"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Site-wide custom cursor: a spinning circular saw blade.
 *
 *  • follows the mouse smoothly; its centre is the click point
 *  • spins constantly, and speeds up + grows over links and buttons
 *  • dips slightly while the mouse button is held
 *  • steps aside for areas with their own cursor ([data-cursor-hide],
 *    e.g. the WhatsApp panel) and for embedded maps (iframes)
 *
 * Mouse / trackpad only — touch devices keep their normal behaviour.
 * Image: /public/images/cursor/saw-blade-96.png
 */
const SIZE = 34; // px on screen
const INTERACTIVE = "a, button, summary, label, select, [role='button'], input[type='submit'], input[type='checkbox'], input[type='radio']";

export function SawCursor() {
  const wrap = useRef(null);
  const blade = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    const root = document.documentElement;
    const el = wrap.current;
    const img = blade.current;

    root.classList.add("saw-cursor");
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3.out" });
    const spin = gsap.to(img, { rotation: 360, duration: 1.6, ease: "none", repeat: -1 });

    let shown = false;
    let hot = false;
    let first = true;
    const show = (on) => {
      if (on === shown) return;
      shown = on;
      gsap.to(el, { autoAlpha: on ? 1 : 0, duration: 0.2, overwrite: "auto" });
    };
    const setHot = (on) => {
      if (on === hot) return;
      hot = on;
      gsap.to(img, { scale: on ? 1.2 : 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      gsap.to(spin, { timeScale: on ? 3.2 : 1, duration: 0.5, ease: "power2.out" });
    };

    const onMove = (e) => {
      if (first) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        first = false;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      const t = e.target;
      const hidden = t.closest?.("[data-cursor-hide], iframe");
      show(!hidden);
      setHot(!hidden && !!t.closest?.(INTERACTIVE));
    };
    const onDown = () => gsap.to(el, { scale: 0.82, duration: 0.15, overwrite: "auto" });
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.3, ease: "back.out(2)", overwrite: "auto" });
    const onLeave = (e) => {
      if (!e.relatedTarget) show(false); // left the window
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerout", onLeave);
    window.addEventListener("blur", () => show(false));

    return () => {
      root.classList.remove("saw-cursor");
      spin.kill();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[300] opacity-0"
      style={{ width: SIZE, height: SIZE }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={blade}
        src="/images/cursor/saw-blade-96.png"
        alt=""
        width={SIZE}
        height={SIZE}
        draggable={false}
        className="block h-full w-full select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
}
