/**
 * The `[TBC]` marker — the most-used component on day one.
 *
 * `MEMORY.md` §5 still lists package tiers, capacity, the enquiry channel and
 * the venue story as Missing, and D-05 requires the gap to be *visible*: a
 * plausible-looking placeholder published on a real bar's site sends real
 * people to a closed door. It says what is missing and who owns it, in plain
 * words, so a reviewer never has to open `MEMORY.md` §5 to find out, and it is
 * never a heading.
 *
 * A dashed underline rather than a dashed box: a box is a component, and a
 * placeholder should not look like one. Dashed is still reserved — nothing else
 * on this site uses it — so the marker stays unmistakable at a glance.
 *
 * The literal `[TBC]` string is kept deliberately. It is the ship guard:
 * `grep -r '\[TBC\]' dist/` must return zero before this site can be deployed,
 * and that is what turns "no fabricated venue content" from a promise into a
 * mechanism.
 */
interface TbcProps {
  /** What is missing, e.g. "package name". */
  children: string;
  /** Who it comes from. Defaults to the client, which is true of all but one. */
  from?: string;
  className?: string;
}

export function Tbc({ children, from = 'client', className = '' }: TbcProps) {
  return (
    <span className={`tbc ${className}`} aria-label="Content to be confirmed">
      <span className="label mr-2xs">[TBC]</span>
      {children}, from {from}
    </span>
  );
}
