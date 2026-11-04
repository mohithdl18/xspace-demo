"use client";
import { useEffect } from "react";
import { useCompare } from "./CompareContext";
/** Keeps the stored comparison in step with a shared /compare?items= link. */
export function CompareSync({ slugs }) {
  const { slugs: current, clear, toggle } = useCompare();
  const key = slugs.join(",");
  useEffect(() => {
    if (current.join(",") === key) return;
    // run after the provider has restored saved state
    const t = setTimeout(() => {
      clear();
      key
        .split(",")
        .filter(Boolean)
        .forEach((s) => toggle(s));
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}
