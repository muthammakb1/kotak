/**
 * Authoring rows (first cell is a keyword):
 *   intro       | <heading text>
 *   testimonial | <name> | <rating 1-5> | <review text> | <date>
 *
 * Renders a centred heading above a row of white review cards (navy name,
 * gold stars, review body, grey reviewed-on date) on a light-grey band.
 */
import enableCarousel from '../../scripts/carousel.js';

function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

function buildStars(rating) {
  const n = Math.max(0, Math.min(5, parseInt(rating, 10) || 0));
  const stars = document.createElement('div');
  stars.className = 'customer-testimonials-stars';
  stars.setAttribute('aria-label', `${n} out of 5`);
  for (let i = 1; i <= 5; i += 1) {
    const star = document.createElement('span');
    star.className = i <= n ? 'customer-testimonials-star is-on' : 'customer-testimonials-star';
    star.textContent = '★';
    stars.append(star);
  }
  return stars;
}

export default function decorate(block) {
  const rows = [...block.children];
  const intro = rows.find((r) => text(r.children[0]).toLowerCase() === 'intro');
  const items = rows.filter((r) => text(r.children[0]).toLowerCase() === 'testimonial');

  block.textContent = '';

  if (intro) {
    const h = document.createElement('h2');
    h.className = 'customer-testimonials-heading';
    h.textContent = text(intro.children[1]);
    block.append(h);
  }

  const grid = document.createElement('div');
  grid.className = 'customer-testimonials-grid';

  items.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'customer-testimonials-card';

    const name = document.createElement('h3');
    name.className = 'customer-testimonials-name';
    name.textContent = text(cells[1]);
    card.append(name);

    card.append(buildStars(text(cells[2])));

    const review = document.createElement('p');
    review.className = 'customer-testimonials-review';
    review.textContent = text(cells[3]);
    card.append(review);

    const date = text(cells[4]);
    if (date) {
      const d = document.createElement('p');
      d.className = 'customer-testimonials-date';
      d.textContent = date;
      card.append(d);
    }

    grid.append(card);
  });

  block.append(grid);

  if (window.location.pathname.includes('/loans/personal-loan')) {
    enableCarousel(block, grid, 'customer-testimonials');
  }
}
