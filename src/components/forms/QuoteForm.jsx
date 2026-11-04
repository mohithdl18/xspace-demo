"use client";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AUDIENCES, QUANTITY_UNITS, whatsappLink } from "@/lib/site";
import { ArrowRight, Check } from "@/components/ui/Icon";
import company from "@/data/company.json";
export function QuoteForm({
  productOptions,
  defaultProduct = "",
  thicknessOptions = [],
  whatsapp,
  phone,
  compact = false,
}) {
  const pathname = usePathname();
  const uid = useId();
  const formRef = useRef(null);
  const statusRef = useRef(null);
  const [state, setState] = useState({ kind: "idle" });
  const [product, setProduct] = useState(defaultProduct);
  const [audience, setAudience] = useState("homeowner");
  // Prefill from ?product= / ?audience= (read client-side so the page can stay static)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const a = q.get("audience");
    if (a && AUDIENCES.some((x) => x.value === a)) setAudience(a);
    const p = q.get("product");
    if (!defaultProduct && p && productOptions.includes(p)) setProduct(p);
    const m = q.get("message");
    const field = formRef.current?.elements.namedItem("message");
    if (m && field instanceof HTMLTextAreaElement && !field.value) field.value = m.slice(0, 500);
  }, [defaultProduct, productOptions]);
  const fe = state.kind === "error" ? (state.fieldErrors ?? {}) : {};
  const id = (n) => `${uid}-${n}`;
  const err = (n) => (fe[n] ? { "aria-invalid": true, "aria-describedby": id(`${n}-err`) } : {});
  // No server: validate in the browser (same rules as the original API), then
  // hand the finished enquiry to WhatsApp or email so it reaches the team.
  function validate(d) {
    const errors = {};
    const t = (k) => String(d[k] ?? "").trim();
    if (t("website")) return { spam: true };
    if (t("name").length < 2) errors.name = "Please enter your name.";
    else if (t("name").length > 120) errors.name = "Please keep this under 120 characters.";
    if (!/^\+?\d{10,15}$/.test(t("phone").replace(/[\s()-]/g, "")))
      errors.phone = "Please enter a valid phone number (10–15 digits).";
    if (t("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t("email"))) errors.email = "Please enter a valid email address.";
    if (t("location").length < 2) errors.location = "Please tell us your city or project location.";
    if (t("quantity") && !/^\d+(\.\d+)?$/.test(t("quantity"))) errors.quantity = "Quantity should be a number.";
    if (t("message").length > 2000) errors.message = "Please keep this under 2000 characters.";
    return { errors };
  }
  function compose(d) {
    const audienceLabel = AUDIENCES.find((a) => a.value === d.audience)?.label || d.audience;
    const qty = d.quantity ? `${d.quantity} ${d.quantityUnit || ""}`.trim() : "";
    const lines = [
      "Hello XSpace, I'd like a quotation.",
      "",
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      d.email ? `Email: ${d.email}` : null,
      `Location: ${d.location}`,
      `I am a: ${audienceLabel}`,
      d.productInterest ? `Product: ${d.productInterest}` : null,
      d.thickness ? `Thickness: ${d.thickness}` : null,
      qty ? `Quantity: ${qty}` : null,
      d.message ? `Message: ${d.message}` : null,
      "",
      `Sent from: ${pathname}`,
    ];
    return lines.filter((l) => l !== null).join("\n");
  }
  function onSubmit(e) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries());
    const d = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v).trim()]));
    const { spam, errors } = validate(d);
    if (spam) return;
    if (errors && Object.keys(errors).length) {
      setState({ kind: "error", message: "Please check the highlighted fields.", fieldErrors: errors });
    } else {
      const text = compose(d);
      const subject = `Quotation request${d.productInterest ? ` – ${d.productInterest}` : ""} – ${d.name}`;
      setState({
        kind: "success",
        text,
        whatsappHref: whatsapp ? whatsappLink(whatsapp, text) : "",
        emailHref: `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
      });
      formRef.current?.reset();
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }
  if (state.kind === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="border border-ink/10 bg-white p-8 outline-hidden md:p-12"
      >
        <span className="flex h-12 w-12 items-center justify-center bg-sky">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 text-h3">Your enquiry is ready — send it to our team.</h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/70">
          Choose how you’d like to send it. Your details are already filled in; just press send.
          {phone && (
            <>
              {" "}
              For anything urgent, call{" "}
              <a className="link-u font-medium text-ink" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                {phone}
              </a>
              .
            </>
          )}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {state.whatsappHref && (
            <a className="btn btn-primary" href={state.whatsappHref} target="_blank" rel="noopener noreferrer">
              Send on WhatsApp <ArrowRight />
            </a>
          )}
          <a className={`btn ${state.whatsappHref ? "btn-outline" : "btn-primary"}`} href={state.emailHref}>
            Send by email
          </a>
        </div>
        <button
          type="button"
          className="link-u mt-8 text-sm text-ink/70"
          onClick={() => setState({ kind: "idle" })}
        >
          Start a new enquiry
        </button>
      </div>
    );
  }
  const submitting = state.kind === "submitting";
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="bg-white"
      aria-describedby={state.kind === "error" ? id("status") : undefined}
    >
      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={`grid gap-5 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
        <div className="field">
          <label htmlFor={id("name")}>Name *</label>
          <input id={id("name")} name="name" required autoComplete="name" className="input" {...err("name")} />
          {fe.name && (
            <p id={id("name-err")} className="field-error">
              {fe.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor={id("phone")}>Phone *</label>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91"
            className="input"
            {...err("phone")}
          />
          {fe.phone && (
            <p id={id("phone-err")} className="field-error">
              {fe.phone}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor={id("email")}>Email</label>
          <input id={id("email")} name="email" type="email" autoComplete="email" className="input" {...err("email")} />
          {fe.email && (
            <p id={id("email-err")} className="field-error">
              {fe.email}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor={id("location")}>City / project location *</label>
          <input
            id={id("location")}
            name="location"
            required
            autoComplete="address-level2"
            className="input"
            {...err("location")}
          />
          {fe.location && (
            <p id={id("location-err")} className="field-error">
              {fe.location}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor={id("audience")}>I am a</label>
          <select
            id={id("audience")}
            name="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="input"
          >
            {AUDIENCES.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={id("product")}>Product of interest</label>
          <select
            id={id("product")}
            name="productInterest"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="input"
          >
            <option value="">Not sure yet / multiple</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={id("thickness")}>Thickness</label>
          {thicknessOptions.length > 0 ? (
            <select id={id("thickness")} name="thickness" defaultValue="" className="input">
              <option value="">Select thickness</option>
              {thicknessOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="Multiple">Multiple thicknesses</option>
            </select>
          ) : (
            <input
              id={id("thickness")}
              name="thickness"
              placeholder="e.g. 18mm"
              className="input"
              {...err("thickness")}
            />
          )}
        </div>
        <div className="grid grid-cols-[1fr_1.1fr] gap-3">
          <div className="field">
            <label htmlFor={id("quantity")}>Quantity</label>
            <input id={id("quantity")} name="quantity" inputMode="decimal" className="input" {...err("quantity")} />
            {fe.quantity && (
              <p id={id("quantity-err")} className="field-error">
                {fe.quantity}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor={id("unit")}>Unit</label>
            <select id={id("unit")} name="quantityUnit" defaultValue="Sheets" className="input">
              {QUANTITY_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor={id("message")}>Message</label>
          <textarea
            id={id("message")}
            name="message"
            rows={compact ? 3 : 4}
            className="input resize-y"
            placeholder="Application, timeline, delivery location…"
            {...err("message")}
          />
          {fe.message && (
            <p id={id("message-err")} className="field-error">
              {fe.message}
            </p>
          )}
        </div>
      </div>

      <div ref={statusRef} tabIndex={-1} id={id("status")} aria-live="assertive" className="outline-hidden">
        {state.kind === "error" && (
          <p
            role="alert"
            className="mt-6 border-l-2 border-[#B42318] bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#912018]"
          >
            {state.message}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? "Sending…" : "Send enquiry"} {!submitting && <ArrowRight />}
        </button>
        {whatsapp && (
          <a
            className="link-u text-sm text-ink/70"
            target="_blank"
            rel="noopener noreferrer"
            href={whatsappLink(whatsapp, `Hello XSpace, I'd like a quotation${product ? ` for ${product}` : ""}.`)}
          >
            Prefer WhatsApp?
          </a>
        )}
      </div>
      <p className="mt-4 text-[12px] text-ink/50">We use these details only to respond to your enquiry.</p>
    </form>
  );
}
