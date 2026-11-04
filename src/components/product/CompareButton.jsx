"use client";
import { useCompare } from "./CompareContext";
import { Check, Plus } from "@/components/ui/Icon";
export function CompareButton({ slug, name, className = "" }) {
  const { has, toggle, full } = useCompare();
  const active = has(slug);
  const disabled = !active && full;
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from comparison` : `Add ${name} to comparison`}
      title={disabled ? "You can compare up to 3 products" : undefined}
      className={`inline-flex min-h-[40px] items-center gap-2 border px-3 text-[12px] font-medium transition-colors ${active ? "border-ink bg-ink text-white" : "border-ink/20 bg-white/90 text-ink hover:border-ink"} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {active ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      {active ? "Comparing" : "Compare"}
    </button>
  );
}
