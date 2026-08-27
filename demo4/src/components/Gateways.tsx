import { pages } from '../data/site';
import { withBase } from '../lib/base';
import { Frame } from './ui/Frame';

/**
 * The landing page's four frames — and, after the reduction, very nearly the
 * whole landing page.
 *
 * ── What changed, and on whose instruction ───────────────────────────────
 * The client asked for the home page to be cut back to four gallery images
 * linking to the four pages, each with a small caption beneath it, as little
 * text as possible, and symmetrical picture frames. So this is no longer one
 * band among six on a long scroll; it is the page's content, and everything
 * that used to sit under it now lives only on the page it belongs to.
 *
 * Three consequences, all of them subtractions:
 *
 *   · **One column on a phone, two everywhere else.** The client asked for the
 *     frames to stack vertically in the iPhone view specifically, so the switch
 *     is at `sm` (480px): a phone gets four full-width frames down the page —
 *     312 x 390 at 360px rather than 144 x 180 — and a tablet or a desktop gets
 *     the 2 x 2 wall, which is symmetrical on both axes. Four across a desktop
 *     row is symmetrical too, but it makes each picture a thumbnail on the one
 *     page that exists to show the room.
 *   · **One caption, centred under the frame, in the wordmark's own setting.**
 *     The index numeral, the arrow and the one-line blurb are gone: three
 *     pieces of text per card, on a page whose brief was to minimise text.
 *     What is left is the destination's name — see the note on the face below.
 *   · **The grid is capped** at `--container-wall` rather than running the
 *     full shell. At 1600px of shell a two-up 4:5 frame is 875px tall, which
 *     is one and a half pictures per screen; the cap holds a frame at a size
 *     you can take in whole.
 *
 * ── The caption's face ───────────────────────────────────────────────────
 * The client asked for a more elegant sans. Four faces are self-hosted and no
 * new one can be added without a file and a licence (CLAUDE.md §5), so the
 * question is which of them, set how — and the most elegant sans setting this
 * site owns is the one the client's own logo is set in: Switzer **Light**,
 * uppercase, at `--tracking-mark`. That is the `wordmark` utility, and using it
 * here means the four captions are set in the venue's own lettering rather than
 * in interface chrome.
 *
 * It is set at `--text-small` (14px) rather than the label's 11px, and the
 * reason is in base.css: Light at 11px with wide tracking on warm paper goes
 * thin and grey before it goes small. Lighter and larger is elegant; lighter
 * and smaller is just faint. Ink at full strength, 17.38:1.
 *
 * What did not change is the part that was already right. One aspect ratio,
 * 4:5, on every card at every width — portrait, because the venue's own frames
 * of the stairwell and the taps are portrait. The caption sits on paper under
 * the picture rather than inside it, so nothing's contrast depends on what a
 * photograph is doing behind it. And each card is the destination's *own cover
 * photograph*, which is what makes the cross-document view transition legible:
 * press the Menu frame and that picture expands into the Menu page's cover,
 * because it is the same picture. `data-cover-for` is how `lib/transitions.ts`
 * finds it.
 *
 * `figure`/`figcaption` inside the link, so each frame is one link with one
 * accessible name — the destination's name — and the photograph is `alt=""`
 * rather than repeating it.
 */
export function Gateways() {
  return (
    <section aria-labelledby="explore" className="shell pt-lg pb-2xl">
      <h2 id="explore" className="sr-only">
        Explore Loft 91
      </h2>

      <div className="mx-auto grid max-w-(--container-wall) grid-cols-1 gap-lg sm:grid-cols-2">
        {pages.map(({ id, name, href, photo }) => (
          <a key={id} href={withBase(href)} className="group block">
            <figure>
              {/* `data-plate` belongs on the plate, not on the link that wraps
                  it. The reveal drives the plate's own opacity and the scale of
                  the picture inside it; keeping both off the link means the
                  link's focus ring is drawn on an element that is never
                  transformed and never clipped. */}
              <div data-plate data-cover-for={href} className="plate aspect-[4/5] w-full">
                <Frame
                  photo={photo}
                  sizes="(min-width: 76rem) 33rem, (min-width: 30rem) 46vw, 88vw"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <figcaption
                className="wordmark mt-sm text-center text-small text-ink transition-colors duration-(--dur-micro) ease-out group-hover:text-ink-3"
                data-reveal
              >
                {name}
              </figcaption>
            </figure>
          </a>
        ))}
      </div>
    </section>
  );
}
