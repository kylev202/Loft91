import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { Plates } from '../components/Plates';
import { SectionLink } from '../components/ui/SectionLink';
import { pageById } from '../data/site';

const page = pageById('gallery');

/**
 * Eight photographs of the room, in two bands of one orientation each — see
 * `Plates` for why the grid is even and `photos.ts` for what is in each band.
 *
 * The [TBC] that used to close this page (MEMORY.md Q13 — publication
 * clearance, and the neighbouring business's neon in two of the frames) is no
 * longer printed here, along with the rest of the site's markers (D-60). The
 * question is not resolved; it is only no longer on the page. It is still open
 * in MEMORY.md, and the frame it was mostly about — `entrance`, which carries
 * the Crumbz Deli sign — is not in the gallery bands at all.
 */
mount(
  'gallery',
  <>
    <Cover
      index={page.index}
      eyebrow={page.eyebrow}
      name={page.name}
      statement={page.statement}
      photo={page.photo}
    />

    <Plates />

    <div className="shell pb-2xl">
      <SectionLink href="/packages/">The same room, hired for the night</SectionLink>
    </div>
  </>,
);
