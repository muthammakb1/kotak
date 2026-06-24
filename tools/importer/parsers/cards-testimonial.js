/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-testimonial.
 * Base block: cards (testimonial variant).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated for the Kotak savings-account migration.
 *
 * The cards-testimonial block (blocks/cards-testimonial/cards-testimonial.js) renders
 * each row as one testimonial card. The block keeps every cell in the row as card body
 * content, so we emit ONE body cell per card holding: reviewer name (heading),
 * star rating, quote, and review date.
 *
 * Source card: .featurecards .hp-main-box (data-ratingvalue) containing
 *   .em-title (reviewer name), ul.rating li i.fa-star (rating), .desc (quote),
 *   .ohidden (review date). Cards live inside an owl-carousel (skip .cloned items).
 */
export default function parse(element, { document }) {
  let cards = Array.from(element.querySelectorAll('.owl-item:not(.cloned) .hp-main-box'));
  if (!cards.length) cards = Array.from(element.querySelectorAll('.hp-main-box'));
  if (!cards.length) cards = Array.from(element.querySelectorAll('.featurecards'));

  const seen = new Set();
  const cells = [];

  cards.forEach((card) => {
    const body = document.createElement('div');

    // Reviewer name.
    const nameEl = card.querySelector('.em-title, h4, h3');
    const name = nameEl ? nameEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (name) {
      const h = document.createElement('h4');
      h.textContent = name;
      body.append(h);
    }

    // Rating: prefer data-ratingvalue, fall back to counting filled stars.
    let rating = card.getAttribute('data-ratingvalue');
    if (!rating) {
      const filled = card.querySelectorAll('.rating .fa-star, .rating i.fa-star');
      if (filled.length) rating = String(filled.length);
    }
    if (rating) {
      const r = document.createElement('p');
      const num = parseInt(rating, 10);
      r.textContent = Number.isNaN(num) ? rating : '★'.repeat(num);
      body.append(r);
    }

    // Quote.
    const quoteEl = card.querySelector('.desc, .info-box p, .share-comp-desc p');
    const quote = quoteEl ? quoteEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (quote) {
      const p = document.createElement('p');
      p.textContent = quote;
      body.append(p);
    }

    // Date.
    const dateEl = card.querySelector('.ohidden');
    const date = dateEl ? dateEl.textContent.replace(/\s+/g, ' ').trim() : '';
    if (date) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = date;
      p.append(em);
      body.append(p);
    }

    if (!body.children.length) return;

    const sig = `${name}|${quote}|${date}`;
    if (seen.has(sig)) return;
    seen.add(sig);

    cells.push([body]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-testimonial', cells });
  element.replaceWith(block);
}
