import { createOptimizedPicture } from '../../scripts/aem.js';

const AUTOPLAY_MS = 5000;

/**
 * Read one slide's cells in authoring order:
 * 0 desktop image, 1 mobile image, 2 redirection link
 */
function readSlide(row) {
  const cells = [...row.children];
  const img = (cell) => (cell ? cell.querySelector('img') : null);
  const link = (cell) => {
    if (!cell) return '';
    const a = cell.querySelector('a');
    return a ? a.getAttribute('href') : cell.textContent.trim();
  };
  return {
    desktopImg: img(cells[0]),
    mobileImg: img(cells[1]),
    href: link(cells[2]),
  };
}

/** Build a <picture> that swaps desktop/mobile sources at the 600px breakpoint. */
function buildResponsivePicture(desktopImg, mobileImg, alt) {
  const desktopSrc = desktopImg ? desktopImg.getAttribute('src') : null;
  const mobileSrc = mobileImg ? mobileImg.getAttribute('src') : desktopSrc;
  if (!desktopSrc && !mobileSrc) return null;

  const picture = document.createElement('picture');
  if (mobileSrc) {
    const source = document.createElement('source');
    source.media = '(max-width: 599px)';
    source.srcset = mobileSrc;
    picture.append(source);
  }
  const img = document.createElement('img');
  img.src = desktopSrc || mobileSrc;
  img.alt = alt || '';
  img.loading = 'lazy';
  picture.append(img);
  return picture;
}

function buildSlide(slide, index) {
  const li = document.createElement('li');
  li.className = 'image-carousel-slide';
  li.dataset.index = index;
  li.setAttribute('role', 'group');
  li.setAttribute('aria-roledescription', 'slide');

  const picture = buildResponsivePicture(slide.desktopImg, slide.mobileImg, '');
  if (!picture) return li;

  if (slide.href) {
    const link = document.createElement('a');
    link.className = 'image-carousel-link';
    link.href = slide.href;
    link.append(picture);
    li.append(link);
  } else {
    li.append(picture);
  }
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  const slides = rows.map(readSlide).filter((s) => s.desktopImg || s.mobileImg);

  block.textContent = '';
  if (!slides.length) return;

  const track = document.createElement('ul');
  track.className = 'image-carousel-track';
  slides.forEach((slide, i) => track.append(buildSlide(slide, i)));
  block.append(track);

  // optimize each picture's img while preserving the mobile source
  block.querySelectorAll('picture > img').forEach((img) => {
    const picture = img.closest('picture');
    const mobileSource = picture.querySelector('source[media="(max-width: 599px)"]');
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    picture.replaceWith(optimized);
    if (mobileSource) optimized.prepend(mobileSource);
  });

  const slideEls = [...track.children];
  slideEls[0]?.classList.add('is-active');
  if (slideEls.length < 2) return;

  let current = 0;
  let timer = null;

  // navigation dots
  const nav = document.createElement('div');
  nav.className = 'image-carousel-dots';
  nav.setAttribute('role', 'tablist');
  const dots = slideEls.map((el, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'image-carousel-dot';
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

  block.append(nav);

  block.addEventListener('mouseenter', () => clearInterval(timer));
  block.addEventListener('mouseleave', restart);

  goTo(0);
  play();
}
