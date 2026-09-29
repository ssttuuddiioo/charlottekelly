"use server";

/**
 * The project enquiry's server action — "Got a project in mind?" on v3.
 *
 * NOTHING IS SENT YET. Like the mailing list, this validates, drops the
 * obvious junk and reports success, but `deliver()` has no provider behind
 * it: an enquiry from the live site goes to the server log and nowhere else.
 * Wire it to email (Resend, Postmark, a form service) before this goes
 * public; see the note there.
 */

export type EnquireState = {
  status: "idle" | "ok" | "error";
  message: string;
};

/** Loose on purpose, as in subscribe.ts: a typo costs one reply not arriving. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Long enough for a proper brief, short enough that a paste of a whole
    document is turned back rather than logged. */
const MAX_MESSAGE = 5000;

export async function enquire(
  _previous: EnquireState,
  formData: FormData,
): Promise<EnquireState> {
  // The honeypot, answered with success for the same reason as the list's.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "ok", message: "Thanks. I’ll be in touch." };
  }

  const message = String(formData.get("message") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!message) {
    return { status: "error", message: "Tell me a little about it." };
  }

  if (message.length > MAX_MESSAGE) {
    return { status: "error", message: "A shorter version, if you can." };
  }

  if (!email) {
    return { status: "error", message: "An address to reply to would help." };
  }

  if (email.length > 254 || !LOOKS_LIKE_EMAIL.test(email)) {
    return { status: "error", message: "That doesn’t look like an email." };
  }

  await deliver(email, message);

  return { status: "ok", message: "Thanks. I’ll be in touch." };
}

/**
 * The one place a provider gets wired in: one POST with an API key from the
 * environment, sending the message to her inbox with `email` as reply-to.
 * Until then it only logs, so nothing is kept anywhere it would be forgotten.
 */
async function deliver(email: string, message: string) {
  console.info("[enquire] no provider configured — not sent:", { email, message });
}
