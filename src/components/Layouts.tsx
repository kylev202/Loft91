import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Frame } from './ui/Frame';
import { PlanPin, RoomPlan } from './RoomPlan';
import { layouts, planDescription, planFeatures, type LayoutId } from '../data/space';

/**
 * §02 of `/space/`: the four ways the floor gets set, as a plan you can watch
 * change.
 *
 * ── Why this is one control and not three blocks ─────────────────────────
 * The section used to be four numerals in a row with a sentence under each,
 * and it was doing its job — the numbers are the thing an organiser is
 * scanning for, so the numbers were set large. What it could not do was
 * answer the question underneath the numbers: *120 standing where?* A room
 * that holds 120 standing and 70 seated is two different rooms, and a list
 * cannot show the difference between them.
 *
 * So the four numerals stay exactly where they were and become the control.
 * One click moves three things at once — the drawing, the photograph and the
 * sentence — which is the whole argument for the section: the plan says what
 * the floor does, the photograph says what it looks like when it does it, and
 * the numeral says how many people that is.
 *
 * ── Tabs, properly ───────────────────────────────────────────────────────
 * `role="tablist"` with roving `tabindex` and arrow-key selection, because
 * that is what this is: four options, one panel, one visible at a time. The
 * cheaper build — four `aria-pressed` buttons — would leave four tab stops in
 * a row and announce nothing when the panel behind them changed.
 *
 * There is one panel element rather than four, and every tab's `aria-controls`
 * points at it; `aria-labelledby` moves to whichever tab is selected. That is
 * valid, and it is what keeps the drawing's DOM stable across a change —
 * re-mounting the SVG would throw away the cross-fade in `RoomPlan` and make
 * the browser re-decode the photograph from scratch.
 *
 * ── Selection is a line, not a colour ────────────────────────────────────
 * There is no accent hue to select with (theme.css), and D-72 already settled
 * the pattern for a control's state on this site: the rule above the chosen
 * option goes to full ink, its type goes to full ink, and the other three sit
 * back. The border is 2px in both states so nothing shifts by a pixel when
 * the choice moves.
 */
