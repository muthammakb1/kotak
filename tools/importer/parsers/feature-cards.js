/* eslint-disable */
/* global WebImporter */
/**
 * Parser for feature-cards.
 * Base block: feature-cards (custom; "feature" not in library catalog).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated for the Kotak savings-account migration.
 *
 * The feature-cards block (blocks/feature-cards/feature-cards.js) reads each card row
 * with 7 cells in this exact order:
 *   0 desktop image, 1 mobile image, 2 title 1 (eyebrow), 3 title 2 (heading),
 *   4 title 3 (description), 5 CTA label, 6 redirection link.
 *
 * Source card: .featurecards .hp-main-box containing
 *   img.em-img (data-originalsrc / data-srcset), .info-title / .em-sub-title (heading),
 *   .info-box / .em-desc <p> (description), a.em-cta (CTA label + href).
 * No eyebrow (title1) or distinct mobile image in source — those cells stay empty.
 */
export default function parse(element, { document }) {
  let cards = Array.from(element.querySelectorAll('.featurecards .hp-main-box'));
  if (!cards.length) cards = Array.from(element.querySelectorAll('.hp-main-box'));

  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  // Resolve the best image URL for a card image.
  const buildImg = (imgEl) => {
    if (!imgEl) return '';
    let src = imgEl.getAttribute('src') || imgEl.getAttribute('data-originalsrc');
    if (!src) {
      const srcset = imgEl.getAttribute('srcset') || imgEl.getAttribute('data-srcset');
      if (srcset) src = srcset.split(',')[0].trim().split(/\s+/)[0];
    }
    if (!src) return '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = imgEl.getAttribute('alt') || '';
    return img;
  };

  const seen = new Set();
  const cells = [];

  cards.forEach((card) => {
    const desktopCell = buildImg(card.querySelector('img.em-img, .em-img, img'));
    const mobileCell = ''; // no distinct mobile image in source markup

    const title1 = ''; // no eyebrow in source
    const title2 = text(card.querySelector('.info-title, .em-sub-title'));
    const title3 = text(card.querySelector('.info-box, .em-desc, .share-comp-desc'));

    const ctaEl = card.querySelector('a.em-cta, .link-box a, a.em-link[href]');
    let ctaLabel = '';
    let ctaHref = '';
    if (ctaEl) {
      ctaLabel = text(ctaEl) || 'Know more';
      ctaHref = ctaEl.getAttribute('href') || '';
      if (/^javascript:/i.test(ctaHref)) ctaHref = '';
    }
    // Fall back to the card overlay link if the CTA had no href.
    if (!ctaHref) {
      const overlay = card.querySelector('a.em-link[href], a.link-card[href]');
      if (overlay) ctaHref = overlay.getAttribute('href') || '';
    }

    if (!desktopCell && !title2 && !title3) return;

    const sig = `${(desktopCell && desktopCell.src) || ''}|${title2}|${ctaHref}`;
    if (seen.has(sig)) return;
    seen.add(sig);

    cells.push([
      desktopCell,
      mobileCell,
      title1,
      title2,
      title3,
      ctaLabel,
      ctaHref,
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
