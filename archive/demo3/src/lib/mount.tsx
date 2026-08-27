import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { Page } from '../shell/Page';

/**
 * Every page entry is the same four lines, so they are these four lines.
 * `current` is the only thing that differs, and it is what the nav, the footer
 * index and `aria-current` all read from.
 */
export function mount(current: string, children: ReactNode) {
  const root = document.getElementById('root');
  if (!root) throw new Error('mount: no #root in this document');

  createRoot(root).render(
    <StrictMode>
      <Page current={current}>{children}</Page>
    </StrictMode>,
  );
}
