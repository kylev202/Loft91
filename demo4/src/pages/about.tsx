import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { SectionHead } from '../components/SectionHead';
import { Frame } from '../components/ui/Frame';
import { Button } from '../components/ui/Button';
import { SectionLink } from '../components/ui/SectionLink';
import { pageById } from '../data/site';
import { photos } from '../data/photos';
import { venue } from '../data/venue';

const page = pageById('about');

/**
 * About us — the fourth nav destination, and the page the Visit page became.
 *
 * The rename is not cosmetic. As "Visit" this document was hours + directions,
 * and both of those also sit in the footer, where a visitor who never leaves
 * the index page still needs them. Since D-62 removed the notice strip, this
 * page and the footer are the only two places the hours are stated at all.
 * What is left that only belongs here is what the venue *is*: the room, the
 * position, the trading pattern, and the door you have to know about to get in.
 *
 * ⚠ Which is exactly where the honesty problem sat. MEMORY.md §5 lists the
 * venue story as ❌ Missing — nobody has told us when it opened, who runs it or
 * what it is for — and an About page is precisely the page where that gap is
 * most tempting to fill with atmosphere. It used to carry a [TBC] instead.
 * D-60 fills it, on explicit user instruction, with **invented placeholder
 * copy** held in `venue.story` and marked as invented there. The two paragraphs
 * under "The venue" are written, not sourced. They are at least kept consistent
 * with the client's own photographs and claim nothing the pictures do not show.
 *
 * Everything operational here is load-bearing: published hours send real people
 * to a real door. "late" is still printed as the literal word rather than
 * resolved into a wall-clock time nobody has confirmed. Monday to Thursday is
 * no longer printed at all: the invented "Private hire only" row went with
 * `venue.hoursGap` (D-65), so the table states the three days that are known
 * and claims nothing about the four that are not. MEMORY.md Q1 is still open.
 *
 * ── The subtitles are gone (client instruction, 2026-08-31) ───────────────
 * Four written blocks came off, and none of them was the only place its content
 * appeared:
 *
 *   · The cover statement, "A bar and function space, one flight up from
 *     Nicholson Street" — under an eyebrow reading "The venue", above a page
 *     that prints the address in full twice.
 *   · §01's standfirst, which stated the trading days — the table in §02 and
 *     the footer on every page both state them properly — and then said the
 *     bar and the function space are one room, which is the first thing
 *     `venue.story` says.
 *   · The fittings paragraph under the story: the bar, the screen wall, the
 *     brick and the banquette seating. That is the Packages feature list, in
 *     prose, on a page that links to Packages; and the two photographs beside
 *     it show all four.
 *   · §03's standfirst, "There is no ground-floor frontage…". Its exact
 *     content is the FAQ's "Where exactly is the entrance?" answer, which this
 *     page links to at the foot; the two photographs under the heading show
 *     the arch and the stairwell, and the street-level frame's alt text names
 *     the deli for a reader who cannot see them. Nothing was lost for anyone.
 */
