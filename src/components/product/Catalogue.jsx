"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ProductCard } from "./ProductCard";
import { Search, Close } from "@/components/ui/Icon";
const EMPTY = { q: "", category: "", grade: "", thickness: "", application: "" };
const uniq = (xs) => [...new Set(xs.filter(Boolean))];
const mm = (t) => parseFloat(t) || 0;
export function CatalogueWithParams(props) {
  const sp = useSearchParams();
  const initial = {
    q: sp.get("q") || "",
    category: sp.get("category") || "",
    grade: sp.get("grade") || "",
    thickness: sp.get("thickness") || "",
    application: sp.get("application") || "",
  };
  return <Catalogue {...props} initial={initial} syncUrl />;
}
export function Catalogue({ products, categories, initial = EMPTY, syncUrl = false }) {
  const [f, setF] = useState(initial);
  const [, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const lastWritten = useRef(JSON.stringify(initial));
  // Adopt URL changes that came from elsewhere (e.g. header category links), not our own writes.
  const initialKey = JSON.stringify(initial);
  useEffect(() => {
    if (initialKey !== lastWritten.current) {
      lastWritten.current = initialKey;
      setF(JSON.parse(initialKey));
    }
  }, [initialKey]);
  const options = useMemo(
    () => ({
      grades: uniq(products.map((p) => p.grade)).sort(),
      thicknesses: uniq(products.flatMap((p) => p.thicknesses)).sort((a, b) => mm(a) - mm(b)),
      applications: uniq(products.flatMap((p) => p.applications)).sort(),
    }),
    [products],
  );
  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!f.category || p.category.slug === f.category) &&
        (!f.grade || p.grade === f.grade) &&
        (!f.thickness || p.thicknesses.includes(f.thickness)) &&
        (!f.application || p.applications.includes(f.application)) &&
        (!q ||
          [
            p.name,
            p.grade,
            p.gradeLabel,
            p.tagline,
            p.description,
            p.category.name,
            ...p.applications,
            ...p.technologies,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q)),
    );
  }, [products, f]);
  const update = (patch) => {
    const next = { ...f, ...patch };
    setF(next);
    if (syncUrl) {
      lastWritten.current = JSON.stringify(next);
      const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v)).toString();
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    }
  };
  const active = Object.values(f).some(Boolean);
  const select = (k, label, opts, labels) => (
    <div className="field min-w-0">
      <label htmlFor={`f-${k}`}>{label}</label>
      <select id={`f-${k}`} className="input" value={f[k]} onChange={(e) => update({ [k]: e.target.value })}>
        <option value="">All</option>
        {opts.map((o) => (
          <option key={o} value={o}>
            {labels?.[o] ?? o}
          </option>
        ))}
      </select>
    </div>
  );
  return (
    <div>
      {/* <div role="search" className="grid gap-4 border-y border-cream/10 py-6 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="field">
          <label htmlFor="f-q">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/50" />
            <input
              id="f-q"
              type="search"
              className="input pl-11!"
              placeholder="Product, grade or use"
              value={f.q}
              onChange={(e) => update({ q: e.target.value })}
            />
          </div>
        </div>
        {select(
          "category",
          "Category",
          categories.map((c) => c.slug),
          Object.fromEntries(categories.map((c) => [c.slug, c.name])),
        )}
        {select("grade", "Grade", options.grades)}
        {select("thickness", "Thickness", options.thicknesses)}
        {select("application", "Application", options.applications)}
      </div>

      <div className="flex min-h-[56px] items-center justify-between gap-4 py-4">
        <p className="text-[14px] text-cream/65" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "product" : "products"}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => update(EMPTY)}
            className="inline-flex min-h-[44px] items-center gap-1.5 text-[13px] font-medium"
          >
            <Close className="h-4 w-4" /> Clear filters
          </button>
        )}
      </div> */}

      {results.length ? (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <ProductCard key={p.slug} p={p} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="bg-panel px-8 py-16 text-center">
          <p className="text-h3">No products match those filters.</p>
          <p className="mt-2 text-[15px] text-cream/65">
            Thickness and application filters only cover products with published specifications.
          </p>
          <button type="button" onClick={() => update(EMPTY)} className="btn btn-outline mt-6">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
