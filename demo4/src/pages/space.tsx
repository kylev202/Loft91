import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { SectionHead } from '../components/SectionHead';
import { Frame } from '../components/ui/Frame';
import { Button } from '../components/ui/Button';
import { SectionLink } from '../components/ui/SectionLink';
import { Layouts } from '../components/Layouts';
import { pageById } from '../data/site';
import { photos } from '../data/photos';
import { facilities, fittings } from '../data/space';

const page = pageById('space');

/**
 * `/space/` — the room as a physical thing, and the site's fifth nav
 * destination.
 *
 * ── Why it is its own document rather than a section ──────────────────────
 * The room was being described in three places and owned by none of them.
 * `/packages/` §01 lists what you are hiring, but its job is the commercial
 * one — three tiers and what they cost — so the room is a six-row summary on
 * the way to a price. `/about/` §01 says the bar and the hireable room are the
 * same floor, which is the venue's shape rather than the room's contents.
 * `/gallery/` shows it and says nothing. A function organiser working out
 * whether sixty people fit had to read all three and still ended up on the FAQ.
 *
 * So this page takes one question and answers it in full: what is up there,
 * how the floor can be set, and what is already in the room. Pricing stays on
 * `/packages/` — the two link to each other rather than restating each other,
 * and nothing here quotes a dollar figure.
 *
 * ── What is sourced and what is not ──────────────────────────────────────
 * `data/space.ts` keeps the two apart and marks them. The fabric — brick,
 * counter, screen wall, banquette, the planted column, the neon stairwell — is
 * read off the client's own photographs, which is the carve-out `/packages/`
 * already works under. Every numeral is invented placeholder content (D-60)
 * and none of it is new: 120 and 70 are imported from `data/packages.ts`
 * rather than retyped, and 60 and 20 are already printed on `/faq/` and in the
 * Booth tier. This page widens the demo's exposure by no facts at all — it
 * gathers what was already published and puts it in one place.
 *
 * ── Shape ────────────────────────────────────────────────────────────────
 * Three sections, each deliberately a different rhythm from the `/packages/`
 * section it sits nearest:
 *
 *   01  One wide plate across the full shell, with the fittings as a
 *       two-column list beneath it. `/packages/` §01 is a list beside two
 *       stacked plates; running the picture full width first is what makes
 *       this read as the room rather than as a feature table.
 *   02  The plan, in the tinted band. The four numbers are still the first
 *       thing in it and still set at display size — they are what a reader is
 *       scanning for — but they are now the control rather than the content:
 *       choosing one redraws the floor, swaps the photograph and changes the
 *       sentence. See `components/Layouts.tsx` for why that is one control and
 *       not three blocks, and `components/RoomPlan.tsx` for what the drawing
 *       does and does not claim.
 *   03  What is fitted, as a list beside two frames that show two of its rows —
 *       the screen wall, and the way up.
 */
mount(
  'space',
  <>
    <Cover index={page.index} eyebrow={page.eyebrow} name={page.name} photo={page.photo}>
      <div className="mt-0 flex flex-wrap gap-sm lg:mt-xl" data-cover-tail>
        <Button href="/enquire/" variant="primary">
          Enquire about hiring
        </Button>
        <Button href="/packages/" variant="secondary">
          What it costs
        </Button>
      </div>
    </Cover>

    {/* --- 01 The room ---------------------------------------------------- */}
    <section aria-labelledby="the-room" className="shell section-pad">
      <SectionHead
        index="01"
        label="The room"
        heading={<span id="the-room">One room, one flight up</span>}
        href="/gallery/"
        linkLabel="See the frames"
      />

      {/* The full-shell plate. `sizes` is CoverFrame's own string, because this
          plate is exactly as wide as the cover above it — the shell minus its
          gutter, flat at 24px until 480px, tracking 5vw through the middle,
          pinned at 88px once the shell stops growing at 1600px. */}
      <div className="plate aspect-[3/2] w-full" data-plate>
        <Frame
          photo={photos.event}
          sizes="(min-width: 110rem) 1424px, (min-width: 30rem) 90vw, calc(100vw - 3rem)"
          className="h-full w-full object-cover"
        />
      </div>

      <dl className="mt-xl grid gap-x-lg md:grid-cols-2 xl:gap-x-2xl">
        {fittings.map(({ label, value }) => (
          <div key={label} className="border-b border-rule py-md" data-reveal>
            <dt className="label text-ink-3">{label}</dt>
            <dd className="mt-2xs max-w-(--container-measure) text-body text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>

    {/* --- 02 Layouts -----------------------------------------------------
        The tinted ground stops short of the screen, like every other panel on
        the site: `frame` + `shell-inset`, so this heading lands on the same
        left edge as the ones in the plain sections above and below it. */}
    <section aria-labelledby="layouts" className="frame">
      <div className="rounded-plate bg-panel">
        <div className="shell-inset section-pad">
          <SectionHead
            index="02"
            label="The plan"
            heading={<span id="layouts">How the floor gets set</span>}
          />

          <Layouts />

          {/* The way through to the money. This page states what the room
              holds; what each of those nights costs is `/packages/`, and it is
              a button rather than a sentence because there is nothing to
              explain — the reader either wants the prices or does not. */}
          <div className="mt-2xl" data-reveal>
            <Button href="/packages/" variant="secondary">
              What each one costs
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* --- 03 What is fitted ---------------------------------------------- */}
    <section aria-labelledby="fitted" className="shell section-pad">
      <SectionHead
        index="03"
        label="What comes with it"
        heading={<span id="fitted">Already in the room</span>}
        href="/faq/"
        linkLabel="Questions"
      />

      <div className="grid gap-lg xl:gap-2xl lg:grid-cols-12">
        <dl className="lg:col-span-7">
          {facilities.map(({ label, value }) => (
            <div key={label} className="border-b border-rule py-md" data-reveal>
              <dt className="label text-ink-3">{label}</dt>
              <dd className="mt-2xs max-w-(--container-measure) text-body text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Two frames, each one a row in the list beside it: the screen wall
            with the banquette facing it, and the stairwell that is the only
            way to either. */}
        <div className="grid gap-md lg:col-span-4 lg:col-start-9">
          <div className="plate aspect-16/10 w-full" data-plate>
            <Frame
              photo={photos.lounge}
              sizes="(min-width: 64rem) 32vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="plate aspect-3/4 w-full" data-plate>
            <Frame
              photo={photos.ascent}
              sizes="(min-width: 64rem) 32vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <SectionLink href="/enquire/">Enquire about the room</SectionLink>
    </section>
  </>,
);
