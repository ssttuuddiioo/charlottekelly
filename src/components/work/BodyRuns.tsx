import type { BodyRun } from "@/lib/projects";

/**
 * A project's body copy as inline content, for each template to wrap in its
 * own paragraph and type. Shared so the one inline element the copy has — the
 * link — behaves the same in every version.
 *
 * Links open in a new tab because they point at the client's own site, not
 * further reading here. The underline takes the base rule's accent colour; a
 * template on a ground where that is wrong overrides it on its paragraph.
 */
export function BodyRuns({ runs }: { runs: BodyRun[] }) {
  return runs.map((run, i) =>
    typeof run === "string" ? (
      run
    ) : (
      <a
        key={i}
        href={run.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-[0.2em]"
      >
        {run.text}
      </a>
    ),
  );
}
