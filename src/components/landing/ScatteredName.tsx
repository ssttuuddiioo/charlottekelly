"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ALL_LETTERS, WORDS, alignedIndex } from "./letters";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Travelling wave: amplitude in em, angular speed, phase step per letter. */
const WAVE_AMP = 0.28;
const WAVE_SPEED = 1.1;
const WAVE_PHASE = 0.42;

/**
 * How much scrolling it takes to resolve the name.
 *
 * On wide screens the hero is pinned for the duration, so the name resolves
 * where it sits instead of sliding off the top — without the pin the align
 * finishes just as the name leaves the viewport and the moment is wasted.
 * Small screens skip the pin: the viewport height changes there as browser
 * chrome hides, which makes a pinned ScrollTrigger jump, so the align is
 * simply made short enough to land while the name is still on screen.
 */
const ALIGN_PINNED = "+=60%";
const ALIGN_UNPINNED = "+=28%";

export function ScatteredName({
  trigger,
}: {
  trigger: RefObject<HTMLElement | null>;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const outers = gsap.utils.toArray<HTMLElement>("[data-letter]", root);
      const inners = gsap.utils.toArray<HTMLElement>("[data-wave]", root);
      const tagline = root.querySelector<HTMLElement>("[data-tagline]");
      if (!outers.length) return;

      // Derived rather than measured: a letter's rest offset from its word-box
      // centre is exactly dy x amp x 1em, so this stays correct through a
      // ScrollTrigger refresh without having to untransform anything first.
      //
      // Memoised because the wave ticker calls this every frame. getComputedStyle
      // forces a style recalc, and doing one between quickSetter writes is a
      // read-write-read thrash 60 times a second for a pair of numbers that only
      // move on resize. ScrollTrigger refreshes on resize, so clearing the cache
      // on refreshInit covers every case that can change them.
      let cache: { u: number; amp: number } | null = null;
      const metrics = () => {
        if (cache) return cache;
        const cs = getComputedStyle(outers[0]);
        const u = parseFloat(cs.fontSize);
        const amp = parseFloat(cs.getPropertyValue("--amp")) || 1;
        cache = { u, amp };
        return cache;
      };
      const clearMetrics = () => {
        cache = null;
      };
      ScrollTrigger.addEventListener("refreshInit", clearMetrics);
      const restY = (i: number) => {
        const { u, amp } = metrics();
        return ALL_LETTERS[i].dy * amp * u;
      };
      const jitterX = (i: number) => ALL_LETTERS[i].jx * metrics().u;

      // GSAP owns the whole transform, so centring goes through xPercent /
      // yPercent instead of a CSS translate that x/y would then fight.
      gsap.set(outers, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
      gsap.set(inners, { y: 0 });

      const mm = gsap.matchMedia();

      // Letters start hidden in CSS, not in JS. Setting the hidden state after
      // mount meant the name rendered, sat there for ~360ms, then blinked out
      // and fell in again — which reads as a bug rather than an entrance. The
      // cost is that opacity now has to be restored on every path, including
      // this one.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(outers, { opacity: 1 });
        // No scroll-linked reveal to run, so the tagline is simply present.
        if (tagline) gsap.set(tagline, { opacity: 1, y: 0 });
      });

      // matchMedia runs the callback when ANY listed condition matches, so
      // `motion` has to be re-checked by hand — `wide` alone matching would
      // otherwise animate for someone who asked for reduced motion. Reduced
      // motion leaves the letters where CSS already put them: the composition
      // is the design, and there is nothing to reveal.
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 48rem)",
        },
        (ctx) => {
        const { motion, wide } = ctx.conditions as Record<string, boolean>;
        if (!motion) return;

        const { u } = metrics();

        // ---- Phase A: settle -------------------------------------------------
        // The drop rides the INNER span, not the outer one.
        //
        // Phase C animates the outer span's x/y, and a scrub records its start
        // values the first time it renders. While the settle owned that same
        // property, scrolling early captured a mid-air y as the start — which
        // is why the align used to be withheld until the settle had landed.
        // Moving the drop one level in leaves the outer x/y sitting at 0, so
        // the two compose instead of competing and you can scroll into the
        // align while the letters are still falling.
        gsap.set(inners, { y: (i) => -restY(i) - 2.6 * u });
        gsap.set(outers, { opacity: 0 });
        const settle = gsap
          .timeline()
          .to(
            inners,
            { y: 0, duration: 0.75, ease: "power3.out", stagger: { each: 0.0275 } },
            0,
          )
          .to(
            outers,
            { opacity: 1, duration: 0.6, ease: "power2.out", stagger: { each: 0.0275 } },
            0,
          );

        // ---- Phase B: wave ---------------------------------------------------
        // Driven off the ticker rather than a staggered yoyo, because that
        // gives a real travelling sine AND leaves the amplitude as a single
        // scalar that phase C can scrub to zero.
        const wave = { amp: 0 };
        const setY = inners.map((el) => gsap.quickSetter(el, "y", "px"));
        let t = 0;
        const tick = (_time: number, delta: number) => {
          if (wave.amp === 0) return;
          t += delta / 1000;
          const { u: unit } = metrics();
          for (let i = 0; i < inners.length; i++) {
            setY[i](Math.sin(t * WAVE_SPEED - i * WAVE_PHASE) * WAVE_AMP * unit * wave.amp);
          }
        };
        gsap.ticker.add(tick);
        const waveIn = gsap.to(wave, {
          amp: 1,
          duration: 1,
          // Settle runs 0.75s + 0.0275 x 13 of stagger = ~1.11s, and both write
          // inner y. Starting just past that avoids the wave snapping in at a
          // part-way amplitude.
          delay: 1.15,
          ease: "power2.out",
        });

        // ---- Phase C: align, on scroll --------------------------------------
        // Trigger and tweens are both built up front now.
        //
        // The trigger has to exist immediately regardless: the pin adds a
        // pin-spacer worth 60% of the viewport to the document, so creating it
        // late means the document is short and then suddenly is not, and a
        // restored scroll position measured against the short version lands in
        // the wrong place. The tweens used to be withheld because the settle
        // owned the outer span's y; now that the drop lives on the inner span
        // there is nothing to wait for, and the align responds the moment you
        // scroll.
        // Resolved from the DOM, not from the ref.
        //
        // React attaches host refs child-first, so this component's layout
        // effect runs BEFORE the parent <section ref={hero}> has its ref set:
        // `trigger.current` is still null here. That went unnoticed while the
        // trigger was built 1.5s later inside buildAlign, but creating it up
        // front means the old `?? root` fallback silently pinned the name box
        // instead of the hero — so the page scrolled away underneath the align
        // instead of holding still, and the start fired ~300px down the page.
        const hero = trigger.current ?? root.closest("section") ?? root;

        const alignTl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: wide ? ALIGN_PINNED : ALIGN_UNPINNED,
            pin: wide ? hero : false,
            anticipatePin: wide ? 1 : 0,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        const buildAlign = () => {
          alignTl
            .to(
              outers,
              {
                x: (i: number) => -jitterX(i),
                y: (i: number) => -restY(i),
                duration: 1,
                ease: "none",
                stagger: { each: 0.02 },
              },
              0,
            )
            // Still the wave as the line resolves, so the aligned lockup is
            // genuinely motionless.
            .to(wave, { amp: 0, duration: 0.55, ease: "none" }, 0)
            .set(inners, { y: 0 });

          // The tagline rides the same scrub rather than its own trigger, so
          // it can never drift out of step with the align. It runs over the
          // first 0.6 of a ~1.26s timeline: moving the moment you scroll, and
          // fully there by the time the name has resolved.
          if (tagline) {
            alignTl.fromTo(
              tagline,
              { opacity: 0, y: () => metrics().u * 0.5 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power1.out" },
              0,
            );
          }
          // No refresh here any more. It used to be needed because the pin had
          // just changed the page's height; the pin now predates the settle, so
          // the measurements it would recompute have not moved, and refreshing
          // mid-page is itself a scroll correction worth not making.
        };
        buildAlign();

        return () => {
          gsap.ticker.remove(tick);
          settle.kill();
          waveIn.kill();
          alignTl.scrollTrigger?.kill();
          alignTl.kill();
        };
        },
      );

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", clearMetrics);
        mm.revert();
      };
    },
    { scope },
  );

  return (
    // .scattered-name sits on this wrapper rather than on the row of words so
    // that --letter is in scope for the tagline too: the tagline's offset is
    // expressed as a multiple of the letter size, which is what keeps it the
    // same distance under the name at every width.
    <div ref={scope} className="scattered-name flex flex-col items-center">
      {/* Without JS nothing restores opacity, so put it back. The name is also
          in the sr-only h1 either way. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: "[data-letter],[data-tagline]{opacity:1!important}",
          }}
        />
      </noscript>

      <div
        // One row at every width — the words never stack. The advance, the
        // scatter amplitude and the letter size all come from .scattered-name
        // in globals.css, because they have to change together to keep the
        // lockup on one line on a phone.
        className="text-[length:var(--letter)] flex items-center justify-center gap-[var(--word-gap)] leading-none font-medium"
        aria-hidden="true"
      >
        {WORDS.map((word) => (
          <div
            key={word.word}
            className="relative h-[4.8em] md:h-[6em]"
            style={{ width: `calc(var(--adv) * ${word.letters.length - 1})` }}
          >
            {word.letters.map((letter, i) => (
              <span
                key={`${word.word}-${i}`}
                data-letter
                className="absolute inline-block will-change-transform select-none"
                style={{
                  left: `calc(50% + (var(--adv) * ${alignedIndex(i, word.letters.length)}) + ${letter.jx}em)`,
                  top: `calc(50% + (${letter.dy}em * var(--amp)))`,
                  transform: "translate(-50%, -50%)",
                  opacity: 0,
                }}
              >
                {/* Inner span carries the wave so it composes with the outer
                    span's align transform instead of overwriting it. */}
                <span data-wave className="inline-block will-change-transform">
                  {letter.ch}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Real content, so it is NOT inside the aria-hidden lockup above and
          not duplicated in the sr-only h1.

          Offset in multiples of --letter rather than its own em, so it holds
          the same distance under the name at every width. 2.6x --letter on
          desktop clears the lowest scattered letter (dy 1.99em at amp 1) by a
          margin, which matters because the fade starts while the letters are
          still on their way up. */}
      <p
        data-tagline
        className="text-fine mt-[calc(var(--letter)*-0.4)] text-center leading-[1.6] font-normal tracking-[0.12em] uppercase md:tracking-[0.16em]"
        // Hidden in CSS for the same reason the letters are: the align
        // timeline is only built after the settle completes (~1.5s), and
        // anything visible until then flashes.
        style={{ opacity: 0 }}
      >
        {/* Each phrase is unbreakable, so on a phone the line wraps between
            phrases instead of mid-phrase. */}
        <span className="whitespace-nowrap">Copywriting,</span>{" "}
        <span className="whitespace-nowrap">Brand Strategy,</span>{" "}
        <span className="whitespace-nowrap">Verbal Identity</span>
      </p>
    </div>
  );
}
