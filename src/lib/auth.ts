/* ==========================================================================
   auth.ts — the credential on /admin/, and the exact size of what it buys.

   ── READ THIS BEFORE TRUSTING THE LOCK ───────────────────────────────────
   demo4 is a static build. There is no server, so there is nothing to
   authenticate *against*: the check below happens in the page, against a value
   that ships in the page. Anybody determined enough to open the bundle can find
   the check and step around it, and no amount of hashing changes that. The
   previous version of `pages/admin.tsx` argued from exactly that fact to "so
   there should be no lock at all", and the argument was sound as far as it went.

   What it missed is the device this board actually lives on. It is the owner's
   phone, or the laptop behind the bar — and the thing a passphrase stops is not
   an attacker, it is the next person who picks that phone up and reads a
   customer's mobile number off a screen somebody left open. That is a real
   risk, it is the *only* risk this page has while the store is local, and a
   latch is the right size of answer to it.

   So, stated plainly, and stated on the page too. This is:

     · a latch on a shared screen, and
     · the login flow the venue keeps when a backend arrives — the form, the
       session, the log-out — so answering MEMORY.md Q3 replaces `signIn` and
       leaves every other line here standing.

   It is NOT protection of the enquiry data. That data is not on a server; it is
   in `localStorage`, one browser profile deep, and a stranger who opens this URL
   on their own phone gets an empty board whether they log in or not.

   ── Why the passphrase is hashed ─────────────────────────────────────────
   Obfuscation, not secrecy, and the difference is worth naming. A SHA-256
   digest keeps the passphrase out of a devtools panel a curious customer is
   scrolling; it would not survive anybody who actually wanted in, because the
   passphrase is short enough to guess against the digest. Both things are true
   at once. The page claims the first and never the second.

   To change it, hash the new passphrase and paste the result over
   `PASSPHRASE_SHA256`:

     node -e "console.log(require('crypto').createHash('sha256').update(process.argv[1]).digest('hex'))" "the new passphrase"
   ========================================================================== */

/** Lower-cased on both sides before comparison — a name typed into a phone at
    the start of a shift arrives capitalised about half the time. */
export const ADMIN_USER = 'loft91';

/** SHA-256, hex. See the header for how to replace it. */
const PASSPHRASE_SHA256 = 'a05bb107e150fb0a39f1b0e909f266dc58f785439f9dc57639d00a6703a2fa3d';

const SESSION_KEY = 'l91-admin-session';

/** Seven days, then the board asks again.
 *
 *  `sessionStorage` would be the more cautious store — it dies with the tab —
 *  but it also means logging in every single time the owner reopens Safari on a
 *  page they check daily, and a lock that annoying is one that gets written on
 *  a sticky note. A week, with a Log out button on the page for the moment it
 *  actually matters, is the honest balance. */
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export interface Session {
  readonly user: string;
  /** Epoch ms. Past this, the session is gone. */
  readonly until: number;
}

/** Reached through a getter for the same reason as the enquiry store: touching
    `localStorage` throws outright in a browser set to block site data, and that
    must not take the module's import — and the whole page — with it. */
function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** The signed-in session, or `null`. An expired or malformed one is cleared on
    the way past rather than left to fail the same check on every render. */
export function readSession(): Session | null {
  try {
    const raw = storage()?.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const session = parsed as Session;
    if (typeof session.user !== 'string' || typeof session.until !== 'number') return null;
    if (Date.now() > session.until) {
      signOut();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function signOut(): void {
  try {
    storage()?.removeItem(SESSION_KEY);
  } catch {
    /* Nothing to do and nothing to report: the caller has already dropped the
       session from React state, so the board is closed either way. */
  }
}

/** `'unavailable'` is a real outcome, not an error path.
 *
 *  `crypto.subtle` exists only in a secure context — https, or localhost. That
 *  covers the deployed site and `npm run dev`, and excludes exactly one case:
 *  opening the dev server from a phone on the LAN by IP. The form says so in
 *  those words rather than reporting a wrong passphrase, because "you typed it
 *  wrong" would be a lie and the fix (open it over https or on localhost) is
 *  not one anybody guesses. */
export type SignInResult = 'ok' | 'wrong' | 'unavailable';

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Check the credential and, if it matches, open a session.
 *
 * A failed write to `localStorage` still returns `ok`: the caller holds the
 * signed-in state in React either way, so a browser blocking site data costs
 * the owner a fresh login on the next reload and nothing else. That browser
 * has no stored enquiries to show either, which is the more visible half of
 * the same limitation.
 */
export async function signIn(user: string, passphrase: string): Promise<SignInResult> {
  if (!globalThis.crypto?.subtle) return 'unavailable';

  const digest = await sha256Hex(passphrase);
  if (user.trim().toLowerCase() !== ADMIN_USER || digest !== PASSPHRASE_SHA256) return 'wrong';

  const session: Session = { user: ADMIN_USER, until: Date.now() + SESSION_MS };
  try {
    storage()?.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* See above — the session lives in React for as long as the tab does. */
  }
  return 'ok';
}
