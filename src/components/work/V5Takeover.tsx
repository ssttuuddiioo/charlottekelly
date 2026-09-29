"use client";

import { useRef, type ReactNode } from "react";

/** How long the blue takes to fill the screen, and to fall back. */
const GROW = 700;
const SHRINK = 550;
/**
 * The blue turns to the cream as it spreads rather than after: the colour
 * starts a little way into the growth and, on the same curve, lands with it,
 * so the two read as one movement. On close it runs inside the shrink the
 * same way, blue again before the edges reach the column.
 */
const TINT_LAG = 0.25;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * The blue column's rect as a clip on a full-screen box: inset by the
 * distance from each edge of the window to the column's, so the takeover can
 * start as exactly the column and grow to the window. Clamped to the window,
 * since below lg the column is a block at the top of the page and may be
 * partly scrolled away. Null when none of it is on screen.
 */
function columnClip(from: Element | null) {
  if (!from) return null;
  const r = from.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const top = Math.max(0, r.top);
  const bottom = Math.max(0, vh - r.bottom);
  if (top + bottom >= vh) return null;
  return `inset(${top}px ${Math.max(0, vw - r.right)}px ${bottom}px ${Math.max(0, r.left)}px)`;
}

/** The column's colours, which the takeover opens from and closes back to. */
const BLUE = { backgroundColor: "var(--color-alt-blue)", color: "var(--color-alt-paper)" };
const CREAM = { backgroundColor: "var(--color-alt-paper)", color: "var(--color-alt-ink)" };

const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * v5's Learn more: the blue column takes over the window and the rest of
 * her about sits on it — `children`, which is v2's landing.
 *
 * A native modal <dialog>, so focus moves into it and is kept there, Escape
 * closes it and focus goes back to Learn more after. What is added here is
 * only the motion: a clip that starts as the column's own rect and opens to
 * the whole window, the blue turning to the cream as it goes, then the
 * content rising in, black; on close the same in reverse, so it is blue again
 * by the time it falls back into the column. With reduced motion it simply
 * opens and closes, on the cream.
 *
 * The page underneath is kept from scrolling while it is open, so a wheel at
 * the end of the about does not carry on into the list behind it.
 */
export function V5Takeover({
  label,
  className = "",
  triggerClassName = "",
  children,
}: {
  label: string;
  className?: string;
  triggerClassName?: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  const column = () => dialog.current?.closest("[data-about]") ?? null;

  const open = () => {
    const box = dialog.current;
    if (!box || box.open) return;
    const clip = columnClip(column());
    box.showModal();
    box.scrollTop = 0;
    document.documentElement.style.overflow = "hidden";
    if (still()) return;

    box.animate(
      clip ? [{ clipPath: clip }, { clipPath: "inset(0px 0px 0px 0px)" }] : [{ opacity: 0 }, { opacity: 1 }],
      { duration: GROW, easing: EASE },
    );
    box.animate([BLUE, CREAM], {
      duration: GROW * (1 - TINT_LAG),
      delay: GROW * TINT_LAG,
      easing: EASE,
      fill: "backwards",
    });
    // Held back until the ground is most of the way to cream, so the text
    // arrives black rather than turning black in view.
    content.current?.animate(
      [
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 600, delay: GROW * 0.75, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
    );
  };

  const close = async () => {
    const box = dialog.current;
    if (!box?.open || closing.current) return;
    if (!still()) {
      closing.current = true;
      const clip = columnClip(column());
      content.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: "forwards" });
      // The text is gone before the ground starts to darken under it.
      box.animate([CREAM, BLUE], {
        duration: SHRINK * (1 - TINT_LAG),
        delay: 120,
        easing: EASE,
        fill: "forwards",
      });
      await box.animate(
        clip ? [{ clipPath: "inset(0px 0px 0px 0px)" }, { clipPath: clip }] : [{ opacity: 1 }, { opacity: 0 }],
        { duration: SHRINK, delay: 120, easing: EASE, fill: "forwards" },
      ).finished;
      // Drop the held end states, or the next open starts from them.
      box.getAnimations().forEach((animation) => animation.cancel());
      content.current?.getAnimations().forEach((animation) => animation.cancel());
      closing.current = false;
    }
    box.close();
  };

  return (
    <div className={className}>
      <button type="button" onClick={open} className={triggerClassName}>
        {label}
      </button>

      <dialog
        ref={dialog}
        aria-label="About Charlotte Kelly"
        // Escape runs the animated close rather than the browser's instant one.
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          document.documentElement.style.overflow = "";
        }}
        className="bg-alt-paper text-alt-ink fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 p-0 backdrop:bg-transparent"
      >
        {/* Close and the about rise in and fade out together, the ground on
            its own. */}
        <div ref={content} className="bg-inherit">
          {/* Pinned, on the dialog's own ground as it fades, so it stays in
              reach down a long about. */}
          <div className="bg-inherit sticky top-0 z-10 flex justify-end px-[6vw] pt-2xs lg:px-[4%]">
            <button type="button" onClick={close} className={triggerClassName}>
              Close
            </button>
          </div>
          <div className="max-w-[84rem]">{children}</div>
        </div>
      </dialog>
    </div>
  );
}
