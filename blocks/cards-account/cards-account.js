import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Decorate a product card. Authored structure per row:
 *   cell 0: <picture> (card image)
 *   cell 1: <h3> title, optional <p> offer strip (often with <strong>),
 *           <ul> bullet list, and one or two <p><a> CTA links.
 */
export default function decorate(block) {
  const cards = [...block.children];

  cards.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const bodyCell = cells[1];
    if (!bodyCell) return;

    row.className = 'cards-account-card';

    // --- image container with overlaid title ---
    const imgWrap = document.createElement('div');
    imgWrap.className = 'cards-account-image';
    const picture = imageCell ? imageCell.querySelector('picture') : null;
    if (picture) imgWrap.append(picture);

    const title = bodyCell.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) {
      const titleOverlay = document.createElement('div');
      titleOverlay.className = 'cards-account-title-overlay';
      titleOverlay.append(title);
      imgWrap.append(titleOverlay);
    }

    // --- offer strip: first <p> that is not a button/link wrapper ---
    const offer = document.createElement('div');
    offer.className = 'cards-account-offer';
    const paras = [...bodyCell.querySelectorAll(':scope > p')];
    const offerPara = paras.find((p) => !p.querySelector('a'));
    if (offerPara) offer.append(offerPara);

    // --- bullets ---
    const bullets = document.createElement('div');
    bullets.className = 'cards-account-bullets';
    const list = bodyCell.querySelector('ul');
    if (list) bullets.append(list);

    // --- buttons ---
    const buttonSection = document.createElement('div');
    buttonSection.className = 'cards-account-buttons';
    const links = [...bodyCell.querySelectorAll('a')];
    links.forEach((a, i) => {
      a.classList.add('cards-account-btn');
      a.classList.add(i === 0 ? 'cards-account-btn-primary' : 'cards-account-btn-secondary');
      // unwrap from parent <p> to control layout
      buttonSection.append(a);
    });

    // rebuild card body
    row.textContent = '';
    row.append(imgWrap);
    if (offerPara) row.append(offer);
    if (list) row.append(bullets);
    if (links.length) row.append(buttonSection);
  });

  // optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });
}
