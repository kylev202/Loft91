import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { FaqList } from '../components/FaqList';
import { Button } from '../components/ui/Button';
import { faqs } from '../data/faq';
import { faqPage } from '../data/site';
import { venue } from '../data/venue';

/**
 * The questions in full — the page the home page's FAQ heading goes to.
 *
 * It is a real document rather than an anchor, because the three questions on
 * the index page are a sample and this is the list; and it is not in the nav,
 * because the nav carries the four places the venue is being sold from. It is
 * reached from the home page's FAQ section, from the About us page, and from
 * the footer index.
 *
 * ⚠ Half of these answers used to be [TBC] — how do I enquire, how many
 * people fit, what can I play in there are exactly the three the venue has
 * never answered (MEMORY.md Q3, Q6). D-60 answers all eight with placeholder
 * copy on user instruction, so the page now reads as finished. What it no
 * longer does is show a reader which four answers nobody has confirmed;
 * `data/faq.tsx` names them at the top of the file instead.
 *
 * ── The section head is gone (client instruction, 2026-08-31) ─────────────
 * It read "01 · Questions · Before you come up", with "Hiring, capacity, hours,
 * food, and where the door actually is" under it — four pieces of text opening
 * a document whose cover, one screen above, already says "05 · Questions ·
 * FAQ", and whose standfirst was a list of the eight questions printed
 * immediately below it. This page now works the way `/menu/` does: a cover and
 * the list, with nothing in between restating either.
 *
 * The heading is kept as visually-hidden text rather than deleted, so the
 * section still has an accessible name and the document still has an `h2`
 * between its `h1` and the questions' own headings.
 */
mount(
  'faq',
  <>
    <Cover
      index={faqPage.index}
      eyebrow={faqPage.eyebrow}
      name={faqPage.name}
      photo={faqPage.photo}
    >
      <div className="mt-0 flex flex-wrap gap-sm lg:mt-xl" data-cover-tail>
        <Button href={venue.instagram.url} variant="primary" external>
          Ask on Instagram
        </Button>
        <Button href="/about/" variant="secondary">
          About the venue
        </Button>
      </div>
    </Cover>

    <section aria-labelledby="questions" className="shell section-pad">
      <h2 id="questions" className="sr-only">
        Questions
      </h2>

      {/* The list opened under the section head's own rule. With the head gone
          the rule stays — it is how this system marks the top of a group, and
          `FaqList` draws a border under each question but none above the
          first. Held to the same measure as the questions below it. */}
      <div className="rule-ink mb-sm max-w-(--container-measure)" data-reveal />

      <FaqList items={faqs} />
    </section>
  </>,
);
