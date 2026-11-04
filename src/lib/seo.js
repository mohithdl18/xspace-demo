import { getSeo } from "./queries";
import { SITE_URL } from "./site";
export function pageMetadata(path, fallback) {
  const row = getSeo(path);
  const title = row?.title || fallback.title;
  const description = row?.description || fallback.description;
  const images = row?.ogImage ? [{ url: row.ogImage }] : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "XSpace Plywood",
      type: "website",
      ...(images && { images }),
    },
    twitter: { card: "summary_large_image", title, description, ...(images && { images }) },
  };
}
