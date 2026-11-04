import { getProducts } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";
export default function sitemap() {
  const pages = ["", "/about", "/products", "/faq", "/contact"].map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.8,
  }));
  const products = getProducts().map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.7,
  }));
  return [...pages, ...products];
}
