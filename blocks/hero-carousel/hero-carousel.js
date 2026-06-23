import { createOptimizedPicture } from '../../scripts/aem.js';

const AUTOPLAY_MS = 5000;

/**
 * Read a slide's cells in authoring order:
 * 0 desktop image, 1 mobile image, 2 title, 3 title color,
 * 4 subtitle, 5 subtitle color, 6 CTA label, 7 redirection link
 */
function readSlide(row) {
  const cells = [...row.children];
  const pickImg = (cell) => (cell ? cell.querySelector('img') : null);
  const text = (cell) => (cell ? cell.textContent.trim() : '');
  const link = (cell) => {
    if (!cell) return '';
    const a = cell.querySelector('a');
    return a ? a.getAttribute('href') : cell.textContent.trim();
  };
  return {
    desktopImg: pickImg(cells[0]),
    mobileImg: pickImg(cells[1]),
    title: text(cells[2]),
    titleColor: text(cells[3]),
    subtitle: text(cells[4]),
    subtitleColor: text(cells[5]),
    ctaLabel: text(cells[6]),
    ctaHref: link(cells[7]),
  };
}

/** Build a <picture> that swaps desktop/mobile sources at the 600px breakpoint. */
function buildResponsivePicture(desktopImg, mobileImg, alt) {
  const desktopSrc = desktopImg ? desktopImg.getAttribute('src') : null;
  const mobileSrc = mobileImg ? mobileImg.getAttribute('src') : desktopSrc;
  if (!desktopSrc && !mobileSrc) return null;

  const picture = document.createElement('picture');

  if (mobileSrc) {
    const mobileSource = document.createElement('source');
    mobileSource.media = '(max-width: 599px)';
    mobileSource.srcset = mobileSrc;
    picture.append(mobileSource);
  }

  const img = document.createElement('img');
  img.src = desktopSrc || mobileSrc;
  img.alt = alt || '';
  img.loading = 'eager';
  picture.append(img);
  return picture;
}

function buildSlide(slide, index) {
  const li = document.createElement('li');
  li.className = 'hero-carousel-slide';
  li.dataset.index = index;
  li.setAttribute('role', 'group');
  li.setAttribute('aria-roledescription', 'slide');

  const picture = buildResponsivePicture(slide.desktopImg, slide.mobileImg, slide.title);
  if (picture) {
    const media = document.createElement('div');
    media.className = 'hero-carousel-media';
    media.append(picture);
    li.append(media);
  }

  const content = document.createElement('div');
  content.className = 'hero-carousel-content';

  if (slide.title) {
    const h = document.createElement('h2');
    h.className = 'hero-carousel-title';
    h.textContent = slide.title;
    if (slide.titleColor) h.style.color = slide.titleColor;
    content.append(h);
  }

  if (slide.subtitle) {
    const p = document.createElement('p');
    p.className = 'hero-carousel-subtitle';
    p.textContent = slide.subtitle;
    if (slide.subtitleColor) p.style.color = slide.subtitleColor;
    content.append(p);
  }

  if (slide.ctaLabel && slide.ctaHref) {
    const cta = document.createElement('a');
    cta.className = 'hero-carousel-cta';
    cta.href = slide.ctaHref;
    cta.textContent = slide.ctaLabel;
    content.append(cta);
  }

  if (content.children.length) li.append(content);
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  const slides = rows.map(readSlide).filter((s) => s.desktopImg || s.mobileImg);

  block.textContent = '';
  if (!slides.length) return;

  const track = document.createElement('ul');
  track.className = 'hero-carousel-track';
  slides.forEach((slide, i) => track.append(buildSlide(slide, i)));
  block.append(track);

  // optimize each picture's img for performance
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, true, [{ width: '2000' }]);
    const source = img.closest('picture').querySelector('source[media="(max-width: 599px)"]');
    img.closest('picture').replaceWith(optimized);
    if (source) optimized.prepend(source);
  });

  const slideEls = [...track.children];
  if (slideEls.length < 2) {
    slideEls[0]?.classList.add('is-active');
    return;
  }

  let current = 0;
  let timer = null;

  // navigation dots
  const nav = document.createElement('div');
  nav.className = 'hero-carousel-dots';
  nav.setAttribute('role', 'tablist');
  const dots = slideEls.map((el, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    nav.append(dot);
    return dot;
  });

  const goTo = (index) => {
    current = (index + slideEls.length) % slideEls.length;
    slideEls.forEach((el, i) => el.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  };

  const play = () => {
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  };
  const restart = () => {
    clearInterval(timer);
    play();
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); restart(); });
  });

  // prev / next arrows
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'hero-carousel-arrow hero-carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '<span aria-hidden="true">‹</span>';
  prev.addEventListener('click', () => { goTo(current - 1); restart(); });

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'hero-carousel-arrow hero-carousel-next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '<span aria-hidden="true">›</span>';
  next.addEventListener('click', () => { goTo(current + 1); restart(); });

  block.append(prev, next, nav);

  block.addEventListener('mouseenter', () => clearInterval(timer));
  block.addEventListener('mouseleave', restart);

  goTo(0);
  play();
}
