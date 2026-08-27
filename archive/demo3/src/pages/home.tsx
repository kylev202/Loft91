import { mount } from '../lib/mount';
import { HomeCover } from '../components/HomeCover';
import { Band } from '../components/Band';
import { Feature } from '../components/Feature';
import { HappyHourPanel } from '../components/HappyHour';
import { Bento, BentoBox } from '../components/Bento';
import { Strip } from '../components/Strip';
import { FaqList } from '../components/FaqList';
import { SectionHead } from '../components/SectionHead';
import { SectionLink } from '../components/ui/SectionLink';
import { Frame } from '../components/ui/Frame';
import { Button } from '../components/ui/Button';
import { Tbc } from '../components/ui/Tbc';
import { standoutFaqs } from '../data/faq';
import { happyHour } from '../data/menu';
import { photos } from '../data/photos';
import { venue } from '../data/venue';

/**
 * The index page: the full landing page from `demo/`, section for section, with
 * every section condensed and handed off to its own document.
 *
 * It is no longer the four-gateway front door it was — the brief changed to
 * "take the same design of the landing page, all the components and boxes,
 * minimise the content, and redirect to the page". So each section keeps the
 * *shape* it had on the one-page build (a feature photograph, the happy-hour
 * figures, the asymmetrical bento, the gallery strip, the disclosure list, the
 * 5/7 editorial split) and carries only as much content as earns its place
 * above a hand-off:
 *
 *   Menu       happy hour in full — the one fact that changes what time
 *              somebody leaves the house — and the drinks list on `/menu/`
 *   Packages   three boxes for the shape of it, the detail on `/packages/`
 *   Gallery    the seven frames as a strip you flick through, in full on
 *              `/gallery/`
 *   FAQ        the three a function organiser asks first, the rest on `/faq/`
 *   Visit      stays below as content, not as a gateway — a visitor who only
 *              ever sees this page still has to be able to find the door
 *
 * Section heads carry no numerals here. The `01`…`05` belong to the
 * destinations, and printing them twice on one page would name two things once
 * (the rule `SectionHead` was written with).
 */

/* -- 01 · Menu ------------------------------------------------------------ */
// Page ground, not `bg-panel`: the happy-hour block is itself the raised
// surface in this section, and a panel on panel is not a panel.
function MenuSection() {
  return (
    <section id="menu" aria-labelledby="menu-h" className="shell section-pad">
      {/* The photo used to run full-bleed below the head, a whole extra screen
          of scroll before the happy-hour figures. Paired beside the head
          instead, it stays the section's one picture without outweighing the
          content it is meant to break up. */}
      <div className="mb-2xl lg:grid lg:grid-cols-2 lg:items-center lg:gap-xl">
        <SectionHead
          label="Menu"
          heading={<span id="menu-h">Drinks, poured upstairs</span>}
          href="/menu/"
          standfirst={
            <>
              Happy hour runs {happyHour.when}. The rest of the list — beer, spirits, soju,
              cocktails and snacks — is on the menu page.
            </>
          }
        />

        <Feature
          photo={photos.taps}
          coverFor="/menu/"
          caption="The bar, upstairs at 91 Nicholson"
          compact
        />
      </div>

      <HappyHourPanel />

      <SectionLink href="/menu/">See the full drinks list</SectionLink>
    </section>
  );
}

/* -- 02 · Packages -------------------------------------------------------- */
function PackagesSection() {
  return (
    <section id="packages" aria-labelledby="packages-h" className="shell section-pad">
      {/* Same reasoning as the Menu section above: paired beside the head
          instead of run full-bleed beneath it, so the photo stays this
          section's one picture without outweighing the Bento grid. */}
      <div className="mb-2xl lg:grid lg:grid-cols-2 lg:items-center lg:gap-xl">
        <SectionHead
          label="Functions & venue hire"
          heading={<span id="packages-h">The room, for whatever you are putting in it</span>}
          href="/packages/"
          standfirst="One upstairs room with its own bar, a wall-sized screen and seating along the white brick."
        />

        <Feature
          photo={photos.event}
          coverFor="/packages/"
          caption="The room, set for a function"
          compact
        />
      </div>

      {/* Everything stated below is read off the client's own photographs, which
          is reading a source. There is no capacity figure, no minimum spend and
          no inclusion list, because there is no source for those — MEMORY.md §5
          lists them Missing and D-05 forbids filling the gap with something
          plausible. */}
      <Bento>
        <BentoBox
          wide
          title="The room"
          meta="One upstairs room, a flight up from Nicholson Street"
          href="/packages/"
        >
          <ul className="grid gap-2xs text-body text-ink-2">
            <li>A full bar in the room — draught taps, spirits, cocktails</li>
            <li>A wall-sized screen running the width of the room</li>
            <li>Tables and bentwood chairs, plus banquette seating along one wall</li>
          </ul>
        </BentoBox>

        <BentoBox title="Capacity" meta="Seated and standing" href="/packages/">
          <p>
            <Tbc what="standing and seated capacity" />
          </p>
        </BentoBox>

        <BentoBox
          title="Packages & pricing"
          meta="Tiers, inclusions, minimum spend"
          href="/packages/"
        >
          <p>
            <Tbc what="package tiers, what each includes, and minimum spend" />
          </p>
        </BentoBox>
      </Bento>

      <SectionLink href="/packages/">See what the room does, and how to enquire</SectionLink>
    </section>
  );
}

