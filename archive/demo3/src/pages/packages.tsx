import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { SectionHead } from '../components/SectionHead';
import { Frame } from '../components/ui/Frame';
import { Button } from '../components/ui/Button';
import { Tbc } from '../components/ui/Tbc';
import { pageById } from '../data/site';
import { photos } from '../data/photos';
import { venue } from '../data/venue';

const page = pageById('packages');

/**
 * The commercial page — and the one with the least content behind it.
 *
 * MEMORY.md §5 lists package tiers, inclusions, minimum spend, capacity and an
 * enquiry email/phone as **Missing**. D-05 forbids filling any of that with
 * plausible-looking placeholder text, so this page does the only honest thing:
 * it says everything that *is* known, shows the room, and marks each gap by
 * name with its owner.
 *
 * Everything in "The room" is read off the client's own photographs — white
 * brick, the wall-sized screen, banquette seating, the mirrored ceiling, the
 * bar with draught taps. Describing a supplied photograph is reading a source.
 * There is no capacity figure, no minimum spend and no inclusion list, because
 * there is no source for those.
 */
const features = [
  { label: 'The space', value: 'One upstairs room, a flight up from Nicholson Street' },
  { label: 'Screen', value: 'A wall-sized screen running the width of the room' },
  { label: 'Seating', value: 'Tables and bentwood chairs, plus banquette seating along one wall' },
  { label: 'Bar', value: 'A full bar in the room — draught taps, spirits, cocktails' },
  { label: 'Standing / seated capacity', value: null },
  { label: 'Minimum spend', value: null },
] as const;

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
              <dd className="mt-2xs text-body text-ink">
                {value ?? <Tbc what={`${label.toLowerCase()} not yet supplied`} />}
              </dd>
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

    {/* --- 02 Packages ---------------------------------------------------- */}
    <section aria-labelledby="tiers" className="bg-panel">
      <div className="shell section-pad">
        <SectionHead
          index="02"
          label="Packages"
          heading={<span id="tiers">Package tiers</span>}
          standfirst="The venue’s function packages are not published yet. Rather than show invented tiers, this section lists exactly what is needed to build it."
        />

        <ul className="grid gap-md md:grid-cols-3">
          {[
            'Package tiers and what each one includes',
            'Capacity — seated and standing',
            'Minimum spend, deposit and cancellation terms',
          ].map((item) => (
            <li key={item} className="border-t border-rule-strong pt-md" data-reveal>
              <Tbc what={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* --- 03 Enquire ----------------------------------------------------- */}
    <section aria-labelledby="enquire-h" id="enquire" className="shell section-pad">
      <SectionHead
        index="03"
        label="Enquiries"
        heading={<span id="enquire-h">Start an enquiry</span>}
        standfirst="Today the venue publishes one channel for functions and venue hire: an Instagram message. A form that reaches an inbox is the obvious upgrade, and it needs an address to send to."
      />

      <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="max-w-(--container-measure) text-lead text-ink-2" data-reveal>
            Message {venue.instagram.handle} on Instagram with your date, rough numbers and what
            the night is for.
          </p>
          <div className="mt-xl flex flex-wrap gap-sm" data-reveal>
            <Button href={venue.instagram.url} variant="primary" external>
              Message on Instagram
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p data-reveal>
            <Tbc what="enquiry email address and phone number — needed before a contact form can exist at all" />
          </p>
        </div>
      </div>
    </section>
  </>,
);
