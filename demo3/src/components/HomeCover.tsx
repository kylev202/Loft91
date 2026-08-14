import { CoverFrame } from '../shell/Cover';
import { home } from '../data/site';
import { venue, hoursSummary } from '../data/venue';
import { wordmarkWhite } from '../data/photos';
import { Button } from './ui/Button';

/**
 * The home cover. The brief asks for "an aesthetic homepage that clearly shows
 * their branding" (MEMORY.md §3.1), so the wordmark is the hero here rather
 * than a line of type — it is set large, on the venue's own backlit counter,
 * which is the photograph this entire palette was sampled from.
 *
 * The statement below it is hand-broken into three lines rather than left to
 * wrap, so the lockup holds the same shape at every width. Its wording is
 * INTERIM — composed only from §1 confirmed facts, not client-approved.
 *
 * The bottom row is the four things somebody standing on Nicholson Street at
 * 9 PM actually needs: what it is, when it is open, and the two ways in.
 */
export function HomeCover() {
  return (
    <CoverFrame photo={home.photo} tall>
      <h1 data-cover-tail>
        <img
          src={wordmarkWhite.src}
          srcSet={wordmarkWhite.srcSet}
          sizes="(min-width: 64rem) 620px, 64vw"
          width={wordmarkWhite.w}
          height={wordmarkWhite.h}
          alt={venue.name}
          className="w-[min(540px,58vw)] short:w-[min(400px,52vw)]"
          translate="no"
        />
      </h1>

      <p className="mt-md font-editorial text-statement text-ink short:mt-2xs">
        {home.statementLines.map((line) => (
          <span key={line} className="line-mask" data-cover-line>
            <span className="block">{line}</span>
          </span>
        ))}
      </p>

      <div className="rule-brass mt-lg w-full short:mt-md" data-cover-rule />

      {/* On a 640px-tall phone the full-height lockup pushed the primary CTA
          90px below the fold. Nothing is hidden to fix it and the type is not
          shrunk to fit: the two vertical rhythms tighten, the wordmark steps
          down one size, and the CTA label shortens to "Enquire" — every fact
          in the row survives. */}
      <div className="mt-lg flex flex-col gap-lg lg:flex-row lg:items-end lg:justify-between short:mt-md short:gap-md">
        <dl
          className="flex flex-col gap-md sm:flex-row sm:gap-2xl short:gap-2xs"
          data-cover-tail
        >
          <div>
            <dt className="label text-ink">Open</dt>
            <dd className="mt-2xs text-body text-ink">{hoursSummary}</dd>
          </div>
          <div>
            <dt className="label text-ink">Where</dt>
            <dd className="mt-2xs text-body text-ink">{venue.address.short}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-sm" data-cover-tail>
          <Button href="/menu/" variant="secondary">
            See the menu
          </Button>
          <Button href="/packages/#enquire" variant="primary">
            <span className="short:hidden">Enquire about functions</span>
            <span className="hidden short:inline">Enquire</span>
          </Button>
        </div>
      </div>
    </CoverFrame>
  );
}
