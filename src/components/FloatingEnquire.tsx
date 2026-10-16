import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import { withBase } from '../lib/base';

/**
 * The floating enquire button — the home page, on a phone, and nowhere else.
 *
 * ── Why it exists ────────────────────────────────────────────────────────
 * D-57 took the landing page's call to action off the page, and D-59 took the
 * lockup with it: the index now carries a photograph, a rule and four frames,
 * and the only route to the enquiry form is the word "Menu" in the running
 * head, then "Enquire about functions" at the foot of the overlay. That is two
 * deliberate actions for the one thing a function organiser arrived to do,
 * and traffic arrives from an Instagram bio link on a phone (CLAUDE.md §4.5) —
 * the audience most likely to want it is the one furthest from it.
 *
 * So this is the landing page's call to action, reinstated as a control that
 * does not re-enter the composition the client asked to clear. It sits over
 * the page rather than in it; the frames, the hero and the rule are untouched.
 *
 * ── Why it is a ring of type and not a chip ──────────────────────────────
 * A floating circular button is a convention from a design language this site
 * does not speak, and its usual form — a hue-filled disc with a pictogram,
 * floating on a shadow — would break three rules at once (no accent hue, no
 * shadows, no elevation system). The version here is drawn in the system's own
 * terms: the ink disc that is already the whole button system
 * (`--color-fill` / `--color-on-fill`, 17.38:1), and the roundel ring from
 * `/events/` — a `textPath` turning on `--dur-spin`, which is the one piece of
 * idle motion this design has already sanctioned.
 *
 * ── The bubble ───────────────────────────────────────────────────────────
 * Client instruction: it should feel like a bubble, and it should be
 * draggable. Three behaviours do that, and the first two are CSS
 * (`.enquire-dot` in base.css) — only the drag needs script:
 *
 *   hover    the disc swells and the ring opens up, which is the closest
 *            thing to surface tension two tokens can buy
 *   press    it squashes, then overshoots once on the way back
 *   drag     it follows the finger with resistance, and springs home
 *
 * **The drag is a tug, not a move.** The button does not get repositioned and
 * nothing is persisted: you pull it off its corner, it resists, and it snaps
 * back to exactly where it was. That is deliberate rather than a half-built
 * version of a draggable widget — a control that can be parked anywhere is a
 * control that can be parked over the footer's address, off-screen at the next
 * breakpoint, or somewhere the next visitor has to go looking for it, and none
 * of those are states this page should be able to get into. The elastic is the
 * whole point: it is what makes a solid ink disc read as something with
 * surface tension, and it costs nothing to get wrong because it always
 * returns.
 *
 * `setPointerCapture` so the gesture survives the finger leaving the 104px
 * box, which on a 66px disc it does almost immediately. A drag past `SLOP`
 * suppresses the click, so a tug never navigates; anything shorter is a tap
 * and does.
 *
 * ── The accessible name does not depend on any of that ────────────────────
 * The ring and the glyph are both `aria-hidden`. The link's name is plain text
 * in a `.sr-only` span — "Enquire about functions", the same string the nav
 * overlay's button uses, so a screen reader hears one destination named one
 * way across the site rather than "LOFT91 · ENQUIRE NOW ·" read as a sentence
 * with the separators in it.
 *
 * ── Phone only, and that is the point ─────────────────────────────────────
 * `lg:hidden`, the same gate the burger and the overlay use. Above 64rem the
 * running head already carries a persistent "Enquire" button in the top right,
 * and two of them on one viewport is one too many.
 *
 * ── When it arrives: two modes, and the difference is the cover ──────────
 * `reveal="hero"` — the landing page only. It fades in on `--delay-hero`,
 * with the hero, because the index has no cover title, no eyebrow and no call
 * to action of its own: there is nothing above the fold for it to compete
 * with, and nothing to wait for.
 *
 * `reveal="scroll"` — every interior page. Those pages all open on a `Cover`
 * that already carries a full-size primary button ("Start an enquiry", "See
 * the packages"), so a floating duplicate of it in the corner of the same
 * viewport is two buttons shouting the same word. So it stays out of the way
 * until the cover is gone, then fades in over the page content — it is the
 * *replacement* for the cover CTA once that has scrolled off, not a second
 * copy of it. Scrolling back up to the top takes it away again.
 *
 * The trigger is the page's own `<main>` rather than a sentinel element, and
 * it fires once the viewport has passed the top of it by 85vh — far enough
 * that the cover button is genuinely off-screen on a phone, not merely
 * scrolling.
 *
 * Under reduced motion the ring stops, the swell and the squash collapse to
 * nothing (the global rule in base.css), and the drag is never wired up at
 * all — the hook returns before binding a listener, so the button is a plain
 * link that cannot be pulled anywhere. The scroll reveal still runs, because
 * it is a visibility rule rather than decoration: hiding the control from a
 * reduced-motion visitor entirely would be the one version of this that takes
 * something away. It just arrives without the fade (CLAUDE.md §4.6).
 */

