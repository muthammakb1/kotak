const MIN_LOAN = 100000; // ₹1L
const MAX_LOAN = 10000000; // ₹1Cr
const DEFAULT_LOAN = 7250000;
const ANNUAL_RATE = 8.6; // % p.a.
const TENURE_YEARS = 20;

/** Format a number as Indian rupees with grouping, e.g. 7250000 -> "₹ 72,50,000". */
function formatRupees(value) {
  return `₹ ${Math.round(value).toLocaleString('en-IN')}`;
}

/** Standard reducing-balance EMI. */
function calcEmi(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return principal / n;
  const factor = (1 + r) ** n;
  return (principal * r * factor) / (factor - 1);
}

/**
 * Authoring rows (first cell is a keyword):
 *   intro      | <eyebrow text>     | <heading text>
 *   calculator | <tool label>       | <calculator title>
 *   card       | <category>         | <card title>
 */
function readRows(block) {
  return [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      key: cells[0] ? cells[0].textContent.trim().toLowerCase() : '',
      a: cells[1] ? cells[1].textContent.trim() : '',
      b: cells[2] ? cells[2].textContent.trim() : '',
    };
  });
}

function buildCalculator(toolLabel, calcTitle) {
  const card = document.createElement('div');
  card.className = 'decision-tools-calc';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'decision-tools-calc-eyebrow';
  eyebrow.textContent = toolLabel || 'Embedded tool';

  const title = document.createElement('h3');
  title.className = 'decision-tools-calc-title';
  title.textContent = calcTitle || 'EMI Calculator';

  const head = document.createElement('div');
  head.className = 'decision-tools-calc-head';
  const headLabel = document.createElement('span');
  headLabel.className = 'decision-tools-calc-label';
  headLabel.textContent = 'Loan amount';
  const headValue = document.createElement('span');
  headValue.className = 'decision-tools-calc-amount';
  head.append(headLabel, headValue);

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'decision-tools-slider';
  slider.min = String(MIN_LOAN);
  slider.max = String(MAX_LOAN);
  slider.step = '50000';
  slider.value = String(DEFAULT_LOAN);
  slider.setAttribute('aria-label', 'Loan amount');

  const scale = document.createElement('div');
  scale.className = 'decision-tools-scale';
  scale.innerHTML = '<span>₹1L</span><span>₹1Cr</span>';

  const stats = document.createElement('div');
  stats.className = 'decision-tools-stats';

  const emiStat = document.createElement('div');
  emiStat.className = 'decision-tools-stat';
  const emiValue = document.createElement('p');
  emiValue.className = 'decision-tools-stat-value';
  const emiLabel = document.createElement('p');
  emiLabel.className = 'decision-tools-stat-label';
  emiLabel.textContent = 'Monthly EMI';
  emiStat.append(emiValue, emiLabel);

  const rateStat = document.createElement('div');
  rateStat.className = 'decision-tools-stat';
  rateStat.innerHTML = `<p class="decision-tools-stat-value">${ANNUAL_RATE}%</p><p class="decision-tools-stat-label">Interest p.a.</p>`;

  const tenureStat = document.createElement('div');
  tenureStat.className = 'decision-tools-stat';
  tenureStat.innerHTML = `<p class="decision-tools-stat-value">${TENURE_YEARS} yr</p><p class="decision-tools-stat-label">Tenure</p>`;

  stats.append(emiStat, rateStat, tenureStat);

  const update = () => {
    const loan = Number(slider.value);
    const pct = ((loan - MIN_LOAN) / (MAX_LOAN - MIN_LOAN)) * 100;
    slider.style.setProperty('--fill', `${pct}%`);
    headValue.textContent = formatRupees(loan);
    emiValue.textContent = formatRupees(calcEmi(loan, ANNUAL_RATE, TENURE_YEARS));
  };
  slider.addEventListener('input', update);

  card.append(eyebrow, title, head, slider, scale, stats);
  update();
  return card;
}

function buildGuideCard(category, title) {
  const card = document.createElement('div');
  card.className = 'decision-tools-card';
  const cat = document.createElement('p');
  cat.className = 'decision-tools-card-category';
  cat.textContent = category;
  const t = document.createElement('p');
  t.className = 'decision-tools-card-title';
  t.textContent = title;
  card.append(cat, t);
  return card;
}

export default function decorate(block) {
  const rows = readRows(block);
  const intro = rows.find((r) => r.key === 'intro');
  const calc = rows.find((r) => r.key === 'calculator');
  const cards = rows.filter((r) => r.key === 'card');

  block.textContent = '';

  if (intro) {
    const header = document.createElement('div');
    header.className = 'decision-tools-header';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'decision-tools-eyebrow';
    eyebrow.textContent = intro.a;
    const heading = document.createElement('h2');
    heading.className = 'decision-tools-heading';
    heading.textContent = intro.b;
    header.append(eyebrow, heading);
    block.append(header);
  }

  const grid = document.createElement('div');
  grid.className = 'decision-tools-grid';

  grid.append(buildCalculator(calc ? calc.a : '', calc ? calc.b : ''));

  const list = document.createElement('div');
  list.className = 'decision-tools-cards';
  cards.forEach((c) => list.append(buildGuideCard(c.a, c.b)));
  grid.append(list);

  block.append(grid);
}
