import { getMetadata } from '../../scripts/aem.js';

/**
 * Standalone footer used only by the standalone-homepage.
 * Loads its content from a fragment path (default /standalone-footer) so it can
 * be authored independently of the main site footer.
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

export default async function decorate(block) {
  const footerMeta = getMetadata('footer-content');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/standalone-footer';
  const frag = await fetchFooter(footerPath);

  block.textContent = '';

  const inner = document.createElement('div');
  inner.className = 'footer-4-inner';

  if (frag) {
    while (frag.firstElementChild) inner.append(frag.firstElementChild);
  }

  block.append(inner);
}
