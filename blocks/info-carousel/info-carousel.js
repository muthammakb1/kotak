import { createOptimizedPicture } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');
const isTablet = window.matchMedia('(min-width: 600px)');

function visibleCount() {
  if (isDesktop.matches) return 5;
  if (isTablet.matches) return 2;
  return 1;
}

function cellLink(cell) {
  if (!cell) return '';
  const a = cell.querySelector('a');
  return a ? a.getAttribute('href') : cell.textContent.trim();
}

/**
 * Read one card's cells in authoring order:
 * 0 title, 1 subtitle, 2 icon, 3 redirection link
 */
function readCard(row) {
  const cells = [...row.children];
  return {
    title: cells[0] ? cells[0].textContent.trim() : '',
    subtitle: cells[1] ? cells[1].textContent.trim() : '',
    icon: cells[2] ? cells[2].querySelector('img') : null,
    href: cellLink(cells[3]),
  };
}

function buildCard(card) {
  const a = document.createElement('a');
  a.className = 'info-carousel-card';
  if (card.href) a.href = card.href;

  if (card.icon) {
    const iconWrap = document.createElement('span');
    iconWrap.className = 'info-carousel-icon';
    const img = document.createElement('img');
    img.src = card.icon.getAttribute('src');
    img.alt = '';
    img.loading = 'lazy';
    iconWrap.append(img);
    a.append(iconWrap);
  }

  const body = document.createElement('span');
  body.className = 'info-carousel-text';
  if (card.title) {
    const t = document.createElement('span');
    t.className = 'info-carousel-title';
    t.textContent = card.title;
    body.append(t);
  }
  if (card.subtitle) {
    const s = document.createElement('span');
    s.className = 'info-carousel-subtitle';
    s.textContent = card.subtitle;
    body.append(s);
  }
  a.append(body);
  return a;
}

export default function decorate(block) {
  const rows = [...block.children];
  const cards = rows.map(readCard).filter((c) => c.title || c.subtitle || c.icon);

  block.textContent = '';
  if (!cards.length) return;

  const viewport = document.createElement('div');
  viewport.className = 'info-carousel-viewport';
  const track = document.createElement('div');
  track.className = 'info-carousel-track';
  cards.forEach((card) => track.append(buildCard(card)));
  viewport.append(track);
  block.append(viewport);

  // optimize icons
  block.querySelectorAll('.info-carousel-icon img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '100' }]);
    img.replaceWith(optimized);
  });

  const cardEls = [...track.children];
  const pageSize = () => visibleCount();
  const pageCount = () => Math.max(1, Math.ceil(cardEls.length / pageSize()));
  if (cardEls.length <= pageSize()) return;

  let page = 0;

  const nav = document.createElement('div');
  nav.className = 'info-carousel-dots';
  nav.setAttribute('role', 'tablist');

  const goTo = (p) => {
    const pages = pageCount();
    page = (p + pages) % pages;
    const offset = page * pageSize() * (cardEls[0].getBoundingClientRect().width
      + parseFloat(getComputedStyle(track).columnGap || 0));
    track.style.transform = `translateX(-${offset}px)`;
    [...nav.children].forEach((d, i) => {
      d.classList.toggle('is-active', i === page);
      d.setAttribute('aria-selected', i === page ? 'true' : 'false');
    });
  };

  const renderDots = () => {
    nav.textContent = '';
    for (let i = 0; i < pageCount(); i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'info-carousel-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      nav.append(dot);
    }
  };

  renderDots();
  block.append(nav);
  goTo(0);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { renderDots(); goTo(0); }, 150);
  });
}
