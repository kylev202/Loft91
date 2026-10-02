import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { SectionHead } from '../components/SectionHead';
import { Button } from '../components/ui/Button';
import { SectionLink } from '../components/ui/SectionLink';
import { ComedySticker, HappyHourBadge, KaraokeSticker } from '../components/Stickers';
import { pageById } from '../data/site';
import { events } from '../data/events';
import { venue } from '../data/venue';

const page = pageById('events');

/**
 * Events — the fifth nav destination, replacing About us (client instruction,
 * 2026-10-02).
 *
 * Two recurring nights, one section each, set like the sections on every other
 * page (client instruction, 2026-10-02: "in the sections … dont put it in a
 * box") — a numbered head, the facts as ruled rows, and the one addition this
 * page alone is allowed: a sticker. Each night carries a small ink drawing that
 * moves slowly, and Comedy Loft carries the "happy hour all night" roundel as
 * well, because that offer is the reason to come on a Thursday.
 *
 * What About us held and where it went: hours and the address are in the
 * footer on every page; the entrance is answered in the FAQ; the invented
 * venue story (D-60) and the map (D-79) are no longer rendered anywhere —
 * `venue.story` and `venue.mapsEmbed` are left in `data/venue.ts` unused.
 *
 * Every fact here comes from `data/events.ts`; nothing on this page states a
 * date, a start time or a price that the client has not given.
 */
const stickers = { comedy: ComedySticker, karaoke: KaraokeSticker } as const;

mount(
  'events',
  <>
    <Cover index={page.index} eyebrow={page.eyebrow} name={page.name} photo={page.photo}>
      <div className="mt-0 flex flex-wrap gap-sm lg:mt-xl" data-cover-tail>
        <Button href={venue.instagram.url} variant="primary" external>
          Keep tracks with us
        </Button>
        <Button href="/menu/" variant="secondary">
          Happy hour
        </Button>
      </div>
    </Cover>

    {/* One section per night, set like every other page's sections: a
        numbered head, then the facts as ruled rows beside the stickers. No
        card — the head's rule is what marks where a night begins. */}
    {events.map((event, i) => {
      const Sticker = stickers[event.sticker];
      const deal = 'deal' in event ? event.deal : undefined;
      const last = i === events.length - 1;
      return (
        <section key={event.id} aria-labelledby={event.id} className="shell section-pad">
          <SectionHead
            index={String(i + 1).padStart(2, '0')}
            label={event.day}
            heading={<span id={event.id}>{event.name}</span>}
          />

          <div className="grid items-center gap-lg xl:gap-2xl lg:grid-cols-12">
            <dl className="lg:col-span-7">
              <div
                className="flex items-baseline justify-between gap-md border-b border-rule py-md"
                data-reveal
              >
                <dt className="text-item text-ink-3">When</dt>
                <dd className="text-item text-ink">{event.when}</dd>
              </div>
              {'from' in event && (
                <div
                  className="flex items-baseline justify-between gap-md border-b border-rule py-md"
                  data-reveal
                >
                  <dt className="text-item text-ink-3">From</dt>
                  <dd className="text-item text-ink tabular-nums">{event.from}</dd>
                </div>
              )}
              {deal && (
                <div
                  className="flex items-baseline justify-between gap-md border-b border-rule py-md"
                  data-reveal
                >
                  <dt className="text-item text-ink-3">At the bar</dt>
                  <dd className="text-item text-ink">{deal}</dd>
                </div>
              )}
            </dl>

            <div
              className="-order-1 flex items-center gap-md lg:order-none lg:col-span-4 lg:col-start-9 lg:justify-center"
              data-reveal
            >
              <Sticker className="w-28 md:w-36" />
              {deal && <HappyHourBadge className="w-24 rotate-[8deg] md:w-28" />}
            </div>
          </div>

          {last && <SectionLink href="/menu/">What’s on the happy hour list</SectionLink>}
        </section>
      );
    })}
  </>,
);
