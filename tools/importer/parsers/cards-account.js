/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-account.
 * Base block: cards (account-product variant).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated for the Kotak savings-account migration.
 *
 * The cards-account block (blocks/cards-account/cards-account.js) renders each row as
 * one card with 2 cells:
 *   0 image cell  (a div whose only child is a <picture>/<img>)
 *   1 body cell   (title, optional offer, bullet list, CTAs)
 * A div containing a single picture is classed as the image; everything else is body.
 *
 * Source card: .col-md-4.main-card > .sa-card containing
 *   .sa-img-container (.sa-tile-img.hidden-xs desktop img, .sa-msg-title overlay title)
 *   .sa-offer-strip   (optional: .sa-offer-title, .sa-offer-desc)
 *   .sa-card-bullets ul
 *   .sa-btn-section   (a.sa-red-btn, a.sa-transparent-btn)
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > .main-card, :scope > [class*="main-card"]'));
  const sourceCards = cards.length ? cards : Array.from(element.querySelectorAll('.sa-card'));

  const cells = [];

  sourceCards.forEach((card) => {
    const sa = card.querySelector('.sa-card') || card;

    // --- Image cell: prefer the desktop tile image. ---
    const imgEl = sa.querySelector('.sa-tile-img.hidden-xs')
      || sa.querySelector('.sa-img-container img')
      || sa.querySelector('img');
    let imageCell = '';
    if (imgEl) {
      const img = document.createElement('img');
      img.src = imgEl.getAttribute('src') || imgEl.getAttribute('data-src') || '';
      img.alt = imgEl.getAttribute('alt') || '';
      const imgDiv = document.createElement('div');
      imgDiv.append(img);
      imageCell = imgDiv;
    }

    // --- Body cell ---
    const body = document.createElement('div');

    // Title (image overlay text).
    const titleEl = sa.querySelector('.sa-msg-title');
    if (titleEl && titleEl.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
      body.append(h);
    }

    // Optional offer strip.
    const offerTitle = sa.querySelector('.sa-offer-title');
    const offerDesc = sa.querySelector('.sa-offer-desc');
    if (offerTitle || offerDesc) {
      const offer = document.createElement('p');
      const parts = [];
      if (offerTitle && offerTitle.textContent.trim()) parts.push(offerTitle.textContent.trim());
      if (offerDesc && offerDesc.textContent.trim()) parts.push(offerDesc.textContent.trim());
      offer.innerHTML = `<strong>${parts.join(' - ')}</strong>`;
      if (parts.length) body.append(offer);
    }

    // Bullet list.
    const bullets = sa.querySelector('.sa-card-bullets ul');
    if (bullets) {
      const ul = document.createElement('ul');
      Array.from(bullets.querySelectorAll(':scope > li')).forEach((li) => {
        const item = document.createElement('li');
        item.innerHTML = li.innerHTML.replace(/\s+/g, ' ').trim();
        ul.append(item);
      });
      if (ul.children.length) body.append(ul);
    }

    // CTAs — preserve as links; resolve href, ignore JS placeholders.
    const ctaEls = Array.from(sa.querySelectorAll('.sa-btn-section a, a.sa-red-btn, a.sa-transparent-btn'));
    const ctaSeen = new Set();
    ctaEls.forEach((cta) => {
      const href = cta.getAttribute('href')
        || cta.getAttribute('data-des-link')
        || cta.getAttribute('data-mob-link')
        || '';
      if (!href || /^javascript:/i.test(href)) return;
      const label = cta.textContent.replace(/\s+/g, ' ').trim();
      if (!label) return;
      const key = `${label}|${href}`;
      if (ctaSeen.has(key)) return;
      ctaSeen.add(key);
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      p.append(a);
      body.append(p);
    });

    // Skip empty cards.
    if (!imageCell && !body.children.length) return;

    cells.push([imageCell, body]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-account', cells });
  element.replaceWith(block);
}
