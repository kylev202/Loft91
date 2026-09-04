import { useState } from 'react';
import { Field } from './ui/Field';
import { buttonClass } from './ui/Button';
import { ADMIN_USER, signIn } from '../lib/auth';

/**
 * The log-in on `/admin/`.
 *
 * A real `<form>` with a real submit, `autocomplete="username"` and
 * `autocomplete="current-password"` on the two fields — which is what lets a
 * password manager fill it and the phone keyboard show a Go key. A pair of
 * `<div>`s with a click handler would look identical and do none of that.
 *
 * ── One message, not two ─────────────────────────────────────────────────
 * A wrong user and a wrong passphrase produce the same sentence, and neither
 * field is flagged individually. Naming which half was wrong is the standard
 * mistake: it confirms a valid user name to somebody guessing, and it buys the
 * owner — who has one credential and knows both halves of it — nothing at all.
 *
 * The message is form-level and `role="alert"`, so it is announced when it
 * appears rather than only found by somebody tabbing back through the form.
 *
 * Nothing else is on the screen. The two fields and the button are the whole
 * page: an explanation of what the lock is worth belongs in `lib/auth.ts`,
 * where the person who can act on it will read it, not in front of the person
 * trying to get in.
 */
export function AdminLogin({ onSignedIn }: { onSignedIn: (user: string) => void }) {
  const [user, setUser] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  /* Disables the button for the length of one digest, which is a millisecond —
     it exists to stop a double submit firing two hashes, not to cover a wait. */
  const [checking, setChecking] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (checking) return;

    setChecking(true);
    setError('');

    const result = await signIn(user, passphrase);

    if (result === 'ok') {
      onSignedIn(ADMIN_USER);
      return; // this component is about to unmount; leave `checking` alone
    }

    setPassphrase('');
    setError(
      result === 'unavailable'
        ? 'This browser cannot check the passphrase over a plain connection. Open the board on https, or on localhost.'
        : 'That user and passphrase do not match.',
    );
    setChecking(false);
  };

  return (
    <form onSubmit={submit} className="grid max-w-96 gap-lg">
      {/* No `autocapitalize` override, and none is needed: `signIn` lower-cases
          the user before comparing, so a phone keyboard capitalising the first
          letter costs nothing. */}
      <Field label="User" name="user" value={user} onChange={setUser} autoComplete="username" />

      <Field
        label="Passphrase"
        name="passphrase"
        type="password"
        value={passphrase}
        onChange={setPassphrase}
        autoComplete="current-password"
      />

      {error && (
        <p role="alert" className="text-small text-error">
          {error}
        </p>
      )}

      <div>
        <button type="submit" disabled={checking} className={buttonClass('primary')}>
          Log in
        </button>
      </div>
    </form>
  );
}
