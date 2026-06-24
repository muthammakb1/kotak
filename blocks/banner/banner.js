/**
 * Authoring rows (first cell is a keyword):
 *   slide | <title>   (one row per carousel slide; title may contain two lines)
 *
 * Everything else (eyebrow, description, CTAs, stats, account-card mock) is
 * identical across slides per the design, so it is rendered from constants.
 */
const EYEBROW = 'Banking, the way it should feel';
const DESCRIPTION = 'Start a fully digital account in under five minutes, then run your money in real time — from one place that always has your back.';
const CTA_PRIMARY = { label: 'Open an Account', href: 'https://www.kotak811.com/open-zero-balance-savings-account' };
const CTA_SECONDARY = { label: 'Explore products', href: '/standalone-homepage' };
const STATS = [
  { value: '5 Cr+', label: 'Customers' },
  { value: '₹4.8L Cr', label: 'Assets' },
  { value: 'RBI', label: 'Regulated · DICGC' },
];

function buildAccountCard() {
  const card = document.createElement('div');
  card.className = 'banner-card';
  card.innerHTML = `
    <div class="banner-card-head">
      <span class="banner-card-label">Kotak · Savings ··6042</span>
      <span class="banner-card-chip" aria-hidden="true"></span>
    </div>
    <p class="banner-card-balance">₹ 2,48,910<span class="banner-card-balance-dec">.50</span></p>
    <p class="banner-card-pill"><span class="banner-card-pill-dot" aria-hidden="true"></span>+ ₹12,400 this month</p>
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
          <p class="banner-card-txn-title">UPI · Groceries</p>
          <p class="banner-card-txn-meta">Yesterday</p>
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

function buildSlide(title) {
  const slide = document.createElement('div');
  slide.className = 'banner-slide';

  const content = document.createElement('div');
  content.className = 'banner-content';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'banner-eyebrow';
  eyebrow.textContent = EYEBROW;

  const heading = document.createElement('h1');
  heading.className = 'banner-title';
  heading.innerHTML = title;

  const desc = document.createElement('p');
  desc.className = 'banner-desc';
  desc.textContent = DESCRIPTION;

  const ctas = document.createElement('div');
  ctas.className = 'banner-ctas';
  const primary = document.createElement('a');
  primary.className = 'banner-cta-primary';
  primary.href = CTA_PRIMARY.href;
  primary.textContent = CTA_PRIMARY.label;
  const secondary = document.createElement('a');
  secondary.className = 'banner-cta-secondary';
  secondary.href = CTA_SECONDARY.href;
  secondary.textContent = `${CTA_SECONDARY.label} →`;
  ctas.append(primary, secondary);

  const stats = document.createElement('div');
  stats.className = 'banner-stats';
  STATS.forEach((s) => {
    const stat = document.createElement('div');
    stat.className = 'banner-stat';
    stat.innerHTML = `<p class="banner-stat-value">${s.value}</p><p class="banner-stat-label">${s.label}</p>`;
    stats.append(stat);
  });

  content.append(eyebrow, heading, desc, ctas, stats);
  slide.append(content, buildAccountCard());
  return slide;
}

export default function decorate(block) {
  const titles = [...block.children]
    .map((row) => {
      const cells = [...row.children];
      const key = cells[0] ? cells[0].textContent.trim().toLowerCase() : '';
      if (key !== 'slide' || !cells[1]) return null;
      return cells[1].innerHTML.trim();
    })
    .filter(Boolean);

  if (!titles.length) {
    titles.push('Open in minutes.<br>Stay for decades.');
  }

  block.textContent = '';

  const viewport = document.createElement('div');
  viewport.className = 'banner-viewport';
  const track = document.createElement('div');
  track.className = 'banner-track';
  titles.forEach((t) => track.append(buildSlide(t)));
  viewport.append(track);
  block.append(viewport);

  let index = 0;
  const total = titles.length;

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
  const dotEls = titles.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'banner-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dots.append(dot);
    return dot;
  });

  const counter = document.createElement('span');
  counter.className = 'banner-counter';

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dotEls.forEach((d, i) => d.classList.toggle('banner-dot-active', i === index));
    const pad = (n) => String(n).padStart(2, '0');
    counter.textContent = `${pad(index + 1)} / ${pad(total)}`;
  };

  const go = (i) => { index = (i + total) % total; update(); };
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  dotEls.forEach((d, i) => d.addEventListener('click', () => go(i)));

  controls.append(prev, next, dots, counter);
  block.append(controls);
  update();
}
