import type { ReactNode } from 'react';
import { photos } from '../data/photos';
import { venue } from '../data/venue';
import { Plate } from './ui/Plate';
import { SectionHead } from './ui/SectionHead';
import { Tbc } from './ui/Tbc';

/**
 * Visit — set as a spec sheet: label on the left, value on the right, one rule
 * between every row. It is the least designed thing on the page and it should
 * be; this is the section somebody reads standing on Nicholson Street at 9pm.
 *
 * Everything factual renders from `venue.ts`, so the hours here and the hours in
 * the hero cannot drift. Nothing here is client-confirmed yet: the hours are
 * read off the Instagram bio, the street formatting is derived from "Upstairs,
 * 91 Nicholson", and "late" is printed as the literal word because inventing
 * `2:00 AM` would send people to a bar that has closed.
 *
 * The functions enquiry channel is the biggest open question on the project
 * (Q3) — it decides whether this site needs a backend at all — so no form is
 * built. What is true today is that the only channel is an Instagram DM.
 */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-md gap-y-2xs border-b border-rule py-sm">
      <dt className="label text-ink-3">{label}</dt>
      <dd className="text-body text-ink tabular-nums">{children}</dd>
    </div>
  );
}

export function Visit() {
  return (
    <section id="visit" aria-labelledby="visit-h" className="section-pad">
      <div className="shell">
        <SectionHead index="05" id="visit" title="Visit" />

        <div className="grid gap-xl lg:grid-cols-[6fr_5fr] lg:gap-2xl">
          <div>
            <address className="not-italic">
              <a
                href={venue.maps}
                target="_blank"
                rel="noopener"
                className="inline-block font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-tight font-medium tracking-tight text-ink underline decoration-rule-strong underline-offset-[0.3em] transition-[text-decoration-color] duration-(--dur-micro) ease-out hover:decoration-ink"
              >
                {venue.address.line1}
                <br />
                {venue.address.line2}
              </a>
            </address>
            <p className="mt-md">
              <Tbc>{venue.address.tbc.replace(', from client', '')}</Tbc>
            </p>

            <dl className="mt-xl border-t border-ink">
              {venue.hours.map(({ day, opens, closes }) => (
                <Row key={day} label={day}>
                  {opens} – {closes}
                </Row>
              ))}
              <div className="flex flex-wrap items-baseline justify-between gap-x-md gap-y-2xs border-b border-rule py-sm">
                <dt className="label text-ink-3">{venue.hoursGap.days}</dt>
                <dd className="text-body text-ink-3">{venue.hoursGap.state}</dd>
              </div>
            </dl>
            <p className="mt-md">
              <Tbc>{venue.hoursTbc}</Tbc>
            </p>

            <dl className="mt-xl border-t border-ink">
              <Row label="Functions">Today, {venue.bookings.channel} only</Row>
              <Row label="Instagram">
                <a
                  href={venue.instagram.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-11 items-center underline decoration-rule-strong underline-offset-[0.35em] transition-[text-decoration-color] duration-(--dur-micro) ease-out hover:decoration-ink"
                >
                  {venue.instagram.handle}
                </a>
              </Row>
            </dl>
            <p className="mt-md">
              <Tbc>{venue.bookings.tbc.replace(', from client', '')}</Tbc>
            </p>
          </div>

          {/* Wayfinding, not decoration: at street level the venue is an
              unmarked stairwell beside a deli, so this photograph is
              information. It also puts a neighbouring business's neon on the
              page, which is MEMORY.md Q13 and the client's call. */}
          <Plate
            photo={photos.entrance}
            sizes="(min-width: 64rem) 40vw, 100vw"
            className="aspect-3/4"
            caption={photos.entrance.caption}
            index="—"
          />
        </div>
      </div>
    </section>
  );
}
