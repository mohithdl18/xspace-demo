"use client";
import Link from "next/link";
import { gsap } from "gsap";
import { getLenis } from "@/lib/lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { ArrowRight, Close, Menu, WhatsApp } from "@/components/ui/Icon";
import { NAV } from "@/lib/site";

const QUOTE_HREF =
  "https://wa.me/919686348614?text=Hello%20XSpace%2C%20I'd%20like%20to%20know%20more%20about%20your%20products";

/**
 * Site header: a full-width bar fixed to the very top of the screen.
 *
 * On devices with a mouse, hovering anything in the bar (logo, links, the
 * quote button) turns the pointer into a large circle that follows it and
 * names where the click goes — the same effect as the WhatsApp panel on the
 * home page. Elements opt in with data-nav-cursor="Label".
 */
export function Header({ logoUrl, banner }) {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef(null);
  const panelRef = useRef(null);
  const bar = useRef(null);
  const ring = useRef(null);
  const [cursor, setCursor] = useState({ label: "", wa: false });

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  // same-page anchor jumps (e.g. Contact on the home page) close the menu too
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("xspace:close-menu", close);
    return () => window.removeEventListener("xspace:close-menu", close);
  }, []);

  // Circle cursor over the bar's links (mouse / trackpad only)
  useEffect(() => {
    const el = bar.current;
    const c = ring.current;
    if (!el || !c) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    gsap.set(c, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });
    const xTo = gsap.quickTo(c, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(c, "y", { duration: 0.4, ease: "power3" });
    let current = null;

    const show = (target, e) => {
      const r = el.getBoundingClientRect();
      if (!current) gsap.set(c, { x: e.clientX - r.left, y: e.clientY - r.top });
      current = target;
      setCursor({ label: target.dataset.navCursor, wa: target.hasAttribute("data-nav-cursor-wa") });
      gsap.to(c, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)", overwrite: "auto" });
    };
    const hide = () => {
      current = null;
      gsap.to(c, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in", overwrite: "auto" });
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
      const t = e.target.closest?.("[data-nav-cursor]");
      if (t && t !== current) show(t, e);
      else if (!t && current) hide();
    };
    const down = () => current && gsap.to(c, { scale: 0.85, duration: 0.15, overwrite: "auto" });
    const up = () => current && gsap.to(c, { scale: 1, duration: 0.25, ease: "back.out(2)", overwrite: "auto" });

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", hide);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", hide);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
    };
  }, []);

  // Mobile menu: lock scroll, close on Escape, keep focus inside
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const first = panelRef.current?.querySelector("a,button");
    first?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const els = [...panelRef.current.querySelectorAll("a,button")];
        const [a, z] = [els[0], els[els.length - 1]];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");
  // hide the native pointer over items that show the circle (mouse devices only)
  const noCursor = "[@media(hover:hover)_and_(pointer:fine)]:cursor-none";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-deep focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>

      {/* Full-width bar fixed to the top of the screen */}
      <header className="fixed inset-x-0 top-0 z-50">
        {banner && !compact && (
          <div className="bg-walnut px-5 py-1.5 text-center text-[13px] font-medium text-cream">
            {banner.href ? (
              <Link href={banner.href} className="link-u">
                {banner.text}
              </Link>
            ) : (
              banner.text
            )}
          </div>
        )}

        <div
          ref={bar}
          className={`relative border-b transition-[background-color,border-color,box-shadow] duration-500 ${
            compact
              ? "border-cream/10 bg-base/90 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.8)] backdrop-blur-md"
              : "border-cream/5 bg-base/70 backdrop-blur-md"
          }`}
        >
          <div className="frame flex h-[72px] items-center justify-between gap-4">
            <div className="flex h-full items-center" data-nav-cursor="Home">
              <Logo logoUrl={logoUrl} imgClassName={`block h-10 w-auto sm:h-11 ${noCursor}`} className={noCursor} />
            </div>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-2">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-nav-cursor={item.label}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`flex min-h-[44px] items-center rounded-full px-4 text-[16px] font-semibold tracking-[0.01em] transition-colors duration-300 hover:text-sand ${noCursor} ${
                        isActive(item.href) ? "text-sand" : "text-cream"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5">
              <Link
                href={QUOTE_HREF}
                data-nav-cursor="Open WhatsApp"
                data-nav-cursor-wa
                className={`btn btn-primary hidden min-h-[46px]! rounded-full text-[15px]! font-semibold! sm:inline-flex ${noCursor}`}
              >
                Request a Quote
              </Link>
              <button
                ref={menuBtn}
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <Close /> : <Menu />}
              </button>
            </div>
          </div>

          {/* circle cursor (mouse devices only) */}
          <span
            ref={ring}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 flex h-[88px] w-[88px] flex-col items-center justify-center rounded-full bg-sand px-2 text-center text-[10px] font-bold uppercase leading-tight tracking-[0.14em] text-deep opacity-0 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.7)]"
          >
            {cursor.wa ? <WhatsApp className="mb-1 h-5 w-5" /> : <ArrowRight className="mb-1 h-4 w-4 -rotate-45" />}
            {cursor.label}
          </span>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-45 overflow-y-auto bg-base pt-[96px] lg:hidden"
      >
        <nav aria-label="Mobile" className="frame pb-12">
          <ul className="border-t border-cream/10">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-cream/10">
                <Link
                  href={item.href}
                  className={`flex min-h-[64px] items-center justify-between text-2xl font-semibold ${
                    isActive(item.href) ? "text-sand" : "text-cream"
                  }`}
                >
                  {item.label} <ArrowRight className="h-5 w-5" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href={QUOTE_HREF} className="btn btn-primary mt-10 w-full rounded-full font-semibold">
            Request a Quote
          </Link>
        </nav>
      </div>
    </>
  );
}
