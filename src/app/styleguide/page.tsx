import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Token specimen",
  robots: { index: false, follow: false },
};

const RAMP = [
  { step: "50", hex: "#E6F4FC", on: "1.03" },
  { step: "100", hex: "#D5EAF6", on: "1.14" },
  { step: "200", hex: "#B9D6E8", on: "1.40" },
  { step: "300", hex: "#97BBD4", on: "1.86" },
  { step: "400", hex: "#729BB9", on: "2.72" },
  { step: "500", hex: "#517C9F", on: "4.08" },
  { step: "600", hex: "#396083", on: "6.09" },
  { step: "700", hex: "#264666", on: "8.99" },
  { step: "800", hex: "#18304B", on: "12.36" },
  { step: "900", hex: "#0D1F34", on: "15.30" },
];

const ROLES = [
  { name: "ink", maps: "blue-700", use: "body copy", ratio: "8.99 AAA" },
  { name: "ink-strong", maps: "blue-800", use: "emphasis", ratio: "12.36 AAA" },
  { name: "ink-muted", maps: "blue-600", use: "meta, labels", ratio: "6.09 AA" },
  { name: "accent", maps: "blue-500", use: "underlines, focus", ratio: "4.08 AA-lg" },
  { name: "rule", maps: "blue-200", use: "hairlines", ratio: "non-text" },
  { name: "wash", maps: "blue-50", use: "tinted blocks", ratio: "non-text" },
];

const TYPE = [
  { cls: "text-fine", range: "12 → 13px", use: "credits, fine print" },
  { cls: "text-small", range: "14 → 15.5px", use: "meta, nav, labels" },
  { cls: "text-body", range: "16 → 18px", use: "body copy, Portable Text" },
  { cls: "text-lead", range: "19 → 22.5px", use: "intro, project summary" },
  { cls: "text-title", range: "23 → 28px", use: "h3" },
  { cls: "text-heading", range: "27.5 → 35px", use: "h2, project title" },
  { cls: "text-display", range: "33 → 44px", use: "h1" },
];

const SPACE = [
  { cls: "3xs", range: "4 → 5px" },
  { cls: "2xs", range: "8 → 10px" },
  { cls: "xs", range: "12 → 15px" },
  { cls: "s", range: "16 → 20px" },
  { cls: "m", range: "24 → 30px" },
  { cls: "l", range: "32 → 40px" },
  { cls: "xl", range: "48 → 60px" },
  { cls: "2xl", range: "64 → 80px" },
  { cls: "3xl", range: "96 → 120px" },
];

function Section({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-rule pt-m pb-2xl">
      <h2 className="font-sans text-small uppercase tracking-wider text-ink-muted">{title}</h2>
      <p className="mt-2xs max-w-measure text-small text-ink-muted">{note}</p>
      <div className="mt-l">{children}</div>
    </section>
  );
}

export default function Styleguide() {
  return (
    <main className="mx-auto max-w-page px-s py-xl">
      <header className="pb-2xl">
        <h1 className="text-heading">Token specimen</h1>
        <p className="mt-2xs max-w-measure text-ink-muted">
          Phase 1. Every value below is a token in{" "}
          <code className="font-sans text-small">src/styles/theme.css</code>. Resize the window —
          type and space are fluid between 320 and 1280px.
        </p>
      </header>

      <Section
        title="Paper"
        note="Warm off-white, not grey. The site background and one step deeper for alternating bands."
      >
        <div className="grid grid-cols-2 gap-s sm:max-w-md">
          <div>
            <div className="h-2xl border border-rule bg-paper" />
            <p className="mt-2xs font-sans text-fine text-ink-muted">paper · #F9F5EE</p>
          </div>
          <div>
            <div className="h-2xl border border-rule bg-paper-2" />
            <p className="mt-2xs font-sans text-fine text-ink-muted">paper-2 · #F2EDE1</p>
          </div>
        </div>
      </Section>

      <Section
        title="Cyanotype ramp"
        note="Built in OKLCH so the steps are perceptually even. Hue drifts from cyan at the pale end to violet at the deep end — that drift is what a real sun print does, and what keeps this from reading as a flat brand blue. Numbers are contrast against paper."
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(5rem,1fr))] gap-2xs">
          {RAMP.map((c) => (
            <div key={c.step}>
              <div
                className="h-xl border border-rule"
                style={{ backgroundColor: `var(--color-blue-${c.step})` }}
              />
              <p className="mt-2xs font-sans text-fine text-ink-muted">
                {c.step}
                <br />
                {c.hex}
                <br />
                {c.on}:1
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Semantic roles"
        note="Components use these, never the raw ramp. Renaming a role re-skins the site; renaming a ramp step does not."
      >
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-s">
          {ROLES.map((r) => (
            <li key={r.name} className="flex items-start gap-xs">
              <span
                className="mt-3xs size-8 shrink-0 border border-rule"
                style={{ backgroundColor: `var(--color-${r.name})` }}
              />
              <span className="font-sans text-small">
                <strong className="font-medium">{r.name}</strong>
                <span className="text-ink-muted">
                  {" "}
                  → {r.maps}
                  <br />
                  {r.use} · {r.ratio}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Type scale"
        note="Geometric from body upward (1.2 → 1.25 ratio). The two steps below body are set by legibility floors instead — the ratio put them at 11px. Display caps at 44px on purpose."
      >
        <div className="flex flex-col gap-m">
          {TYPE.map((t) => (
            <div key={t.cls} className="flex flex-col gap-3xs sm:flex-row sm:items-baseline sm:gap-m">
              <p className="shrink-0 font-sans text-fine text-ink-muted sm:w-40">
                {t.cls}
                <br />
                {t.range} · {t.use}
              </p>
              <p className={`${t.cls} max-w-measure`}>
                She wrote the line that made the room go quiet.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Space scale"
        note="Same fluid method, base 16 → 20px. Space breathes a little more than type does: gutters open up on desktop while the words stay put."
      >
        <ul className="flex flex-col gap-2xs">
          {SPACE.map((s) => (
            <li key={s.cls} className="flex items-center gap-s">
              <span className="w-24 shrink-0 font-sans text-fine text-ink-muted">
                {s.cls} · {s.range}
              </span>
              <span
                className="h-4 bg-blue-300"
                style={{ width: `var(--spacing-${s.cls})` }}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Measure"
        note="The reading column is capped at 68ch. This is the constraint that matters most — the text is the work, and long lines are where portfolio sites lose readers."
      >
        <div className="max-w-measure">
          <p>
            A brand voice is not a font and it is not a colour. It is the sum of every
            decision about what to say and what to leave out, made consistently enough
            that a reader starts to recognise it before they see the logo. Fifteen years
            of doing that work is fifteen years of arguments won quietly, in rooms where
            the loudest idea was rarely the right one.
          </p>
          <p className="mt-m">
            This paragraph sits at the measure cap. If it feels long on your screen, that
            is the number to change first.
          </p>
        </div>
      </Section>

      <Section title="Tap target" note="44px floor, available as min-h-tap / min-w-tap.">
        <a
          href="#top"
          className="inline-flex min-h-tap min-w-tap items-center justify-center border border-rule px-s font-sans text-small"
        >
          44px minimum
        </a>
      </Section>
    </main>
  );
}
