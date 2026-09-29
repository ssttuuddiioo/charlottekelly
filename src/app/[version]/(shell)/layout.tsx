import type { ComponentType, ReactNode } from "react";
import { notFound } from "next/navigation";
import { V2Shell } from "@/components/work/V2Shell";
import { isVersion, type VersionId } from "@/lib/versions";

/**
 * What surrounds a version's landing and case studies — everything under it
 * except the blog, which sits outside this group and keeps one design across
 * versions.
 *
 * A layout rather than part of each page because in v2 it is most of the
 * screen: the sidebar and the index of projects stay mounted while only the
 * project beside them changes. v1, v3, v4 and v5 have nothing of the kind and pass
 * their pages straight through.
 */
const SHELLS: Record<VersionId, ComponentType<{ base: string; children: ReactNode }>> = {
  v1: ({ children }) => children,
  v2: V2Shell,
  v3: ({ children }) => children,
  v4: ({ children }) => children,
  v5: ({ children }) => children,
};

export default async function ShellLayout({ children, params }: LayoutProps<"/[version]">) {
  const { version } = await params;
  if (!isVersion(version)) notFound();

  const Shell = SHELLS[version];
  return <Shell base={`/${version}`}>{children}</Shell>;
}
