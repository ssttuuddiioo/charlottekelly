import type { Metadata } from "next";
import Link from "next/link";
import { VersionSkeleton } from "@/components/site/VersionSkeleton";
import { VERSIONS } from "@/lib/versions";

export const metadata: Metadata = {
  title: "Templates — Charlotte Kelly",
  description: "The same work, laid out one way per version, for review.",
};

/**
 * The root, for now: an index of the versions under review, a square each
 * with the version's layout drawn in it as a loading skeleton. Each opens on
 * the version's landing.
 */
export default function Templates() {
  return (
    <main className="bg-alt-paper text-alt-ink font-display min-h-dvh px-[6vw] pt-xl pb-3xl md:px-[8vw]">
      <h1 className="text-[length:calc(var(--text-title)*2)] leading-[1.05] tracking-[-0.02em]">
        Templates
      </h1>
      <p className="text-alt-muted pt-xs text-fine">
        Charlotte Kelly. The same work in each, laid out differently.
      </p>

      {/* The portfolio grid's columns at half their width, 100px apart. */}
      <ul className="grid grid-cols-2 gap-x-[100px] gap-y-xl pt-l md:grid-cols-4">
        {VERSIONS.map((version) => (
          <li key={version.id}>
            <article className="group relative">
              <div className="bg-alt-ink/5 aspect-square overflow-hidden">
                <VersionSkeleton id={version.id} />
              </div>

              <h2 className="pt-2xs text-[clamp(1.0625rem,0.98rem+0.38vw,1.25rem)] leading-[1.25]">
                {/* Stretched over the whole card, square included. */}
                <Link
                  href={`/${version.id}`}
                  className="no-underline group-hover:underline after:absolute after:inset-0"
                >
                  <span className="font-bold uppercase">{version.id}</span>{" "}
                  {version.name}
                </Link>
              </h2>
              <p className="text-alt-muted pt-3xs text-fine">{version.note}</p>
            </article>
          </li>
        ))}
      </ul>
    </main>
  );
}
