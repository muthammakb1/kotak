/*
 * Accordion FAQ Block
 * Each authored row becomes a collapsible question/answer item.
 * Row structure: [ question cell, answer cell ]
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const label = cells[0];
    const body = cells[1];

    // build <details> wrapper
    const details = document.createElement('details');
    details.className = 'accordion-faq-item';

    // summary (question)
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...label.childNodes);

    // body (answer)
    const bodyWrap = document.createElement('div');
    bodyWrap.className = 'accordion-faq-item-body';
    if (body) bodyWrap.append(...body.childNodes);

    details.append(summary, bodyWrap);
    row.replaceWith(details);
  });
}
