"use client";
import Link from "next/link";
import { getLenis } from "@/lib/lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { ArrowRight, Close, Menu } from "@/components/ui/Icon";
import { NAV } from "@/lib/site";
export function Header({ logoUrl, banner }) {
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef(null);
  const panelRef = useRef(null);
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
  // Over the home hero photo (top of page, nothing open): light text on transparent bar
  // The bar is always solid white, so text and logo are always dark.
  const overHero = false;
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>
      {/* Island navbar: a floating rounded white bar, fixed near the top */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 md:pt-4">
        {banner && !compact && (
          <div className="pointer-events-auto mx-auto mb-2 w-fit max-w-full rounded-full bg-sky px-5 py-1.5 text-center text-[13px] font-medium text-ink shadow-[0_6px_18px_-10px_rgba(17,17,17,0.35)]">
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
          className="pointer-events-auto relative mx-auto flex items-center justify-between gap-4 rounded-full bg-white/75 pl-5 pr-1.5 text-ink sm:pl-6"
          style={{ maxWidth: 920, height: 60 }}
        >
          {/* logo: centred vertically in the bar */}
          <div className="flex h-full items-center">
            <Logo logoUrl={logoUrl} imgClassName="block h-10 w-auto sm:h-11" />
          </div>

          <nav aria-label="Primary" className="relative hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex min-h-[40px] items-center rounded-full px-4 text-sm transition-colors duration-300 ${
                      overHero ? "hover:bg-white/15" : "hover:bg-ink/[0.06]"
                    } ${isActive(item.href) ? (overHero ? "bg-white/15 font-medium" : "bg-ink/[0.07] font-medium") : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative flex items-center gap-1.5">
            <Link
              href="/contact#quote"
              className={`btn ${overHero ? "btn-light" : "btn-primary"} hidden min-h-[46px]! rounded-full sm:inline-flex`}
            >
              Request a Quote
            </Link>
            <button
              ref={menuBtn}
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden ${
                overHero ? "hover:bg-white/15" : "hover:bg-ink/[0.06]"
              }`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
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
        className="fixed inset-0 z-45 overflow-y-auto bg-white pt-[104px] lg:hidden"
      >
        <nav aria-label="Mobile" className="frame pb-12">
          <ul className="border-t border-ink/10">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-ink/10">
                <Link
                  href={item.href}
                  className="flex min-h-[64px] items-center justify-between text-2xl font-medium"
                >
                  {item.label} <ArrowRight className="h-5 w-5" />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact#quote" className="btn btn-primary mt-10 w-full rounded-full">
            Request a Quote
          </Link>
        </nav>
      </div>
    </>
  );
}
