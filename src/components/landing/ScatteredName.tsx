"use client";

import { useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ALL_LETTERS, WORDS, alignedX, wordSpan } from "./letters";

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
  replayKey = 0,
}: {
  trigger: RefObject<HTMLElement | null>;
  replayKey?: number;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      const outers = gsap.utils.toArray<HTMLElement>("[data-letter]", root);
      const inners = gsap.utils.toArray<HTMLElement>("[data-wave]", root);
      if (!outers.length) return;

      // Derived rather than measured: a letter's rest offset from its word-box
      // centre is exactly dy x amp x 1em, so this stays correct through a
      // ScrollTrigger refresh without having to untransform anything first.
      const metrics = () => {
        const cs = getComputedStyle(outers[0]);
        const u = parseFloat(cs.fontSize);
        const amp = parseFloat(cs.getPropertyValue("--amp")) || 1;
        return { u, amp };
      };
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
        // Letters drop in from a common line above and land on the scatter.
        gsap.set(outers, { y: (i) => -restY(i) - 2.6 * u, opacity: 0 });
        const settle = gsap.to(outers, {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          stagger: { each: 0.055 },
        });

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
          duration: 1.2,
          delay: 1.4,
          ease: "power2.out",
        });

        // ---- Phase C: align, on scroll --------------------------------------
        // Built once settle has landed, so the scrub captures y = 0 (the
        // scattered rest position) as its start rather than a mid-fall value.
        let alignTl: gsap.core.Timeline | null = null;
        const buildAlign = () => {
          alignTl = gsap
            .timeline({
              scrollTrigger: {
                trigger: trigger.current ?? root,
                start: "top top",
                end: wide ? ALIGN_PINNED : ALIGN_UNPINNED,
                pin: wide ? (trigger.current ?? root) : false,
                anticipatePin: wide ? 1 : 0,
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            })
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
          ScrollTrigger.refresh();
        };
        settle.eventCallback("onComplete", buildAlign);

        return () => {
          gsap.ticker.remove(tick);
          settle.kill();
          waveIn.kill();
          alignTl?.scrollTrigger?.kill();
          alignTl?.kill();
        };
        },
      );

      return () => mm.revert();
    },
    { scope, dependencies: [replayKey], revertOnUpdate: true },
  );

  return (
    <div
      ref={scope}
      // Sized in em, not vw: the whole lockup is 21.5em wide, so tying it to
      // the type keeps the letter spacing constant at every viewport. Below md
      // the two words stack, because one line does not fit a phone.
      className="text-[length:var(--letter)] flex flex-col items-center justify-center gap-[1.6em] leading-none font-medium [--amp:0.7] md:flex-row md:items-center md:gap-[2.75em] md:[--amp:1]"
      aria-hidden="true"
    >
      {/* Without JS nothing restores opacity, so put it back. The name is also
          in the sr-only h1 either way. */}
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: "[data-letter]{opacity:1!important}" }} />
      </noscript>

      {WORDS.map((word) => (
        <div
          key={word.word}
          className="relative h-[4.4em] md:h-[6em]"
          style={{ width: `${wordSpan(word.letters.length)}em` }}
        >
          {word.letters.map((letter, i) => (
            <span
              key={`${word.word}-${i}`}
              data-letter
              className="absolute inline-block will-change-transform select-none"
              style={{
                left: `calc(50% + ${alignedX(i, word.letters.length) + letter.jx}em)`,
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
  );
}
