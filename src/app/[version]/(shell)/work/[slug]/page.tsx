import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { V1Project } from "@/components/work/V1Project";
import { V2Project } from "@/components/work/V2Project";
import { V3Page } from "@/components/work/V3Page";
import { V4Page } from "@/components/work/V4Page";
import { V5Page } from "@/components/work/V5Page";
import { PROJECTS, type Project } from "@/lib/projects";
import { isVersion, type VersionId } from "@/lib/versions";

const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

/**
 * The one place the versions actually differ: each has its own case-study
 * template. Keyed by VersionId, so adding a version without adding its
 * template here is a type error.
 */
/** v3 has no page per project: it is the one page with this row open. */
const V3Template = ({ project, base }: { project: Project; base: string }) => (
  <V3Page base={base} open={project.slug} />
);

/** Nor has v4, whose page is v3's under a hero. */
const V4Template = ({ project, base }: { project: Project; base: string }) => (
  <V4Page base={base} open={project.slug} />
);

/** Nor v5, which is v4's with its own thumbnails and blue column. */
const V5Template = ({ project, base }: { project: Project; base: string }) => (
  <V5Page base={base} open={project.slug} />
);

const TEMPLATES: Record<VersionId, ComponentType<{ project: Project; base: string }>> = {
  v1: V1Project,
  v2: V2Project,
  v3: V3Template,
  v4: V4Template,
  v5: V5Template,
};

/** Every project is known at build time, so every page is prerendered — once
    per version, which the layout above supplies. */
export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[version]/work/[slug]">): Promise<Metadata> {
  const project = bySlug((await params).slug);
  if (!project) return {};

  return {
    title: `${project.title} — Charlotte Kelly`,
    description: project.services,
    openGraph: { images: [{ url: project.image }] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[version]/work/[slug]">) {
  const { version, slug } = await params;
  const project = bySlug(slug);
  if (!project || !isVersion(version)) notFound();

  const Template = TEMPLATES[version];
  return <Template project={project} base={`/${version}`} />;
}
