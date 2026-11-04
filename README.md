# XSpace Plywood — Website

A copy of the XSpace Plywood public website, rebuilt on:

**Next.js 16 (App Router) · JavaScript (JSX) · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Poppins (self-hosted via @fontsource)**

Same pages, layout, content, procedural plywood renders and GSAP motion as the original. The original's admin studio, SQLite database, login and enquiry email server are not included. Content lives in JSON files and there is no backend.

## Run

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Set the canonical domain before building:

```bash
NEXT_PUBLIC_SITE_URL=https://www.xspaceply.com npm run build
```

## Pages

| Route | What it is |
|---|---|
| `/` | Hero, heritage, collection, scroll-driven exploded-ply story, technology, process, applications, audience pathways, brochure, closing enquiry |
| `/about` | Heritage, sourcing, values |
| `/products` | Catalogue with search and filters (category, grade, thickness, application), synced to the URL |
| `/products/[slug]` | Specs, thicknesses, benefits, applications, documents, related products, prefilled quote form, WhatsApp |
| `/compare?items=a,b,c` | Side-by-side comparison of up to 3 products |
| `/manufacturing` | Scroll sequence where the sheet assembles stage by stage |
| `/applications` | Application areas linked to products |
| `/resources`, `/resources/insights/[slug]` | Downloads, FAQs, insights |
| `/contact` | Address, phones, email, WhatsApp, map, quote form |
| SEO | `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, plus structured data |

## Editing content

Edit the files in `src/data/`, then rebuild. The field names match the original admin studio.

| File | Controls |
|---|---|
| `company.json` | Name, address, phones, WhatsApp number, email, hours, social links, logo |
| `home.json` | Homepage hero and section copy, hero photo |
| `banner.json` | Announcement banner (`enabled`, `text`, `href`) |
| `categories.json` | Product categories and their order |
| `products.json` | Products: grade, tagline, description, thicknesses, applications, benefits, technologies, specs, image, render tone, featured, verified, published, SEO |
| `documents.json` | Brochures and data sheets (`fileUrl` points to a PDF in `/public`) |
| `faqs.json`, `insights.json` | FAQs and articles (an insight shows only when `"published": true`) |
| `process-steps.json` | Manufacturing stages |
| `applications.json` | Application areas, uses, linked product slugs, image |
| `page-seo.json` | Per-page title, description and share image |

The content rules from the original still apply:
- Leave an unknown spec out instead of guessing. The site shows "To be confirmed — ask our team".
- A product with `"verified": false` shows a notice on its page.
- A product with an empty `imageUrl` shows a procedural render labelled "Illustrative render". To use a photo, put it in `public/images/products/` and set `"imageUrl": "/images/products/your-photo.jpg"`.
- Application images are labelled as inspiration unless `"imageIsInspiration": false`.

## Quote form

The original saved enquiries to a database and emailed the team. With no server, the form now:

1. Validates in the browser, using the same rules as the original.
2. Shows a confirmation with two buttons, **Send on WhatsApp** and **Send by email**. Both open with the full enquiry already written: name, phone, location, role, product, thickness, quantity, message and the page it came from.

The messages go to `whatsapp` and `email` in `company.json`. If you later want enquiries saved to a database, point the form's `onSubmit` in `src/components/forms/QuoteForm.jsx` at an API route.

## Motion

Everything from the original, plus extra motion. All of it is driven by data attributes, so you can add it to any new element.

| Effect | How it's applied | Where it's used now |
|---|---|---|
| Hero intro: words, copy, plies drop in, stack drifts on scroll | `Hero.jsx` | Home |
| Pinned exploded-ply story / manufacturing sequence | `ExplodedPly.jsx`, `ProcessSequence.jsx` | Home, Manufacturing (desktop) |
| Fade + rise on scroll | `data-reveal`, `data-reveal-stagger` | Every page |
| **Headline words slide up out of masks** | `<h2 data-split><SplitWords>Text</SplitWords></h2>` | All page titles and section headings |
| **Visual wipes open, contents settle from a zoom** | `data-reveal-img` (`="down"` wipes from the top); photos or `[data-reveal-scale]` children zoom | Product cards, product page, About render, Applications, page-intro panels |
| **Photo drifts inside its frame** | `data-parallax-img` on an overflow-hidden frame | Applications, manufacturing photos |
| **Wood-grain texture drifts** | `data-parallax-bg="140"` (pixels) | "1959" lettering, page-intro panels, application textures |
| Element drift | `data-parallax="0.06"` | Home collection |
| **Walnut page-transition wipe** | Automatic for every internal link (`PageTransition.jsx`); add `data-no-transition` to opt a link out | Site-wide |
| **Smooth accordion open/close** | Automatic for any `<details>` inside `<main>` | Resources FAQs |
| Scroll cue nudge, button sweeps, link underlines, sticky header | CSS | Site-wide |
| Lenis smooth scrolling | `SmoothScroll.jsx`, synced to GSAP's ticker; pauses while the mobile menu is open | Site-wide |

- Parallax runs only on desktop (1024px and wider), to keep phones light.
- Visitors who prefer reduced motion get no animation, no Lenis and no page wipe. Everything is shown immediately.
- Without JavaScript, all content is visible. The hero auto-reveals after 2.5s if scripts fail.

## Items to confirm

These were already flagged in the original:

1. WhatsApp number: currently set to +91 94487 47744.
2. PIN code 573201: taken from a public directory listing.
3. BWP Elite & Prime 710: full benefits, applications and spec sheet still needed.
4. MR Value – Accurate 16mm: confirm its application list.
5. Other categories (blockboard, doors, MDF, laminates, PVC foam boards, particle boards, timber) are marked not verified.
6. Manufacturing stage sequence: confirm it, and add factory photos.
7. Brochure PDF, logo, product and factory photography are still needed.
8. Business hours and social links are empty in `company.json`.

## Structure

```
src/
  app/(site)/        public pages
  app/               root layout, globals.css (Tailwind 4 @theme), sitemap, robots, OG image, icon
  components/        layout, home, product, forms, pages, motion, ui
  data/              all site content (JSON)
  lib/               queries (JSON content layer), seo, site helpers, grain textures, technologies, lenis
```
