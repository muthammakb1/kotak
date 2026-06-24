/**
 * Customer testimonial cards.
 * Each row is one testimonial: reviewer name, rating, quote, and date.
 * Renders as a horizontally scrollable track of cards.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-testimonial-track';
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-testimonial-card';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.classList.add('cards-testimonial-card-body');
    });
    ul.append(li);
  });
  block.replaceChildren(ul);
}
