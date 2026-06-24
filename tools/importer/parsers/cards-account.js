/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-account. Base block: cards.
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated: 2026-06-24
 *
 * Block structure (from library-description.txt): 2 columns.
 *   Row 1: block name only.
 *   Each subsequent row = one card: [ image cell, text content cell ].
 *
 * Source HTML: each card is a .main-card containing a .sa-card with:
 *   - .sa-img-container with desktop image (.sa-tile-img.hidden-xs) and a
 *     .sa-msg-title overlay caption
 *   - optional .sa-offer-strip (offer image + title + desc)
 *   - .sa-card-bullets (ul of features)
 *   - .sa-btn-section with two CTAs (Open / Know More)
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > .main-card, .main-card'));

  const cells = [];

  cards.forEach((card) => {
    const inner = card.querySelector('.sa-card') || card;

    // --- Image cell ---
    // Prefer the desktop image; fall back to any sa-tile-img, then any img.
    const img = inner.querySelector('img.sa-tile-img.hidden-xs')
      || inner.querySelector('img.sa-tile-img')
      || inner.querySelector('.sa-img-container img')
      || inner.querySelector('img');
    const imageCell = img ? [img] : [''];

    // --- Text content cell ---
    const contentCell = [];

    // Card title (overlay caption) → heading.
    const titleP = inner.querySelector('.sa-msg-title');
    if (titleP && titleP.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = titleP.textContent.trim();
      contentCell.push(h);
    }

    // Optional offer strip (title + description).
    const offer = inner.querySelector('.sa-offer-strip');
    if (offer) {
      const offerTitle = offer.querySelector('.sa-offer-title');
      const offerDesc = offer.querySelector('.sa-offer-desc');
      if (offerTitle && offerTitle.textContent.trim()) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = offerTitle.textContent.trim();
        p.append(strong);
        if (offerDesc && offerDesc.textContent.trim()) {
          p.append(document.createTextNode(' ' + offerDesc.textContent.trim()));
        }
        contentCell.push(p);
      }
    }

    // Feature bullets.
    const bullets = inner.querySelector('.sa-card-bullets ul');
    if (bullets) contentCell.push(bullets);

    // CTAs — preserve real navigable hrefs only (skip javascript: anchors).
    const ctas = Array.from(inner.querySelectorAll('.sa-btn-section a[href]'));
    ctas.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href && !href.startsWith('javascript:')) {
        // Strip the trailing arrow icon; keep clean link text.
        const link = document.createElement('a');
        link.href = href;
        link.textContent = a.textContent.trim();
        const p = document.createElement('p');
        p.append(link);
        contentCell.push(p);
      }
    });

    if (contentCell.length || img) {
      cells.push([imageCell, contentCell.length ? contentCell : ['']]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-account', cells });
  element.replaceWith(block);
}
