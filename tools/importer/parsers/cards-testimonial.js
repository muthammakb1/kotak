/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-testimonial. Base block: cards (no images variant).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated: 2026-06-24
 *
 * Block structure (from library-description.txt "Cards (no images)"): 1 column.
 *   Row 1: block name only.
 *   Each subsequent row = one testimonial card in a single cell:
 *     heading (name), rating, quote, review date.
 *
 * Source HTML: testimonials live in an owl-carousel; each slide
 * (.owl-item / .featurecards) contains:
 *   - h4.em-title  → reviewer name
 *   - ul.rating with N <i class="fa fa-star"> → star rating
 *   - p.desc       → the testimonial quote
 *   - p.ohidden    → "Reviewed on ..." date
 */
export default function parse(element, { document }) {
  // Each testimonial is a .featurecards block; querying these directly avoids
  // duplicate owl-item clones the carousel may insert.
  const slides = Array.from(element.querySelectorAll('.featurecards'));

  const cells = [];

  slides.forEach((slide) => {
    const contentCell = [];

    // Reviewer name → heading.
    const nameEl = slide.querySelector('h4.em-title, .em-title');
    if (nameEl && nameEl.textContent.trim()) {
      const h = document.createElement('h3');
      h.textContent = nameEl.textContent.trim();
      contentCell.push(h);
    }

    // Star rating → render as filled-star characters so it survives as text.
    const ratingList = slide.querySelector('ul.rating');
    if (ratingList) {
      const starCount = ratingList.querySelectorAll('i.fa-star').length;
      if (starCount) {
        const p = document.createElement('p');
        p.textContent = '★'.repeat(starCount);
        contentCell.push(p);
      }
    }

    // Testimonial quote.
    const quote = slide.querySelector('p.desc, .em-desc p');
    if (quote && quote.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = quote.textContent.trim();
      contentCell.push(p);
    }

    // Review date.
    const date = slide.querySelector('p.ohidden');
    if (date && date.textContent.trim()) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = date.textContent.trim();
      p.append(em);
      contentCell.push(p);
    }

    if (contentCell.length) cells.push([contentCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-testimonial', cells });
  element.replaceWith(block);
}
