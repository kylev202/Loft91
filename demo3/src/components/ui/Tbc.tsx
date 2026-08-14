/**
 * The [TBC] marker — the most-used component on day one.
 *
 * MEMORY.md §5 still lists function package tiers, venue capacity, the enquiry
 * channel and the venue story as Missing, and D-05 requires those gaps to be
 * *visible*: a plausible-looking placeholder published on a real bar's website
 * sends real people to a closed door.
 *
 * It always says two things — what is missing, and who owns it — so a reviewer
 * never has to open MEMORY.md to find out.
 */
export function Tbc({ what, owner = 'client' }: { what: string; owner?: string }) {
  return (
    <span className="tbc">
      <span className="label mr-2xs text-brass">[TBC]</span>
      {what} — {owner}
    </span>
  );
}
