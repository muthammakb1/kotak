/**
 * Authoring rows (first cell is a keyword):
 *   intro | <heading text> | <description text>
 *   item  | <icon image>   | <caption text>
 *
 * Renders a centred heading + intro above a horizontally scrolling row of
 * circular icon badges with captions, flanked by prev/next arrows.
 */
function readRows(block) {
  return [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      key: cells[0] ? cells[0].textContent.trim().toLowerCase() : '',
      cells: cells.slice(1),
    };
  });
}

export default function decorate(block) {
  const rows = readRows(block);
  const intro = rows.find((r) => r.key === 'intro');
  const items = rows.filter((r) => r.key === 'item');

  block.textContent = '';

  if (intro) {
    const heading = document.createElement('h2');
    heading.className = 'benefits-carousel-heading';
    heading.textContent = intro.cells[0] ? intro.cells[0].textContent.trim() : '';
    block.append(heading);

    if (intro.cells[1] && intro.cells[1].textContent.trim()) {
      const desc = document.createElement('p');
      desc.className = 'benefits-carousel-intro';
      desc.textContent = intro.cells[1].textContent.trim();
      block.append(desc);
    }
  }

  const viewport = document.createElement('div');
  viewport.className = 'benefits-carousel-viewport';

  const track = document.createElement('div');
  track.className = 'benefits-carousel-track';

  items.forEach((it) => {
    const [iconCell, captionCell] = it.cells;
    const item = document.createElement('div');
    item.className = 'benefits-carousel-item';

    const circle = document.createElement('div');
    circle.className = 'benefits-carousel-circle';
    const pic = iconCell ? iconCell.querySelector('picture, img') : null;
    if (pic) circle.append(pic.tagName === 'PICTURE' ? pic : pic.closest('picture') || pic);
    item.append(circle);

    if (captionCell) {
      const caption = document.createElement('p');
      caption.className = 'benefits-carousel-caption';
      caption.textContent = captionCell.textContent.trim();
      item.append(caption);
    }

    track.append(item);
  });

  viewport.append(track);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'benefits-carousel-arrow benefits-carousel-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '<span aria-hidden="true">&#8249;</span>';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'benefits-carousel-arrow benefits-carousel-next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '<span aria-hidden="true">&#8250;</span>';

  const scrollByItem = (dir) => {
    const first = track.querySelector('.benefits-carousel-item');
    const step = first ? first.getBoundingClientRect().width + 24 : viewport.clientWidth / 2;
    viewport.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollByItem(-1));
  next.addEventListener('click', () => scrollByItem(1));

  const stage = document.createElement('div');
  stage.className = 'benefits-carousel-stage';
  stage.append(prev, viewport, next);

  block.append(stage);
}
