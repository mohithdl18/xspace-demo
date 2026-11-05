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
/**
 * Social profiles shown beside the email.
 * ▸ Replace these two links with XSpace's real profile URLs.
 *   (Entries in company.json "social" — e.g. { "platform": "instagram", "url": "…" } — override them.)
 */
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
};

const InstagramIcon = ({ className = "h-4 w-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const FacebookIcon = ({ className = "h-4 w-4" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    fill="currentColor"
  >
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
  </svg>
);

function socialUrl(company, platform) {
  const hit = (company.social || []).find(
    (s) => (s.platform || s.name || "").toLowerCase() === platform,
  );
  return hit?.url || hit?.href || SOCIAL_LINKS[platform];
}

export function Footer({ company }) {
  const social = [
    { platform: "instagram", label: "Instagram", Icon: InstagramIcon },
    { platform: "facebook", label: "Facebook", Icon: FacebookIcon },
  ].map((s) => ({ ...s, url: socialUrl(company, s.platform) }));
  const year = new Date().getFullYear();
  return (
    <footer
      id="site-footer"
      data-nav-theme="dark"
      className="on-dark relative z-30 flex min-h-[50svh] flex-col overflow-hidden rounded-t-[28px] bg-ink text-white shadow-[0_-28px_60px_-18px_rgba(17,17,17,0.45)] md:rounded-t-[44px]"
    >
      <div className="frame flex flex-col gap-6 pt-9 md:flex-row md:items-start md:justify-between md:gap-12 md:pt-10">
        <div data-footer-col className="max-w-md">
          <Logo
            inverted
            logoUrl={company.logoUrl}
            imgClassName="h-12 w-auto md:h-14"
          />
          <p className="mt-4 text-[14px] leading-relaxed text-white/65 md:text-[15px]">
            {company.tagline} Plywood and interior materials from Hassan,
            Karnataka <br></br> Powered by {company.poweredBy}, since{" "}
            {company.foundedYear}.
          </p>
        </div>

        <div
          data-footer-col
          className="space-y-2.5 text-[15px] md:text-right md:text-[16px]"
        >
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 md:justify-end">
            <Phone className="h-4 w-4 shrink-0 text-sky" />
            <span className="sr-only">Phone:</span>
            {company.phones.map((p, i) => (
              <span key={p} className="flex items-center gap-3">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="hidden text-white/30 md:inline"
                  >
                    ·
                  </span>
                )}
                <a href={telLink(p)} className="link-u whitespace-nowrap">
                  {p}
                </a>
              </span>
            ))}
          </p>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            {/* social icons, to the left of the email */}
            <ul
              className="flex items-center gap-2"
              aria-label="XSpace on social media"
            >
              {social.map(({ platform, label, Icon, url }) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`XSpace Plywood on ${label}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
            <span aria-hidden="true" className="h-5 w-px bg-white/20" />
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-sky" />
              <span className="sr-only">Email:</span>
              <a href={`mailto:${company.email}`} className="link-u">
                {company.email}
              </a>
            </p>
          </div>
          <p className="pt-1 text-[12px] text-white/40">
            © {year} {company.legalName}. All rights reserved.
          </p>
        </div>
      </div>

      {/* giant wordmark: full width, fading down, bottom 5% hidden */}
      <div aria-hidden="true" className="relative mt-auto overflow-hidden pt-4">
        <svg
          viewBox="0 -6 1000 174"
          className="block w-full translate-y-[5%]"
          preserveAspectRatio="xMidYMax meet"
        >
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
            style={{
              fontFamily: "inherit",
              fontWeight: 600,
              fontSize: 240,
              letterSpacing: "-0.02em",
            }}
          >
            XSPACE
          </text>
        </svg>
      </div>
    </footer>
  );
}