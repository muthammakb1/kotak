/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated: 2026-06-24
 *
 * Block structure (from library-description.txt): 2 columns.
 *   Row 1: block name only.
 *   Each subsequent row: [ title cell, content cell ].
 *
 * Source HTML: <h2 class="target"> heading followed by a sibling
 * <div class="toggle-ctnt"> content block, repeated for each FAQ item
 * (19 items on this page).
 */
export default function parse(element, { document }) {
  // FAQ titles live in <h2 class="target"> (one per accordion item).
  const titles = Array.from(element.querySelectorAll(':scope .ctnt-wrapper > h2.target, :scope > h2.target, h2.target'));

  const cells = [];

  titles.forEach((titleEl) => {
    // Title text is inside an anchor (<a><strong>...</strong></a>); strip the
    // toggle arrow icon and the javascript anchor, keep just the label text.
    const strong = titleEl.querySelector('strong');
    const titleText = (strong ? strong.textContent : titleEl.textContent).trim();

    // The matching content panel is the next sibling .toggle-ctnt.
    let panel = titleEl.nextElementSibling;
    while (panel && !panel.classList.contains('toggle-ctnt')) {
      panel = panel.nextElementSibling;
    }

    // Extract the meaningful body content from the panel. Prefer the
    // .cmp-text inner content; fall back to the panel itself.
    let contentEl = null;
    if (panel) {
      contentEl = panel.querySelector('.cmp-text');
      if (!contentEl) {
        // Use the panel's children directly when no .cmp-text wrapper exists.
        contentEl = panel;
      }
    }

    // Title cell: plain heading text (block JS makes the row clickable).
    const titleCell = document.createElement('p');
    titleCell.textContent = titleText;

    // Content cell: preserve the rich HTML (paragraphs, lists, links, bold).
    const contentCell = [];
    if (contentEl) {
      // Pull the real content nodes so we don't carry wrapper boilerplate.
      const richNodes = Array.from(contentEl.children).filter(
        (n) => n.textContent.trim() || n.querySelector('img, a'),
      );
      if (richNodes.length) {
        contentCell.push(...richNodes);
      } else {
        contentCell.push(contentEl);
      }
    }

    if (titleText && contentCell.length) {
      cells.push([titleCell, contentCell]);
    }
  });

  // Empty-block guard: if no FAQ items found, unwrap and bail.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
