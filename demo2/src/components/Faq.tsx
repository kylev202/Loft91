import { SectionHead } from './ui/SectionHead';
import { Tbc } from './ui/Tbc';

/**
 * The three questions a function organiser asks first. Every answer is
 * outstanding (MEMORY.md Q3, Q6, and AV/music which is not yet even a logged
 * question), so the questions ship and the answers are marked.
 *
 * `<details>`/`<summary>`, so it is keyboard-operable and screen-reader
 * announced without a line of JavaScript. Stripped of container boxes and
 * separated only by hairlines, with a `+` that rotates into a `−` — two 1px
 * rules, one of which turns, rather than an icon swap.
 *
 * Deliberately not height-animated: opening a `<details>` animates `height`,
 * which is a layout property, and this system animates transform and opacity
 * only. An instant disclosure is the honest version.
 */
const faqs = [
  {
    q: 'How do I enquire about hiring the space?',
    a: <Tbc>enquiry channel: Instagram DM, email, or form</Tbc>,
  },
  { q: 'What is the venue capacity?', a: <Tbc>capacity, seated and standing</Tbc> },
  { q: 'Do you have AV or music options for events?', a: <Tbc>AV, DJ and music policy</Tbc> },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-h" className="section-pad">
      <div className="shell">
        <SectionHead index="04" id="faq" title="Questions">
          What function organisers ask first.
        </SectionHead>

        <div className="max-w-measure">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group border-b border-rule" data-reveal>
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-md py-md text-item text-ink transition-opacity duration-(--dur-micro) ease-out hover:opacity-70 [&::-webkit-details-marker]:hidden">
                <span className="text-pretty">{q}</span>
                <span aria-hidden="true" className="relative block h-3 w-3 shrink-0">
                  <span className="absolute top-1/2 left-0 block h-px w-3 bg-ink" />
                  <span className="absolute top-1/2 left-0 block h-px w-3 rotate-90 bg-ink transition-transform duration-(--dur-short) ease-out group-open:rotate-0" />
                </span>
              </summary>
              <div className="pb-md">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
