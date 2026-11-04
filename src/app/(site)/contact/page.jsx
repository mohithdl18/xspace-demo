import { PageIntro } from "@/components/ui/PageIntro";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Mail, Phone, Pin, WhatsApp } from "@/components/ui/Icon";
import { getCompany, getProducts } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { telLink, whatsappLink } from "@/lib/site";
export function generateMetadata() {
  return pageMetadata("/contact", {
    title: "Contact & Request a Quote",
    description: "Contact XSpace Plywood, Hassan.",
  });
}
export default function ContactPage() {
  const c = getCompany();
  const products = getProducts();
  const address = [...c.addressLines, `${c.city}, ${c.region}${c.postalCode ? ` ${c.postalCode}` : ""}`];
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(c.mapEmbedQuery)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapEmbedQuery)}`;
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Let’s talk about your project."
        intro="Request a quotation, ask about a grade, or plan a visit. Our team responds by phone, email or WhatsApp."
      />
      <section className="frame grid gap-14 pb-24 lg:grid-cols-12">
        <aside className="space-y-10 lg:col-span-4" aria-label="Contact details">
          <div>
            <h2 className="eyebrow flex items-center gap-2">
              <Pin /> Address
            </h2>
            <address className="mt-4 not-italic text-[17px] leading-relaxed">
              <strong className="font-medium">{c.name}</strong>
              <br />
              {address.map((l) => (
                <span key={l}>
                  {l}
                  <br />
                </span>
              ))}
            </address>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="link-u mt-3 inline-block text-sm font-medium"
            >
              Open in Google Maps
            </a>
          </div>
          <div>
            <h2 className="eyebrow flex items-center gap-2">
              <Phone /> Call
            </h2>
            <ul className="mt-4 space-y-2 text-[17px]">
              {c.phones.map((p) => (
                <li key={p}>
                  <a href={telLink(p)} className="link-u">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow flex items-center gap-2">
              <Mail /> Email
            </h2>
            <a href={`mailto:${c.email}`} className="link-u mt-4 inline-block text-[17px]">
              {c.email}
            </a>
          </div>
          {c.whatsapp && (
            <a
              href={whatsappLink(c.whatsapp, "Hello XSpace, I'd like a quotation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn w-full bg-[#1F7A4D] text-white before:bg-ink!"
            >
              <WhatsApp className="h-5 w-5" /> Chat on WhatsApp
            </a>
          )}
          {c.hours && <p className="text-[14px] text-ink/65">{c.hours}</p>}
        </aside>
        <div id="quote" className="scroll-mt-28 border border-ink/10 p-6 md:p-10 lg:col-span-8">
          <h2 className="text-h2">Request a quote</h2>
          <p className="mb-8 mt-3 text-[15px] text-ink/65">Fields marked * are required.</p>
          <QuoteForm productOptions={products.map((p) => p.name)} whatsapp={c.whatsapp} phone={c.phones[0]} />
        </div>
      </section>
      <section aria-label="Map" className="relative h-[420px] bg-ice">
        <iframe
          title={`Map showing ${c.name}`}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 grayscale-[0.4]"
        />
      </section>
    </>
  );
}
