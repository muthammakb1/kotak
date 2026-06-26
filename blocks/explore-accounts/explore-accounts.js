/**
 * Authoring rows (first cell is a keyword):
 *   intro | <heading text> | <subheading text>
 *   item  | <thumbnail image> | <account name> | <redirect link>
 *
 * Renders a centred heading + italic subheading above a horizontally paged
 * carousel of pill cards. Each card shows a small thumbnail beside the linked
 * account name. A pagination bar reflects the scroll position and lets the
 * reader jump between pages.
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

function textOf(cell) {
  return cell ? cell.textContent.trim() : '';
}

function hrefFrom(cell) {
  if (!cell) return '';
  const anchor = cell.querySelector('a');
  return anchor ? anchor.getAttribute('href') : textOf(cell);
}

export default function decorate(block) {
  const rows = readRows(block);
  const intro = rows.find((r) => r.key === 'intro');
  const items = rows.filter((r) => r.key === 'item');

  block.textContent = '';

  if (intro) {
    const header = document.createElement('div');
    header.className = 'explore-accounts-header';

    const heading = document.createElement('h2');
    heading.className = 'explore-accounts-heading';
    heading.textContent = textOf(intro.cells[0]);
    header.append(heading);

    if (intro.cells[1] && intro.cells[1].textContent.trim()) {
      const sub = document.createElement('p');
      sub.className = 'explore-accounts-subheading';
      sub.textContent = textOf(intro.cells[1]);
      header.append(sub);
    }
    block.append(header);
  }

  const viewport = document.createElement('div');
  viewport.className = 'explore-accounts-viewport';

  const track = document.createElement('div');
  track.className = 'explore-accounts-track';

  items.forEach((it) => {
    const [imgCell, nameCell, linkCell] = it.cells;
    const href = hrefFrom(linkCell);

    const card = document.createElement('a');
    card.className = 'explore-accounts-card';
    if (href) card.href = href;

    const pic = imgCell ? imgCell.querySelector('picture, img') : null;
    if (pic) {
      const thumb = document.createElement('span');
      thumb.className = 'explore-accounts-thumb';
      thumb.append(pic.tagName === 'PICTURE' ? pic : pic.closest('picture') || pic);
      card.append(thumb);
    }

    const name = document.createElement('span');
    name.className = 'explore-accounts-name';
    name.textContent = textOf(nameCell);
    card.append(name);

    track.append(card);
  });

  viewport.append(track);
  block.append(viewport);

  const dots = document.createElement('div');
  dots.className = 'explore-accounts-dots';
  block.append(dots);

  const cardStep = () => {
    const first = track.querySelector('.explore-accounts-card');
    if (!first) return viewport.clientWidth || 1;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  };

  const perPage = () => {
    const step = cardStep();
    if (!viewport.clientWidth || !step) return items.length || 1;
    return Math.max(1, Math.round(viewport.clientWidth / step));
  };

  const renderDots = () => {
    const itemsPerPage = perPage();
    const pages = Math.ceil(items.length / itemsPerPage);
    dots.innerHTML = '';
    if (pages <= 1) return;
    const active = Math.min(
      pages - 1,
      Math.round(viewport.scrollLeft / (itemsPerPage * cardStep())),
    );
    for (let i = 0; i < pages; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'explore-accounts-dot';
      if (i === active) dot.classList.add('is-active');
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      dot.addEventListener('click', () => {
        viewport.scrollTo({ left: i * itemsPerPage * cardStep(), behavior: 'smooth' });
      });
      dots.append(dot);
    }
  };

  viewport.addEventListener('scroll', renderDots, { passive: true });
  window.addEventListener('resize', renderDots);

  // the section is display:none during decoration (clientWidth 0), so the dot
  // count can only be computed once the viewport gets a real width
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(renderDots);
    ro.observe(viewport);
  }
  renderDots();
}
