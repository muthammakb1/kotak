/* eslint-disable */
/* global WebImporter */
/**
 * Parser for knowledge-hub.
 * Base block: knowledge-hub (custom; "knowledge" not in library catalog).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated for the Kotak savings-account migration.
 *
 * The knowledge-hub block (blocks/knowledge-hub/knowledge-hub.js) reads each row with
 * 4 cells in this exact order:
 *   0 eyebrow, 1 title, 2 image, 3 redirection link.
 * It promotes the first row that has BOTH an image and a title to a "featured" card,
 * renders remaining image+title rows as story items, and treats a row with only a
 * link (no image/title) as the "view all" link.
 *
 * Source: a .columncontrol with up to three .multiplelinkblock / .mf-card columns,
 * each with a .mf-header and a .mf-list of items. Only the editorial "stories" card
 * carries thumbnails (img.mf-list-icon); the others are plain link lists. We emit one
 * row per list link (eyebrow = its card header, title = link text, image = thumbnail
 * if present, href = link), then a final view-all row from the stories card's CTA.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.mf-card, .multiplelinkblock .mf-card'));

  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').replace(/^[•\s]+/, '').trim() : '');

  const buildImg = (imgEl, alt) => {
    if (!imgEl) return '';
    const src = imgEl.getAttribute('src') || imgEl.getAttribute('data-src');
    if (!src) return '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || imgEl.getAttribute('alt') || '';
    return img;
  };

  const seen = new Set();
  const cells = [];
  let viewAllHref = '';
  let storiesViewAll = '';

  cards.forEach((card) => {
    const header = text(card.querySelector('.mf-header'));
    const items = Array.from(card.querySelectorAll('.mf-list-item'));

    items.forEach((item) => {
      // The primary link for the item.
      const link = item.querySelector('.mf-list-item-text a[href], a[href]:not(.red-arrow)')
        || item.querySelector('a[href]');
      const title = link ? text(link) : text(item.querySelector('.mf-list-item-text'));
      const href = link ? (link.getAttribute('href') || '') : '';
      const imageCell = buildImg(item.querySelector('img.mf-list-icon, img'), title);

      if (!title) return;

      const sig = `${header}|${title}|${href}`;
      if (seen.has(sig)) return;
      seen.add(sig);

      cells.push([header, title, imageCell, href]);
    });

    // Capture this card's CTA; prefer the stories card's "View all stories".
    const cta = card.querySelector('.link-box a[href]');
    if (cta) {
      const ctaHref = cta.getAttribute('href') || '';
      const isStories = /story|stories/i.test(ctaHref) || /view all stories/i.test(cta.textContent);
      if (isStories && !storiesViewAll) storiesViewAll = ctaHref;
      if (!viewAllHref) viewAllHref = ctaHref;
    }
  });

  // Append a "view all" row (link-only) so the block renders the View All link.
  const finalViewAll = storiesViewAll || viewAllHref;
  if (finalViewAll) {
    cells.push(['', '', '', finalViewAll]);
  }

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'knowledge-hub', cells });
  element.replaceWith(block);
}
