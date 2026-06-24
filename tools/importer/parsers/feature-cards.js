/* eslint-disable */
/* global WebImporter */
/**
 * Parser for feature-cards. Base block: feature-cards (custom Kotak block).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated: 2026-06-24
 *
 * Block contract (from blocks/feature-cards/feature-cards.js readCard()):
 *   7 cells per row, in authoring order:
 *     0 desktop image, 1 mobile image, 2 title1 (eyebrow),
 *     3 title2 (heading), 4 title3 (description), 5 CTA label, 6 CTA href.
 *
 * Source HTML: each card is a .featurecards > .hp-main-box containing:
 *   - img.em-img (lazyload: real URL is in data-originalsrc, not src)
 *   - p.info-title (em-sub-title) → card heading
 *   - .em-desc p → description
 *   - a.em-cta → "Know more" CTA (label + href)
 * Only one image is authored, so it is used for both desktop and mobile cells.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.featurecards .hp-main-box, .featurecards'));
  // De-duplicate: prefer .hp-main-box nodes; if both selectors matched the same
  // card, keep only the innermost (.hp-main-box) ones.
  const cardEls = cards.filter((el) => el.classList.contains('hp-main-box')
    ? true
    : !el.querySelector('.hp-main-box'));

  const cells = [];

  cardEls.forEach((card) => {
    // --- Image: resolve the real URL from data-originalsrc / data-srcset. ---
    const imgEl = card.querySelector('img.em-img, img');
    let imageNode = '';
    if (imgEl) {
      const realSrc = imgEl.getAttribute('data-originalsrc')
        || imgEl.getAttribute('src')
        || (imgEl.getAttribute('data-srcset') || '').split(',')[0].trim().split(/\s+/)[0]
        || '';
      if (realSrc) {
        const img = document.createElement('img');
        img.src = realSrc;
        img.alt = imgEl.getAttribute('alt') || '';
        imageNode = img;
      }
    }

    // --- Text fields ---
    const titleEl = card.querySelector('.info-title, .em-sub-title');
    const title2 = titleEl ? titleEl.textContent.trim() : '';

    const descEl = card.querySelector('.em-desc p, .info-box p, .em-desc');
    const title3 = descEl ? descEl.textContent.trim() : '';

    // --- CTA ---
    const ctaEl = card.querySelector('a.em-cta');
    const ctaLabel = ctaEl ? ctaEl.textContent.trim() : '';
    const ctaHref = ctaEl ? (ctaEl.getAttribute('href') || '') : '';

    // Skip empty cards.
    if (!imageNode && !title2 && !title3) return;

    cells.push([
      imageNode ? [imageNode] : [''], // 0 desktop image
      imageNode ? [imageNode.cloneNode(true)] : [''], // 1 mobile image (same source)
      '', // 2 title1 / eyebrow (not present in source)
      title2, // 3 title2 / heading
      title3, // 4 title3 / description
      ctaLabel, // 5 CTA label
      ctaHref, // 6 CTA href
    ]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'feature-cards', cells });
  element.replaceWith(block);
}
