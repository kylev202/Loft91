import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { SectionHead } from '../components/SectionHead';
import { Button } from '../components/ui/Button';
import { EnquiryForm } from '../components/EnquiryForm';
import { enquirePage } from '../data/site';
import { venue } from '../data/venue';

const page = enquirePage;

/**
 * `/enquire/` — the form, on its own document.
 *
 * ── Why it is a page and not the block it replaces ────────────────────────
 * Every "Enquire" affordance on this site used to land on `/packages/#enquire`
 * — a section at the foot of the packages page holding two buttons and three
 * addresses. That was the right shape while there was nothing to fill in. A
 * form is not a section: it is eight controls, a validation state, and a second
 * screen after submit, and hanging all of that off an anchor at the bottom of
 * a commercial page means the visitor who pressed "Enquire" in the running
 * head arrives three screens above what they asked for, having scrolled past
 * pricing they had already read.
 *
 * So the enquiry gets its own URL. It is linkable from an Instagram bio, it is
 * the single destination of all four "Enquire" buttons on the site, and
 * `/packages/` keeps its section as what it now actually is — the way through
 * to here, plus the addresses for anyone who would rather not fill anything in.
 *
 * ── What is on it ────────────────────────────────────────────────────────
 * Two columns from `lg`: the form, and beside it the three steps of the
 * process and the ways to reach the venue that are not this form. The steps
 * are stated *before* the form rather than after it, because the last one is
 * an action — the visitor presses send themselves — and a process whose final
 * step is a surprise is a process people drop out of at the end.
 *
 * The aside is not sticky. A `position: sticky` column has to survive the
 * reveal animation, and this system animates `transform` — a transformed
 * ancestor is a containing block, which is exactly how a sticky element
 * silently stops sticking. One column that scrolls with the page is worth more
 * than a clever one that breaks in a way no screenshot shows.
 */
mount(
  'enquire',
  <>
    <Cover index={page.index} eyebrow={page.eyebrow} name={page.name} photo={page.photo}>
      <div className="mt-0 flex flex-wrap gap-sm lg:mt-xl" data-cover-tail>
        <Button href="/packages/" variant="primary">
          See the packages
        </Button>
        <Button href="/faq/" variant="secondary">
          Read the FAQ
        </Button>
      </div>
    </Cover>

    <section aria-labelledby="enquiry-h" className="shell section-pad">
      <SectionHead
        index="01"
        label="Enquiry"
        heading={<span id="enquiry-h">Tell us about the night</span>}
      />

      <div className="grid gap-xl lg:grid-cols-12 xl:gap-2xl">
        <div className="lg:col-span-6">
          <EnquiryForm />
        </div>

        <aside aria-labelledby="how-it-works" className="lg:col-span-4 lg:col-start-9">
          <h3 id="how-it-works" className="label text-ink">
            How it works
          </h3>

          {/* Numbered the way the site numbers everything else. Three rows, and
              the third one is the venue's half of it — the visitor should know
              a person replies, not a system. */}
          <ol className="mt-md">
            {[
              {
                index: '01',
                title: 'Fill this in',
                body: 'The date, the numbers and what the night is for — enough to quote it.',
              },
              {
                index: '02',
                title: 'Send the email',
                body: 'The form writes it for you. Press send from Gmail, or from your own mail app.',
              },
              {
                index: '03',
                title: 'They come back to you',
                body: `${venue.name} reads it and replies directly to confirm the room and the date.`,
              },
            ].map(({ index, title, body }) => (
              <li key={index} className="border-t border-rule py-md" data-reveal>
                <p className="flex items-baseline gap-md">
                  <span className="label shrink-0 text-ink-3 tabular-nums" aria-hidden="true">
                    {index}
                  </span>
                  <span className="text-item text-ink">{title}</span>
                </p>
                <p className="mt-2xs pl-[calc(var(--spacing-md)+2ch)] text-small text-ink-2">
                  {body}
                </p>
              </li>
            ))}
          </ol>

          <h3 className="label mt-2xl text-ink">Contact Us</h3>
          <dl className="mt-md">
            <div className="border-t border-rule pt-sm pb-sm" data-reveal>
              <dt className="label text-ink-3">Email</dt>
              <dd className="mt-2xs text-item text-ink">
                <a
                  href={`mailto:${venue.contact.email}`}
                  className="transition-colors duration-(--dur-micro) ease-out hover:text-ink-2"
                >
                  {venue.contact.email}
                </a>
              </dd>
            </div>
            <div className="border-t border-rule pt-sm pb-sm" data-reveal>
              <dt className="label text-ink-3">Phone</dt>
              <dd className="mt-2xs text-item text-ink tabular-nums">
                <a
                  href={venue.contact.phoneHref}
                  className="transition-colors duration-(--dur-micro) ease-out hover:text-ink-2"
                >
                  {venue.contact.phone}
                </a>
              </dd>
            </div>
            <div className="border-t border-rule pt-sm pb-sm" data-reveal>
              <dt className="label text-ink-3">Instagram</dt>
              <dd className="mt-2xs text-item text-ink">
                <a
                  href={venue.instagram.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors duration-(--dur-micro) ease-out hover:text-ink-2"
                >
                  {venue.instagram.handle}
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  </>,
);
