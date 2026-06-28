/* eslint-disable */
/* global WebImporter */
/**
 * Parser for `columns` (base block: columns).
 * Source: https://www.kotak.bank.in/en/stories-in-focus/nri/how-to-invest-in-gold-as-an-nri.html
 * Generated for the Kotak "story-article" template (DA project).
 *
 * Block model (library-description.txt + blocks/columns/columns.js):
 *   First row = block name (added by createBlock).
 *   Second row defines the column count; here it is a 2-column layout:
 *     [ main article body | Related Information sidebar ]
 *
 * Source structure (section.articles-details > div.container > div.row):
 *   - Left  (div.col-md-8): div.article-ctnt > div.article-ctnt-div holds the
 *     editorial copy — publish date, h2.hd1 headings, paragraphs, ol/ul lists,
 *     conclusion. Framework chrome (comment counter, rating modal, share
 *     widgets) is excluded.
 *   - Right (div.col-md-4): div.multiplelinkblock .mf-card holds the
 *     "Related Information" sidebar — p.mf-header heading + ul.mf-list of
 *     related-article links (populated dynamically; static links captured here).
 */
export default function parse(element, { document }) {
  // ----- Left column: main article body -----
  // The editorial copy (date div, h2.hd1 headings, paragraphs, ol/ul lists)
  // are direct children of .article-ctnt. The publish-date lives in the nested
  // .article-ctnt-div, the rest are its siblings inside .article-ctnt.
  const articleBody = element.querySelector(
    '.col-md-8 .article-ctnt, .col-md-8 .commentsrte, .col-md-8',
  );

  const leftCell = [];
  if (articleBody) {
    // Walk every descendant block we care about, in document order, regardless
    // of how deeply the live DOM nests them (cleaned vs rendered differ).
    const wanted = articleBody.querySelectorAll(
      ':scope .article-ctnt-div, :scope h1, :scope h2, :scope h3, :scope h4, :scope h5, :scope h6, :scope > p, :scope p, :scope > ol, :scope ol, :scope > ul, :scope ul',
    );
    const seen = new Set();
    wanted.forEach((node) => {
      // Avoid capturing a node that is already inside another captured node.
      if ([...seen].some((s) => s.contains(node))) return;

      const tag = node.tagName ? node.tagName.toLowerCase() : '';
      const cls = node.className || '';
      // Drop framework chrome (rating / comments / share / modal helpers),
      // including nodes nested *inside* such chrome containers (e.g. the
      // rating-success popup's "OK" button and message paragraph).
      if (/link-box|modal|rating|comments|share|error-msg|thumbs|like|dislike/i.test(cls)) return;
      if (node.closest && node.closest('.modal, .link-box, [id*="rating"], [id*="popup"], [class*="popup"], .get-help-popup, .em')) return;

      const text = node.textContent.replace(/ /g, ' ').trim();
      // Keep structural elements (headings/lists) always; keep paragraphs/date
      // only when they carry real text.
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul'].includes(tag)) {
        leftCell.push(node);
        seen.add(node);
      } else if (text) {
        leftCell.push(node);
        seen.add(node);
      }
    });
  }

  // ----- Right column: Related Information sidebar -----
  const sidebarCard = element.querySelector(
    '.col-md-4 .mf-card, .col-md-4 .multiplelinkblock, .col-md-4',
  );

  const rightCell = [];
  if (sidebarCard) {
    const header = sidebarCard.querySelector('.mf-header, p.mf-header, h2, h3, h4');
    if (header && header.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = header.textContent.trim();
      rightCell.push(h3);
    }

    // Rebuild the related-links list with clean anchors only.
    const listItems = Array.from(sidebarCard.querySelectorAll('li.mf-list-item, .mf-list > li'));
    if (listItems.length) {
      const ul = document.createElement('ul');
      listItems.forEach((li) => {
        const link = li.querySelector('a[href]:not(.red-arrow)') || li.querySelector('a[href]');
        const label = li.querySelector('.mf-list-item-text');
        if (link && (link.getAttribute('href') || '').trim()) {
          const newLi = document.createElement('li');
          const a = document.createElement('a');
          a.href = link.getAttribute('href');
          a.textContent = (label ? label.textContent : link.textContent).trim();
          newLi.append(a);
          ul.append(newLi);
        }
      });
      if (ul.children.length) rightCell.push(ul);
    }
  }

  // Empty-block guard: if there is no article body at all, leave content as-is.
  if (leftCell.length === 0 && rightCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Pad to keep the 2-column shape even if the sidebar is empty (dynamic).
  if (rightCell.length === 0) rightCell.push('');

  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
