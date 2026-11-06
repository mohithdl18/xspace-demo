"use client";
import { usePathname } from "next/navigation";
import { WhatsApp } from "@/components/ui/Icon";
import { whatsappLink } from "@/lib/site";

/**
 * Floating WhatsApp button (every page). A green circle; on hover or keyboard
 * focus a label rises above it. The pre-filled message reflects the page
 * being viewed (on a product page it names the product).
 */
export function WhatsAppButton({ number, productNames }) {
  const pathname = usePathname();
  if (!number) return null;
  const slug = pathname.startsWith("/products/") ? pathname.split("/")[2] : "";
  const product = slug ? productNames[slug] : "";
  const msg = product
    ? `Hello XSpace, I'd like a quotation for ${product}. Thickness: ___ Quantity: ___ Location: ___`
    : "Hello XSpace, I'd like to know more about your products.";
  const label = product ? `Ask about ${product}` : "Chat on WhatsApp";

  return (
    <a
      href={whatsappLink(number, msg)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={product ? `Ask about ${product} on WhatsApp` : "Chat with XSpace on WhatsApp"}
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1F7A4D] text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.55)] transition-[transform,background-color] duration-300 ease-out hover:scale-105 hover:bg-[#1A6B43] focus-visible:scale-105 md:bottom-6 md:right-6 md:h-16 md:w-16"
    >
      {/* soft ring that pulses gently behind the button */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#1F7A4D] opacity-40 animate-[wa-pulse_2.8s_ease-out_infinite]"
      />
      <WhatsApp className="relative h-7 w-7 md:h-8 md:w-8" />

      {/* label that rises above the circle on hover / focus */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-full right-0 mb-3 translate-y-2 whitespace-nowrap rounded-full bg-deep px-4 py-2 text-[13px] font-medium text-white opacity-0 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.5)] transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {label}
        <span className="absolute -bottom-1 right-6 h-2.5 w-2.5 rotate-45 bg-deep md:right-7" />
      </span>
    </a>
  );
}
