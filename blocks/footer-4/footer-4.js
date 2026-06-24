import { getMetadata } from '../../scripts/aem.js';

/**
 * Standalone footer used only by the standalone-homepage. Content is authored in
 * a fragment (default /standalone-footer) as keyword-keyed rows:
 *   brand      | <logo img> | <social links> | <app links>
 *   column     | <heading>  | <links>
 *   popular    | <heading>  | <links>          (inline wrap row)
 *   groups     | <heading>  | <links>          (inline wrap row)
 *   disclaimer | <rich text>
 *   legal      | <copyright text> | <links>
 */
async function fetchFooter(footerPath) {
  let resp = await fetch('/content/standalone-footer.plain.html');
  if (!resp.ok) resp = await fetch(`${footerPath}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M13 22v-9h3l.5-3.5H13V7.3c0-1 .3-1.7 1.8-1.7H17V2.5c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.6H7V13h3v9z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M18 2h3l-7 8 8.5 12H16l-5-6.5L5 22H2l7.5-8.5L1 2h6.5L12 8zm-1 18h1.5L7 4H5.5z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M23 12s0-3.2-.4-4.7c-.2-.9-.9-1.5-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4c-.8.2-1.5.8-1.7 1.7C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4c.8-.2 1.5-.8 1.7-1.7C23 15.2 23 12 23 12zM9.7 15.3V8.7l5.7 3.3z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zm6 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg>',
};

function socialKey(href = '') {
  if (/facebook/i.test(href)) return 'facebook';
  if (/twitter|x\.com/i.test(href)) return 'twitter';
  if (/youtube/i.test(href)) return 'youtube';
  if (/linkedin/i.test(href)) return 'linkedin';
  return null;
}

function buildLinkList(cell, className) {
  const ul = document.createElement('ul');
  ul.className = className;
  cell.querySelectorAll('a').forEach((a) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    li.append(link);
    ul.append(li);
  });
  return ul;
}

function buildBrandRow(cells) {
  const row = document.createElement('div');
  row.className = 'footer-4-top';

  const brand = document.createElement('a');
  brand.className = 'footer-4-logo';
  brand.href = '/';
  const img = cells[1] && cells[1].querySelector('img');
  if (img) {
    const el = document.createElement('img');
    el.src = img.getAttribute('src');
    el.alt = img.getAttribute('alt') || 'Kotak Mahindra Bank';
    brand.append(el);
  }
  row.append(brand);

  const connect = document.createElement('div');
  connect.className = 'footer-4-connect';
  const label = document.createElement('span');
  label.className = 'footer-4-connect-label';
  label.textContent = 'CONNECT';
  connect.append(label);

  if (cells[2]) {
    const social = document.createElement('div');
    social.className = 'footer-4-social';
    cells[2].querySelectorAll('a').forEach((a) => {
      const href = a.getAttribute('href');
      const key = socialKey(href);
      const link = document.createElement('a');
      link.href = href;
      link.className = 'footer-4-social-link';
      link.setAttribute('aria-label', a.textContent.trim() || key || 'social');
      link.innerHTML = key ? SOCIAL_ICONS[key] : a.textContent.trim();
      social.append(link);
    });
    connect.append(social);
  }

  if (cells[3]) {
    const apps = document.createElement('div');
    apps.className = 'footer-4-apps';
    cells[3].querySelectorAll('a').forEach((a) => {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.className = 'footer-4-app';
      link.textContent = a.textContent.trim();
      apps.append(link);
    });
    connect.append(apps);
  }

  row.append(connect);
  return row;
}

function buildColumn(cells) {
  const col = document.createElement('div');
  col.className = 'footer-4-col';
  const h = document.createElement('h3');
  h.className = 'footer-4-col-title';
  h.textContent = cells[1] ? cells[1].textContent.trim() : '';
  col.append(h);
  if (cells[2]) col.append(buildLinkList(cells[2], 'footer-4-col-links'));
  return col;
}

function buildInlineRow(cells, modifier) {
  const section = document.createElement('div');
  section.className = `footer-4-inline footer-4-${modifier}`;
  const h = document.createElement('h3');
  h.className = 'footer-4-inline-title';
  h.textContent = cells[1] ? cells[1].textContent.trim() : '';
  section.append(h);
  if (cells[2]) section.append(buildLinkList(cells[2], 'footer-4-inline-links'));
  return section;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer-content');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/standalone-footer';
  const frag = await fetchFooter(footerPath);

  block.textContent = '';
  if (!frag) return;

  const inner = document.createElement('div');
  inner.className = 'footer-4-inner';

  let columns = null;
  const flushColumns = () => {
    if (columns && columns.children.length) {
      inner.append(columns);
      columns = null;
    }
  };

  [...frag.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0] ? cells[0].textContent.trim().toLowerCase() : '';
    if (key === 'brand') {
      inner.append(buildBrandRow(cells));
    } else if (key === 'column') {
      if (!columns) {
        columns = document.createElement('div');
        columns.className = 'footer-4-columns';
      }
      columns.append(buildColumn(cells));
    } else if (key === 'popular') {
      flushColumns();
      inner.append(buildInlineRow(cells, 'popular'));
    } else if (key === 'groups') {
      inner.append(buildInlineRow(cells, 'groups'));
    } else if (key === 'disclaimer') {
      const d = document.createElement('div');
      d.className = 'footer-4-disclaimer';
      if (cells[1]) d.append(...cells[1].childNodes);
      inner.append(d);
    } else if (key === 'legal') {
      const legal = document.createElement('div');
      legal.className = 'footer-4-legal';
      const copy = document.createElement('p');
      copy.className = 'footer-4-copyright';
      copy.textContent = cells[1] ? cells[1].textContent.trim() : '';
      legal.append(copy);
      if (cells[2]) legal.append(buildLinkList(cells[2], 'footer-4-legal-links'));
      inner.append(legal);
    }
  });

  flushColumns();

  block.append(inner);
}
