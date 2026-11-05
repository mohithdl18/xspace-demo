import { Logo } from "./Logo";
import { telLink } from "@/lib/site";
import { Phone, Mail } from "@/components/ui/Icon";

/**
 * Site footer. Black, rounded top corners, about half the screen tall.
 * Logo + short intro on the left; phone numbers + email on the right.
 * A giant "XSPACE" spans the full width at the bottom, fading downwards,
 * with its bottom 5% tucked out of view.
 * On the home page it rises up over the (fixed) contact section.
 */
export function Footer({ company }) {
  const year = new Date().getFullYear();
  return (
    <footer
      id="site-footer"
      data-nav-theme="dark"
      className="on-dark relative z-30 flex min-h-[50svh] flex-col overflow-hidden rounded-t-[28px] bg-ink text-white shadow-[0_-28px_60px_-18px_rgba(17,17,17,0.45)] md:rounded-t-[44px]"
    >
      <div className="frame flex flex-col gap-6 pt-9 md:flex-row md:items-start md:justify-between md:gap-12 md:pt-10">
        <div data-footer-col className="max-w-md">
          <Logo inverted logoUrl={company.logoUrl} imgClassName="h-12 w-auto md:h-14" />
          <p className="mt-4 text-[14px] leading-relaxed text-white/65 md:text-[15px]">
            {company.tagline} Plywood and interior materials from Hassan, Karnataka — powered by {company.poweredBy},
            since {company.foundedYear}.
          </p>
        </div>

        <div data-footer-col className="space-y-2.5 text-[15px] md:text-right md:text-[16px]">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 md:justify-end">
            <Phone className="h-4 w-4 shrink-0 text-sky" />
            <span className="sr-only">Phone:</span>
            {company.phones.map((p, i) => (
              <span key={p} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="hidden text-white/30 md:inline">·</span>}
                <a href={telLink(p)} className="link-u whitespace-nowrap">
                  {p}
                </a>
              </span>
            ))}
          </p>
          <p className="flex items-center gap-3 md:justify-end">
            <Mail className="h-4 w-4 shrink-0 text-sky" />
            <span className="sr-only">Email:</span>
            <a href={`mailto:${company.email}`} className="link-u">
              {company.email}
            </a>
          </p>
          <p className="pt-1 text-[12px] text-white/40">
            © {year} {company.legalName}. All rights reserved.
          </p>
        </div>
      </div>

      {/* giant wordmark: full width, fading down, bottom 5% hidden */}
      <div aria-hidden="true" className="relative mt-auto overflow-hidden pt-4">
        <svg viewBox="0 -6 1000 174" className="block w-full translate-y-[5%]" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="footer-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.92" />
              <stop offset="0.55" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="168"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#footer-fade)"
            style={{ fontFamily: "inherit", fontWeight: 600, fontSize: 240, letterSpacing: "-0.02em" }}
          >
            XSPACE
          </text>
        </svg>
      </div>
    </footer>
  );
}
