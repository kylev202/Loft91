import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { Button } from '../components/ui/Button';
import { DrinksList } from '../components/DrinksList';
import { pageById } from '../data/site';

const page = pageById('menu');

/**
 * The menu page: a photograph, a title, and the list. That is the whole
 * document.
 *
 * ── Happy hour is gone (client instruction) ───────────────────────────────
 * The page used to open on a happy-hour panel — the trading window and six
 * prices in a hairline box — ahead of the A–Z, on the argument that it was the
 * only thing here that changes what time somebody leaves the house. The client
 * removed it, and the cost is worth stating plainly rather than burying: those
 * prices are now **nowhere on the site**. The landing page dropped its own copy
 * of the panel when it was reduced to four frames, so `/menu/` was the last
 * surface carrying them.
 *
 * Nothing is deleted to achieve that. `components/HappyHour.tsx` and the
 * `happyHour` block in `data/menu.ts` are left exactly where they are, for the
 * same reason `Feature`, `Bento` and `Strip` are: they are correct, they are
 * sourced from the client's own posters, and re-instating the section is one
 * import and one line. MEMORY.md Q12 — the two posters disagreeing about
 * Sunday — is unaffected and still open; it simply no longer has anything on
 * the page riding on it.
 *
 * The page statement and both meta descriptions lost their "and what happy hour
 * costs" clause with the section, so the page does not promise in search
 * results what it no longer carries.
 *
 * ── The cover statement is gone too (client instruction, 2026-08-31) ──────
 * "The list behind the bar." sat opposite the title, three lines under an
 * eyebrow already reading "Behind the bar". It said the same thing twice, so
 * it went with the rest of the site's cover statements.
 *
 * ── The cover is now the shared one, with two buttons (2026-09-03) ───────
 * The words here used to be composed locally, on the argument that this page
 * passed no buttons and merging it into `Cover` would have been a change to
 * four other pages nobody asked for. It passes buttons now — Menu was the one
 * interior page whose cover ended on the title, so it read as a shorter page
 * than the rest of the set — which is precisely the case `Cover` already
 * handles: index, eyebrow, rule, and the title held against the actions from
 * `lg` up. The local copy went with it, so the lockup can no longer drift from
 * About, Packages, FAQ and Enquire.
 *
 * The pair is the site's standing one — the enquiry as the primary, since a
 * drinks list is also read by somebody pricing a night here, and beside it the
 * page's own list. "See all drinks" is an in-page hash rather than a
 * navigation: the list is directly below, and the cover now stands a full
 * screen above it on a phone, so the button is the way past the photograph for
 * anyone who came here to read prices.
 *
 * The page holds itself to three sizes: `--text-display` here, `--text-heading`
 * on a drinks group, `--text-item` on everything else. The first two are
 * uppercase Switzer Medium — the `.label` setting the running head uses at
 * 11px, scaled up and re-tracked — so the eyebrow, the title and the group
 * headings are one voice at three sizes rather than three voices.
 */
mount(
  'menu',
  <>
    <Cover index={page.index} eyebrow={page.eyebrow} name={page.name} photo={page.photo}>
      <div className="mt-0 flex flex-wrap gap-sm lg:mt-xl" data-cover-tail>
        <Button href="/enquire/" variant="primary">
          Start an enquiry
        </Button>
        <Button href="#drinks" variant="secondary">
          See all drinks
        </Button>
      </div>
    </Cover>

    <DrinksList />
  </>,
);
