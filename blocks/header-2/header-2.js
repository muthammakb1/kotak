import { getMetadata } from '../../scripts/aem.js';

/**
 * Standalone header used only by the standalone-homepage.
 * Three tiers: a dark utility bar, the main brand/nav row, and a demo persona bar.
 * Primary nav links come from a fragment (default /standalone-nav).
 */
const TOP_LINKS = [
  { label: 'Security Center', href: 'https://www.kotak.bank.in/en/security.html' },
  { label: 'Report Fraud', href: 'https://kapps.kotak.bank.in/FraudPreLogin', fraud: true },
  { label: 'Support', href: 'https://www.kotak.bank.in/en/help-center.html' },
  { label: 'Branch & ATM', href: 'https://www.kotak.bank.in/en/branch-locator.html' },
  { label: 'Download App', href: 'https://kotakapp.onelink.me/Xoqo/rt3ds5c3' },
];

const PERSONAS = ['Personal Banking', 'Business Banking', 'NRI Banking'];

const FALLBACK_LOGO = 'https://www.kotak.bank.in/content/dam/Kotak/svg-icons/navigation/kmbl-logo.svg';

/* Per-persona homepage copy. Selecting a banking option in the demo bar rewrites
   the rendered section text in place (the reference keeps the same accent and
   only swaps content). Keyed by the persona dropdown label. */