/* -- 03 · Gallery --------------------------------------------------------- */
function GallerySection() {
  return (
    <section id="gallery" aria-labelledby="gallery-h" className="section-pad">
      <div className="shell">
        <SectionHead
          label="The room"
          heading={<span id="gallery-h">From the street to the top of the stairs</span>}
          href="/gallery/"
          standfirst="The neon stairwell, the bar, the room and the screen wall — seven frames, in the order the arrival actually happens."
        />
      </div>

      {/* Outside `.shell`: the strip is full-bleed by design, and running off
          the right edge of the screen is how it says there is more of it. */}
      <Strip />

      <div className="shell">
        <SectionLink href="/gallery/">See the full gallery</SectionLink>
      </div>
    </section>
  );
}

/* -- 04 · FAQ ------------------------------------------------------------- */
function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="bg-panel">
      <div className="shell section-pad">
        <SectionHead
          label="Questions"
          heading={<span id="faq-h">What function organisers ask first</span>}
          href="/faq/"
          standfirst="Three of them here. Hours, food, booking and where the door actually is are on the questions page."
        />

        <FaqList items={standoutFaqs} />

        <SectionLink href="/faq/">Read all the questions</SectionLink>
      </div>
    </section>
  );
}

/* -- 05 · Visit ----------------------------------------------------------- */
function VisitSection() {
  return (
    <section id="visit" aria-labelledby="visit-h" className="shell section-pad">
      <SectionHead
        label="Visit"
        heading={<span id="visit-h">Upstairs, beside the deli</span>}
        standfirst="At street level Loft 91 is an unmarked stairwell — the lit arch next to Crumbz Deli. The sign is above the door, not on the street."
      />

      <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
        {/* The wayfinding frame, not decoration: this is the thing you actually
            look for. It is also the About us cover, so pressing through morphs
            from here into that page. */}
        <div className="lg:col-span-5">
          <div className="plate aspect-3/4 w-full" data-plate data-cover-for="/about/">
            <Frame
              photo={photos.entrance}
              sizes="(min-width: 64rem) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>

          <address className="mt-md text-lead text-ink not-italic" data-reveal>
            <a
              href={venue.maps}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors duration-(--dur-micro) ease-out hover:text-brass"
            >
              {venue.address.line1}
              <br />
              {venue.address.line2}
            </a>
          </address>

          <p className="mt-md" data-reveal>
            <Tbc what={venue.address.tbc} />
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h3 className="label text-ink-3" data-reveal>
            Hours
          </h3>
          <dl className="mt-md" data-reveal>
            {venue.hours.map(({ day, opens, closes }) => (
              <div
                key={day}
                className="flex items-baseline justify-between gap-md border-b border-rule py-xs"
              >
                <dt className="text-item text-ink">{day}</dt>
                <dd className="text-item text-ink tabular-nums">
                  {opens} – {closes}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-md border-b border-rule py-xs">
              <dt className="text-item text-ink-3">{venue.hoursGap.days}</dt>
              <dd className="text-item text-ink-3">{venue.hoursGap.state}</dd>
            </div>
          </dl>

          <p className="mt-md" data-reveal>
            <Tbc what={venue.hoursTbc} />
          </p>

          <h3 className="label mt-2xl text-ink-3" data-reveal>
            Functions
          </h3>
          <p className="mt-md max-w-(--container-measure) text-body text-ink-2" data-reveal>
            Today the venue publishes one enquiry channel: an {venue.bookings.channel} to{' '}
            {venue.instagram.handle}.
          </p>
          <p className="mt-md" data-reveal>
            <Tbc what={venue.bookings.tbc} />
          </p>

          <div className="mt-xl flex flex-wrap gap-sm" data-reveal>
            <Button href={venue.maps} variant="secondary" external>
              Open in Maps
            </Button>
            <Button href="/about/" variant="secondary">
              About the venue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

mount(
  'home',
  <>
    <HomeCover />
    <Band />
    <MenuSection />
    <PackagesSection />
    <GallerySection />
    <FaqSection />
    <VisitSection />
  </>,
);
