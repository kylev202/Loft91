import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { SectionHead } from '../components/SectionHead';
import { Frame } from '../components/ui/Frame';
import { Button } from '../components/ui/Button';
import { pageById } from '../data/site';
import { photos } from '../data/photos';
import { venue } from '../data/venue';
import { capacity, minimumSpend, terms, tiers } from '../data/packages';

const page = pageById('packages');

/**
 * The commercial page — and, until D-60, the one with the least content behind
 * it.
 *
 * ⚠ WHAT CHANGED, AND WHAT IT COSTS. This page used to carry five visible
 * [TBC] markers: capacity, minimum spend, the three package tiers, and the
 * enquiry address. MEMORY.md §5 still lists every one of those as ❌ Missing,
 * and D-05 forbade filling them with plausible-looking placeholder text for
 * exactly the reason that matters here — an invented minimum spend on a real
 * venue's website is a price the venue does not charge.
 *
 * The user asked for the blanks to be filled so the demo reads as a finished
 * site, which is a fair thing to want from a demo, and that is the instruction
 * this page now follows. The invention is quarantined in `data/packages.ts`,
 * every figure in it is marked as invented at the top of that file, and the
 * footer of every page says the build carries placeholder content. Deleting
 * that one module and reverting this file restores the honest state.
 *
 * Everything in "The room" that describes fittings is still read off the
 * client's own photographs — white brick, the wall-sized screen, banquette
 * seating, the bar with draught taps. Describing a supplied photograph is
 * reading a source. The two figures beside them are not.
 */
const features = [
  { label: 'The space', value: 'One upstairs room, a flight up from Nicholson Street' },
  { label: 'Screen', value: 'A wall-sized screen running the width of the room' },
  { label: 'Seating', value: 'Tables and bentwood chairs, plus banquette seating along one wall' },
  { label: 'Bar', value: 'A full bar in the room — draught taps, spirits, cocktails' },
  // ⚠ The two invented rows (D-60).
  { label: 'Standing / seated capacity', value: capacity.combined },
  { label: 'Minimum spend', value: minimumSpend },
] as const;

const mailto = `mailto:${venue.contact.email}`;

mount(
  'packages',
  <>
    <Cover
      index={page.index}
      eyebrow={page.eyebrow}
      name={page.name}
      statement={page.statement}
      photo={page.photo}
    >
      <div className="mt-xl flex flex-wrap gap-sm" data-cover-tail>
        <Button href="#enquire" variant="primary">
          Start an enquiry
        </Button>
        <Button href="/gallery/" variant="secondary">
          See the room
        </Button>
      </div>
    </Cover>

    {/* --- 01 The room ---------------------------------------------------- */}
    <section aria-labelledby="the-room" className="shell section-pad">
      <SectionHead
        index="01"
        label="The room"
        heading={<span id="the-room">What you are hiring</span>}
        standfirst="One upstairs room with its own bar, a wall-sized screen and seating along the brick."
      />

      <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
        <dl className="lg:col-span-5">
          {features.map(({ label, value }) => (
            <div key={label} className="border-b border-rule py-md" data-reveal>
              <dt className="label text-ink-3">{label}</dt>
              <dd className="mt-2xs text-body text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-md lg:col-span-6 lg:col-start-7">
          <div className="plate aspect-[16/10] w-full" data-plate>
            <Frame
              photo={photos.room}
              sizes="(min-width: 48rem) 48vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="plate aspect-[16/10] w-full" data-plate>
            <Frame
              photo={photos.lounge}
              sizes="(min-width: 48rem) 48vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    {/* --- 02 Packages ----------------------------------------------------
        Three tiers, three equal columns, each one a hairline and a column of
        text — no boxes and no shadows, because this system marks a group with
        a rule and nothing else. The price sits directly under the name at
        `--text-item` with tabular figures, so the three of them align across
        the row and can be compared at a glance, which is the only job this
        section has. */}
    <section aria-labelledby="tiers" className="bg-panel">
      <div className="shell section-pad">
        <SectionHead
          index="02"
          label="Packages"
          heading={<span id="tiers">Three ways to take the room</span>}
          standfirst="A minimum spend rather than a per-head price, so the money goes across the bar instead of into a hire fee. Every tier is on the same floor — what changes is how much of it is yours."
        />

        <ul className="grid gap-lg md:grid-cols-3 xl:gap-xl">
          {tiers.map(({ id, name, scale, price, summary, includes }) => (
            <li key={id} className="border-t border-rule-strong pt-md" data-reveal>
              <h3 className="font-display text-lead text-ink">{name}</h3>
              <p className="label mt-2xs text-ink-3">{scale}</p>
              <p className="mt-sm text-item text-ink tabular-nums">{price}</p>
              <p className="mt-sm text-body text-ink-2">{summary}</p>

              <ul className="mt-md">
                {includes.map((line) => (
                  <li key={line} className="border-t border-rule py-xs text-small text-ink-2">
                    {line}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {/* The terms, as one row under the tiers rather than as small print
            inside each of them — they are identical across all three, and
            saying them three times would make them the loudest thing in the
            section. */}
        <dl className="mt-2xl grid gap-md md:grid-cols-2 lg:grid-cols-4">
          {terms.map(({ label, value }) => (
            <div key={label} className="border-t border-rule pt-sm" data-reveal>
              <dt className="label text-ink-3">{label}</dt>
              <dd className="mt-2xs text-small text-ink-2">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    {/* --- 03 Enquire ----------------------------------------------------- */}
    <section aria-labelledby="enquire-h" id="enquire" className="shell section-pad">
      <SectionHead
        index="03"
        label="Enquiries"
        heading={<span id="enquire-h">Start an enquiry</span>}
        standfirst="Send the date, rough numbers and what the night is for, and you get a hold on the room and a written quote back."
      />

      <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="max-w-(--container-measure) text-lead text-ink-2" data-reveal>
            Email reaches the people who run the room. Instagram works too, and the phone is
            answered from behind the bar on trading nights.
          </p>
          <div className="mt-xl flex flex-wrap gap-sm" data-reveal>
            <Button href={mailto} variant="primary">
              Email the venue
            </Button>
            <Button href={venue.instagram.url} variant="secondary" external>
              Message on Instagram
            </Button>
          </div>
        </div>

        {/* The details in full as text, not only behind a button — a phone at
            night is as likely to want to copy an address as to tap it, and a
            `mailto:` that opens nothing is otherwise a dead end. */}
        <dl className="lg:col-span-5 lg:col-start-8">
          <div className="border-t border-rule pt-sm" data-reveal>
            <dt className="label text-ink-3">Email</dt>
            <dd className="mt-2xs text-item text-ink">
              <a
                href={mailto}
                className="transition-colors duration-(--dur-micro) ease-out hover:text-ink-2"
              >
                {venue.contact.email}
              </a>
            </dd>
          </div>
          <div className="mt-md border-t border-rule pt-sm" data-reveal>
            <dt className="label text-ink-3">Phone</dt>
            <dd className="mt-2xs text-item text-ink tabular-nums">
              <a
                href={venue.contact.phoneHref}
                className="transition-colors duration-(--dur-micro) ease-out hover:text-ink-2"
              >
                {venue.contact.phone}
              </a>
            </dd>
          </div>
          <div className="mt-md border-t border-rule pt-sm" data-reveal>
            <dt className="label text-ink-3">Instagram</dt>
            <dd className="mt-2xs text-item text-ink">
              <a
                href={venue.instagram.url}
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors duration-(--dur-micro) ease-out hover:text-ink-2"
              >
                {venue.instagram.handle}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  </>,
);
