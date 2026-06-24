/* eslint-disable */
/* global WebImporter */
/**
 * Parser for highlight-grid. Base block: highlight-grid (custom Kotak video grid).
 * Source: https://www.kotak.bank.in/en/personal-banking/accounts/savings-account.html
 * Generated: 2026-06-24
 *
 * Block contract (from blocks/highlight-grid/highlight-grid.js readCard()):
 *   4 cells per card, in authoring order:
 *     0 title, 1 image, 2 body text, 3 video link (optional).
 *   A card with a video link renders as a play-button thumbnail.
 *
 * Source HTML: each grid item is a .video.section > .track-video-section with:
 *   - p.video-title-large (.info-title) → title
 *   - a.em-link[href=youtube...] wrapping img.em-img (lazyload data-srcset) → video + thumbnail
 *   - .comp-desc → body description
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.track-video-section, .video.section .hp-main-box'));
  // Keep one node per card; prefer the inner .track-video-section.
  const cardEls = items.filter((el) => el.classList.contains('track-video-section')
    ? true
    : !el.querySelector('.track-video-section'));

  const cells = [];

  cardEls.forEach((card) => {
    // --- Title ---
    const titleEl = card.querySelector('.video-title-large, .info-title');
    const title = titleEl ? titleEl.textContent.trim() : '';

    // --- Video link + thumbnail image ---
    const link = card.querySelector('a.em-link[href], a.track-videos[href], .img-card a[href]');
    const videoHref = link ? (link.getAttribute('href') || '') : '';

    const imgEl = card.querySelector('img.em-img, .img-card img, img');
    let imageNode = '';
    if (imgEl) {
      const realSrc = imgEl.getAttribute('src')
        || (imgEl.getAttribute('data-srcset') || '').split(',')[0].trim().split(/\s+/)[0]
        || imgEl.getAttribute('data-src')
        || '';
      if (realSrc) {
        const img = document.createElement('img');
        img.src = realSrc;
        img.alt = imgEl.getAttribute('alt') || title;
        imageNode = img;
      }
    }

    // --- Body description (strip empty &nbsp; paragraphs) ---
    const descEl = card.querySelector('.comp-desc, .info-box .text');
    let bodyNode = '';
    if (descEl) {
      const meaningful = Array.from(descEl.children).filter((n) => n.textContent.trim());
      if (meaningful.length) {
        bodyNode = meaningful;
      } else if (descEl.textContent.trim()) {
        bodyNode = descEl;
      }
    }

    // Skip empty cards.
    if (!title && !imageNode && !videoHref) return;

    cells.push([
      title, // 0 title
      imageNode ? [imageNode] : [''], // 1 image
      bodyNode && bodyNode.length ? bodyNode : (bodyNode || ''), // 2 body text
      videoHref, // 3 video link
    ]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'highlight-grid', cells });
  element.replaceWith(block);
}
