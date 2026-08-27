import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { SectionHead } from '../components/SectionHead';
import { Frame } from '../components/ui/Frame';
import { Button } from '../components/ui/Button';
import { Tbc } from '../components/ui/Tbc';
import { SectionLink } from '../components/ui/SectionLink';
import { pageById } from '../data/site';
import { photos } from '../data/photos';
import { venue } from '../data/venue';

const page = pageById('about');

/**
 * About us — the fourth nav destination, and the page the Visit page became.
 *
 * The rename is not cosmetic. As "Visit" this document was hours + directions,
 * and both of those now also sit at the foot of the home page, where a visitor
 * who never leaves the index page still needs them. What is left that only
 * belongs here is what the venue *is*: the room, the position, the trading
 * pattern, and the door you have to know about to get in.
 *
 * Which is exactly where the honesty problem sits. MEMORY.md §5 lists the venue
 * story as **Missing** — nobody has told us when it opened, who runs it or what
 * it is for — and an About page is precisely the page where that gap is most
 * tempting to fill with atmosphere. It is not filled. Every sentence below is
 * either a §1 fact, a description of a client-supplied photograph, or a visible
 * [TBC] with an owner.
 *
 * Everything operational here is load-bearing: published hours send real people
 * to a real door. "late" is printed as the literal word rather than resolved
 * into a wall-clock time nobody has confirmed, and Monday to Thursday reads
 * "Not published" — which is true — rather than "Closed", which would be a
 * guess.
 */
mount(
  'about',
  <>
    <Cover
      index={page.index}
      eyebrow={page.eyebrow}
      name={page.name}
      statement={page.statement}
      photo={page.photo}
    >
      <div className="mt-xl flex flex-wrap gap-sm" data-cover-tail>
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
        standfirst="Loft 91 trades Friday and Saturday nights and Sunday afternoons, one flight above Nicholson Street. The same room is the bar and the function space — there is no second floor and no other entrance."
      />

      <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="max-w-(--container-measure) text-lead text-ink-2" data-reveal>
            The room has its own bar with draught taps and spirits, a wall-sized screen along one
            wall, and tables and banquette seating on white brick. That is what the venue’s own
            photographs show, and it is as far as this page will go on its behalf.
          </p>

          <p className="mt-lg" data-reveal>
            <Tbc what="the venue’s own story — when it opened, who runs it, and how it would like to describe itself" />
          </p>

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
    <section aria-labelledby="hours" className="bg-panel">
      <div className="shell section-pad">
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
            <div
              className="flex items-baseline justify-between gap-md border-b border-rule py-md"
              data-reveal
            >
              <dt className="text-item text-ink-3">{venue.hoursGap.days}</dt>
              <dd className="text-item text-ink-3">{venue.hoursGap.state}</dd>
            </div>
          </dl>

          <div className="lg:col-span-4 lg:col-start-9">
            <h3 className="label text-ink-3">Address</h3>
            <address className="mt-2xs text-lead text-ink not-italic">
              {venue.address.line1}
              <br />
              {venue.address.line2}
            </address>
            <p className="mt-md">
              <Tbc what={venue.address.tbc} />
            </p>
            <p className="mt-lg">
              <Tbc what={venue.hoursTbc} />
            </p>
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
        standfirst="There is no ground-floor frontage. From the footpath the venue is a stairwell edged in magenta neon, immediately beside the deli, with the sign mounted above the doorway."
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
      <SectionLink href="/faq/">Questions people ask before they come up</SectionLink>
    </section>
  </>,
);
