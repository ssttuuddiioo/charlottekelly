"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { subscribe, type SubscribeState } from "@/lib/subscribe";

const INITIAL: SubscribeState = { status: "idle", message: "" };

/**
 * The sign-up field: one rule, the address on it, the button at its right end.
 * Taken from the reference, minus the terms checkbox — there is no terms page
 * for it to point at, and a personal note list sent a few times a year does not
 * need one standing between a reader and the field.
 *
 * A client component inside the otherwise-server footer, which is the smallest
 * unit that can carry the pending and result states. The form still submits
 * before hydration: React queues it and replays it once the action is live.
 *
 * Black on the footer's ochre at full opacity, like everything else in here.
 * The placeholder is the one exception at 70%, which is 5.83:1 — still AA, and
 * it is not the label. The real label is beside it, visually hidden.
 */
export function MailingList() {
  const [state, action, pending] = useActionState(subscribe, INITIAL);
  const field = useRef<HTMLInputElement>(null);
  const id = useId();

  // Empty the field once the address is in, so the form reads as done rather
  // than as still holding something waiting to be sent again.
  useEffect(() => {
    if (state.status === "ok" && field.current) field.current.value = "";
  }, [state]);

  return (
    <form action={action} className="relative">
      {/* The honeypot. Off-screen rather than display:none, and taken out of
          the tab order and the accessibility tree, so nothing that reads this
          page aloud or walks it with a keyboard ever meets it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* The rule belongs to the pair, not to the input, so the button sits on
          the same line the address is written on. Focus doubles it via a shadow
          rather than thickening the border, which would shift both by a pixel. */}
      <div className="gap-s pb-2xs flex items-end border-b border-current has-[:focus-visible]:shadow-[0_1px_0_0_currentColor]">
        <label htmlFor={`${id}-email`} className="sr-only">
          Your email address
        </label>
        <input
          ref={field}
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Your email"
          aria-describedby={state.message ? `${id}-status` : undefined}
          aria-invalid={state.status === "error" || undefined}
          className="placeholder:text-alt-ink/70 w-full min-w-0 flex-1 bg-transparent text-[clamp(1.125rem,0.95rem+0.7vw,1.5rem)] leading-[1.2] font-medium outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          // inline-flex items-end, not a bare 44px button: min-h-tap centres a
          // button's label in its box, which floated the word half a tap target
          // above the line the address is written on. This keeps the target and
          // puts the label back on the rule.
          //
          // outline-current because the base focus ring is the cyanotype accent
          // blue, which on this ochre is a third colour doing nothing.
          className="min-h-tap inline-flex shrink-0 items-end text-[0.95rem] leading-[1.2] font-bold tracking-[0.02em] uppercase focus-visible:outline-current disabled:opacity-60"
        >
          {pending ? "Sending" : "Add me"}
        </button>
      </div>

      {/* Always in the DOM so the live region exists before it has anything to
          announce — one mounted at the moment of the message is often missed. */}
      <p
        id={`${id}-status`}
        aria-live="polite"
        className="mt-2xs min-h-[1.4em] text-[0.95rem] font-medium"
      >
        {state.message}
      </p>
    </form>
  );
}
