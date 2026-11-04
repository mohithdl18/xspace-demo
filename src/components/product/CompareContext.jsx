"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
export const MAX_COMPARE = 3;
const CompareCtx = createContext(null);
const KEY = "xspace-compare";
export function CompareProvider({ index, children }) {
  const [slugs, setSlugs] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setSlugs(saved.filter((s) => index.some((i) => i.slug === s)).slice(0, MAX_COMPARE));
    } catch {
      /* storage unavailable */
    }
  }, [index]);
  const persist = (next) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    return next;
  };
  const toggle = useCallback((slug) => {
    setSlugs((cur) => {
      if (cur.includes(slug)) {
        setMessage("Removed from comparison.");
        return persist(cur.filter((s) => s !== slug));
      }
      if (cur.length >= MAX_COMPARE) {
        setMessage(`You can compare up to ${MAX_COMPARE} products. Remove one first.`);
        return cur;
      }
      setMessage("Added to comparison.");
      return persist([...cur, slug]);
    });
  }, []);
  const remove = useCallback((slug) => setSlugs((cur) => persist(cur.filter((s) => s !== slug))), []);
  const clear = useCallback(() => setSlugs(persist([])), []);
  const value = useMemo(
    () => ({
      slugs,
      items: slugs.map((s) => index.find((i) => i.slug === s)).filter(Boolean),
      toggle,
      remove,
      clear,
      has: (s) => slugs.includes(s),
      full: slugs.length >= MAX_COMPARE,
      message,
    }),
    [slugs, index, toggle, remove, clear, message],
  );
  return <CompareCtx.Provider value={value}>{children}</CompareCtx.Provider>;
}
export function useCompare() {
  const ctx = useContext(CompareCtx);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
