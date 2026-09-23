import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

/**
 * One project in a grid. Shared by the landing's full grid and the "more work"
 * row at the foot of a project page so the crop, the type scale and the link
 * target can never drift apart between the two.
 *
 * The 6/7 portrait crop is what makes a grid read as a grid: the source images
 * range from 0.675 to 1.922 in aspect. A fixed-aspect box plus `fill` is also
 * what keeps this CLS-free — intrinsic width/height would give every card a
 * different height and defeat the layout.
 */
export function ProjectCard({ project, sizes }: { project: Project; sizes: string }) {
  return (
    <article>
      {/* The whole card is one link rather than a link on the title: it gives
          a much larger target and means only one stop in the tab order. */}
      <Link href={`/work/${project.slug}`} className="group block no-underline">
        <div className="bg-alt-ink/5 relative aspect-[6/7] overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
        <h3 className="pt-2xs text-[clamp(1.0625rem,0.98rem+0.38vw,1.25rem)] leading-[1.25] group-hover:underline">
          {project.title}
        </h3>
        {/* 12px floor rather than the mock's ~10px — below that the services
            line stops being readable. */}
        <p className="text-alt-muted pt-3xs text-fine">{project.services}</p>
      </Link>
    </article>
  );
}
