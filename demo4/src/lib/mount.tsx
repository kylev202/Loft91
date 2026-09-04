import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { Page } from '../shell/Page';

/**
 * Every page entry is the same four lines, so they are these four lines.
 * `current` is the only thing that differs, and it is what the nav, the footer
 * index and `aria-current` all read from.
 *
 * `bare` is the one exception, and only `/admin/` passes it: a tool page that
 * drops the loader, the nav and the footer. See `Page`.
 */
export function mount(current: string, children: ReactNode, { bare = false } = {}) {
  const root = document.getElementById('root');
  if (!root) throw new Error('mount: no #root in this document');

  createRoot(root).render(
    <StrictMode>
      <Page current={current} bare={bare}>
        {children}
      </Page>
    </StrictMode>,
  );
}
