import Link from "next/link";
export default function NotFound() {
  return (
    <section className="frame flex min-h-[80svh] flex-col justify-center pb-20 pt-36">
      <p className="eyebrow">404</p>
      <h1 className="mt-6 text-h1">This page isn’t in our catalogue.</h1>
      <p className="mt-5 max-w-lg text-[17px] text-ink/70">
        The link may be outdated. Try the product range or get in touch.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/products" className="btn btn-primary">
          Browse products
        </Link>
        <Link href="/contact" className="btn btn-outline">
          Contact us
        </Link>
      </div>
    </section>
  );
}