export function Layouts() {
  const [active, setActive] = useState<LayoutId>(layouts[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  /* `useId` rather than hand-written ids: this component is written once but
     the ids it emits have to be unique in a document, and a hard-coded
     `#layout-panel` is a bug waiting for the day a second plan appears on a
     page. */
  const uid = useId();
  const tabId = (id: LayoutId) => `${uid}-${id}`;
  const panelId = `${uid}-panel`;

  const current = layouts.find((l) => l.id === active) ?? layouts[0];

  /* Automatic activation — arrowing to a tab selects it. The panel is already
     rendered and switching it costs nothing, which is the condition the
     pattern asks for before choosing automatic over manual. */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const from = layouts.findIndex((l) => l.id === active);
    const last = layouts.length - 1;

    const to =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? (from + 1) % layouts.length
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? (from + last) % layouts.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : -1;

    if (to < 0) return;
    event.preventDefault();
    setActive(layouts[to].id);
    tabs.current[to]?.focus();
  };

  return (
    <>
      {/* --- The four settings, as the control ---------------------------- */}
      <div
        role="tablist"
        aria-label="How the floor gets set"
        onKeyDown={onKeyDown}
        /* Two up on the narrowest phone rather than one. Stacked, the four
           settings are 370px of scrolling before the drawing they control
           comes into view, which puts the control off the screen that the
           panel is on. Two columns halve that and still leave "at the
           banquette end" room to wrap to a second line. */
        className="grid grid-cols-2 gap-md lg:grid-cols-4 xl:gap-lg"
      >
        {layouts.map((layout, i) => {
          const selected = layout.id === active;
          return (
            <button
              key={layout.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(layout.id)}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(layout.id)}
              data-reveal
              className={`border-t-2 pt-md text-left transition-colors duration-(--dur-micro) ease-out ${
                selected ? 'border-fill' : 'border-rule hover:border-rule-strong'
              }`}
            >
              {/* The numeral leads, and a qualifier is set small beside it
                  rather than folded into the number — "about 60" and "60" are
                  different claims, and the two figures stated exactly
                  elsewhere on the site should not be made to look approximate
                  to match the two that are not. */}
              <span className="flex items-baseline gap-2xs">
                {layout.qualifier && <span className="label text-ink-3">{layout.qualifier}</span>}
                <span
                  className={`font-display text-display tabular-nums transition-colors duration-(--dur-micro) ease-out ${
                    selected ? 'text-ink' : 'text-ink-3'
                  }`}
                >
                  {layout.figure}
                </span>
              </span>
              <span className="label mt-2xs block text-ink-3">{layout.unit}</span>
            </button>
          );
        })}
      </div>

      {/* --- The setting itself ------------------------------------------- */}
      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId(active)}
        /* Focusable, because the panel holds a graphic and a list rather than
           a control — without it, a keyboard reader arrowing through the tabs
           has no way into what the tabs are changing. */
        tabIndex={0}
        className="mt-xl"
      >
        <p className="max-w-(--container-measure) text-body text-ink-2">{current.note}</p>

        {/* Two rows on a wide screen — the drawing beside the photograph, the
            legend as a strip under both — and one column on a phone.

            The arrangement is settled by the heights rather than by taste. The
            drawing is 3:2 and the legend is six rows, so stacking those two in
            one column beside a 4:3 photograph leaves the picture's column
            running 300px past the plan's with nothing under it. Putting the
            legend across the full width instead lets the photograph stretch to
            the drawing's own height, which is what makes the two read as a
            pair rather than as a diagram with a picture parked next to it. */}
        <div className="mt-lg grid gap-lg lg:grid-cols-12 xl:gap-xl">
          {/* The drawing. Mounted on a sheet of page-white inside the tinted
              band, so it reads as a plan pinned to a board rather than as an
              illustration printed on the panel. */}
          <figure className="lg:col-span-7 lg:row-start-1" data-reveal>
            {/* The padding is on the sheet and the ratio is on the box inside
                it, and that order matters. With both on one element the inner
                box is 3:2 *minus the padding* — no longer 3:2 — so the SVG
                letterboxes inside it while the pins, which are percentages of
                the box, keep using the full width. The drawing and its pins
                then drift apart by several pixels at the edges. */}
            <div className="rounded-plate bg-page p-sm sm:p-md">
              <div className="relative aspect-3/2 w-full">
                <RoomPlan
                  layout={active}
                  title={`Plan of the upstairs room, set for ${current.figure} ${current.unit}`}
                  desc={`${planDescription} ${current.note}`}
                />

                {planFeatures.map(({ n, x, y }) => (
                  <PlanPin
                    key={n}
                    n={n}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  />
                ))}
              </div>
            </div>

            <figcaption className="label mt-sm text-ink-3">
              Indicative plan, not to scale · solid shapes are fixed, outlines move
            </figcaption>
          </figure>

          {/* The legend. Last on a wide screen and second on a phone, which is
              why it is here in the source rather than after the photograph:
              under the drawing is where a numbered key belongs when there is
              only one column to put it in. */}
          <ol className="grid gap-x-lg sm:grid-cols-2 lg:col-span-12 lg:row-start-2 lg:grid-cols-3 xl:gap-x-xl">
            {planFeatures.map(({ n, label, line }) => (
              <li key={n} className="flex gap-sm border-b border-rule py-sm" data-reveal>
                <PlanPin n={n} />
                <span>
                  <span className="label text-ink">{label}</span>
                  <span className="mt-2xs block text-small text-ink-2">{line}</span>
                </span>
              </li>
            ))}
          </ol>

          {/* The photograph of that setting, cropped to whatever height the
              drawing beside it ends up at. `aspect-4/3` is the phone's, where
              it is a picture in its own right; from `lg` the ratio comes off
              and the plate takes the row's height, so the two sit as one
              spread. `object-cover` and each frame's own `object-position`
              decide what survives the crop. */}
          <div className="plate aspect-4/3 w-full lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:aspect-auto lg:h-full" data-plate>
            <Frame
              photo={current.photo}
              sizes="(min-width: 64rem) 38vw, calc(100vw - 3rem)"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
}
