/* eslint-disable */
/* global WebImporter */
/**
 * Parser for info-carousel.
 * Base block: info (custom carousel variant).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated for the Kotak savings-account migration.
 *
 * The info-carousel block (blocks/info-carousel/info-carousel.js) reads each card row
 * with 4 cells in this exact order:
 *   0 title, 1 subtitle, 2 icon (image), 3 redirection link.
 *
 * This block is used in THREE distinct places on the page, each with different markup:
 *   - why-choose icon grid:   .offer       (icon .icon-box img, title .ohidden h4, desc .details-box)
 *   - legacy-accounts slider: a.iconsider-large-a (icon .iconsider-large-img img,
 *                             title .iconsider-title, desc .iconsider-dec, href on the <a>)
 *   - offers carousel:        .offer-card-box (icon .em-img, title .em-title,
 *                             desc .info-box/.share-comp-desc, link a.em-link)
 * The parser detects whichever card pattern is present and normalises to the 4-cell row.
 */
export default function parse(element, { document }) {
  // Resolve a usable href, ignoring placeholder JS links.
  const cleanHref = (a) => {
    if (!a) return '';
    const href = a.getAttribute('href') || '';
    if (!href || /^javascript:/i.test(href.trim()) || href.trim() === '#') return '';
    return href;
  };

  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  // Build a clean <img> referencing the source asset.
  const buildIcon = (img) => {
    if (!img) return '';
    const src = img.getAttribute('src') || img.getAttribute('data-src');
    if (!src) return '';
    const out = document.createElement('img');
    out.src = src;
    out.alt = img.getAttribute('alt') || '';
    return out;
  };

  // Try each known card pattern, in priority order, returning a list of card objects.
  const collectCards = () => {
    // Pattern A: why-choose icon grid
    let nodes = Array.from(element.querySelectorAll('.offer'));
    if (nodes.length) {
      return nodes.map((node) => ({
        title: text(node.querySelector('.ohidden h4, h4, h3')),
        subtitle: text(node.querySelector('.details-box, p')),
        icon: node.querySelector('.icon-box img, img'),
        href: cleanHref(node.querySelector('a')),
      }));
    }

    // Pattern B: legacy-accounts iconslider — anchor cards (skip owl clones).
    nodes = Array.from(element.querySelectorAll('.owl-item:not(.cloned) a.iconsider-large-a'));
    if (!nodes.length) nodes = Array.from(element.querySelectorAll('a.iconsider-large-a'));
    if (nodes.length) {
      return nodes.map((node) => ({
        title: text(node.querySelector('.iconsider-title')),
        subtitle: text(node.querySelector('.iconsider-dec')),
        icon: node.querySelector('.iconsider-large-img img, img'),
        href: cleanHref(node),
      }));
    }

    // Pattern C: offers carousel cards (skip owl clones).
    nodes = Array.from(element.querySelectorAll('.owl-item:not(.cloned) .offer-card-box'));
    if (!nodes.length) nodes = Array.from(element.querySelectorAll('.offer-card-box'));
    if (nodes.length) {
      return nodes.map((node) => {
        const link = node.querySelector('a.em-link[href]:not([href^="javascript"]), a[href]:not([href^="javascript"])');
        return {
          title: text(node.querySelector('.em-title, h4, h3')),
          subtitle: text(node.querySelector('.info-box, .share-comp-desc')),
          icon: node.querySelector('.em-img, img'),
          href: cleanHref(link),
        };
      });
    }

    return [];
  };

  const cards = collectCards();

  // Deduplicate (owl carousels may still produce repeats) and drop empty cards.
  const seen = new Set();
  const cells = [];
  cards.forEach((card) => {
    const iconCell = buildIcon(card.icon);
    if (!card.title && !card.subtitle && !iconCell) return;
    const sig = `${card.title}|${card.subtitle}|${(iconCell && iconCell.src) || ''}|${card.href}`;
    if (seen.has(sig)) return;
    seen.add(sig);
    cells.push([card.title, card.subtitle, iconCell, card.href]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'info-carousel', cells });
  element.replaceWith(block);
}
