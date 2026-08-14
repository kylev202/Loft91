import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { SectionHead } from '../components/SectionHead';
import { Frame } from '../components/ui/Frame';
import { Button } from '../components/ui/Button';
import { Tbc } from '../components/ui/Tbc';
import { pageById } from '../data/site';
import { photos } from '../data/photos';
import { venue } from '../data/venue';

const page = pageById('visit');

/**
 * Everything on this page is operationally load-bearing: published hours send
 * real people to a real door. MEMORY.md §1.1 carries an explicit warning about
 * exactly that, and Q1 is still open.
 *
 * So the hours table renders what the Instagram bio says and *nothing more*.
 * "late" is printed as the literal word rather than resolved into a wall-clock
 * time nobody has confirmed, and Monday to Thursday reads "Not published" —
 * which is true — rather than "Closed", which would be a guess.
 *
 * The FAQ answers only what a source supports. Where the honest answer is "we
 * do not know yet", it says that and names who owns it.
 */
const faqs = [
  {
    q: 'Do I need to book?',
    a: (
      <>
        For functions and venue hire, enquiries go through Instagram — it is the only channel the
        venue publishes today. <Tbc what="whether walk-in tables can be booked, and how" />
      </>
    ),
  },
  {
    q: 'Are you open during the week?',
    a: (
      <>
        Friday, Saturday and Sunday are the published trading days. Monday to Thursday are not
        listed. <Tbc what="whether Mon–Thu are closed, or available for private hire" />
      </>
    ),
  },
  {
    q: 'What time do you close?',
    a: (
      <>
        The venue’s own listing says “late” for Friday and Saturday, and 8 PM on Sunday. That word
        is printed here exactly as published rather than turned into a time.{' '}
        <Tbc what="an actual closing time for Fri & Sat" />
      </>
    ),
  },
  {
    q: 'Is there food?',
    a: (
      <>
        The bar menu lists snacks — chips, crackling and nuts.{' '}
        <Tbc what="whether a kitchen menu or function catering exists" />
      </>
    ),
  },
  {
    q: 'Where exactly is the entrance?',
    a: <>At street level it is the lit arched stairwell beside Crumbz Deli, with the LOFT91 sign above the door. There is no ground-floor frontage — the venue is one flight up.</>,
  },
] as const;

mount(
  'visit',
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

    {/* --- 01 Hours ------------------------------------------------------- */}
    <section aria-labelledby="hours" className="shell section-pad">
      <SectionHead
        index="01"
        label="Hours"
        heading={<span id="hours">When the bar is open</span>}
      />

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
    </section>

    {/* --- 02 Getting here ------------------------------------------------ */}
    <section aria-labelledby="getting-here" className="bg-panel">
      <div className="shell section-pad">
        <SectionHead
          index="02"
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
      </div>
    </section>

    {/* --- 03 Questions --------------------------------------------------- */}
    <section aria-labelledby="questions" className="shell section-pad">
      <SectionHead
        index="03"
        label="Questions"
        heading={<span id="questions">Before you come up</span>}
      />

      <div className="max-w-(--container-measure)">
        {faqs.map(({ q, a }) => (
          <details key={q} className="group border-b border-rule" data-reveal>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-md py-sm text-item text-ink marker:hidden">
              {q}
              <span
                aria-hidden="true"
                className="shrink-0 text-brass transition-transform duration-(--dur-short) ease-out group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="pb-md text-body text-ink-2">{a}</div>
          </details>
        ))}
      </div>
    </section>
  </>,
);
