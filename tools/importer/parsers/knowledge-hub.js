/* eslint-disable */
/* global WebImporter */
/**
 * Parser for knowledge-hub. Base block: knowledge-hub (custom Kotak block).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated: 2026-06-24
 *
 * Block contract (from blocks/knowledge-hub/knowledge-hub.js readRow()):
 *   4 cells per row, in authoring order:
 *     0 eyebrow, 1 title, 2 image, 3 redirection link.
 *   decorate() promotes the first row that has both image + title to a
 *   "featured" tile, treats remaining image+title rows as story links, uses
 *   the featured row's eyebrow as the aside heading, and treats a link-only
 *   row (no image, no title) as the "view all" CTA.
 *
 * Source HTML: three .mf-card columns ("Service Request", "HelpCenter",
 * "Learn all about Savings Account"). Each card:
 *   - p.mf-header                → section heading
 *   - ul.mf-list > li.mf-list-item, each with:
 *       img.mf-list-icon (optional) → story image
 *       span.mf-list-item-text a    → link text + href (some items are
 *                                     plain text with no anchor)
 *   - span.link-box a            → the card's "view all" CTA
 *
 * One row is emitted per list item (eyebrow = card header so grouping/heading
 * is preserved), plus one link-only "view all" row per card.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.mf-card'));

  const cells = [];

  cards.forEach((card) => {
    const headerEl = card.querySelector('.mf-header');
    const header = headerEl ? headerEl.textContent.trim() : '';

    const items = Array.from(card.querySelectorAll('ul.mf-list > li.mf-list-item, .mf-list .mf-list-item'));

    items.forEach((li) => {
      // Image (only present in the stories card).
      const imgEl = li.querySelector('img.mf-list-icon, img');
      let imageNode = '';
      if (imgEl && imgEl.getAttribute('src')) {
        const img = document.createElement('img');
        img.src = imgEl.getAttribute('src');
        img.alt = '';
        imageNode = img;
      }

      // Link text + href. The first .mf-list-item-text holds the anchor; some
      // items carry the label in a sibling plain-text span instead.
      const anchor = li.querySelector('.mf-list-item-text a[href], a[href]:not(.red-arrow)')
        || li.querySelector('a[href]');
      let href = anchor ? (anchor.getAttribute('href') || '') : '';
      if (href === '#') href = '';

      // Title text: prefer anchor text; fall back to any item-text span text.
      let title = anchor ? anchor.textContent.trim() : '';
      if (!title) {
        const textSpan = Array.from(li.querySelectorAll('.mf-list-item-text'))
          .map((s) => s.textContent.trim())
          .find((t) => t);
        title = textSpan || '';
      }
      // Strip leading bullet glyphs/whitespace ("•   Nomination update").
      title = title.replace(/^[••\s]+/, '').trim();

      if (title || imageNode || href) {
        cells.push([header, title, imageNode ? [imageNode] : [''], href]);
      }
    });

    // Card-level "view all" CTA → link-only row (no eyebrow/title/image).
    const viewAll = card.querySelector('.link-box a[href]');
    if (viewAll) {
      const href = viewAll.getAttribute('href') || '';
      if (href && href !== '#') {
        cells.push(['', '', '', href]);
      }
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'knowledge-hub', cells });
  element.replaceWith(block);
}
