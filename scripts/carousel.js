/**
 * Turns a grid of cards into a horizontally scrolling carousel with prev/next
 * arrows and pagination dots (owl-carousel style). Used to give shared grid
 * blocks a carousel presentation on specific pages without changing their
 * default layout elsewhere.
 *
 * @param {Element} block   the block root (arrows/dots are appended here)
 * @param {Element} track   the scrollable element holding the card children
 * @param {string}  ns      class namespace, e.g. "compare-cards"
 */
export default function enableCarousel(block, track, ns) {
  const items = [...track.children];
  if (items.length < 2) return;

  block.classList.add(`${ns}-carousel`);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = `${ns}-carousel-arrow ${ns}-carousel-prev`;
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '<span aria-hidden="true">&#8249;</span>';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = `${ns}-carousel-arrow ${ns}-carousel-next`;
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '<span aria-hidden="true">&#8250;</span>';

  const dots = document.createElement('div');
  dots.className = `${ns}-carousel-dots`;

  const perPage = () => {
    const first = items[0];
    const step = first ? first.getBoundingClientRect().width : track.clientWidth;
    if (!step) return 1;
    return Math.max(1, Math.round(track.clientWidth / step));
  };

  const pageCount = () => Math.max(1, Math.ceil(items.length / perPage()));

  const buildDots = () => {
    dots.textContent = '';
    const count = pageCount();
    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `${ns}-carousel-dot`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        const per = perPage();
        const target = items[Math.min(i * per, items.length - 1)];
        if (target) {
          track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: 'smooth' });
        }
      });
      dots.append(dot);
    }
  };

  const syncDots = () => {
    const per = perPage();
    const active = Math.round(track.scrollLeft / (track.clientWidth || 1));
    [...dots.children].forEach((d, i) => {
      d.classList.toggle('is-active', i === Math.min(active, pageCount() - 1));
    });
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    return per;
  };

  const scrollByPage = (dir) => {
    track.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollByPage(-1));
  next.addEventListener('click', () => scrollByPage(1));
  track.addEventListener('scroll', () => syncDots());

  const stage = document.createElement('div');
  stage.className = `${ns}-carousel-stage`;
  track.before(stage);
  stage.append(prev, track, next);
  block.append(dots);

  const refresh = () => {
    buildDots();
    syncDots();
  };

  refresh();
  let raf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(refresh);
  });
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => refresh()).observe(track);
  }
}
