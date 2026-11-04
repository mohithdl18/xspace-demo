"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "./CompareContext";
import { grainUrl } from "@/lib/grain";
import { Close } from "@/components/ui/Icon";
export function CompareTray() {
  const { items, remove, clear, message } = useCompare();
  const pathname = usePathname();
  const hidden = items.length === 0 || pathname === "/compare";
  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        {message}
      </p>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur-md transition-[transform,visibility] duration-500 ease-out ${hidden ? "invisible translate-y-full" : "visible translate-y-0"}`}
        aria-hidden={hidden}
        inert={hidden}
      >
        <div className="frame flex flex-wrap items-center gap-3 py-3 pr-20 sm:flex-nowrap sm:gap-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink/60">Compare · {items.length}/3</p>
          <ul className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
            {items.map((i) => (
              <li key={i.slug} className="flex shrink-0 items-center gap-2 border border-ink/10 py-1 pl-1 pr-1">
                <span
                  className="h-8 w-8 shrink-0"
                  style={{ backgroundImage: grainUrl(i.tone), backgroundSize: "cover" }}
                  aria-hidden="true"
                />
                <span className="max-w-[140px] truncate text-[13px]">{i.name}</span>
                <button
                  type="button"
                  onClick={() => remove(i.slug)}
                  className="flex h-8 w-8 items-center justify-center text-ink/60 hover:text-ink"
                  aria-label={`Remove ${i.name} from comparison`}
                >
                  <Close className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={clear} className="min-h-[44px] px-3 text-[13px] text-ink/60 hover:text-ink">
              Clear
            </button>
            <Link
              href={`/compare?items=${items.map((i) => i.slug).join(",")}`}
              className="btn btn-primary min-h-[44px]!"
            >
              Compare
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
