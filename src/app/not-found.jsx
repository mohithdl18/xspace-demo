import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
export default function RootNotFound() {
  return (
    <main className="frame flex min-h-svh flex-col justify-center py-20">
      <Logo />
      <p className="eyebrow mt-16">404</p>
      <h1 className="mt-6 text-h1">This page isn’t in our catalogue.</h1>
      <p className="mt-5 max-w-lg text-[17px] text-cream/70">
        The link may be outdated. Try the product range or get in touch.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/products" className="btn btn-primary">
          Browse products
        </Link>
        <Link href="/" className="btn btn-outline">
          Home
        </Link>
      </div>
    </main>
  );
}
