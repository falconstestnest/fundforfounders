import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-20 lg:pt-24">
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
