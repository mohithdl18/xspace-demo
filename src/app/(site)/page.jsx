import { Hero } from "@/components/home/Hero";
import { pageMetadata } from "@/lib/seo";
import {
  getApplications,
  getBrochure,
  getCategories,
  getCompany,
  getHome,
  getProcessSteps,
  getProducts,
} from "@/lib/queries";
import { AboutMain } from "@/components/home/AboutMain";
import { CollectionMain } from "@/components/home/CollectionMain";
import { ProcessMain } from "@/components/home/ProcessMain";
import { SpacesMain } from "@/components/home/SpacesMain";
import { WorkWithUs } from "@/components/home/WorkWithUs";
import { ContactAnchor } from "@/components/home/ContactAnchor";
import { ContactMain } from "@/components/home/ContactMain";
export function generateMetadata() {
  return pageMetadata("/", {
    title: "XSpace Plywood — Premium Plywood & Interior Materials Since 1959",
    description:
      "Premium plywood, blockboard and interior materials from Hassan, Karnataka. Powered by C Nanjappa Timbers.",
  });
}
export default function Home() {
  const home = getHome();
  const company = getCompany();
  const featured = getProducts({ featured: true });
  const allProducts = getProducts();
  const categories = getCategories();
  const steps = getProcessSteps();
  const apps = getApplications();
  const brochure = getBrochure();
  const years = new Date().getFullYear() - company.foundedYear;
  return (
    <>
      <Hero eyebrow={home.heroEyebrow} headline={home.heroHeadline} copy={home.heroCopy} imageUrl={home.heroImageUrl} />

      {/* Everything after the hero slides up over it (the hero is sticky) */}
      <div className="relative z-10 rounded-t-[28px] bg-base shadow-[0_-28px_60px_-18px_rgba(17,17,17,0.5)] md:rounded-t-[44px]">

      <AboutMain company={company} home={home} years={years} categoryCount={categories.length} />

      {/* Everything from here slides up over the (sticky) About section */}
      <div className="relative z-10 rounded-t-[28px] bg-base md:rounded-t-[44px]">
      <CollectionMain featured={featured} />

      {/* Everything from here slides up over the (sticky) collection */}
      <div className="relative z-10">
      {/* scroll hold: the collection stays fully on screen for a moment before
          the manufacturing section starts to rise (transparent spacer) */}
      <div aria-hidden="true" className="h-[70svh]" />
      <ProcessMain steps={steps} />

      {/* the rest of the page sits on white */}
      <div className="relative bg-base">

      {/* ── Applications ───────────────────────────────────── */}
      <SpacesMain apps={apps} products={allProducts} />

      {/* Everything from here slides up over the (sticky) applications section */}
      <div className="relative z-10">
      {/* ── Work with us ──────────────────────────────────── */}
      <WorkWithUs />

      {/* ── Contact (fixed on desktop while the footer rises over it) ── */}
      <ContactAnchor />
      <ContactMain company={company} home={home} brochure={brochure} />
      {/* space the footer rises into (see globals.css: footer overlap) */}
      <div data-footer-reveal aria-hidden="true" className="h-[50svh]" />
      </div>
      </div>
      </div>
      </div>
      </div>
    </>
  );
}
