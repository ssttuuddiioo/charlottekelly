import type { ReactNode } from "react";
import type { VersionId } from "@/lib/versions";

/**
 * A version's layout drawn as a loading skeleton, for its square on the root
 * index: grey blocks where the page puts its columns, images and lines of
 * type, as a page shows before it loads. Only the shape of each page,
 * so the squares tell the versions apart at a glance.
 *
 * Keyed by VersionId, so a version added without a skeleton is a type error.
 */

/** A block: an image, a column, a band. */
const Block = ({ className = "" }: { className?: string }) => (
  <div className={`bg-alt-ink/15 rounded-[2px] ${className}`} />
);

/** A line of type, as wide as `w`. */
const Line = ({ w = "w-full", className = "" }: { w?: string; className?: string }) => (
  <div className={`bg-alt-ink/15 h-[3px] shrink-0 rounded-full ${w} ${className}`} />
);

/** A few lines of copy, the last one short. */
const Lines = ({ n = 3, className = "" }: { n?: number; className?: string }) => (
  <div className={`flex flex-col gap-[3px] ${className}`}>
    {Array.from({ length: n }, (_, i) => (
      <Line key={i} w={i === n - 1 ? "w-2/3" : "w-full"} />
    ))}
  </div>
);

/** v3–v5's pinned column about her, darker for the blue. */
const AboutColumn = ({ children }: { children?: ReactNode }) => (
  <div className="bg-alt-ink/25 relative flex w-1/3 flex-col gap-[3px] p-[6%]">
    <Line w="w-3/4" className="bg-alt-paper/60" />
    {children}
  </div>
);

/** A list row in v3–v5: the thumbnail, the title and summary, the scope. */
const Row = ({ thumb }: { thumb: string }) => (
  <div className="border-alt-ink/20 flex gap-[5%] border-b border-dashed py-[5%]">
    <Block className={`shrink-0 ${thumb}`} />
    <Lines n={3} className="flex-1" />
    <Lines n={2} className="w-1/5" />
  </div>
);

const List = ({ thumb, hero }: { thumb: string; hero?: boolean }) => (
  <div className="flex flex-1 flex-col overflow-hidden px-[5%]">
    {hero ? <Block className="-mx-[6%] h-[45%] shrink-0 rounded-none" /> : null}
    {Array.from({ length: 4 }, (_, i) => (
      <Row key={i} thumb={thumb} />
    ))}
  </div>
);

const SKELETONS: Record<VersionId, () => ReactNode> = {
  // The fixed bar, title and tags, the 16/9 hero, copy, three more projects.
  v1: () => (
    <div className="flex h-full flex-col">
      <Block className="h-[8%] shrink-0 rounded-none" />
      <div className="flex flex-1 flex-col gap-[4%] overflow-hidden p-[6%]">
        <Line w="w-1/2" className="h-[6px]" />
        <Line w="w-1/3" />
        <Block className="aspect-video w-full shrink-0" />
        <Lines n={3} className="w-3/4" />
        <div className="flex gap-[3%]">
          <Block className="aspect-square flex-1" />
          <Block className="aspect-square flex-1" />
          <Block className="aspect-square flex-1" />
        </div>
      </div>
    </div>
  ),

  // The index of thumbnails, the project, the sidebar.
  v2: () => (
    <div className="flex h-full gap-[3%]">
      <div className="flex w-[12%] flex-col gap-[4px] overflow-hidden py-[4%] pl-[3%]">
        {Array.from({ length: 6 }, (_, i) => (
          <Block key={i} className="aspect-[3/4] w-full shrink-0" />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-[4%] overflow-hidden py-[6%]">
        <Line w="w-1/2" className="h-[6px]" />
        <Block className="aspect-video w-full shrink-0" />
        <Lines n={4} />
      </div>
      <div className="bg-alt-ink/25 flex w-[28%] flex-col gap-[3px] p-[5%]">
        <Line w="w-3/4" className="bg-alt-paper/60" />
        <Lines n={5} className="pt-[20%]" />
      </div>
    </div>
  ),

  // The list with portrait thumbnails, the column about her.
  v3: () => (
    <div className="flex h-full">
      <List thumb="h-[22px] w-[17px]" />
      <AboutColumn>
        <Lines n={4} className="pt-[25%]" />
        <Lines n={3} className="pt-[15%]" />
      </AboutColumn>
    </div>
  ),

  // v3 under the full-screen hero.
  v4: () => (
    <div className="flex h-full">
      <List thumb="h-[22px] w-[17px]" hero />
      <AboutColumn>
        <Lines n={4} className="pt-[25%]" />
        <Lines n={3} className="pt-[15%]" />
      </AboutColumn>
    </div>
  ),

  // v4 with wider thumbnails, and the short column with its tile.
  v5: () => (
    <div className="flex h-full">
      <List thumb="h-[18px] w-[24px]" hero />
      <AboutColumn>
        <Lines n={3} className="pt-[25%]" />
        <div className="flex flex-1 items-center justify-center">
          <Block className="bg-alt-paper/50 aspect-[3/4] w-1/3" />
        </div>
      </AboutColumn>
    </div>
  ),
};

export function VersionSkeleton({ id }: { id: VersionId }) {
  const Skeleton = SKELETONS[id];
  return (
    <div aria-hidden className="h-full w-full">
      <Skeleton />
    </div>
  );
}
