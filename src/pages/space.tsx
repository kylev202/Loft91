import { mount } from '../lib/mount';
import { Cover } from '../shell/Cover';
import { pageById } from '../data/site';

const page = pageById('space');

/**
 * The Space — published empty for now, on client instruction (2026-10-02):
 * the cover and title only, so the nav link resolves to a real page. The full
 * page (the room, the floor plan, the layouts and fittings) is kept on the
 * local `space-local` branch and goes up when it is ready.
 */
mount('space', <Cover index={page.index} eyebrow={page.eyebrow} name={page.name} photo={page.photo} />);
