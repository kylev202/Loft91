import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { Plates } from '../components/Plates';
import { Tbc } from '../components/ui/Tbc';
import { pageById } from '../data/site';

const page = pageById('gallery');

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
      {/* MEMORY.md Q13 — publication clearance is still open, and two of these
          frames carry a neighbouring business's neon. That is a real question
          for the client, so it is on the page rather than only in the docs. */}
      <Tbc what="photography is the client’s own; publication clearance and a possible commissioned shoot still to confirm" />
    </div>
  </>,
);
