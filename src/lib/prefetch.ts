import { withBase } from './base';

/** Fetch the next page while the visitor is about to click it.

    Every page is its own document, so a click waits on the next one loading.
    With speculation rules a
    same-site link's HTML is fetched on hover or pointer-down ("moderate"), so
    the next page arrives sooner.

    Inserted from script so it lives in one place rather than in nine HTML
    heads. Browsers without speculation rules ignore it. `/admin/` is
    excluded — it is a tool page nobody needs warmed. */
export function prefetchOnIntent() {
  if (!HTMLScriptElement.supports?.('speculationrules')) return;
  if (document.querySelector('script[type="speculationrules"]')) return;

  const rules = document.createElement('script');
  rules.type = 'speculationrules';
  rules.textContent = JSON.stringify({
    prefetch: [
      {
        where: {
          and: [
            { href_matches: withBase('/*') },
            { not: { href_matches: withBase('/admin/*') } },
            { not: { selector_matches: '[target=_blank], [rel~=nofollow]' } },
          ],
        },
        eagerness: 'moderate',
      },
    ],
  });
  document.head.append(rules);
}
