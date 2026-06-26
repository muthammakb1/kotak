import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const DAM = 'https://www.kotak.bank.in/content/dam/Kotak';

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M13 22v-9h3l.5-3.5H13V7.3c0-1 .3-1.7 1.8-1.7H17V2.5c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.6H7V13h3v9z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M18 2h3l-7 8 8.5 12H16l-5-6.5L5 22H2l7.5-8.5L1 2h6.5L12 8zm-1 18h1.5L7 4H5.5z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M23 12s0-3.2-.4-4.7c-.2-.9-.9-1.5-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4c-.8.2-1.5.8-1.7 1.7C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.7 1.7 1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4c.8-.2 1.5-.8 1.7-1.7C23 15.2 23 12 23 12zM9.7 15.3V8.7l5.7 3.3z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zm6 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9z"/></svg>',
};

/* "Connect With Us" band shown just above the copyright bar:
   social links, app store badges, trust seals and a group-companies toggle. */
function buildConnectBand() {
  const band = document.createElement('div');
  band.className = 'footer-band';

  const connect = document.createElement('div');
  connect.className = 'footer-band-connect';
  connect.innerHTML = '<p class="footer-band-title">Connect With Us</p>';
  const social = document.createElement('div');
  social.className = 'footer-band-social';
  [
    ['facebook', 'https://www.facebook.com/KotakBank/'],
    ['twitter', 'https://twitter.com/kotakbankltd'],
    ['youtube', 'https://www.youtube.com/user/KotakBankIndia'],
    ['linkedin', 'https://www.linkedin.com/company/kotak-mahindra-bank'],
  ].forEach(([key, href]) => {
    const a = document.createElement('a');
    a.className = 'footer-band-social-link';
    a.href = href;
    a.setAttribute('aria-label', key);
    a.innerHTML = SOCIAL_ICONS[key];
    social.append(a);
  });
  connect.append(social);
  band.append(connect);

  const apps = document.createElement('div');
  apps.className = 'footer-band-apps';
  apps.innerHTML = '<p class="footer-band-title">Install the Kotak Bank App</p>';
  const badges = document.createElement('div');
  badges.className = 'footer-band-badges';
  [
    ['Google Play', `${DAM}/google-play.png`, 'https://kotakapp.onelink.me/Xoqo/rt3ds5c3'],
    ['App Store', `${DAM}/apple-store.png`, 'https://kotakapp.onelink.me/Xoqo/rt3ds5c3'],
  ].forEach(([name, src, href]) => {
    const a = document.createElement('a');
    a.className = 'footer-band-badge';
    a.href = href;
    a.setAttribute('aria-label', name);
    const img = document.createElement('img');
    img.src = src;
    img.alt = name;
    img.loading = 'lazy';
    a.append(img);
    badges.append(a);
  });
  apps.append(badges);
  band.append(apps);

  const seals = document.createElement('div');
  seals.className = 'footer-band-seals';
  [
    ['Entrust Secured', `${DAM}/entrust.png`],
    ['VeriSign', `${DAM}/verisign.png`],
  ].forEach(([alt, src]) => {
    const img = document.createElement('img');
    img.className = 'footer-band-seal';
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    seals.append(img);
  });
  band.append(seals);

  const group = document.createElement('div');
  group.className = 'footer-band-group';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'footer-band-group-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span>Kotak Group Companies</span><span class="footer-band-group-caret" aria-hidden="true">▾</span>';
  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
  });
  group.append(toggle);
  band.append(group);

  return band;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // insert the connect band just above the copyright bar (footer-3 section)
  const band = buildConnectBand();
  const copyright = footer.querySelector('.footer-3');
  // walk up to the copyright element's ancestor that is a direct child of footer
  let anchor = copyright;
  while (anchor && anchor.parentElement !== footer) anchor = anchor.parentElement;
  if (anchor) {
    footer.insertBefore(band, anchor);
  } else {
    footer.append(band);
  }

  block.append(footer);
}
