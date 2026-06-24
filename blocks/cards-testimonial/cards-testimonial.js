/**
 * Customer testimonial cards.
 * Each authored row is one testimonial: reviewer name, quote, and a
 * "Reviewed on DATE" line. A 5-star rating is rendered above the quote to
 * match the source design (gold FontAwesome-style stars).
 * Renders as a responsive grid of cards (3-up on desktop).
 */

const STAR = '<span class="cards-testimonial-star" aria-hidden="true">★</span>';

function buildRating(count = 5) {
  const rating = document.createElement('div');
  rating.className = 'cards-testimonial-rating';
  rating.setAttribute('role', 'img');
  rating.setAttribute('aria-label', `${count} out of 5 stars`);
  rating.innerHTML = STAR.repeat(count);
  return rating;
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-testimonial-track';
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-testimonial-card';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.classList.add('cards-testimonial-card-body');
      // tag the heading (name), quote and date for precise styling
      const heading = div.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) heading.classList.add('cards-testimonial-name');
      const paras = [...div.querySelectorAll('p')];
      paras.forEach((p) => {
        if (p.querySelector('em')) p.classList.add('cards-testimonial-date');
        else p.classList.add('cards-testimonial-quote');
      });
      // insert the star rating directly after the reviewer name
      if (heading) heading.insertAdjacentElement('afterend', buildRating(5));
    });
    ul.append(li);
  });
  block.replaceChildren(ul);
}
