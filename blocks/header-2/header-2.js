import { getMetadata } from '../../scripts/aem.js';

/**
 * Standalone header used only by the standalone-homepage.
 * Loads its content from a fragment path (default /standalone-nav) so it can be
 * authored independently of the main site header.
 */
async function fetchNav(navPath) {
  let resp = await fetch('/content/standalone-nav.plain.html');
  if (!resp.ok) resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return null;
  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/standalone-nav';
  const frag = await fetchNav(navPath);

  block.textContent = '';

  const inner = document.createElement('div');
  inner.className = 'header-2-inner';

  // brand: first link/image in the fragment, or a text fallback
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

  // primary nav links: all anchors in the first <ul> of the fragment
  const list = frag && frag.querySelector('ul');
  if (list) {
    const nav = document.createElement('nav');
    nav.className = 'header-2-nav';
    const ul = document.createElement('ul');
    list.querySelectorAll(':scope > li').forEach((li) => {
      const a = li.querySelector('a');
      if (!a) return;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      item.append(link);
      ul.append(item);
    });
    nav.append(ul);
    inner.append(nav);
  }

  block.append(inner);
}