/** How far the finger may travel before the gesture stops being a tap. Below
    this the click goes through to `/enquire/`; above it, navigation is
    suppressed and the pull is the whole interaction. */
const SLOP = 8;

/** Resistance. The disc covers this fraction of the distance the finger
    actually travels, so it reads as attached to its corner by something
    rather than stuck to the glass. */
const PULL = 0.42;

/** The furthest it will go, in px, however hard it is pulled. Keeps the disc
    off the running head and inside the viewport, which is the one way a tug
    could leave the page looking broken mid-gesture. */
const MAX = 72;

export function FloatingEnquire({ reveal = 'scroll' }: { reveal?: 'hero' | 'scroll' }) {
  const root = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();

  /* The scroll reveal — interior pages only. Deliberately NOT gated on
     `reduced`: see the note above about this being a visibility rule rather
     than decoration. What `reduced` changes is the duration, which the global
     CSS rule in base.css collapses anyway; this sets it to 0 explicitly so
     GSAP does not animate opacity for 280ms behind a stylesheet that has
     already said not to. */
  useGSAP(
    () => {
      if (reveal !== 'scroll') return;
      const el = root.current;
      if (!el) return;

      const main = document.getElementById('main');
      if (!main) return;

      gsap.set(el, { autoAlpha: 0 });

      const show = (visible: boolean) =>
        gsap.to(el, {
          autoAlpha: visible ? 1 : 0,
          duration: reduced ? 0 : 0.28,
          ease: 'power2.out',
          overwrite: 'auto',
        });

      const trigger = ScrollTrigger.create({
        trigger: main,
        start: 'top top-=85%',
        onEnter: () => show(true),
        onLeaveBack: () => show(false),
      });

      return () => trigger.kill();
    },
    { dependencies: [reveal, reduced], scope: root },
  );

  useGSAP(
    () => {
      // Reduced motion: no elastic, no pull, no listeners. The button stays a
      // link, and a link is all it ever needed to be.
      if (reduced) return;

      const el = root.current;
      if (!el) return;

      let id: number | null = null;
      let x0 = 0;
      let y0 = 0;
      let dragged = false;

      const quickX = gsap.quickTo(el, 'x', { duration: 0.22, ease: 'power3.out' });
      const quickY = gsap.quickTo(el, 'y', { duration: 0.22, ease: 'power3.out' });

      const onDown = (e: PointerEvent) => {
        // Secondary buttons never start a drag.
        if (e.button !== 0) return;
        id = e.pointerId;
        x0 = e.clientX;
        y0 = e.clientY;
        dragged = false;
        el.setPointerCapture(e.pointerId);
        gsap.killTweensOf(el); // cut any in-flight spring; the finger wins
        el.dataset.dragging = 'true';
      };

      const onMove = (e: PointerEvent) => {
        if (id !== e.pointerId) return;
        const dx = e.clientX - x0;
        const dy = e.clientY - y0;

        if (!dragged && Math.hypot(dx, dy) > SLOP) dragged = true;
        if (!dragged) return;

        /* Resistance that grows with distance: the raw delta is scaled by PULL
           and then passed through a curve that approaches MAX rather than
           reaching it, so the far end of a hard pull feels like something
           stretching instead of like hitting a wall. */
        const resist = (v: number) => {
          const p = v * PULL;
          return (MAX * p) / (MAX + Math.abs(p));
        };
        quickX(resist(dx));
        quickY(resist(dy));
      };

      const release = (e: PointerEvent) => {
        if (id !== e.pointerId) return;
        id = null;
        delete el.dataset.dragging;
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);

        // The spring home. `elastic` rather than a soft ease — the wobble at
        // the end is the bubble, and without it this is just a slow return.
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
      };

      /* A drag must not navigate. `click` fires after `pointerup`, so the flag
         set during the move is still true here; capture phase so this runs
         before the browser follows the href. */
      const onClick = (e: MouseEvent) => {
        if (!dragged) return;
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      };

      el.addEventListener('pointerdown', onDown);
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', release);
      el.addEventListener('pointercancel', release);
      el.addEventListener('click', onClick, true);

      return () => {
        el.removeEventListener('pointerdown', onDown);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', release);
        el.removeEventListener('pointercancel', release);
        el.removeEventListener('click', onClick, true);
      };
    },
    { dependencies: [reduced], scope: root },
  );

  /* `data-reveal-mode` rather than a second class: the CSS entrance
     (`enquire-dot-in`, on `--delay-hero`) belongs to the hero mode alone. In
     scroll mode GSAP owns this element's opacity, and a CSS animation with
     `both` fill holding opacity at 0 through a 2s delay would sit on top of
     whatever the tween had set — the button would simply never appear on an
     interior page the visitor scrolled quickly. */
  return (
    <a
      ref={root}
      href={withBase('/enquire/')}
      className="enquire-dot lg:hidden"
      data-enquire-dot
      data-reveal-mode={reveal}
    >
      <span className="sr-only">Enquire about functions</span>

      <svg viewBox="0 0 120 120" aria-hidden="true" className="enquire-dot__art">
        <defs>
          {/* The baseline the words sit on. Inset from the disc's edge by the
              ring's own optical size so the caps sit inside the circle rather
              than straddling it. */}
          <path id="enquire-ring" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
        </defs>

        {/* The disc: ink, square-cornered rules and plate radii being beside
            the point on a circle. No stroke and no backing — this one is a
            control on the page, not a sticker stuck to it, so it does not take
            the die-cut offset the `/events/` roundels do. */}
        <circle cx="60" cy="60" r="38" className="enquire-dot__disc" />

        <g className="enquire-dot__spin">
          {/* `textLength` pins the run to the circumference so the separators
              land evenly however the face is metricked or substituted. The
              string is repeated twice: a single pass leaves a gap of bare
              paper opposite the words, which reads as a rendering fault. */}
          <text className="enquire-dot__ring">
            <textPath href="#enquire-ring" textLength="289">
              LOFT91 · ENQUIRE NOW · LOFT91 · ENQUIRE NOW ·
            </textPath>
          </text>
        </g>

        {/* An envelope, static at the centre, in the paper tone — the one
            pictogram the site allows itself, and it is inside a control rather
            than in the running type where `Nav` makes the "a word, not an
            icon" argument. Drawn rather than set, because at this size a glyph
            from the interface face would be a letter in a circle. */}
        <g
          className="enquire-dot__glyph"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="44" y="49" width="32" height="22" rx="2" />
          <path d="M44 52 L60 63 L76 52" />
        </g>
      </svg>
    </a>
  );
}
