import Link from "next/link";
/** Brand logo (logoUrl from src/data/company.json); falls back to a typographic mark. */
export function Logo({ logoUrl, inverted = false, className = "", imgClassName = "h-9 w-auto" }) {
  const color = inverted ? "#FFFFFF" : "#111111";
  return (
    <Link href="/" aria-label="XSpace Plywood — home" className={`inline-flex items-center gap-3 leading-none ${className}`}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="XSpace Plywood" className={imgClassName} width={705} height={299} />
      ) : (
        <>
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <rect x="2" y="5" width="26" height="4" fill={color} />
            <rect x="2" y="13" width="26" height="4" fill="#A67C52" />
            <rect x="2" y="21" width="26" height="4" fill={color} />
            <path d="M8 3 L22 27 M22 3 L8 27" stroke={inverted ? "#111" : "#fff"} strokeWidth="2.2" />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="text-[1.05rem] font-semibold tracking-[0.18em]" style={{ color }}>
              XSPACE
            </span>
            <span
              className="mt-1 text-[0.56rem] font-medium tracking-[0.42em]"
              style={{ color: inverted ? "#C8E4F4" : "#694530" }}
            >
              PLYWOOD
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
