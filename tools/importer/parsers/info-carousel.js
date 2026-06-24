/* eslint-disable */
/* global WebImporter */
/**
 * Parser for info-carousel. Base block: info-carousel (custom Kotak block).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated: 2026-06-24
 *
 * Block contract (from blocks/info-carousel/info-carousel.js readCard()):
 *   4 cells per card, in authoring order:
 *     0 title, 1 subtitle, 2 icon (image), 3 redirection link.
 *
 * This block appears in THREE distinct source structures (handled robustly):
 *
 *   1. "why-choose" icon grid — selector div.what-we-offer ... div.row
 *      Cards: .offer
 *        icon  → .icon-box img
 *        title → h4
 *        sub   → p.details-box
 *        link  → none
 *
 *   2. "legacy-accounts" slider — selector div.iconslider.section
 *      Cards: a.iconsider-large-a (each is itself the redirection link)
 *        icon  → .iconsider-large-img img
 *        title → .iconsider-title
 *        sub   → .iconsider-dec (usually empty)
 *        link  → the anchor's href
 *
 *   3. "offers" carousel — selector div.owl-carousel.common-slider
 *      Cards: .offer-card-box
 *        icon  → figure img.em-img
 *        title → h4.em-title
 *        sub   → .em-desc .info-box (offer description; validity ignored)
 *        link  → .em-cta href (often javascript:void → omitted)
 */
function makeIcon(document, imgEl, alt) {
  if (!imgEl) return '';
  const src = imgEl.getAttribute('src')
    || imgEl.getAttribute('data-src')
    || (imgEl.getAttribute('data-srcset') || '').split(',')[0].trim().split(/\s+/)[0]
    || '';
  if (!src) return '';
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || imgEl.getAttribute('alt') || '';
  return img;
}

function cleanHref(href) {
  if (!href) return '';
  if (href.startsWith('javascript:') || href === '#') return '';
  return href;
}

export default function parse(element, { document }) {
  const cells = [];

  // --- Structure 1: why-choose icon grid (.offer) ---
  const offers = Array.from(element.querySelectorAll('.offer'));
  // --- Structure 2: legacy-accounts slider (a.iconsider-large-a) ---
  const legacy = Array.from(element.querySelectorAll('a.iconsider-large-a'));
  // --- Structure 3: offers carousel (.offer-card-box) ---
  const offerCards = Array.from(element.querySelectorAll('.offer-card-box'));

  if (offers.length) {
    offers.forEach((card) => {
      const titleEl = card.querySelector('h4, .ohidden h4, .info-title');
      const title = titleEl ? titleEl.textContent.trim() : '';
      const subEl = card.querySelector('p.details-box, .details-box');
      const subtitle = subEl ? subEl.textContent.trim() : '';
      const icon = makeIcon(document, card.querySelector('.icon-box img, img'), title);
      const linkEl = card.querySelector('a[href]');
      const href = linkEl ? cleanHref(linkEl.getAttribute('href')) : '';
      if (title || subtitle || icon) {
        cells.push([title, subtitle, icon ? [icon] : [''], href]);
      }
    });
  } else if (legacy.length) {
    legacy.forEach((card) => {
      const titleEl = card.querySelector('.iconsider-title');
      const title = titleEl ? titleEl.textContent.trim() : '';
      const subEl = card.querySelector('.iconsider-dec');
      const subtitle = subEl ? subEl.textContent.trim() : '';
      const icon = makeIcon(document, card.querySelector('.iconsider-large-img img, img'), title);
      const href = cleanHref(card.getAttribute('href'));
      if (title || subtitle || icon) {
        cells.push([title, subtitle, icon ? [icon] : [''], href]);
      }
    });
  } else if (offerCards.length) {
    offerCards.forEach((card) => {
      const titleEl = card.querySelector('h4.em-title, .em-title');
      const title = titleEl ? titleEl.textContent.trim() : '';
      const subEl = card.querySelector('.em-desc .info-box, .em-desc p, .share-comp-desc');
      const subtitle = subEl ? subEl.textContent.trim() : '';
      const icon = makeIcon(document, card.querySelector('figure img, img.em-img, img'), title);
      const ctaEl = card.querySelector('a.em-cta[href], a.em-link[href]');
      const href = ctaEl ? cleanHref(ctaEl.getAttribute('href')) : '';
      if (title || subtitle || icon) {
        cells.push([title, subtitle, icon ? [icon] : [''], href]);
      }
    });
  }

  // Empty-block guard: if no recognizable cards (e.g. a dynamically-rendered
  // slider that was empty in the captured DOM), unwrap and bail.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'info-carousel', cells });
  element.replaceWith(block);
}
