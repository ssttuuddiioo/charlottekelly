"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { enquire, type EnquireState } from "@/lib/enquire";

const INITIAL: EnquireState = { status: "idle", message: "" };

/**
 * "Got a project in mind?" and, opened from it, a short form: the message,
 * an address to reply to, send. Set like the sign-up in the same column —
 * fields written on a rule, colour from the text around them, the
 * placeholder at 80% of the paper for AA on the blue.
 *
 * The form stays in the DOM when closed, so the open can animate (a grid
 * row from 0fr to 1fr) and so what was typed survives closing it again.
 */
export function ProjectEnquiry({ triggerClassName = "" }: { triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-form`}
        onClick={() => setOpen((was) => !was)}
        className={`cursor-pointer text-left ${triggerClassName}`}
      >
        Got a project in mind?
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <EnquiryForm id={`${id}-form`} active={open} className="pt-xs" />
        </div>
      </div>
    </div>
  );
}

/**
 * The form itself, also set on its own in v1's menu (SiteHeader). Fields
 * written on a rule, colour from the text around it.
 *
 * `active` false takes it out of the tab order and the accessibility tree
 * (`inert`) while whatever holds it is shut; turning true puts the cursor
 * straight in the message, the only reason to have opened it.
 */
export function EnquiryForm({
  id,
  active,
  className = "",
}: {
  id?: string;
  active: boolean;
  className?: string;
}) {
  const [state, action, pending] = useActionState(enquire, INITIAL);
  const form = useRef<HTMLFormElement>(null);
  const message = useRef<HTMLTextAreaElement>(null);
  const own = useId();
  const base = id ?? own;

  // Empty the fields once it has gone, so the form reads as done.
  useEffect(() => {
    if (state.status === "ok") form.current?.reset();
  }, [state]);

  useEffect(() => {
    if (active) message.current?.focus({ preventScroll: true });
  }, [active]);

  const field =
    "w-full min-w-0 border-b border-current bg-transparent pb-2xs leading-[1.35] outline-none placeholder:text-current/80 focus-visible:shadow-[0_1px_0_0_currentColor]";

  return (
    <form
      ref={form}
      id={id}
      action={action}
      inert={!active}
      aria-label="Project enquiry"
      className={`relative flex flex-col gap-s ${className}`}
    >
      {/* The honeypot, as on the sign-up. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor={`${base}-company`}>Company</label>
        <input id={`${base}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label htmlFor={`${base}-message`} className="sr-only">
        Your project
      </label>
      <textarea
        ref={message}
        id={`${base}-message`}
        name="message"
        required
        rows={3}
        maxLength={5000}
        placeholder="A little about it"
        aria-describedby={state.message ? `${base}-status` : undefined}
        className={`${field} resize-none`}
      />

      <div className="flex items-end gap-s">
        <label htmlFor={`${base}-email`} className="sr-only">
          Your email address
        </label>
        <input
          id={`${base}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Your email"
          aria-describedby={state.message ? `${base}-status` : undefined}
          className={`${field} flex-1`}
        />
        {/* Label on the rule rather than centred in the tap target,
            as the sign-up's button does. */}
        <button
          type="submit"
          disabled={pending}
          className="min-h-tap inline-flex shrink-0 cursor-pointer items-end pb-2xs leading-[1.35] focus-visible:outline-current disabled:opacity-60"
        >
          {pending ? "Sending" : "Send"}
        </button>
      </div>

      <p id={`${base}-status`} aria-live="polite" className="min-h-[1.4em] text-[0.95rem]">
        {state.message}
      </p>
    </form>
  );
}
