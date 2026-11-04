import Link from "next/link";
import { ArrowRight, Download } from "@/components/ui/Icon";
import { SplitWords } from "@/components/ui/SplitWords";
import { StickyDim } from "@/components/motion/StickyDim";
import { WhatsAppCta } from "@/components/home/WhatsAppCta";
import { grainUrl } from "@/lib/grain";
import { whatsappLink } from "@/lib/site";

/**
 * Home — closing contact section. Fills one screen. Heading on the left; on
 * the right a big WhatsApp call-to-action, a Google map and the brochure card.
 * On desktop it stays fixed while the footer rises over its lower half.
 */
export function ContactMain({ company, home, brochure }) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(company.mapEmbedQuery)}&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapEmbedQuery)}`;
  const waNumber = company.phones?.[0] ?? `+${company.whatsapp}`;

  return (
    <section
      id="contact-main"
      aria-labelledby="closing-title"
      className="relative flex min-h-svh w-full items-center bg-white pb-16 pt-28 lg:sticky lg:top-0 lg:py-20 [@media(max-height:780px)]:lg:py-16"
    >
      <div className="frame grid w-full gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* left: heading (unchanged) */}
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>
            Request a quote
          </p>
          <h2 id="closing-title" className="mt-5 text-h1" data-split>
            <SplitWords>{home.closingHeading}</SplitWords>
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink/70" data-reveal>
            {home.closingCopy}
          </p>
        </div>

        {/* right: WhatsApp → map → brochure */}
        <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-5">
          <WhatsAppCta
            href={whatsappLink(company.whatsapp, "Hello XSpace, I'd like a quotation.")}
            number={waNumber}
            className="lg:h-[min(30svh,280px)]"
          />

          {/* <div className="relative h-[200px] overflow-hidden rounded-[24px] bg-ice lg:h-[min(26svh,250px)]">
            <iframe
              title={`Map showing ${company.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[35%]"
              allowFullScreen
            />
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex min-h-[36px] items-center gap-2 rounded-full bg-white px-4 text-[12px] font-medium shadow-[0_6px_16px_-6px_rgba(17,17,17,0.35)] transition-colors hover:bg-ink hover:text-white"
            >
              Open in Google Maps <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div> */}

          <div className="flex items-center gap-5 rounded-[24px] bg-ice p-5">
            <div
              className="relative h-20 w-[60px] shrink-0 rounded-[6px] shadow-[5px_5px_0_#C8E4F4]"
              style={{ backgroundImage: grainUrl("oak", 9), backgroundSize: "cover" }}
              aria-hidden="true"
            >
              <span className="absolute inset-x-1.5 bottom-1.5 text-[6px] font-semibold tracking-[0.2em] text-ink">XSPACE</span>
            </div>
            <div className="min-w-0">
              <p className="text-[16px] font-medium">{brochure?.title ?? "Product brochure"}</p>
              {brochure?.description && <p className="mt-1 text-[13px] text-ink/60">{brochure.description}</p>}
              {brochure?.fileUrl ? (
                <a href={brochure.fileUrl} download className="link-u mt-2 inline-flex items-center gap-2 text-sm font-medium">
                  <Download /> Download brochure{" "}
                  {brochure.fileSize && <span className="text-ink/50">({brochure.fileSize})</span>}
                </a>
              ) : (
                <Link
                  href="/contact?message=Please%20send%20me%20the%20XSpace%20product%20brochure.#quote"
                  className="link-u mt-2 inline-flex items-center gap-2 text-sm font-medium"
                >
                  Request the brochure <ArrowRight />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* darkens slightly as the footer rises over this section */}
      <StickyDim max={0.25} cover="#site-footer" />
    </section>
  );
}
