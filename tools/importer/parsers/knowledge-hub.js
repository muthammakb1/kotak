/* eslint-disable */
/* global WebImporter */
/**
 * Parser for `knowledge-hub` (base block: knowledge-hub).
 * Source: https://www.kotak.bank.in/en/stories-in-focus/nri/how-to-invest-in-gold-as-an-nri.html
 * Generated for the Kotak "story-article" template (DA project).
 *
 * Block model (from blocks/knowledge-hub/knowledge-hub.js -> readRow):
 *   No fixed library convention; the local block reads each row's cells in
 *   authoring order as: [ 0 eyebrow | 1 title | 2 image | 3 redirection link ].
 *   The decorator treats the first row with image+title as the featured card,
 *   remaining image+title rows as story items, and a row with only a link
 *   (no image, no title) as the "view all" link.
 *   => 4 columns. First row = block name (added by createBlock).
 *
 * Source structure (div.keepreading.section):
 *   - Heading: div.keep-reading-div ("Read Next") -> default content before block.
 *   - Cards:   div.col-md-4.em, each with
 *        img.em-img            -> thumbnail image
 *        .em-title             -> card title
 *        a.em-cta / a.em-link  -> "Keep Reading" article link
 *   - "Load More": p.btn-box a.btn -> maps to the view-all (link-only) row.
 */
export default function parse(element, { document }) {
  // Section heading rendered above the cards grid (default content).
  const heading = element.querySelector('.keep-reading-div, h2, h3');

  const cards = Array.from(element.querySelectorAll('.col-md-4.em, .col-md-4'));

  const cells = [];

  cards.forEach((card) => {
    const titleEl = card.querySelector('.em-title, .hp-card-box .em-title');
    const imgEl = card.querySelector('img.em-img, img');
    const linkEl = card.querySelector('a.em-cta, a.em-link, a[href]');

    const title = titleEl ? titleEl.textContent.trim() : '';
    const href = linkEl ? (linkEl.getAttribute('href') || '').trim() : '';

    // Skip cards that carry neither a title nor an image.
    if (!title && !imgEl) return;

    // Eyebrow cell (none in source) — leave empty.
    const eyebrowCell = '';

    // Title cell.
    const titleCell = document.createElement('p');
    titleCell.textContent = title;

    // Image cell — reference the <img> element. These thumbnails are
    // lazy-loaded, so the live DOM may carry the real URL on a data-* attribute
    // while src is an empty/placeholder. Promote the lazy attr to src so the
    // importer captures the actual image.
    let imageCell = '';
    if (imgEl) {
      const realSrc = imgEl.getAttribute('data-src')
        || imgEl.getAttribute('data-original')
        || imgEl.getAttribute('data-lazy')
        || imgEl.getAttribute('data-srcset')
        || imgEl.getAttribute('src');
      const currentSrc = imgEl.getAttribute('src') || '';
      const isPlaceholder = !currentSrc
        || /^data:image/.test(currentSrc)
        || /(blank|placeholder|spacer|lazy)/i.test(currentSrc);
      if (realSrc && (isPlaceholder || !currentSrc)) {
        imgEl.setAttribute('src', realSrc.split(' ')[0]);
      }
      imageCell = imgEl;
    }

    // Redirection-link cell.
    let linkCell = '';
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = title || href;
      linkCell = a;
    }

    cells.push([eyebrowCell, titleCell, imageCell, linkCell]);
  });

  // "Load More" / view-all link -> link-only row (no eyebrow, title, image).
  const loadMore = element.querySelector('.btn-box a[href], a.btn[href]');
  if (loadMore && (loadMore.getAttribute('href') || '').trim()) {
    const a = document.createElement('a');
    a.href = loadMore.getAttribute('href');
    a.textContent = loadMore.textContent.trim() || 'View all';
    cells.push(['', '', '', a]);
  }

  // Empty-block guard: no cards found — leave content in place.
  if (cells.length === 0) {
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
  // Place the "Read Next" heading as default content before the block.
  if (heading && heading.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    element.replaceWith(h2, block);
  } else {
    element.replaceWith(block);
  }
  element.replaceWith(block);
}
