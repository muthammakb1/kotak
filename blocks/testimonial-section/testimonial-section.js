/**
 * Authoring rows (first cell is a keyword):
 *   intro      | <heading>
 *   testimonial| <name> | <rating 1-5> | <review text> | <date>
 */
function text(cell) {
  return cell ? cell.textContent.trim() : '';
}

function buildStars(rating) {
  const n = Math.max(0, Math.min(5, parseInt(rating, 10) || 0));
  const stars = document.createElement('div');
  stars.className = 'testimonial-section-stars';
  stars.setAttribute('aria-label', `${n} out of 5`);
  for (let i = 1; i <= 5; i += 1) {
    const star = document.createElement('span');
    star.className = i <= n ? 'testimonial-section-star is-on' : 'testimonial-section-star';
    star.textContent = '★';
    stars.append(star);
  }
  return stars;
}

export default function decorate(block) {
  const rows = [...block.children];
  const intro = rows.find((r) => text(r.children[0]).toLowerCase() === 'intro');
  const items = rows.filter((r) => {
    const k = text(r.children[0]).toLowerCase();
    return k === 'testimonial' || k === 'offer';
  });

  block.textContent = '';

  if (intro) {
    const h = document.createElement('h2');
    h.className = 'testimonial-section-title';
    h.textContent = text(intro.children[1]);
    block.append(h);
  }

  if (!items.length) return;

  const viewport = document.createElement('div');
  viewport.className = 'testimonial-section-viewport';
  const track = document.createElement('div');
  track.className = 'testimonial-section-track';

  items.forEach((row) => {
    const cells = [...row.children];
    const kind = text(cells[0]).toLowerCase();

    if (kind === 'offer') {
      // offer | label | rating | image | title | description | validity | readLabel | readHref
      const card = document.createElement('div');
      card.className = 'testimonial-section-card testimonial-section-offer';

      const head = document.createElement('div');
      head.className = 'testimonial-section-offer-head';
      const label = document.createElement('span');
      label.className = 'testimonial-section-offer-label';
      label.textContent = text(cells[1]);
      head.append(label, buildStars(text(cells[2])));
      card.append(head);

      const imgEl = cells[3] ? cells[3].querySelector('img') : null;
      if (imgEl) {
        const media = document.createElement('div');
        media.className = 'testimonial-section-offer-media';
        const picture = document.createElement('img');
        picture.src = imgEl.getAttribute('src');
        picture.alt = text(cells[4]) || imgEl.getAttribute('alt') || '';
        picture.loading = 'lazy';
        media.append(picture);
        card.append(media);
      }

      const title = document.createElement('p');
      title.className = 'testimonial-section-offer-title';
      title.textContent = text(cells[4]);
      card.append(title);

      const desc = document.createElement('p');
      desc.className = 'testimonial-section-offer-desc';
      desc.textContent = text(cells[5]);
      card.append(desc);

      const valid = text(cells[6]);
      if (valid) {
        const v = document.createElement('p');
        v.className = 'testimonial-section-offer-valid';
        v.textContent = valid;
        card.append(v);
      }

      const readLabel = text(cells[7]);
      const readCell = cells[8];
      let readHref = '#';
      if (readCell) {
        const a = readCell.querySelector('a');
        readHref = a ? a.getAttribute('href') : readCell.textContent.trim() || '#';
      }
      if (readLabel) {
        const read = document.createElement('a');
        read.className = 'testimonial-section-offer-read';
        read.href = readHref;
        read.innerHTML = `<span>${readLabel}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="11 9 14 12 11 15" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        card.append(read);
      }

      track.append(card);
      return;
    }

    // testimonial | name | rating | review | date
    const card = document.createElement('div');
    card.className = 'testimonial-section-card';

    const name = document.createElement('p');
    name.className = 'testimonial-section-name';
    name.textContent = text(cells[1]);

    card.append(name, buildStars(text(cells[2])));

    const desc = document.createElement('p');
    desc.className = 'testimonial-section-desc';
    desc.textContent = text(cells[3]);
    card.append(desc);

    const date = text(cells[4]);
    if (date) {
      const d = document.createElement('p');
      d.className = 'testimonial-section-date';
      d.textContent = date;
      card.append(d);
    }

    track.append(card);
  });

  viewport.append(track);
  block.append(viewport);

  const cards = [...track.children];
  if (cards.length < 2) return;

  let index = 0;
  const perView = () => (window.matchMedia('(width >= 900px)').matches ? 3 : 1);
  const maxIndex = () => Math.max(0, cards.length - perView());

  const controls = document.createElement('div');
  controls.className = 'testimonial-section-controls';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'testimonial-section-nav testimonial-section-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 5 8 12 15 19"/></svg>';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'testimonial-section-nav testimonial-section-next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 5 16 12 9 19"/></svg>';

  const update = () => {
    index = Math.min(index, maxIndex());
    track.style.transform = `translateX(calc(-${index} * (100% / ${perView()})))`;
  };
  const go = (i) => { index = Math.max(0, Math.min(i, maxIndex())); update(); };
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  window.addEventListener('resize', update);

  controls.append(prev, next);
  block.append(controls);
  update();
}
