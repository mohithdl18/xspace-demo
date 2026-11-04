/**
 * Content layer. The original site read these from a SQLite database through
 * Drizzle; this version reads the same content from JSON files in src/data,
 * so the site needs no database or server-side storage. The function names and
 * return shapes match the original, so pages and components are unchanged.
 *
 * Edit content in src/data/*.json, then rebuild.
 */
import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import documentsData from "@/data/documents.json";
import faqsData from "@/data/faqs.json";
import insightsData from "@/data/insights.json";
import processData from "@/data/process-steps.json";
import applicationsData from "@/data/applications.json";
import pageSeoData from "@/data/page-seo.json";
import companyData from "@/data/company.json";
import homeData from "@/data/home.json";
import bannerData from "@/data/banner.json";
import { defaultBanner, defaultCompany, defaultHome } from "./site-defaults";

const bySort = (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim()) : []);
const specs = (v) =>
  Array.isArray(v)
    ? v.filter((s) => s && typeof s.label === "string" && typeof s.value === "string" && s.label.trim())
    : [];

export const getCompany = () => ({ ...defaultCompany, ...companyData });
export const getHome = () => ({ ...defaultHome, ...homeData });
export const getBanner = () => ({ ...defaultBanner, ...bannerData });

export function getCategories() {
  return [...categoriesData].sort((a, b) => bySort(a, b) || a.name.localeCompare(b.name));
}

const categoryMap = () => Object.fromEntries(getCategories().map((c, i) => [c.slug, { ...c, order: i }]));

function toView(p, category) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    grade: p.grade || "",
    gradeLabel: p.gradeLabel || "",
    tagline: p.tagline || "",
    description: p.description || "",
    thicknesses: list(p.thicknesses),
    applications: list(p.applications),
    benefits: list(p.benefits),
    technologies: list(p.technologies),
    specs: specs(p.specs),
    imageUrl: p.imageUrl || "",
    imageAlt: p.imageAlt || p.name,
    tone: p.tone || "birch",
    featured: !!p.featured,
    verified: !!p.verified,
    seoTitle: p.seoTitle || "",
    seoDescription: p.seoDescription || "",
    updatedAt: p.updatedAt || "",
    category: category ? { slug: category.slug, name: category.name } : { slug: "", name: "" },
  };
}

export function getProducts(opts = {}) {
  const cats = categoryMap();
  return productsData
    .filter((p) => p.published !== false && cats[p.category] && (!opts.featured || p.featured))
    .sort(
      (a, b) =>
        cats[a.category].order - cats[b.category].order || bySort(a, b) || a.name.localeCompare(b.name),
    )
    .map((p) => toView(p, cats[p.category]));
}

export function getProduct(slug) {
  return getProducts().find((p) => p.slug === slug) ?? null;
}

export function getRelated(productId, categorySlug, limit = 3) {
  return getProducts()
    .filter((p) => p.id !== productId)
    .sort((a, b) => Number(b.category.slug === categorySlug) - Number(a.category.slug === categorySlug))
    .slice(0, limit);
}

export function getDocuments(productId) {
  const slug = productId ? productsData.find((p) => p.id === productId)?.slug : null;
  return documentsData
    .filter((d) => d.published !== false && (!productId || d.productSlug === slug))
    .sort(bySort)
    .map((d) => ({ ...d, productId: d.productSlug ? productsData.find((p) => p.slug === d.productSlug)?.id ?? null : null }));
}

export function getBrochure() {
  return getDocuments().find((d) => d.kind === "brochure");
}

export const getFaqs = () => faqsData.filter((f) => f.published !== false).sort(bySort);

export const getInsights = () =>
  insightsData
    .filter((i) => i.published)
    .sort((a, b) => String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? "")));
export const getInsight = (slug) => getInsights().find((i) => i.slug === slug);

export const getProcessSteps = () => [...processData].sort(bySort);

export function getApplications() {
  return [...applicationsData]
    .sort(bySort)
    .map((a) => ({ ...a, uses: list(a.uses), productSlugs: list(a.productSlugs) }));
}

export function getSeo(path) {
  return pageSeoData.find((s) => s.path === path);
}
