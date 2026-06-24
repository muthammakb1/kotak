/* eslint-disable */
/* global WebImporter */
/**
 * Parser for highlight-grid.
 * Base block: highlight-grid (custom; "highlight" not in library catalog).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated for the Kotak savings-account migration.
 *
 * The highlight-grid block (blocks/highlight-grid/highlight-grid.js) reads each card row
 * with up to 4 cells in this exact order:
 *   0 title, 1 image (thumbnail), 2 body text, 3 video link (optional).
 * A card with a video link renders as a play-button thumbnail that opens a modal.
 *
 * Source card: .video.section .details-box[data-type="video"] containing
 *   .info-title.em-title (title), a.em-link[href] (YouTube embed link) wrapping img.em-img
 *   (thumbnail), .info-box .text (body copy).
 */
export default function parse(element, { document }) {
  let cards = Array.from(element.querySelectorAll('.video .details-box, .details-box[data-type="video"]'));
  if (!cards.length) cards = Array.from(element.querySelectorAll('.hp-main-box'));

  const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

  const buildImg = (imgEl, alt) => {
    if (!imgEl) return '';
    let src = imgEl.getAttribute('src') || imgEl.getAttribute('data-originalsrc');
    if (!src) {
      const srcset = imgEl.getAttribute('srcset') || imgEl.getAttribute('data-srcset');
      if (srcset) src = srcset.split(',')[0].trim().split(/\s+/)[0];
    }
    if (!src) return '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || imgEl.getAttribute('alt') || '';
    return img;
  };

  const seen = new Set();
  const cells = [];

  cards.forEach((card) => {
    // Title
    const titleEl = card.querySelector('.info-title, .video-title-large, .em-title');
    const title = text(titleEl);

    // Video link + thumbnail image
    const linkEl = card.querySelector('a.em-link[href], a.track-videos[href], a[href*="youtube"], a[href*="youtu.be"]');
    const videoHref = linkEl ? (linkEl.getAttribute('href') || '') : '';
    const imgEl = card.querySelector('img.em-img, .img-card img, img');
    const imageCell = buildImg(imgEl, title);

    // Body text — preserve formatting (bold) from the description block.
    const bodyEl = card.querySelector('.info-box .text, .info-box .comp-desc, .info-box');
    let bodyCell = '';
    if (bodyEl) {
      const wrap = document.createElement('div');
      // Pull paragraph nodes, skipping empty (&nbsp;) paragraphs.
      const paras = Array.from(bodyEl.querySelectorAll('p'));
      if (paras.length) {
        paras.forEach((p) => {
          if (p.textContent.replace(/ /g, ' ').trim()) {
            const np = document.createElement('p');
            np.innerHTML = p.innerHTML;
            wrap.append(np);
          }
        });
      } else if (text(bodyEl)) {
        const np = document.createElement('p');
        np.textContent = text(bodyEl);
        wrap.append(np);
      }
      if (wrap.children.length) bodyCell = wrap;
    }

    if (!title && !imageCell && !videoHref) return;

    const sig = `${title}|${(imageCell && imageCell.src) || ''}|${videoHref}`;
    if (seen.has(sig)) return;
    seen.add(sig);

    // Build the row. Include the optional 4th (video link) cell only when present,
    // but keep every row the same width by padding shorter rows.
    const row = [title, imageCell, bodyCell];
    row.push(videoHref || '');
    cells.push(row);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'highlight-grid', cells });
  element.replaceWith(block);
}