const PERSONA_CONTENT = {
  'Personal Banking': {
    heroSlides: [
      {
        eyebrow: 'Banking, the way it should feel',
        title: 'Open in minutes.<br>Stay for decades.',
        desc: 'Start a fully digital account in under five minutes, then run your money in real time — from one place that always has your back.',
        primary: 'Open an Account',
        secondary: 'Explore products',
      },
      {
        eyebrow: 'Zero-balance · Kotak 811',
        title: 'Banking with<br>nothing held back.',
        desc: 'Open an 811 account with Aadhaar in five minutes — zero balance, fully digital, no branch visit.',
        primary: 'Open 811 Account',
        secondary: 'Why 811',
      },
      {
        eyebrow: 'Cards that reward you',
        title: 'Spend smart.<br>Earn more.',
        desc: 'Pick a credit card matched to how you actually spend, with every fee shown up front.',
        primary: 'Explore Cards',
        secondary: 'Compare cards',
      },
    ],
    heroStats: [
      { value: '5 Cr+', label: 'Customers' },
      { value: '₹4.8L Cr', label: 'Assets' },
      { value: 'RBI', label: 'Regulated · DICGC' },
    ],
    card: {
      label: 'Kotak · Savings ··6042',
      balance: '₹ 2,48,910',
      decimal: '.50',
      pill: '+ ₹12,400 this month',
      actions: ['Pay', 'Transfer', 'Invest'],
      txns: [
        {
          title: 'Salary credited', meta: 'Today · 09:14', amount: '+ ₹1,42,000', dir: 'in',
        },
        {
          title: 'SIP · Bluechip Fund', meta: 'Yesterday', amount: '− ₹10,000', dir: 'out',
        },
        {
          title: 'Electricity bill', meta: '12 Jun · Auto-pay', amount: '− ₹2,180', dir: 'out',
        },
      ],
      ai: 'Your idle balance could earn ₹1,040 more this quarter in ActivMoney.',
    },
    quickActions: ['Open an Account', 'Apply for Credit Card', 'Explore Loans', 'Track Application', 'Pay & Transfer', 'Compare Products', 'Find Branch / ATM', 'Report Fraud / Get Help'],
    chips: ["I'm new to Kotak", 'A credit card that works for me', 'I need a salary account', 'A low-fee starter option', 'Premium banking', 'Help me compare options'],
    journey: {
      eyebrow: 'Built around your life',
      heading: 'Start where you are. We’ll take it from there.',
      cards: [
        { title: 'Start Banking', desc: 'Open a zero-balance account from your phone — no branch, no paperwork.', tags: '811 Digital · Savings · Salary' },
        { title: 'Save Smarter', desc: 'Earn more on idle money with FDs and ActivMoney — without locking it away.', tags: 'Fixed Deposits · RD · ActivMoney' },
        { title: 'Borrow with Confidence', desc: 'See your real EMI and total cost before you commit a single rupee.', tags: 'Home · Personal · Vehicle' },
        { title: 'Spend & Earn', desc: 'Pick a card that rewards how you already spend, with fees shown up front.', tags: 'Credit Cards · Rewards · Cashback' },
        { title: 'Grow My Wealth', desc: 'From your first ₹500 SIP to a managed portfolio, all in one place.', tags: 'Mutual Funds · Stocks · PMS' },
        { title: 'Protect What Matters', desc: 'Life, health and motor cover for the things you can’t afford to lose.', tags: 'Life · Health · Motor' },
      ],
    },
    trust: {
      heading: 'Built to be trusted with more than your money.',
      tiles: [
        { title: 'Your money is insured by law.', desc: 'Deposits up to ₹5 lakh are covered under DICGC, and Kotak is regulated by the RBI.' },
        { title: 'Locked down to your device.', desc: '256-bit encryption, multi-factor authentication and device binding on every session.' },
        { title: 'If fraud happens, you don’t pay.', desc: 'Real-time alerts on every transaction and a zero-liability policy on unauthorised use.' },
        { title: 'No fee you didn’t see coming.', desc: 'Every charge is published up front. Read the full fee schedule before you open anything.' },
      ],
      stats: [
        { value: '5 Cr+', label: 'Customers served' },
        { value: '₹4.8L Cr', label: 'Assets under management' },
        { value: '24 / 7', label: 'Support availability' },
        { value: 'Since 2003', label: 'A bank you can place' },
      ],
    },
    decision: {
      heading: 'Decide with the numbers in front of you.',
      calcTitle: 'EMI Calculator',
      guides: ['Which credit card is right for you?', 'Home loan vs. rent — what makes sense now?', 'The three messages no bank will ever send you'],
    },
  },
  'Business Banking': {
    heroSlides: [
      {
        eyebrow: 'Banking for builders',
        title: 'Banking that keeps<br>pace with you.',
        desc: 'Open a current account online, collect payments instantly, and unlock collateral-free working capital from ₹3 lakh.',
        primary: 'Open a Current Account',
        secondary: 'Explore business banking',
      },
      {
        eyebrow: 'Working capital',
        title: 'Fuel growth<br>without the wait.',
        desc: 'Collateral-free funding from ₹3 lakh to ₹1 crore, decisioned fast and built around your cash flow.',
        primary: 'Check eligibility',
        secondary: 'See loan options',
      },
      {
        eyebrow: 'Collect & pay',
        title: 'Get paid instantly.<br>Pay at scale.',
        desc: 'Accept UPI and cards with next-day settlement, and automate vendor and salary payouts.',
        primary: 'Start collecting',
        secondary: 'Payment solutions',
      },
    ],
    heroStats: [
      { value: '40L+', label: 'Businesses banked' },
      { value: '1,300+', label: 'Branches' },
      { value: 'RBI', label: 'Regulated · PCI-DSS' },
    ],
    card: {
      label: 'Kotak · Current ··8810',
      balance: '₹ 18,42,650',
      decimal: '.00',
      pill: '+ ₹3,10,000 today',
      actions: ['Collect', 'Payout', 'GST'],
      txns: [
        {
          title: 'Customer payment · UPI', meta: 'Today · 11:02', amount: '+ ₹2,80,000', dir: 'in',
        },
        {
          title: 'Vendor payout · NEFT', meta: 'Today · 09:30', amount: '− ₹1,15,000', dir: 'out',
        },
        {
          title: 'GST remittance', meta: '12 Jun · Auto', amount: '− ₹84,200', dir: 'out',
        },
      ],
      ai: 'Your working-capital line has ₹6.2L unused — sweep idle funds to earn while it waits.',
    },
    quickActions: ['Open Current Account', 'Collect Payments', 'Working Capital', 'Bulk Payouts', 'Pay GST / Taxes', 'Trade & Forex', 'Track Application', 'Report Fraud / Get Help'],
    chips: ["I'm starting a business", 'I want to collect payments', 'I need working capital', 'Open a current account', 'Run payroll & salary'],
    journey: {
      eyebrow: 'Built around your business',
      heading: 'Run it, fund it, grow it.',
      cards: [
        { title: 'Open & Operate', desc: 'Current accounts with the limits and tools a real business needs.', tags: 'Current · Pro · Privy Business' },
        { title: 'Finance Growth', desc: 'Fund expansion with collateral-free and secured lending.', tags: 'Business Loan · Working Capital · LAP' },
        { title: 'Collect & Pay', desc: 'Accept payments and automate payouts at scale.', tags: 'Payment Gateway · UPI · Payouts' },
        { title: 'Trade & Forex', desc: 'Move goods and money across borders with ease.', tags: 'LC · Bank Guarantee · Export Credit' },
        { title: 'Manage Payroll', desc: 'Pay your team on time, every time.', tags: 'Corporate Salary · Payouts API' },
        { title: 'Treasury & Tax', desc: 'Keep idle funds working and your taxes on track.', tags: 'Sweep · CMS · GST Payments' },
      ],
    },
    trust: {
      heading: 'Banking your business can rely on.',
      tiles: [
        { title: 'Settlements that clear on time.', desc: 'Real-time collections and same-day settlements with transparent cut-offs.' },
        { title: 'Secure, compliant by design.', desc: 'PCI-DSS payments, RBI-regulated processes and granular team access controls.' },
        { title: 'A banker who knows your business.', desc: 'A dedicated relationship manager and priority resolution for your team.' },
        { title: 'No fee you didn’t see coming.', desc: 'Every charge published up front. Read the full schedule before you sign.' },
      ],
      stats: [
        { value: '40L+', label: 'Businesses banked' },
        { value: '1,300+', label: 'Branches' },
        { value: '99.9%', label: 'Platform uptime' },
        { value: 'Since 2003', label: 'Trusted since' },
      ],
    },
    decision: {
      heading: 'Run the numbers before you commit.',
      calcTitle: 'Business Loan EMI',
      guides: ['How much working capital does your business need?', 'Term loan vs. overdraft — which costs less?', 'Protecting your business from payment fraud'],
    },
  },
  'NRI Banking': {
    heroSlides: [
      {
        eyebrow: 'Banking without borders',
        title: 'Your money, home<br>from anywhere.',
        desc: 'Open an NRE or NRO account in 72 hours, remit to India at live rates, and grow tax-efficient deposits.',
        primary: 'Open an NRI Account',
        secondary: 'Explore NRI banking',
      },
      {
        eyebrow: 'Tax-efficient deposits',
        title: 'Earn 7.2%,<br>entirely tax-free.',
        desc: 'Book an NRE fixed deposit — interest is tax-free in India and the funds stay fully repatriable.',
        primary: 'Book NRE FD',
        secondary: 'Compare rates',
      },
      {
        eyebrow: 'Remit in minutes',
        title: 'Send money home,<br>instantly.',
        desc: 'Remit to India online at live exchange rates with Click2Remit, usually credited within a day.',
        primary: 'Remit now',
        secondary: 'How it works',
      },
    ],
    heroStats: [
      { value: '150+', label: 'Countries served' },
      { value: '72 hr', label: 'Account opening' },
      { value: 'RBI · FEMA', label: 'Compliant' },
    ],
    card: {
      label: 'Kotak · NRE ··4021',
      balance: '₹ 32,18,400',
      decimal: '.00',
      pill: '+ $4,200 received',
      actions: ['Remit', 'Book FD', 'Repatriate'],
      txns: [
        {
          title: 'Inward remittance · USD', meta: 'Today · 08:15', amount: '+ ₹3,52,000', dir: 'in',
        },
        {
          title: 'NRE FD booked', meta: 'Yesterday', amount: '− ₹10,00,000', dir: 'out',
        },
        {
          title: 'Repatriation · USD', meta: '10 Jun', amount: '− ₹2,10,000', dir: 'out',
        },
      ],
      ai: 'NRE FD rates are 7.2% — booking now locks tax-free interest for two years.',
    },
    quickActions: ['Open NRI Account', 'Remit to India', 'NRE / NRO FD', 'Repatriate Funds', 'Invest in India', 'Track Onboarding', 'Find Branch / ATM', 'Report Fraud / Get Help'],
    chips: ["I'm new to NRI banking", 'I want to remit to India', 'Tax-efficient deposits', 'Invest in India', 'A home loan in India'],
    journey: {
      eyebrow: 'Built around your journey',
      heading: 'India, wherever you are.',
      cards: [
        { title: 'Open from Abroad', desc: 'Start an NRE or NRO account without flying down to India.', tags: 'NRE · NRO · Privy' },
        { title: 'Grow Deposits', desc: 'Tax-efficient, repatriable deposits in rupees or forex.', tags: 'NRE FD · NRO FD · FCNR' },
        { title: 'Remit & Repatriate', desc: 'Move money to and from India at live exchange rates.', tags: 'Click2Remit · Wire · Exchange House' },
        { title: 'Invest in India', desc: 'Participate in Indian markets, fully compliantly.', tags: 'PIS Demat · Mutual Funds · PMS' },
        { title: 'Borrow in India', desc: 'Finance a home or property back home with ease.', tags: 'NRI Home Loan · LAP' },
        { title: 'Protect Family', desc: 'Cover the people you’re building it all for.', tags: 'Life · Health Insurance' },
      ],
    },
    trust: {
      heading: 'Banking that respects borders and rules.',
      tiles: [
        { title: 'Repatriation, done right.', desc: 'FEMA-compliant transfers with clear documentation, every single time.' },
        { title: 'Tax treated correctly.', desc: 'NRE interest is tax-free in India; DTAA benefits applied where you’re eligible.' },
        { title: 'Secure across borders.', desc: '256-bit encryption, multi-factor authentication and device binding on every session.' },
        { title: 'No fee you didn’t see coming.', desc: 'Transparent FX rates and charges, published before you transact.' },
      ],
      stats: [
        { value: '150+', label: 'Countries served' },
        { value: '72 hr', label: 'Account opening' },
        { value: '24 / 7', label: 'Global support' },
        { value: 'Since 2003', label: 'Trusted since' },
      ],
    },
    decision: {
      heading: 'Decide with the numbers in front of you.',
      calcTitle: 'NRI Home Loan EMI',
      guides: ['NRE vs NRO — where should your money sit?', 'Is an FCNR deposit right for you?', 'Remittance scams every NRI should know'],
    },
  },
};

