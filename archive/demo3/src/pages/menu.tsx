import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { HappyHour } from '../components/HappyHour';
import { DrinksList } from '../components/DrinksList';
import { pageById } from '../data/site';

const page = pageById('menu');

mount(
  'menu',
  <>
    <Cover
      index={page.index}
      eyebrow={page.eyebrow}
      name={page.name}
      statement={page.statement}
      photo={page.photo}
    />
    {/* Happy hour leads, not the A–Z: it is the only thing on this page that
        changes a decision that has not been made yet. */}
    <HappyHour index="01" heading="What happy hour costs" />
    <DrinksList index="02" />
  </>,
);
