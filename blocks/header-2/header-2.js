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
  brand.href = '/';
  const brandImg = frag && frag.querySelector('img');
  if (brandImg) {
    const img = document.createElement('img');
    img.src = brandImg.getAttribute('src');
    img.alt = brandImg.getAttribute('alt') || 'Home';
    brand.append(img);
  } else {
    brand.textContent = 'Kotak';
  }
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
