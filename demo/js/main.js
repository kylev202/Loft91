/* ==========================================================================
   main.js — loader, nav, reveals. DESIGN.md §6.3, §6.4, §7.1.

   Two rules this file exists to honour:
   · Never a scroll event listener — IntersectionObserver only (§6.4).
   · Nothing here may leave content unreachable if it fails to run. Every
     progressive layer is additive; the page is complete without it.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('js');   /* unlocks the reveal styles — see site.css */

  /* ── Loader (§6.3) ───────────────────────────────────────────────────────
     The animation is pure CSS, so it completes with or without this block.
     JS only: gates it to once per session, and removes the node afterwards —
     never leaves an `opacity: 0` overlay lying over the content.            */
  var loader = document.getElementById('loader');
  if (loader) {
    if (root.getAttribute('data-loader') === 'skip') {
      loader.remove();
    } else {
      try { sessionStorage.setItem('l91-loaded', '1'); } catch (e) { /* private mode */ }

      var kill = function () {
        if (!loader.parentNode) return;
        loader.remove();
        document.removeEventListener('keydown', onKey, true);
      };
      var onKey = function (e) {
        /* Reaching for Tab or Esc means they have already decided they want
           the content. Dismiss on the spot (§6.3). */
        if (e.key === 'Tab' || e.key === 'Escape') {
          loader.classList.add('loader--dismiss');
          setTimeout(kill, 320);
        }
      };

      document.addEventListener('keydown', onKey, true);
      loader.addEventListener('animationend', function (e) {
        if (e.animationName === 'loader-lift') kill();
      });
      setTimeout(kill, 1800);   /* failsafe (§6.3) */
    }
  }

  /* ── Nav (§7.1) ─────────────────────────────────────────────────────────
     The nav is a sticky vertical rail and is ALWAYS visible, so there is no
     show/hide logic left here — which also retires the §7.1 keyboard hazard
     (a nav revealed only by a scroll gesture is unreachable for someone who
     starts at the top and never scrolls up). Nothing to observe.

     All that remains is the active-section indicator.                      */

  /* Active section indicator — brass role 1 (§3 accent budget). */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        var active = byId[e.target.id];
        if (active) active.classList.add('is-active');
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) activeObserver.observe(el);
    });
  }

  /* ── Mobile overlay — a real dialog (§7.1, §10) ─────────────────────── */
  var burger = document.getElementById('navBurger');
  var overlay = document.getElementById('navOverlay');
  if (burger && overlay) {
    var open = function () {
      overlay.hidden = false;
      requestAnimationFrame(function () { overlay.classList.add('is-open'); });
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
      var first = overlay.querySelector('a');
      if (first) first.focus();
    };
    var close = function () {
      overlay.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
      burger.focus();                                  /* focus returns to trigger */
      setTimeout(function () { overlay.hidden = true; }, 320);
    };

    burger.addEventListener('click', function () {
      if (burger.getAttribute('aria-expanded') === 'true') close(); else open();
    });
    overlay.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (overlay.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;

      /* Focus trap */
      var f = overlay.querySelectorAll('a[href], button');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ── Scroll reveals (§6.4) — once only, IO not scroll events ─────────── */
  if ('IntersectionObserver' in window) {
    /* .menu-col/.happy/.feature joined the list when Menu and Packages
       stopped being Editorial Splits — without them those sections would be
       the only ones on the page that snap in rather than reveal. */
    var blocks = document.querySelectorAll(
      '.section__head, .split__a, .split__b, .happy, .menu-col, .feature, .footer__inner'
    );
    var groups = [
      document.querySelectorAll('.bento__item'),
      document.querySelectorAll('.strip__frame')
    ];

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        obs.unobserve(e.target);                       /* once: true (§6.4) */
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    blocks.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });

    /* Batched stagger: 70ms, capped at 6 items — beyond that the last item's
       delay becomes a visible wait (§6.4). */
    groups.forEach(function (list) {
      Array.prototype.forEach.call(list, function (el, i) {
        el.classList.add('reveal');
        if (!reduced) el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
        io.observe(el);
      });
    });
  }

  /* ── Venue data consistency (CLAUDE.md §5) ──────────────────────────────
     Hours and address are hard-coded in the HTML so a no-JS visitor still
     gets them. This asserts the markup has not drifted from venue.js, which
     is the single source. A mismatch is a defect, not a cosmetic issue.    */
  if (typeof VENUE !== 'undefined') {
    /* Compare on content, not on whitespace: the markup carries non-breaking
       spaces (§4.2) and <br>, which contribute no whitespace to textContent.
       `norm` is for the human-readable message, `squash` for the comparison. */
    var NBSP = String.fromCharCode(160);
    var norm = function (s) { return (s || '').split(NBSP).join(' ').replace(/\s+/g, ' ').trim(); };
    var squash = function (s) { return norm(s).replace(/\s/g, '').toLowerCase(); };

    var rows = document.querySelectorAll('[data-venue="hours-table"] .hours__row');
    VENUE.hours.forEach(function (h, i) {
      var row = rows[i];
      if (!row) { console.error('[venue] missing hours row for ' + h.day); return; }
      var got = norm(row.querySelector('dt').textContent) + ' ' + norm(row.querySelector('dd').textContent);
      var want = norm(h.day + ' ' + h.opens + ' – ' + h.closes);
      if (squash(got) !== squash(want)) {
        console.error('[venue] hours drift — markup "' + got + '" vs venue.js "' + want + '"');
      }
    });

    var addr = document.querySelector('.visit__address');
    var wantAddr = VENUE.address.line1 + ' ' + VENUE.address.line2;
    if (addr && squash(addr.textContent) !== squash(wantAddr)) {
      console.error('[venue] address drift — markup "' + norm(addr.textContent) +
                    '" vs venue.js "' + norm(wantAddr) + '"');
    }
  }
})();
