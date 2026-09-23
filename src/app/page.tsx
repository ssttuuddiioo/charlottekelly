import Link from "next/link";

// Holding page. The real combined home + about arrives in phase 7.
export default function Home() {
  return (
    <main className="mx-auto max-w-page px-s py-3xl">
      <div className="max-w-measure">
        <h1 className="text-display">Charlotte Kelly</h1>
        <p className="mt-m font-sans text-small uppercase tracking-wide text-ink-muted">
          Copywriter &amp; Associate Creative Director
        </p>
        <p className="mt-l text-lead">
          Site in progress. Phase 1 of 10 &mdash; design tokens only.
        </p>
        <p className="mt-m">
          <Link href="/styleguide">Review the token specimen</Link>
        </p>
      </div>
    </main>
  );
}
