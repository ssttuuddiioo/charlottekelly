import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/landing";
import { V2Landing } from "@/components/work/V2Landing";
import { V3Page } from "@/components/work/V3Page";
import { V4Page } from "@/components/work/V4Page";
import { V5Page } from "@/components/work/V5Page";
import { isVersion, type VersionId } from "@/lib/versions";

export const metadata: Metadata = {
  title: "Charlotte Kelly",
  description:
    "Charlotte Kelly is an independent senior copywriter working on brand strategy, verbal identity, and all kinds of writing.",
};

/**
 * Each version's landing. v1's is the full scrolling page; v2's is its bio
 * and lists, in the column a project takes once one is open; v3's is its
 * one page with no row open, v4's the same under its hero, and v5's v4 with its
 * wider thumbnails and short blue column.
 */
const HOMES: Record<VersionId, ComponentType<{ base: string }>> = {
  v1: Landing,
  v2: V2Landing,
  v3: V3Page,
  v4: V4Page,
  v5: V5Page,
};

export default async function Home({ params }: PageProps<"/[version]">) {
  const { version } = await params;
  if (!isVersion(version)) notFound();

  const Page = HOMES[version];
  return <Page base={`/${version}`} />;
}