function setText(el, value) {
  if (el && value != null) el.textContent = value;
}

/** Rewrites the homepage section copy to match the chosen persona. */
function applyPersonaContent(persona) {
  const data = PERSONA_CONTENT[persona];
  const main = document.querySelector('main');
  if (!data || !main) return false;

  // each carousel slide gets its own persona copy
  main.querySelectorAll('.banner-content').forEach((slide, i) => {
    const s = data.heroSlides[i] || data.heroSlides[data.heroSlides.length - 1];
    if (!s) return;
    setText(slide.querySelector('.banner-eyebrow'), s.eyebrow);
    const title = slide.querySelector('.banner-title');
    if (title) title.innerHTML = s.title;
    setText(slide.querySelector('.banner-desc'), s.desc);
    setText(slide.querySelector('.banner-cta-primary'), s.primary);
    setText(slide.querySelector('.banner-cta-secondary'), `${s.secondary} →`);
  });

  // hero stat strip (shared across slides)
  main.querySelectorAll('.banner-stat').forEach((stat, i) => {
    const s = data.heroStats[i];
    if (!s) return;
    setText(stat.querySelector('.banner-stat-value'), s.value);
    setText(stat.querySelector('.banner-stat-label'), s.label);
  });

  // account-card mock (the white card on the blue banner)
  const cardData = data.card;
  const cardEl = main.querySelector('.banner-card');
  if (cardData && cardEl) {
    setText(cardEl.querySelector('.banner-card-label'), cardData.label);
    setText(cardEl.querySelector('.banner-card-balance-main'), cardData.balance);
    setText(cardEl.querySelector('.banner-card-balance-dec'), cardData.decimal);
    setText(cardEl.querySelector('.banner-card-pill-text'), cardData.pill);
    cardEl.querySelectorAll('.banner-card-action').forEach((el, i) => setText(el, cardData.actions[i]));
    cardEl.querySelectorAll('.banner-card-txn').forEach((row, i) => {
      const t = cardData.txns[i];
      if (!t) return;
      setText(row.querySelector('.banner-card-txn-title'), t.title);
      setText(row.querySelector('.banner-card-txn-meta'), t.meta);
      const amt = row.querySelector('.banner-card-txn-amt');
      if (amt) {
        amt.textContent = t.amount;
        amt.classList.toggle('banner-card-txn-in', t.dir === 'in');
        amt.classList.toggle('banner-card-txn-out', t.dir === 'out');
      }
    });
    setText(cardEl.querySelector('.banner-card-ai-text'), cardData.ai);
  }

  main.querySelectorAll('.quick-actions-label').forEach((el, i) => setText(el, data.quickActions[i]));

  main.querySelectorAll('.product-finder-chip').forEach((el, i) => {
    if (data.chips[i]) {
      el.textContent = data.chips[i];
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });

  setText(main.querySelector('.journey-grid-eyebrow'), data.journey.eyebrow);
  setText(main.querySelector('.journey-grid-heading'), data.journey.heading);
  main.querySelectorAll('.journey-grid-card').forEach((card, i) => {
    const c = data.journey.cards[i];
    if (!c) return;
    setText(card.querySelector('.journey-grid-card-title'), c.title);
    setText(card.querySelector('.journey-grid-card-desc'), c.desc);
    setText(card.querySelector('.journey-grid-card-tags'), c.tags);
  });

  setText(main.querySelector('.trust-section-heading'), data.trust.heading);
  main.querySelectorAll('.trust-section-tile').forEach((tile, i) => {
    const t = data.trust.tiles[i];
    if (!t) return;
    setText(tile.querySelector('.trust-section-tile-title'), t.title);
    setText(tile.querySelector('.trust-section-tile-desc'), t.desc);
  });
  main.querySelectorAll('.trust-section-stat').forEach((stat, i) => {
    const s = data.trust.stats[i];
    if (!s) return;
    setText(stat.querySelector('.trust-section-stat-value'), s.value);
    setText(stat.querySelector('.trust-section-stat-label'), s.label);
  });

  setText(main.querySelector('.decision-tools-heading'), data.decision.heading);
  setText(main.querySelector('.decision-tools-calc-title'), data.decision.calcTitle);
  main.querySelectorAll('.decision-tools-card-title').forEach((el, i) => setText(el, data.decision.guides[i]));

  return !!main.querySelector('.banner-content');
}

const MEGA_MENUS = {
  Personal: {
    columns: [
      { title: 'Accounts', links: ['Savings Account', 'Salary Account', 'Private Banking', 'Privy', 'Solitaire', '3-in-1 Account'] },
      { title: 'Cards', links: ['Credit Card', 'Debit Card', 'Forex Card'] },
      { title: 'Loans', links: ['Home Loan', 'Personal Loan', 'Car Loan', 'Gold Loan', 'Smart EMI', 'Loan Against Property'] },
      { title: 'Insurance', links: ['Life Insurance', 'Health Insurance', 'Vehicle Insurance', 'Travel Insurance'] },
      { title: 'Investments', links: ['Deposits', 'Mutual Funds', 'ASBA Facility', 'Demat Account', 'Government Schemes'] },
      { title: 'Payments', links: ['Bill Payments', 'Fund Transfer', 'FASTag', 'Forex & Remittance', 'Wearable Payments'] },
    ],
    featured: {
      eyebrow: 'Featured',
      title: 'Open an 811 account in 5 minutes',
      desc: 'Zero-balance, fully digital, with Aadhaar. No branch visit.',
      cta: 'Start now',
      href: 'https://www.kotak811.com/open-zero-balance-savings-account',
    },
  },
  Business: {
    columns: [
      { title: 'Banking', links: ['Current Account', 'Retail Institution Account', 'Corporate Salary Solutions', 'Privy Business', 'Solitaire'] },
      { title: 'Lending', links: ['Business Loan', 'Working Capital', 'Business Credit Card', 'Commercial Vehicle Loan', 'Commercial Equipment Loan', 'Loan Against Property'] },
      { title: 'Payment', links: ['Payment Solutions', 'Loan / Utility Payment', 'Fund Transfer', 'Taxes'] },
      { title: 'Trade', links: ['Domestic', 'International — Exports', 'International — Imports', 'Bank Guarantee', 'Letter of Credit', 'Export Credit'] },
      { title: 'Corporate Solutions', links: ['Cash Management Services', 'Trade & Supply Chain Finance', 'Trade Service', 'Sector Based Solutions', 'Corporate Accounts'] },
    ],
    featured: {
      eyebrow: 'For Business',
      title: 'Current accounts built for growth',
      desc: 'Simplified transactions and collateral-free loans from ₹3 lakh.',
      cta: 'Discover Business',
      href: 'https://www.kotak.bank.in/en/business.html',
    },
  },
  NRI: {
    columns: [
      { title: 'Accounts', links: ['Savings Account', 'Current Account', 'Privy'] },
      { title: 'Deposits', links: ['NRE Fixed Deposit', 'NRO Fixed Deposit', 'FCNR Deposits'] },
      { title: 'Investment & Insurance', links: ['Demat Account', 'Mutual Funds', 'Portfolio Investment Schemes', 'Life Insurance'] },
      { title: 'Money Transfer', links: ['Wire Transfer', 'Click2Remit', 'Remittance Exchange House'] },
      { title: 'Cards', links: ['Credit Card', 'Debit Card'] },
      { title: 'Loans', links: ['Home Loan'] },
    ],
    featured: {
      eyebrow: 'For NRIs',
      title: 'Open an NRI account in 72 hours',
      desc: 'Dissolving distances, powering ambitions — from anywhere.',
      cta: 'Discover NRI',
      href: 'https://www.kotak.bank.in/en/personal-banking/nri-banking.html',
    },
  },
  'About Us': {
    columns: [
      { title: 'Company', links: ['Our Story', 'Investors', 'Careers', 'Media Centre'] },
    ],
    featured: {
      eyebrow: 'About Kotak',
      title: 'A trusted bank since 2003',
      desc: 'From a finance company to one of India’s most trusted banks.',
      cta: 'Read our story',
      href: 'https://www.kotak.bank.in/en/about-us.html',
    },
  },
  Learn: {
    columns: [
      { title: 'Resources', links: ['Safe Banking', 'Digital Banking', 'Calculators', 'Financial Education'] },
    ],
    featured: {
      eyebrow: 'Learn',
      title: 'Tools to decide with confidence',
      desc: 'Calculators, guides and safe-banking knowledge in one place.',
      cta: 'Explore Learn',
      href: 'https://www.kotak.bank.in/en/help-center.html',
    },
  },
  Help: {
    columns: [
      { title: 'Support', links: ['Help Center', 'Service Requests', 'Locate Us', 'Call Us (1800 4100)', 'Complaints', 'Download Forms'] },
    ],
    featured: {
      eyebrow: 'Help',
      title: 'We’re here 24×7 — 1800 4100',
      desc: 'Help Center, service requests, branch locator and complaints.',
      cta: 'Get help',
      href: 'https://www.kotak.bank.in/en/help-center.html',
    },
  },
};

function buildMegaPanel(data) {
  const panel = document.createElement('div');
  panel.className = 'header-2-mega';
  panel.hidden = true;

  const inner = document.createElement('div');
  inner.className = 'header-2-mega-inner';

  const cols = document.createElement('div');
  cols.className = 'header-2-mega-cols';
  data.columns.forEach((c) => {
    const col = document.createElement('div');
    col.className = 'header-2-mega-col';
    const title = document.createElement('p');
    title.className = 'header-2-mega-col-title';
    title.textContent = c.title;
    const list = document.createElement('div');
    list.className = 'header-2-mega-col-links';
    c.links.forEach((l) => {
      const a = document.createElement('a');
      a.className = 'header-2-mega-link';
      a.href = '#';
      a.textContent = l;
      list.append(a);
    });
    col.append(title, list);
    cols.append(col);
  });

  const featured = document.createElement('a');
  featured.className = 'header-2-mega-featured';
  featured.href = data.featured.href;
  featured.innerHTML = `
    <p class="header-2-mega-featured-eyebrow">${data.featured.eyebrow}</p>
    <p class="header-2-mega-featured-title">${data.featured.title}</p>
    <p class="header-2-mega-featured-desc">${data.featured.desc}</p>
    <p class="header-2-mega-featured-cta">${data.featured.cta} →</p>`;

  inner.append(cols, featured);
  panel.append(inner);
  return panel;
}

async function fetchNav(navPath) {
  let resp = await fetch('/content/standalone-nav.plain.html');
  if (!resp.ok) resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

function buildTopBar() {
  const top = document.createElement('div');
  top.className = 'header-2-top';

  const inner = document.createElement('div');
  inner.className = 'header-2-top-inner';

  const links = document.createElement('div');
  links.className = 'header-2-top-links';
  TOP_LINKS.forEach((l) => {
    const a = document.createElement('a');
    a.className = 'header-2-top-link';
    if (l.fraud) a.classList.add('header-2-top-link-fraud');
    a.href = l.href;
    a.textContent = l.label;
    links.append(a);
  });

  const login = document.createElement('a');
  login.className = 'header-2-netbanking';
  login.href = 'https://netbanking.kotak.com/knb2/';
  login.textContent = 'Net Banking Login';

  inner.append(links, login);
  top.append(inner);
  return top;
}

function buildMainRow(frag) {
  const main = document.createElement('div');
  main.className = 'header-2-main';

  const inner = document.createElement('div');
  inner.className = 'header-2-inner';

  const brand = document.createElement('a');
  brand.className = 'header-2-brand';
  brand.href = 'https://main--kotak--muthammakb1.aem.page/';
  const fragSrc = frag && frag.querySelector('img') && frag.querySelector('img').getAttribute('src');
  const img = document.createElement('img');
  img.className = 'header-2-brand-logo';
  // the authored fragment logo lives on an auth-gated da.live URL; fall back to
  // the public Kotak logo so the brand mark always renders
  img.src = fragSrc && !/content\.da\.live/.test(fragSrc) ? fragSrc : FALLBACK_LOGO;
  img.alt = 'Kotak Mahindra Bank';
  img.addEventListener('error', () => {
    if (img.src !== FALLBACK_LOGO) img.src = FALLBACK_LOGO;
  }, { once: true });
  brand.append(img);
  inner.append(brand);

  const list = frag && frag.querySelector('ul');
  if (list) {
    const nav = document.createElement('nav');
    nav.className = 'header-2-nav';
    const ul = document.createElement('ul');
    let openTimer;

    list.querySelectorAll(':scope > li').forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      const label = a.textContent.trim();
      const item = document.createElement('li');
      item.className = 'header-2-nav-item';
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = label;
      item.append(link);

      const data = MEGA_MENUS[label];
      if (data) {
        const panel = buildMegaPanel(data);
        item.append(panel);

        const open = () => {
          clearTimeout(openTimer);
          nav.querySelectorAll('.header-2-mega').forEach((p) => { p.hidden = true; });
          nav.querySelectorAll('.header-2-nav-item').forEach((i) => i.classList.remove('header-2-nav-item-open'));
          panel.hidden = false;
          item.classList.add('header-2-nav-item-open');
        };
        const close = () => {
          openTimer = setTimeout(() => {
            panel.hidden = true;
            item.classList.remove('header-2-nav-item-open');
          }, 120);
        };
        item.addEventListener('mouseenter', open);
        item.addEventListener('mouseleave', close);
        link.addEventListener('focus', open);
      }
      ul.append(item);
    });
    nav.append(ul);
    inner.append(nav);
  }

  const actions = document.createElement('div');
  actions.className = 'header-2-actions';
  const search = document.createElement('button');
  search.type = 'button';
  search.className = 'header-2-search';
  search.textContent = 'Search';
  const login = document.createElement('a');
  login.className = 'header-2-login';
  login.href = 'https://netbanking.kotak.com/knb2/';
  login.textContent = 'Login';
  actions.append(search, login);
  inner.append(actions);

  main.append(inner);
  return main;
}

