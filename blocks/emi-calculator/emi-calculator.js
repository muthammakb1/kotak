/**
 * Personal Loan EMI calculator (hero overlay).
 *
 * Authoring rows (optional — sensible defaults are used if omitted):
 *   background | <hero image>          (full-bleed banner behind the card)
 *   heading    | <title>
 *   amount     | <min> | <max> | <default>
 *   rate       | <min> | <max> | <default>   (% per annum)
 *   tenure     | <min> | <max> | <default>   (years)
 *
 * Renders a banner with a white calculator card overlaid on the left. Each
 * input is a row (label · slider · value), and the monthly EMI shows inline
 * beside the Apply Now button.
 */
const FMT = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

function readConfig(block) {
  const cfg = {
    heading: 'Personal Loan',
    bgImg: null,
    amount: {
      min: 50000, max: 10000000, value: 8480000, step: 10000,
    },
    rate: {
      min: 10.99, max: 24, value: 10.99, step: 0.01,
    },
    tenure: {
      min: 1, max: 6, value: 1, step: 1,
    },
  };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const rawKey = cells[0] ? cells[0].textContent.trim() : '';
    const key = rawKey.toLowerCase();
    if (key === 'background') {
      cfg.bgImg = cells[1] ? cells[1].querySelector('img') : null;
      return;
    }
    const vals = cells.map((c) => c.textContent.trim());
    const [, v1, v2, v3] = vals;
    if (key === 'heading' && v1) cfg.heading = v1;
    if (['amount', 'rate', 'tenure'].includes(key)) {
      if (v1) cfg[key].min = parseFloat(v1);
      if (v2) cfg[key].max = parseFloat(v2);
      if (v3) cfg[key].value = parseFloat(v3);
    }
  });
  return cfg;
}

/** Standard reducing-balance EMI: P·r·(1+r)^n / ((1+r)^n − 1). */
function calcEmi(principal, annualRate, years) {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return principal / n;
  const f = (1 + r) ** n;
  return (principal * r * f) / (f - 1);
}

function field(name, label, cfg) {
  const wrap = document.createElement('div');
  wrap.className = 'emi-calculator-field';
  wrap.innerHTML = `
    <span class="emi-calculator-label">${label}</span>
    <input type="range" id="emi-${name}" min="${cfg.min}" max="${cfg.max}"
      step="${cfg.step}" value="${cfg.value}" aria-label="${label}">
    <output class="emi-calculator-value" id="emi-${name}-out"></output>`;
  return wrap;
}

export default function decorate(block) {
  const cfg = readConfig(block);
  block.textContent = '';

  // full-bleed banner background
  if (cfg.bgImg) {
    const bg = document.createElement('div');
    bg.className = 'emi-calculator-bg';
    const img = document.createElement('img');
    img.src = cfg.bgImg.getAttribute('src');
    img.alt = '';
    img.loading = 'eager';
    bg.append(img);
    block.append(bg);
  }

  // overlaid white card
  const card = document.createElement('div');
  card.className = 'emi-calculator-card';

  const heading = document.createElement('h1');
  heading.className = 'emi-calculator-heading';
  heading.textContent = cfg.heading;
  card.append(heading);

  const fields = document.createElement('div');
  fields.className = 'emi-calculator-fields';
  fields.append(
    field('amount', 'Loan Amount', cfg.amount),
    field('rate', 'Interest Rate (% P.A.)', cfg.rate),
    field('tenure', 'Tenure (Years)', cfg.tenure),
  );
  card.append(fields);

  const footer = document.createElement('div');
  footer.className = 'emi-calculator-footer';
  footer.innerHTML = `
    <div class="emi-calculator-emi">
      <span class="emi-calculator-emi-value" id="emi-monthly"></span>
      <span class="emi-calculator-emi-label">is your monthly EMI</span>
    </div>
    <a class="emi-calculator-cta" href="https://onboarding.kotak.com/pl">Apply Now</a>`;
  card.append(footer);

  block.append(card);

  const amountEl = block.querySelector('#emi-amount');
  const rateEl = block.querySelector('#emi-rate');
  const tenureEl = block.querySelector('#emi-tenure');

  /** paint the filled portion of a range track (blue up to the current value). */
  const paintFill = (el) => {
    const min = Number(el.min);
    const max = Number(el.max);
    const pct = max > min ? ((Number(el.value) - min) / (max - min)) * 100 : 0;
    el.style.setProperty('--fill', `${pct}%`);
  };

  const update = () => {
    const amount = Number(amountEl.value);
    const rate = Number(rateEl.value);
    const years = Number(tenureEl.value);

    block.querySelector('#emi-amount-out').textContent = `₹${FMT.format(amount)}`;
    block.querySelector('#emi-rate-out').textContent = `${rate} %`;
    block.querySelector('#emi-tenure-out').textContent = `${years} ${years === 1 ? 'year' : 'years'}`;

    [amountEl, rateEl, tenureEl].forEach(paintFill);

    const emi = calcEmi(amount, rate, years);
    block.querySelector('#emi-monthly').textContent = `₹${FMT.format(Math.round(emi))}`;
  };

  [amountEl, rateEl, tenureEl].forEach((el) => el.addEventListener('input', update));
  update();
}
