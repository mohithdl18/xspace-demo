/**
 * Default editable site content. Seeded into the `settings` table and used as a
 * fallback at runtime. Everything here was verified against xspaceply.com
 * (Nov 2026) unless marked `// UNVERIFIED`.
 */
export const defaultCompany = {
  name: "XSpace Plywood",
  legalName: "XSpace Plywood",
  poweredBy: "C Nanjappa Timbers",
  foundedYear: 1959,
  tagline: "Premium Quality. Built to Last.",
  addressLines: ["Plot No. 209 G, KIADB Industrial Area", "Hosakoppalu"],
  city: "Hassan",
  region: "Karnataka",
  postalCode: "573201", // UNVERIFIED on xspaceply.com — from public directory listing for the same plot
  country: "IN",
  phones: ["+91 94487 47744", "+91 96863 48614", "+91 95916 25894"],
  whatsapp: "919448747744", // UNVERIFIED which number is on WhatsApp — confirm in Admin → Settings
  email: "info@xspaceply.com",
  hours: "",
  mapEmbedQuery: "Plot No. 209 G, KIADB Industrial Area, Hosakoppalu, Hassan, Karnataka",
  social: [],
  logoUrl: "",
};
export const defaultHome = {
  heroEyebrow: "Since 1959 · Powered by C Nanjappa Timbers",
  heroHeadline: "Premium Quality. Built to Last.",
  heroCopy:
    "Plywood, blockboard and interior materials from Hassan — engineered in clear grades so architects, builders and homeowners can specify with confidence.",
  heroImageUrl: "",
  introHeading: "A legacy of trust, layered over six decades.",
  introBody:
    "XSpace Plywood is powered by C Nanjappa Timbers, with a heritage that began in 1959. We combine carefully sourced timber with modern pressing and preservation technology, so every sheet is built for consistency, precision and long service.",
  closingHeading: "Planning a project? Let’s specify it properly.",
  closingCopy:
    "Tell us the grade, thickness and quantity you need. Our team will come back with availability and a quotation.",
};
export const defaultBanner = { enabled: false, text: "", href: "" };
export const SETTINGS_KEYS = { company: "company", home: "home", banner: "banner" };