mount(
  'about',
  <>
    <Cover
      index={page.index}
      eyebrow={page.eyebrow}
      name={page.name}
      photo={page.photo}
    >
      <div className="mt-0 flex flex-wrap gap-sm lg:mt-xl" data-cover-tail>
        <Button href={venue.maps} variant="primary" external>
          Open in Google Maps
        </Button>
        <Button href={venue.instagram.url} variant="secondary" external>
          {venue.instagram.handle}
        </Button>
      </div>
    </Cover>

    {/* --- 01 The venue --------------------------------------------------- */}
    <section aria-labelledby="the-venue" className="shell section-pad">
      <SectionHead
        index="01"
        label="The venue"
        heading={<span id="the-venue">A bar upstairs, and a room you can hire</span>}
      />

      <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
        <div className="lg:col-span-6">
          {/* ⚠ Invented copy (D-60) — `venue.story`, not a sourced fact. The
              first paragraph carries the lead, so it takes the lead size and
              the rest sit at body. */}
          {venue.story.map((para, i) => (
            <p
              key={i}
              className={`max-w-(--container-measure) ${
                i === 0 ? 'text-lead text-ink-2' : 'mt-lg text-body text-ink-2'
              }`}
              data-reveal
            >
              {para}
            </p>
          ))}

          <div className="mt-xl flex flex-wrap gap-sm" data-reveal>
            <Button href="/packages/" variant="secondary">
              Functions &amp; venue hire
            </Button>
            <Button href="/menu/" variant="secondary">
              What’s behind the bar
            </Button>
          </div>
        </div>

        <div className="grid gap-md lg:col-span-5 lg:col-start-8">
          <div className="plate aspect-16/10 w-full" data-plate>
            <Frame
              photo={photos.room}
              sizes="(min-width: 64rem) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="plate aspect-16/10 w-full" data-plate>
            <Frame
              photo={photos.lounge}
              sizes="(min-width: 64rem) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    {/* --- 02 Hours ------------------------------------------------------- */}
    <section aria-labelledby="hours" className="frame">
      {/* The tinted ground stops short of the screen, on client instruction —
          nothing on this site touches the edge any more. `frame` + `shell-inset`
          rather than a single `shell`: the panel takes `--frame` off the outside
          and gives the remaining `--gutter - --frame` back on the inside, so this
          heading lands on exactly the same left edge as the ones in the plain
          sections above and below it. The arithmetic is in base.css. */}
      <div className="rounded-plate bg-panel">
        <div className="shell-inset section-pad">
          <SectionHead index="02" label="Hours" heading={<span id="hours">When the bar is open</span>} />

          <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
            <dl className="lg:col-span-7">
              {venue.hours.map(({ day, opens, closes }) => (
                <div
                  key={day}
                  className="flex items-baseline justify-between gap-md border-b border-rule py-md"
                  data-reveal
                >
                  <dt className="text-item text-ink">{day}</dt>
                  <dd className="text-item text-ink tabular-nums">
                    {opens} – {closes}
                  </dd>
                </div>
              ))}
            </dl>

            {/* The address and the ways to reach the venue. This column used to
                be the address plus two [TBC] blocks — the street format and the
                hours confirmation. Both markers are gone (D-60); what fills the
                column instead is the contact detail the site never had. */}
            <div className="lg:col-span-4 lg:col-start-9">
              <h3 className="label text-ink-3">Address</h3>
              <address className="mt-2xs text-lead text-ink not-italic">
                {venue.address.line1}
                <br />
                {venue.address.line2}
              </address>

              <h3 className="label mt-lg text-ink-3">Get in touch</h3>
              <ul className="mt-2xs">
                <li className="border-t border-rule">
                  <a
                    href={`mailto:${venue.contact.email}`}
                    className="flex min-h-11 items-center text-body text-ink-2 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                  >
                    {venue.contact.email}
                  </a>
                </li>
                <li className="border-t border-rule">
                  <a
                    href={venue.contact.phoneHref}
                    className="flex min-h-11 items-center text-body text-ink-2 tabular-nums transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                  >
                    {venue.contact.phone}
                  </a>
                </li>
                <li className="border-t border-rule">
                  <a
                    href={venue.instagram.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex min-h-11 items-center text-body text-ink-2 transition-colors duration-(--dur-micro) ease-out hover:text-ink"
                  >
                    Instagram {venue.instagram.handle}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* --- 03 Getting here ------------------------------------------------ */}
    <section aria-labelledby="getting-here" className="shell section-pad">
      <SectionHead
        index="03"
        label="Getting here"
        heading={<span id="getting-here">Look for the lit arch</span>}
      />

      <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
        <div className="lg:col-span-5" data-plate>
          <div className="plate aspect-3/4 w-full">
            <Frame
              photo={photos.entrance}
              sizes="(min-width: 48rem) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-7" data-plate>
          <div className="plate aspect-3/4 w-full">
            <Frame
              photo={photos.stair}
              sizes="(min-width: 48rem) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-xl" data-reveal>
        <Button href={venue.maps} variant="secondary" external>
          Open in Google Maps
        </Button>
      </div>

      {/* The questions moved to their own document when the home page got an
          FAQ section — one list, one place, linked from both. */}
      <SectionLink href="/faq/">Questions</SectionLink>
    </section>
  </>,
);