function buildDemoBar() {
  const demo = document.createElement('div');
  demo.className = 'header-2-demo';

  const inner = document.createElement('div');
  inner.className = 'header-2-demo-inner';

  const label = document.createElement('span');
  label.className = 'header-2-demo-label';
  label.textContent = 'Demo · Viewing as';

  const picker = document.createElement('div');
  picker.className = 'header-2-demo-picker';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'header-2-demo-select';
  toggle.setAttribute('aria-haspopup', 'listbox');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = `<span class="header-2-demo-current">${PERSONAS[0]}</span><span class="header-2-demo-caret" aria-hidden="true">▾</span>`;

  const menu = document.createElement('ul');
  menu.className = 'header-2-demo-menu';
  menu.setAttribute('role', 'listbox');
  menu.hidden = true;

  const current = toggle.querySelector('.header-2-demo-current');

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    picker.classList.toggle('header-2-demo-picker-open', open);
  };

  PERSONAS.forEach((p) => {
    const li = document.createElement('li');
    li.className = 'header-2-demo-option';
    li.setAttribute('role', 'option');
    li.textContent = p;
    if (p === PERSONAS[0]) li.setAttribute('aria-selected', 'true');
    li.addEventListener('click', () => {
      current.textContent = p;
      menu.querySelectorAll('.header-2-demo-option').forEach((o) => o.removeAttribute('aria-selected'));
      li.setAttribute('aria-selected', 'true');
      setOpen(false);
      applyPersonaContent(p);
    });
    menu.append(li);
  });

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(menu.hidden);
  });
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  picker.append(toggle, menu);

  const note = document.createElement('span');
  note.className = 'header-2-demo-note';
  note.textContent = 'The whole page re-skins to the selected persona.';

  inner.append(label, picker, note);
  demo.append(inner);
  return demo;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/standalone-nav';
  const frag = await fetchNav(navPath);

  block.textContent = '';
  block.append(buildTopBar(), buildMainRow(frag), buildDemoBar());
}
