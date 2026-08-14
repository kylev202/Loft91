import { mount } from '../lib/mount';
import { HomeCover } from '../components/HomeCover';
import { Band } from '../components/Band';
import { HappyHour } from '../components/HappyHour';
import { Gateways } from '../components/Gateways';
import { SectionHead } from '../components/SectionHead';
import { Frame } from '../components/ui/Frame';
import { Button } from '../components/ui/Button';
import { photos } from '../data/photos';
import { venue } from '../data/venue';

/**
 * The index page. Its job changed completely when each destination got its own
 * document: it is no longer a scroll narrative that happens to contain the
 * menu, it is a front door that shows the two or three things worth stopping
 * for and then hands you off.
 *
 * So it carries exactly three things beyond the cover:
 *   · happy hour, because it is the one fact that changes what time somebody
 *     leaves the house — the single most "stand out" piece of content the venue
 *     has, and it belongs above the fold-and-a-half rather than two pages in;
 *   · the four gateways, each showing the destination's own cover photograph;
 *   · where the place is, because a visitor who only ever sees this page still
 *     has to be able to find the door.
 */
function FindUs() {
  return (
    <section aria-labelledby="find-us" className="shell section-pad">
      <SectionHead
        label="Finding us"
        heading={<span id="find-us">Upstairs, beside the deli</span>}
        standfirst="At street level Loft 91 is an unmarked stairwell — the lit arch next to Crumbz Deli. The sign is above the door, not on the street."
      />

      <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
        <div className="lg:col-span-5" data-plate>
          <div className="plate aspect-[3/4] w-full">
            <Frame
              photo={photos.entrance}
              sizes="(min-width: 48rem) 40vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <dl className="grid gap-lg" data-reveal>
            <div>
              <dt className="label text-ink-3">Address</dt>
              <dd className="mt-2xs text-lead text-ink">
                {venue.address.line1}
                <br />
                {venue.address.line2}
              </dd>
            </div>
            <div>
              <dt className="label text-ink-3">Open</dt>
              <dd className="mt-2xs">
                <ul className="grid gap-2xs">
                  {venue.hours.map(({ day, opens, closes }) => (
                    <li key={day} className="flex justify-between border-b border-rule py-2xs">
                      <span className="text-body text-ink-2">{day}</span>
                      <span className="text-body text-ink tabular-nums">
                        {opens} – {closes}
                      </span>
                    </li>
                  ))}
                  <li className="flex justify-between border-b border-rule py-2xs">
                    <span className="text-body text-ink-3">{venue.hoursGap.days}</span>
                    <span className="text-body text-ink-3">{venue.hoursGap.state}</span>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>

          <div className="mt-xl flex flex-wrap gap-sm" data-reveal>
            <Button href="/visit/" variant="secondary">
              Hours &amp; directions
            </Button>
            <Button href={venue.maps} variant="secondary" external>
              Open in Maps
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
    <HappyHour heading="From $4 a pot, $16 cocktails" />
    <Gateways />
    <FindUs />
  </>,
);
