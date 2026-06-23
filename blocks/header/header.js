import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

const HAMBURGER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
</svg>`;

const CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
</svg>`;

const CHEVRON_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
  <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

/**
 * fetch the nav fragment for local (aem up) or DA/EDS production
 * @param {string} navPath path to the nav doc without the .plain.html suffix
 */
async function fetchNav(navPath) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

function closeAllPanels(nav) {
  nav.querySelectorAll('.nav-l1[aria-expanded="true"]').forEach((li) => {
    li.setAttribute('aria-expanded', 'false');
  });
}

/**
 * build the desktop/mobile megamenu from the nav list section
 * @param {Element} listSection the section div containing the top-level <ul>
 */
function buildNavSections(listSection) {
  const topUl = listSection.querySelector(':scope > ul');
  if (!topUl) return null;
  topUl.querySelectorAll(':scope > li').forEach((l1) => {
    l1.classList.add('nav-l1');
    l1.setAttribute('aria-expanded', 'false');

    const trigger = l1.querySelector(':scope > a');
    const label = trigger ? trigger.textContent.trim() : '';
    // L1 does not navigate — replace with a button-like span
    const l1btn = document.createElement('button');
    l1btn.type = 'button';
    l1btn.className = 'nav-l1-trigger';
    l1btn.innerHTML = `<span>${label}</span>${CHEVRON_SVG}`;
    if (trigger) trigger.replaceWith(l1btn); else l1.prepend(l1btn);

    const panel = l1.querySelector(':scope > ul');
    if (!panel) return;
    panel.classList.add('nav-panel');

    // Determine if this is a "big" menu (has L2 categories with nested ul) or a flat list
    const l2items = [...panel.querySelectorAll(':scope > li')];
    const hasCategories = l2items.some((li) => li.querySelector(':scope > ul'));

    if (hasCategories) {
      l1.classList.add('nav-l1-mega');
      const sidebar = document.createElement('div');
      sidebar.className = 'nav-panel-sidebar';
      const content = document.createElement('div');
      content.className = 'nav-panel-content';

      l2items.forEach((li) => {
        const sub = li.querySelector(':scope > ul');
        const a = li.querySelector(':scope > a');
        if (sub) {
          // L2 category — does not navigate
          const catBtn = document.createElement('button');
          catBtn.type = 'button';
          catBtn.className = 'nav-l2-cat';
          catBtn.textContent = a ? a.textContent.trim() : '';
          sidebar.append(catBtn);

          const l3list = document.createElement('ul');
          l3list.className = 'nav-l3-list';
          sub.querySelectorAll(':scope > li').forEach((l3li) => l3list.append(l3li));
          content.append(l3list);

          const activate = () => {
            sidebar.querySelectorAll('.nav-l2-cat').forEach((b) => b.classList.remove('is-active'));
            content.querySelectorAll('.nav-l3-list').forEach((u) => u.classList.remove('is-active'));
            catBtn.classList.add('is-active');
            l3list.classList.add('is-active');
          };
          catBtn.addEventListener('mouseenter', activate);
          catBtn.addEventListener('click', activate);
          catBtn.addEventListener('focus', activate);
        } else if (a) {
          // top-level "Discover X" link in the sidebar header
          li.classList.add('nav-panel-discover');
          sidebar.prepend(li);
        }
      });

      // activate first category by default
      const firstCat = sidebar.querySelector('.nav-l2-cat');
      const firstList = content.querySelector('.nav-l3-list');
      if (firstCat) firstCat.classList.add('is-active');
      if (firstList) firstList.classList.add('is-active');

      panel.textContent = '';
      panel.append(sidebar, content);
    } else {
      l1.classList.add('nav-l1-flat');
    }
  });
  return topUl;
}

function wireDesktopHover(nav) {
  nav.querySelectorAll('.nav-l1').forEach((l1) => {
    const trigger = l1.querySelector(':scope > .nav-l1-trigger');
    l1.addEventListener('mouseenter', () => {
      if (!isDesktop.matches) return;
      closeAllPanels(nav);
      l1.setAttribute('aria-expanded', 'true');
    });
    l1.addEventListener('mouseleave', () => {
      if (!isDesktop.matches) return;
      l1.setAttribute('aria-expanded', 'false');
    });
    trigger.addEventListener('click', () => {
      const expanded = l1.getAttribute('aria-expanded') === 'true';
      if (isDesktop.matches) {
        closeAllPanels(nav);
        l1.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      } else {
        // mobile: pill-tab behaviour — one L1 panel open at a time, always one active
        closeAllPanels(nav);
        l1.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !e.target.closest('.nav-l1')) closeAllPanels(nav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeAllPanels(nav);
  });
}

function buildSearch() {
  const search = document.createElement('div');
  search.className = 'nav-search';
  search.innerHTML = `
    <button type="button" class="nav-search-toggle" aria-label="Search" aria-expanded="false">
      <img src="/content/images/search-mob.svg" alt="" width="22" height="22">
    </button>
    <form class="nav-search-form" role="search" action="https://www.kotak.bank.in/en/search.html">
      <input type="search" name="q" placeholder="Search" aria-label="Search">
    </form>`;
  const toggle = search.querySelector('.nav-search-toggle');
  const form = search.querySelector('.nav-search-form');
  const input = search.querySelector('input');
  toggle.addEventListener('click', () => {
    const open = search.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) input.focus();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) {
      search.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  form.addEventListener('submit', (e) => {
    if (!input.value.trim()) e.preventDefault();
  });
  return search;
}

function toggleMobileMenu(nav, force) {
  const open = force !== undefined ? force : !nav.classList.contains('nav-open');
  nav.classList.toggle('nav-open', open);
  document.body.style.overflowY = open ? 'hidden' : '';
  const hamburger = nav.querySelector('.nav-hamburger');
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    hamburger.innerHTML = open ? CLOSE_SVG : HAMBURGER_SVG;
  }
  if (!open) {
    closeAllPanels(nav);
  } else if (!isDesktop.matches) {
    // mobile: open the first L1 as the active tab by default
    closeAllPanels(nav);
    const first = nav.querySelector('.nav-l1');
    if (first) first.setAttribute('aria-expanded', 'true');
  }
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await fetchNav(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  const sections = fragment ? [...fragment.children] : [];
  const [brandSec, navSec, toolsSec] = sections;

  // Brand
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSec) brand.append(...brandSec.childNodes);

  // Sections (megamenu)
  const sectionsWrap = document.createElement('div');
  sectionsWrap.className = 'nav-sections';
  if (navSec) {
    buildNavSections(navSec);
    sectionsWrap.append(...navSec.childNodes);
  }

  // Tools (search + login)
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  tools.append(buildSearch());
  if (toolsSec) {
    const login = document.createElement('div');
    login.className = 'nav-login';
    login.append(...toolsSec.childNodes);
    tools.append(login);
  }

  // Hamburger (mobile)
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML = HAMBURGER_SVG;
  hamburger.addEventListener('click', () => toggleMobileMenu(nav));

  nav.append(brand, sectionsWrap, tools, hamburger);

  wireDesktopHover(nav);

  // viewport change handling
  isDesktop.addEventListener('change', () => {
    toggleMobileMenu(nav, false);
    closeAllPanels(nav);
    document.body.style.overflowY = '';
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
