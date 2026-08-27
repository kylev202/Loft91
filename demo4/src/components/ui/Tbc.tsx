/**
 * The [TBC] marker — still the most-used component on day one.
 *
 * MEMORY.md §5 lists function package tiers, venue capacity, the enquiry
 * channel and the venue story as Missing, and D-05 requires those gaps to be
 * *visible*: a plausible-looking placeholder published on a real bar's website
 * sends real people to a closed door.
 *
 * It always says two things — what is missing, and who owns it — so a reviewer
 * never has to open MEMORY.md to find out.
 *
 * The marker was brass in Nocturne, where the accent was the loudest thing on
 * the page. There is no accent here, so it takes full ink instead: on a page
 * whose body copy sits at 0.70 alpha, the darkest available value is still the
 * thing your eye lands on first, which is exactly what this marker is for.
 */
export function Tbc({ what, owner = 'client' }: { what: string; owner?: string }) {
  return (
    <span className="tbc">
      <span className="label mr-2xs text-ink">[TBC]</span>
      {what} — {owner}
    </span>
  );
}
