import { useId } from 'react';

/**
 * A written field — the text half of the form, built to sit level with
 * `Select` so a column of controls reads as one column rather than as two
 * kinds of thing.
 *
 * The shared anatomy is three parts and it is the same in both files: the
 * small wide-tracked label, an `Optional` marker at the far end of that same
 * baseline, and the control itself sitting on a single hairline. **A rule, not
 * a box.** Every group on this site is marked with a rule — the hours table,
 * the tier lists, the footer index, the FAQ — and a form full of bordered
 * rectangles would be the only boxed component on the whole build. Since the
 * client asked for the selection box's border to come off (2026-09-03) that is
 * now true without exception: there is not a rectangle anywhere in the form.
 *
 * The line under the control is in two layers, and they are the same two the
 * selection box uses:
 *
 *   · at rest, a hairline in `--color-outline` (4.01:1) — the affordance, so
 *     it has a 3:1 floor to clear, which `--color-rule-strong` at 1.69:1 does
 *     not;
 *   · over it, `.rule-sweep`, full ink, scaling open from its own centre when
 *     the field is focused, filled in, or flagged.
 *
 * That makes a column of fields scannable in one look: the ones already dealt
 * with are underlined in ink, the ones still waiting are not.
 *
 * Optional is marked rather than required, which is the opposite of the usual
 * asterisk. Five of the eight fields here are required, so marking those would
 * pepper the form with five asterisks to say "yes, this one too"; marking the
 * three that can be skipped says something the visitor did not already assume.
 * `required` is still set on the element, so the browser and the screen reader
 * both know — this is about what is printed, not about semantics.
 *
 * ── Errors are red (client instruction, 2026-09-03) ──────────────────────
 * *"error input should appears red to inform retry."* They were the ink
 * colour, on the argument that this system has no second hue to spend. The
 * client's point is the stronger one: an error message set in the same ink as
 * every other line on the page has to be *read* before it is understood, and a
 * form is the one place on a site where something has genuinely gone wrong and
 * the visitor needs to know at a glance which field to go back to.
 *
 * So `--color-error` exists (see `theme.css`, where the exception is argued
 * out) and three things turn: the resting hairline, the sweeping line, and the
 * message. The value the visitor typed stays in ink — colouring their own
 * words red would suggest the text itself is the problem rather than the field.
 *
 * Colour is never the only signal. The message is still text, `aria-invalid`
 * and `aria-describedby` still announce it, and the line still sweeps — which
 * is what keeps the field legible to anyone who cannot see the red at all
 * (WCAG 1.4.1: colour is not used as the only means of conveying information).
 */
export function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder,
  error,
  optional = false,
  maxLength,
  hint,
  /** A `<textarea>` instead of an `<input>`, for the one field that runs long. */
  multiline = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  /* No `'date'`. A date is asked for with `DatePicker`, which draws its own
     calendar — routing one through here would reopen the OS picker that
     component exists to replace. */
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel';
  placeholder?: string;
  error?: string;
  optional?: boolean;
  maxLength?: number;
  /** A quiet line under the control. Guidance, never a validation message. */
  hint?: string;
  multiline?: boolean;
}) {
  const uid = useId();
  const errorId = `${uid}-error`;
  const hintId = `${uid}-hint`;

  /* Only what CSS cannot see. Focus used to be tracked here as a fourth piece
     of React state; it is now `.focus-line:focus ~ .rule-sweep` in base.css,
     which is where a pseudo-class belongs — the state, the handlers and the
     re-render on every focus and blur all go with it. "Has a value" and "is in
     error" are not CSS states, so those two stay. */
  const live = Boolean(value) || Boolean(error);

  const described = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

  const skin = `focus-line block w-full border-b bg-transparent pt-xs pb-2xs text-item text-ink placeholder:text-ink-3 ${
    error ? 'border-error' : 'border-outline'
  }`;

  const shared = {
    id: uid,
    name,
    value,
    placeholder,
    maxLength,
    required: !optional,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': described || undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
  };

  return (
    <div>
      <label htmlFor={uid} className="flex items-baseline justify-between gap-md">
        <span className="label text-ink-3">{label}</span>
        {optional && (
          /* `text-ink-3`, not `text-ink-4` — see the note on the same marker in
             `Select`. A word the visitor is meant to read is not decoration. */
          <span className="label text-ink-3" aria-hidden="true">
            Optional
          </span>
        )}
      </label>

      <div className="relative">
        {multiline ? (
          <textarea {...shared} rows={5} className={`${skin} min-h-32 resize-y`} />
        ) : (
          <input
            {...shared}
            type={type}
            autoComplete={autoComplete}
            inputMode={inputMode}
            className={`${skin} min-h-14`}
          />
        )}

        {/* The state, drawn as a line. See `.rule-sweep` in base.css. */}
        <span aria-hidden="true" className="rule-sweep" data-on={live} data-error={Boolean(error)} />
      </div>

      {hint && (
        <p id={hintId} className="mt-2xs text-small text-ink-3">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2xs text-small text-error">
          {error}
        </p>
      )}
    </div>
  );
}
