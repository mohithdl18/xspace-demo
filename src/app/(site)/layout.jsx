import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Motion } from "@/components/motion/Motion";
import { SawCursor } from "@/components/layout/SawCursor";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransition } from "@/components/motion/PageTransition";
import { CompareProvider } from "@/components/product/CompareContext";
import { CompareTray } from "@/components/product/CompareTray";
import { getBanner, getCategories, getCompany, getProducts } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";
export default function SiteLayout({ children }) {
  const company = getCompany();
  const banner = getBanner();
  const categories = getCategories().map(({ slug, name, summary }) => ({ slug, name, summary }));
  const products = getProducts();
  const productNames = Object.fromEntries(products.map((p) => [p.slug, p.name]));
  const compareIndex = products.map((p) => ({ slug: p.slug, name: p.name, tone: p.tone, imageUrl: p.imageUrl }));
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: company.name,
    url: SITE_URL,
    email: company.email,
    telephone: company.phones,
    foundingDate: String(company.foundedYear),
    slogan: company.tagline,
    parentOrganization: { "@type": "Organization", name: company.poweredBy },
    address: {
      "@type": "PostalAddress",
      streetAddress: company.addressLines.join(", "),
      addressLocality: company.city,
      addressRegion: company.region,
      ...(company.postalCode && { postalCode: company.postalCode }),
      addressCountry: company.country,
    },
    ...(company.logoUrl && { logo: new URL(company.logoUrl, SITE_URL).toString() }),
  };
  return (
    <CompareProvider index={compareIndex}>
      <Header
        categories={categories}
        logoUrl={company.logoUrl}
        banner={banner.enabled && banner.text ? { text: banner.text, href: banner.href } : null}
      />
      <main id="main" tabIndex={-1} className="outline-hidden">
        {children}
      </main>
      <Footer company={company} categories={categories} />
      <CompareTray />
      <WhatsAppButton number={company.whatsapp} productNames={productNames} />
      <SmoothScroll />
      <PageTransition />
      <Motion />
      <SawCursor />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
    </CompareProvider>
  );
}
