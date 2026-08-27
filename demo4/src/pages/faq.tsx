import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { SectionHead } from '../components/SectionHead';
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
 */
mount(
  'faq',
  <>
    <Cover
      index={faqPage.index}
      eyebrow={faqPage.eyebrow}
      name={faqPage.name}
      statement={faqPage.statement}
      photo={faqPage.photo}
    >
      <div className="mt-xl flex flex-wrap gap-sm" data-cover-tail>
        <Button href={venue.instagram.url} variant="primary" external>
          Ask on Instagram
        </Button>
        <Button href="/about/" variant="secondary">
          About the venue
        </Button>
      </div>
    </Cover>

    <section aria-labelledby="questions" className="shell section-pad">
      <SectionHead
        index="01"
        label="Questions"
        heading={<span id="questions">Before you come up</span>}
        standfirst="Hiring, capacity, hours, food, and where the door actually is."
      />

      <FaqList items={faqs} />
    </section>
  </>,
);
