import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-[calc(4.25rem+env(safe-area-inset-top))]">
      <section className="section-pad">
        <div className="container-site max-w-xl text-center">
          <p className="eyebrow">404</p>
          <h1 className="font-display mt-4 text-4xl tracking-tight md:text-5xl">
            Page not found.
          </h1>
          <p className="mt-5 text-stone">
            The page you requested does not exist or has moved.
          </p>
          <Link href="/" className="btn-primary focus-ring mt-8">
            Return home
          </Link>
        </div>
      </section>
    </div>
  );
}
