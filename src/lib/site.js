export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export function whatsappLink(number, message) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
export const telLink = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const NAV = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];
export const AUDIENCES = [
  { value: "homeowner", label: "Homeowner" },
  { value: "architect", label: "Architect" },
  { value: "designer", label: "Interior designer" },
  { value: "contractor", label: "Contractor / builder" },
  { value: "dealer", label: "Dealer / distributor" },
  { value: "other", label: "Other" },
];
export const QUANTITY_UNITS = ["Sheets", "Sq. ft", "Cubic ft", "Pieces", "Not sure yet"];
