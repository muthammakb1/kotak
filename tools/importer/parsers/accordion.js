/* eslint-disable */
/* global WebImporter */
/**
 * Parser for `accordion` (base block: accordion).
 * Source: https://www.kotak.bank.in/en/stories-in-focus/nri/how-to-invest-in-gold-as-an-nri.html
 * Generated for the Kotak "story-article" template (DA project).
 *
 * Block model (library-description.txt + blocks/accordion/accordion.js):
 *   2 columns, multiple rows.
 *   Row 1: block name (added by createBlock).
 *   Each subsequent row = one accordion item: [ Title cell | Content cell ].
 *     Title cell   -> the clickable question.
 *     Content cell -> the answer body (paragraphs / media).
 *
 * Source structure (div.faq.section):
 *   - Section heading: h4 ("Frequently Asked Questions") — kept as default
 *     content placed *before* the accordion block (no heading slot in model).
 *   - Each Q&A: div.search-result-box
 *        h3.faq-question      -> question
 *        p (direct children)  -> answer paragraphs
 *        (like/dislike + pagination controls are ignored)
 */
export default function parse(element, { document }) {
  // Section heading that sits above the accordion (default content).
  const heading = element.querySelector('h4');

  // Each FAQ item lives in a .search-result-box that carries an h3.faq-question.
  const items = Array.from(
    element.querySelectorAll('.search-result-box'),
  ).filter((box) => box.querySelector('h3.faq-question, .faq-question'));

  const cells = [];

  items.forEach((box) => {
    const question = box.querySelector('h3.faq-question, .faq-question');
    if (!question) return;

    // Title cell: clean heading text for the accordion label.
    const titleEl = document.createElement('p');
    titleEl.textContent = question.textContent.trim();

    // Content cell: answer paragraphs that are direct children of the box.
    // Skip the interaction helper (.get-help-more) and empty/non-breaking paras.
    const contentEls = [];
    Array.from(box.querySelectorAll(':scope > p')).forEach((p) => {
      const text = p.textContent.replace(/ /g, ' ').trim();
      if (text) {
        const para = document.createElement('p');
        para.innerHTML = p.innerHTML;
        contentEls.push(para);
      }
    });

    // Fallback: if no usable paragraph was found, emit an empty content cell
    // so the row keeps its 2-column shape.
    if (contentEls.length === 0) contentEls.push('');

    cells.push([titleEl, contentEls]);
  });

  // Empty-block guard: nothing to author — drop the FAQ section entirely.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion', cells });

  // Place the "Frequently Asked Questions" heading as default content before
  // the accordion block (the block model has no heading slot).
  if (heading && heading.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    element.replaceWith(h2, block);
  } else {
    element.replaceWith(block);
  }
}
