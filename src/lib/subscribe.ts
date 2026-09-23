"use server";

/**
 * The mailing list's server action.
 *
 * NOTHING IS STORED YET. This validates the address, drops the obvious junk,
 * and reports success — but `deliver()` at the bottom of this file has no
 * provider behind it, so an address entered on the live site goes to the server
 * log and nowhere else. The form therefore tells people they are on a list that
 * does not exist. Pick a provider before this goes public; see the note there.
 */

export type SubscribeState = {
  status: "idle" | "ok" | "error";
  message: string;
};

/**
 * Deliberately loose. The only test that means anything is whether the address
 * accepts mail, and the cost of a typo getting through is one note not
 * arriving. Stricter patterns reject real addresses — plus-tags, long TLDs,
 * quoted local parts — far more often than they catch a genuine mistake.
 */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribe(
  _previous: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  // The honeypot. A person never sees the field, so anything in it came from a
  // bot filling every input on the page. Answered with the success message
  // rather than an error: telling a scraper which of its submissions failed is
  // how it learns to get past this.
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "ok", message: "Noted. Talk soon, maybe." };
  }

  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { status: "error", message: "An address would help." };
  }

  // 254 is the RFC 5321 ceiling for a whole address. Checked before the pattern
  // so a megabyte of text in the field is rejected on its length rather than
  // being handed to the regex.
  if (email.length > 254 || !LOOKS_LIKE_EMAIL.test(email)) {
    return { status: "error", message: "That doesn’t look like an email." };
  }

  await deliver(email);

  return { status: "ok", message: "Noted. Talk soon, maybe." };
}

/**
 * The one place a provider gets wired in — Buttondown, Mailchimp, a Supabase
 * table, whatever Charlotte ends up wanting to write in. One POST with an API
 * key from the environment replaces the body of this function and nothing else
 * in the codebase moves.
 *
 * Until then it keeps the address out of anything persistent on purpose: a
 * half-wired list that silently collects addresses with no way to mail them,
 * and no record of consent, is worse than no list.
 */
async function deliver(email: string) {
  console.info("[subscribe] no provider configured — not stored:", email);
}
