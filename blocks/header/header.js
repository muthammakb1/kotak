import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 1180px)');

const HAMBURGER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
</svg>`;

const CLOSE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
</svg>`;

const CHEVRON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
  <path d="M13.25 1L7 7.25L0.75 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

const DISCOVER_ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 42 30" fill="none" aria-hidden="true">
  <path d="M41.3072 13.3445L41.305 13.3423L28.9627 1.18103C28.038 0.26998 26.5425 0.27337 25.6221 1.18898C24.7018 2.10446 24.7054 3.58522 25.63 4.49638L33.9167 12.6613H2.36209C1.05751 12.6613 0 13.7083 0 15C0 16.2917 1.05751 17.3387 2.36209 17.3387H33.9166L25.6301 25.5036C24.7055 26.4148 24.7019 27.8955 25.6222 28.811C26.5426 29.7267 28.0383 29.7299 28.9628 28.819L41.3052 16.6577L41.3073 16.6555C42.2324 15.7413 42.2294 14.2557 41.3072 13.3445Z" fill="#1C1C1C"></path>
</svg>`;

const SEARCH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
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

/**
 * Direct-child link of a list item, whether bare (`<li><a>`) or wrapped by DA/EDS
 * in a paragraph (`<li><p><a>`). Returns null if none.
 */
function directLink(li) {
  return li.querySelector(':scope > a') || li.querySelector(':scope > p > a');
}

/** Direct-child sub-list of a list item. */
function directSubUl(li) {
  return li.querySelector(':scope > ul');
}

function closeAllMenus(menu) {
  menu.querySelectorAll('.header-menu-li.active-header-menu').forEach((li) => {
    li.classList.remove('active-header-menu');
    const panel = li.querySelector(':scope > .header-menu-divmain');
    if (panel) panel.classList.add('disp-none');
  });
}

/**
 * Build a single L3 link in the live-site shape:
 * a.header-menu2-div > span.header-menu2-divspan > img, then span.span with the text.
 */
function buildL3Link(srcAnchor) {
  const a = document.createElement('a');
  a.className = 'header-menu2-div';
  const href = srcAnchor.getAttribute('href');
  if (href) a.href = href;

  const media = srcAnchor.querySelector('picture, img');
  if (media) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'header-menu2-divspan';
    iconSpan.append(media);
    a.append(iconSpan);
  }

  const textSpan = document.createElement('span');
  textSpan.className = 'span';
  textSpan.textContent = srcAnchor.textContent.trim();
  a.append(textSpan);
  return a;
}

/**
 * Activate one L2 category: highlight its label and show its L3 panel, hide siblings.
 */
function activateCategory(sidebarUl, span) {
  sidebarUl.querySelectorAll(':scope > li > .header-menul1-span').forEach((s) => s.classList.remove('active'));
  sidebarUl.querySelectorAll(':scope > li > .header-menu2').forEach((p) => { p.style.display = 'none'; });
  span.classList.add('active');
  const panel = span.parentElement.querySelector(':scope > .header-menu2');
  if (panel) panel.style.display = '';
}

/**
 * Build the megamenu structure using the live-site class names.
 * @param {Element} listSection the section div containing the top-level <ul>
 */
function buildHeaderMenu(listSection) {
  const srcUl = listSection.querySelector(':scope > ul');
  if (!srcUl) return null;

  const menu = document.createElement('div');
  menu.className = 'header-menu';
  const menuUl = document.createElement('ul');
  menuUl.className = 'header-menu-ul';
  menu.append(menuUl);

  const l1items = [...srcUl.querySelectorAll(':scope > li')];
  l1items.forEach((srcL1, index) => {
    const l1 = document.createElement('li');
    l1.className = 'header-menu-li';

    const l1link = directLink(srcL1);
    const label = l1link ? l1link.textContent.trim() : srcL1.textContent.trim().split('\n')[0].trim();

    // L1 label row — does NOT navigate
    const headerdiv = document.createElement('div');
    headerdiv.className = 'headerdiv';
    headerdiv.innerHTML = `<span class="header-menutext-color">${label}</span>${CHEVRON_SVG}`;
    l1.append(headerdiv);

    const srcPanel = directSubUl(srcL1);
    if (!srcPanel) {
      menuUl.append(l1);
      return;
    }

    const divmain = document.createElement('div');
    divmain.className = 'header-menu-divmain disp-none';

    const srcL2items = [...srcPanel.querySelectorAll(':scope > li')];
    const hasCategories = srcL2items.some((li) => directSubUl(li));

    // "Discover X" header bar (first direct link without a sub-list)
    const discoverSrc = srcL2items.find((li) => directLink(li) && !directSubUl(li)
      && /discover/i.test((directLink(li).textContent || '')));
    if (hasCategories && discoverSrc) {
      const dl = directLink(discoverSrc);
      const divhead = document.createElement('a');
      divhead.className = 'header-menu-divhead';
      if (dl.getAttribute('href')) divhead.href = dl.getAttribute('href');
      divhead.innerHTML = `<span>${dl.textContent.trim()}</span><span>${DISCOVER_ARROW_SVG}</span>`;
      divmain.append(divhead);
    }

    const menul1 = document.createElement('div');
    menul1.className = 'header-menul1';
    const menul1Scroll = document.createElement('div');
    menul1Scroll.className = 'header-menul1-scroll';
    const subUl = document.createElement('ul');
    subUl.className = 'sub-header-ul';
    menul1Scroll.append(subUl);
    menul1.append(menul1Scroll);

    if (hasCategories) {
      l1.classList.add('header-menu-li-mega');
      srcL2items.forEach((srcL2) => {
        if (srcL2 === discoverSrc) return;
        const srcL3ul = directSubUl(srcL2);
        const l2link = directLink(srcL2);
        const l2label = l2link ? l2link.textContent.trim() : srcL2.textContent.trim().split('\n')[0].trim();
        if (!srcL3ul) return;

        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'header-menul1-span';
        span.textContent = l2label;
        li.append(span);

        const menu2 = document.createElement('div');
        menu2.className = 'header-menu2';
        menu2.style.display = 'none';
        const menu2Scroll = document.createElement('div');
        menu2Scroll.className = 'header-menu2scroll';
        const l3ul = document.createElement('ul');
        const l3li = document.createElement('li');
        l3li.className = 'header-menu2-li';
        srcL3ul.querySelectorAll(':scope > li').forEach((srcL3li) => {
          const srcA = directLink(srcL3li);
          if (srcA) l3li.append(buildL3Link(srcA));
        });
        l3ul.append(l3li);
        menu2Scroll.append(l3ul);
        menu2.append(menu2Scroll);
        li.append(menu2);

        const activate = () => activateCategory(subUl, span);
        span.addEventListener('mouseenter', activate);
        span.addEventListener('click', activate);
        subUl.append(li);
      });

      // first category active by default
      const firstSpan = subUl.querySelector(':scope > li > .header-menul1-span');
      if (firstSpan) activateCategory(subUl, firstSpan);
    } else {
      // flat menu (About Us, Learn, Help) — direct links, no L2 panel
      l1.classList.add('header-menu-li-flat');
      menul1.classList.add('header-menul1-no-title-br', 'header-menul1-no-l2');
      srcL2items.forEach((srcL2) => {
        const srcA = directLink(srcL2);
        if (!srcA) return;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'header-menul1-span';
        if (srcA.getAttribute('href')) a.href = srcA.getAttribute('href');
        a.textContent = srcA.textContent.trim();
        li.append(a);
        subUl.append(li);
      });
    }

    divmain.append(menul1);
    l1.append(divmain);
    menuUl.append(l1);

    // divider after the 4th L1 item (matches live site: after About Us)
    if (index === 3) {
      const divider = document.createElement('div');
      divider.className = 'header-divider';
      divider.dataset.value = '4';
      menuUl.append(divider);
    }
  });

  return menu;
}

function wireMenuBehavior(menu) {
  let closeTimer = null;

  menu.querySelectorAll('.header-menu-li').forEach((l1) => {
    const panel = l1.querySelector(':scope > .header-menu-divmain');
    if (!panel) return;
    const headerdiv = l1.querySelector(':scope > .headerdiv');

    const open = () => {
      clearTimeout(closeTimer);
      closeAllMenus(menu);
      l1.classList.add('active-header-menu');
      panel.classList.remove('disp-none');
    };
    const close = () => {
      l1.classList.remove('active-header-menu');
      panel.classList.add('disp-none');
    };
    // hover-intent: delay close so moving the cursor across the gap from the
    // L1 label into the dropdown does not dismiss the panel.
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(close, 250);
    };

    l1.addEventListener('mouseenter', () => { if (isDesktop.matches) open(); });
    l1.addEventListener('mouseleave', () => { if (isDesktop.matches) scheduleClose(); });
    panel.addEventListener('mouseenter', () => { if (isDesktop.matches) clearTimeout(closeTimer); });
    panel.addEventListener('mouseleave', () => { if (isDesktop.matches) scheduleClose(); });

    headerdiv.addEventListener('click', () => {
      const isOpen = l1.classList.contains('active-header-menu');
      if (isDesktop.matches) {
        if (isOpen) close(); else open();
      } else {
        // mobile: pill-tab behaviour — one panel open at a time, always one active
        open();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !e.target.closest('.header-menu-li')) closeAllMenus(menu);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeAllMenus(menu);
  });
}

function buildSearch() {
  const search = document.createElement('div');
  search.className = 'header-search';
  search.innerHTML = `
    <button type="button" class="header-search-toggle" aria-label="Search" aria-expanded="false">
      ${SEARCH_SVG}
    </button>
    <form class="header-search-form" role="search" action="https://www.kotak.bank.in/en/search.html">
      <input type="search" name="q" placeholder="Search" aria-label="Search">
    </form>`;
  const toggle = search.querySelector('.header-search-toggle');
  const form = search.querySelector('.header-search-form');
  const input = search.querySelector('input');
  toggle.addEventListener('click', () => {
    const open = search.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) input.focus();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search')) {
      search.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  form.addEventListener('submit', (e) => {
    if (!input.value.trim()) e.preventDefault();
  });
  return search;
}

function toggleMobileMenu(menu, hamburger, force) {
  const root = menu.closest('.header-container');
  const open = force !== undefined ? force : !root.classList.contains('nav-open');
  root.classList.toggle('nav-open', open);
  document.body.style.overflowY = open ? 'hidden' : '';
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    hamburger.innerHTML = open ? CLOSE_SVG : HAMBURGER_SVG;
  }
  if (!open) {
    closeAllMenus(menu);
  } else if (!isDesktop.matches) {
    closeAllMenus(menu);
    const first = menu.querySelector('.header-menu-li');
    if (first) {
      first.classList.add('active-header-menu');
      const panel = first.querySelector(':scope > .header-menu-divmain');
      if (panel) panel.classList.remove('disp-none');
    }
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

  const container = document.createElement('div');
  container.className = 'header-container';
  const row = document.createElement('div');
  row.className = 'header-row';
  container.append(row);

  const sections = fragment ? [...fragment.children] : [];
  const [brandSec, navSec, toolsSec] = sections;

  // Brand
  const brand = document.createElement('div');
  brand.className = 'header-menulogo-container';
  const logo = document.createElement('div');
  logo.className = 'header-logo';
  if (brandSec) {
    const logoLink = brandSec.querySelector('a');
    if (logoLink) logo.append(logoLink);
  }
  brand.append(logo);

  // Menu (megamenu) in live-site structure
  let menu = document.createElement('div');
  menu.className = 'header-menu';
  if (navSec) {
    const built = buildHeaderMenu(navSec);
    if (built) menu = built;
  }

  // Login + search tools
  const tools = document.createElement('div');
  tools.className = 'header-login-container';
  tools.append(buildSearch());
  if (toolsSec) {
    const loginLink = toolsSec.querySelector('a');
    if (loginLink) {
      const login = document.createElement('div');
      login.className = 'header-login';
      const icon = loginLink.querySelector('picture, img');
      if (icon) {
        const iconSpan = document.createElement('span');
        iconSpan.className = 'header-loginicon';
        iconSpan.append(icon);
        login.append(iconSpan);
      }
      const labelLink = document.createElement('a');
      if (loginLink.getAttribute('href')) labelLink.href = loginLink.getAttribute('href');
      labelLink.textContent = loginLink.textContent.trim() || 'Login';
      login.append(labelLink);
      tools.append(login);
    }
  }

  // Hamburger (mobile)
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'header-hamburger';
  hamburger.setAttribute('aria-controls', 'header-menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML = HAMBURGER_SVG;
  hamburger.addEventListener('click', () => toggleMobileMenu(menu, hamburger));

  row.append(brand, menu, tools, hamburger);

  wireMenuBehavior(menu);

  isDesktop.addEventListener('change', () => {
    toggleMobileMenu(menu, hamburger, false);
    closeAllMenus(menu);
    document.body.style.overflowY = '';
  });

  block.append(container);
}
