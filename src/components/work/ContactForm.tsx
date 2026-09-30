"use client";

import type { FormEvent } from "react";
import { EMAIL } from "@/lib/site";

/** A field: its label over it, a rule under it, no box — the section's tint
    shows through, and the rule is the ink the labels are set in. */
const FIELD =
  "w-full border-0 border-b border-current/40 bg-transparent py-2xs outline-none placeholder:text-current/40 focus-visible:border-current";

/**
 * v5's Let's talk form: name, email, message.
 *
 * There is no backend yet, so Send opens her address in the visitor's own
 * mail app with the message filled in, and they send it from there. The
 * fields are a real <form> with native validation, so swapping the handler
 * for a server action later changes nothing on screen.
 */
export function ContactForm({ color }: { color: string }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const message = String(data.get("message") ?? "");
    const subject = `Hello from ${name}`;
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} className="grid gap-x-[3cqi] gap-y-m pb-l @md:grid-cols-2">
      <label className="flex flex-col">
        <span className="font-semibold" style={{ color }}>
          Name
        </span>
        <input name="name" type="text" autoComplete="name" required className={FIELD} />
      </label>

      <label className="flex flex-col">
        <span className="font-semibold" style={{ color }}>
          Email
        </span>
        <input name="email" type="email" autoComplete="email" required className={FIELD} />
      </label>

      <label className="flex flex-col @md:col-span-2">
        <span className="font-semibold" style={{ color }}>
          Message
        </span>
        <textarea name="message" rows={6} required className={`${FIELD} resize-y`} />
      </label>

      <div className="@md:col-span-2">
        <button
          type="submit"
          className="min-h-tap inline-flex cursor-pointer items-center px-m font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          Send
        </button>
      </div>
    </form>
  );
}
