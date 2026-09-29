import { VERSIONS } from "@/lib/versions";

/**
 * Nothing to render — this segment exists to name the versions. Generating
 * them here, top-down, means the pages below only list their own slugs, and
 * `dynamicParams = false` makes anything not in VERSIONS a 404 instead of an
 * on-demand render of a version that does not exist.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return VERSIONS.map(({ id }) => ({ version: id }));
}

export default function VersionLayout({ children }: LayoutProps<"/[version]">) {
  return children;
}
