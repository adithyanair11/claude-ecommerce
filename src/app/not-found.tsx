import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container-prose section-y flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <p className="eyebrow text-muted">Error 404</p>
      <h1 className="text-headline">This page could not be found</h1>
      <p className="text-body text-muted">
        The piece or page you were looking for may have moved or is no longer
        available.
      </p>
      <Link href="/" className="btn btn-primary mt-2">
        Return to the homepage
      </Link>
    </main>
  );
}
