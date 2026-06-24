/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq.
 * Base block: accordion (FAQ variant).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated for the Kotak savings-account migration.
 *
 * The accordion-faq block (blocks/accordion-faq/accordion-faq.js) expects a 2-column
 * table; each row is one accordion item:
 *   0 title cell   (the question / clickable label)
 *   1 content cell (the answer body — text, lists, links shown when expanded)
 *
 * Source markup: a .prod-accordion / .ctnt-wrapper with a flat sequence of
 *   <h2 class="target"> (question, wrapped in <a><strong>…</strong></a>) each followed
 *   by a sibling .toggle-ctnt containing the answer inside .cmp-text.
 * We pair each question heading with the toggle-content that immediately follows it.
 */
export default function parse(element, { document }) {
  const wrapper = element.querySelector('.ctnt-wrapper') || element;
  const headings = Array.from(wrapper.querySelectorAll('h2.target, .target'));

  const cells = [];
  const seen = new Set();

  headings.forEach((h) => {
    // Question text — prefer the inner <strong>, fall back to the heading text.
    const strong = h.querySelector('strong');
    const question = (strong ? strong.textContent : h.textContent).replace(/\s+/g, ' ').trim();
    if (!question) return;

    // Answer: the next sibling .toggle-ctnt (skip non-element/whitespace nodes).
    let sib = h.nextElementSibling;
    while (sib && !sib.classList.contains('toggle-ctnt')) sib = sib.nextElementSibling;

    // Title cell as a heading element to preserve semantics.
    const titleCell = document.createElement('p');
    titleCell.textContent = question;

    // Content cell: pull the meaningful answer content (cmp-text), preserving
    // paragraphs, lists, bold text and links.
    const contentCell = document.createElement('div');
    if (sib) {
      const source = sib.querySelector('.cmp-text') || sib;
      Array.from(source.children).forEach((child) => {
        // Skip empty paragraphs (e.g. <p>&nbsp;</p>).
        if (child.tagName === 'P' && !child.textContent.replace(/ /g, ' ').trim() && !child.querySelector('a, img')) {
          return;
        }
        contentCell.append(child.cloneNode(true));
      });
      // Fallback: if nothing was copied, use the source's text.
      if (!contentCell.children.length) {
        const text = source.textContent.replace(/\s+/g, ' ').trim();
        if (text) {
          const p = document.createElement('p');
          p.textContent = text;
          contentCell.append(p);
        }
      }
    }

    const sig = question;
    if (seen.has(sig)) return;
    seen.add(sig);

    cells.push([titleCell, contentCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
