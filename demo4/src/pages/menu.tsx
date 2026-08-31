import { mount } from '../lib/mount';
import { CoverFrame } from '../shell/Cover';
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
 * What is left is short enough that the shared `Cover` would now do: an index,
 * an eyebrow, a rule and the name. It is still composed here because this page
 * passes no buttons, and merging the two is a change to four other pages
 * nobody asked for.
 *
 * `CoverFrame` supplies the plate, the `data-cover` view-transition name and
 * the entrance timeline; the words below it are this page's own.
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
    <CoverFrame photo={page.photo}>
      <p className="label flex items-baseline gap-xs text-ink-3" data-cover-tail>
        <span className="tabular-nums">{page.index}</span>
        <span className="text-ink">{page.eyebrow}</span>
      </p>

      <div className="rule-ink mt-sm w-full" data-cover-rule />

      <h1 className="line-mask mt-lg" data-cover-line>
        <span className="block text-display uppercase text-ink">{page.name}</span>
      </h1>
    </CoverFrame>

    <DrinksList />
  </>,
);
