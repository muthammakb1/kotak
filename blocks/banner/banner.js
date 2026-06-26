/**
 * Authoring rows (first cell is the keyword "slide"); one row per carousel slide:
 *   slide | eyebrow | title | description | primaryLabel | primaryHref | secLabel | secHref
 *
 * Only the left content (eyebrow / title / description / CTAs) rotates.
 * The stats row, controls and the account-card mock stay fixed.
 */
const STATS = [
  { value: '5 Cr+', label: 'Customers' },
  { value: '₹4.8L Cr', label: 'Assets' },
  { value: 'RBI', label: 'Regulated · DICGC' },
];

function cellText(cell, fallback = '') {
  return cell ? cell.textContent.trim() : fallback;
}

function buildAccountCard() {
  const card = document.createElement('div');
  card.className = 'banner-card';
  card.innerHTML = `
    <div class="banner-card-head">
      <span class="banner-card-label">Kotak · Savings ··6042</span>
      <span class="banner-card-chip" aria-hidden="true"></span>
    </div>
    <p class="banner-card-balance"><span class="banner-card-balance-main">₹ 2,48,910</span><span class="banner-card-balance-dec">.50</span></p>
    <p class="banner-card-pill"><span class="banner-card-pill-dot" aria-hidden="true"></span><span class="banner-card-pill-text">+ ₹12,400 this month</span></p>
    <div class="banner-card-actions">
      <span class="banner-card-action">Pay</span>
      <span class="banner-card-action">Transfer</span>
      <span class="banner-card-action">Invest</span>
    </div>
    <div class="banner-card-txns">
      <div class="banner-card-txn">
        <div>
          <p class="banner-card-txn-title">Salary credited</p>
          <p class="banner-card-txn-meta">Today · 09:14</p>
        </div>
        <p class="banner-card-txn-amt banner-card-txn-in">+ ₹1,42,000</p>
      </div>
      <div class="banner-card-txn">
        <div>
          <p class="banner-card-txn-title">SIP · Bluechip Fund</p>
          <p class="banner-card-txn-meta">Yesterday</p>
        </div>
        <p class="banner-card-txn-amt banner-card-txn-out">− ₹10,000</p>
      </div>
      <div class="banner-card-txn">
        <div>
          <p class="banner-card-txn-title">Electricity bill</p>
          <p class="banner-card-txn-meta">12 Jun · Auto-pay</p>
        </div>
        <p class="banner-card-txn-amt banner-card-txn-out">− ₹2,180</p>
      </div>
    </div>
    <div class="banner-card-ai">
      <p class="banner-card-ai-label"><span class="banner-card-ai-dot" aria-hidden="true"></span>Kotak AI</p>
      <p class="banner-card-ai-text">Your idle balance could earn ₹1,040 more this quarter in ActivMoney.</p>
    </div>`;
  return card;
}

function buildContent(slide) {
  const content = document.createElement('div');
  content.className = 'banner-content';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'banner-eyebrow';
  eyebrow.textContent = slide.eyebrow;

  const heading = document.createElement('h1');
  heading.className = 'banner-title';
  heading.innerHTML = slide.title;

  const desc = document.createElement('p');
  desc.className = 'banner-desc';
  desc.textContent = slide.desc;

  const ctas = document.createElement('div');
  ctas.className = 'banner-ctas';
  const primary = document.createElement('a');
  primary.className = 'banner-cta-primary';
  primary.href = slide.primaryHref;
  primary.textContent = slide.primaryLabel;
  const secondary = document.createElement('a');
  secondary.className = 'banner-cta-secondary';
  secondary.href = slide.secondaryHref;
  secondary.textContent = `${slide.secondaryLabel} →`;
  ctas.append(primary, secondary);

  content.append(eyebrow, heading, desc, ctas);
  return content;
}

export default function decorate(block) {
  const slides = [...block.children]
    .map((row) => {
      const cells = [...row.children];
      if (cellText(cells[0]).toLowerCase() !== 'slide') return null;
      return {
        eyebrow: cellText(cells[1]),
        title: cells[2] ? cells[2].innerHTML.trim() : '',
        desc: cellText(cells[3]),
        primaryLabel: cellText(cells[4], 'Open an Account'),
        primaryHref: cellText(cells[5], '#'),
        secondaryLabel: cellText(cells[6], 'Explore products'),
        secondaryHref: cellText(cells[7], '#'),
      };
    })
    .filter(Boolean);

  if (!slides.length) return;

  block.textContent = '';

  const viewport = document.createElement('div');
  viewport.className = 'banner-viewport';

  const layout = document.createElement('div');
  layout.className = 'banner-layout';

  // ---- left column: rotating content + fixed stats + controls ----
  const left = document.createElement('div');
  left.className = 'banner-left';

  const carousel = document.createElement('div');
  carousel.className = 'banner-carousel';
  const track = document.createElement('div');
  track.className = 'banner-track';
  slides.forEach((s) => track.append(buildContent(s)));
  carousel.append(track);
  left.append(carousel);

  const stats = document.createElement('div');
  stats.className = 'banner-stats';
  STATS.forEach((s) => {
    const stat = document.createElement('div');
    stat.className = 'banner-stat';
    stat.innerHTML = `<p class="banner-stat-value">${s.value}</p><p class="banner-stat-label">${s.label}</p>`;
    stats.append(stat);
  });
  left.append(stats);

  // ---- controls (inside the container) ----
  const total = slides.length;
  let index = 0;

  const controls = document.createElement('div');
  controls.className = 'banner-controls';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'banner-nav banner-nav-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 5 8 12 15 19"/></svg>';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'banner-nav banner-nav-next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 5 16 12 9 19"/></svg>';

  const dots = document.createElement('div');
  dots.className = 'banner-dots';
  const dotEls = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'banner-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dots.append(dot);
    return dot;
  });

  controls.append(prev, next, dots);
  left.append(controls);

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dotEls.forEach((d, i) => d.classList.toggle('banner-dot-active', i === index));
  };
  const go = (i) => { index = (i + total) % total; update(); };

  // auto-advance every 5s; reset the timer on any manual interaction and pause on hover
  const AUTO_MS = 5000;
  let timer;
  const stopAuto = () => clearInterval(timer);
  const startAuto = () => {
    stopAuto();
    if (total > 1) timer = setInterval(() => go(index + 1), AUTO_MS);
  };
  const goManual = (i) => { go(i); startAuto(); };

  prev.addEventListener('click', () => goManual(index - 1));
  next.addEventListener('click', () => goManual(index + 1));
  dotEls.forEach((d, i) => d.addEventListener('click', () => goManual(i)));

  layout.append(left, buildAccountCard());
  viewport.append(layout);
  block.append(viewport);
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);
  update();
  startAuto();
}
