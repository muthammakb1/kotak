/**
 * Horizontal page-navigation tab strip (Kotak "search-tabs-box" style).
 *
 * Authoring: one row per tab.
 *   <label> | <link>
 * The link cell may hold an <a> or a plain URL. The tab whose href resolves to
 * the current page is marked active. Tabs that don't fit on one line collapse
 * into a "More" dropdown.
 */
function normalize(path) {
  return path
    .replace(/^\/content/, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '');
}

function currentPath() {
  return normalize(window.location.pathname);
}

function hrefPath(href) {
  try {
    return normalize(new URL(href, window.location.origin).pathname);
  } catch (e) {
    return href;
  }
}

export default function decorate(block) {
  const rows = [...block.children];
  const here = currentPath();

  const nav = document.createElement('nav');
  nav.className = 'page-tabs-nav';
  nav.setAttribute('aria-label', 'Page sections');

  const list = document.createElement('ul');
  list.className = 'page-tabs-list';

  rows.forEach((row) => {
    const cells = [...row.children];
    const label = cells[0] ? cells[0].textContent.trim() : '';
    const linkCell = cells[1];
    if (!label) return;

    let href = '#';
    if (linkCell) {
      const a = linkCell.querySelector('a');
      href = a ? a.getAttribute('href') : linkCell.textContent.trim() || '#';
    }

    const item = document.createElement('li');
    item.className = 'page-tabs-item';

    const link = document.createElement('a');
    link.className = 'page-tabs-link';
    link.href = href;
    link.textContent = label;
    if (hrefPath(href) === here) {
      link.classList.add('page-tabs-link-active');
      link.setAttribute('aria-current', 'page');
    }

    item.append(link);
    list.append(item);
  });

  // "More" dropdown for overflow tabs
  const more = document.createElement('li');
  more.className = 'page-tabs-item page-tabs-more';
  more.hidden = true;
  const moreBtn = document.createElement('button');
  moreBtn.type = 'button';
  moreBtn.className = 'page-tabs-more-btn';
  moreBtn.setAttribute('aria-expanded', 'false');
  moreBtn.innerHTML = 'More <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
  const moreMenu = document.createElement('ul');
  moreMenu.className = 'page-tabs-more-menu';
  more.append(moreBtn, moreMenu);
  list.append(more);

  // Apply Now button — revealed only when the strip is stuck to the header
  const apply = document.createElement('a');
  apply.className = 'page-tabs-apply';
  apply.href = 'https://onboarding.kotak.com/pl?utm_source=website&utm_medium=Apply_now&utm_campaign=Loans_page';
  apply.textContent = 'Apply Now';
  const applyItem = document.createElement('li');
  applyItem.className = 'page-tabs-item page-tabs-apply-item';
  applyItem.append(apply);
  list.append(applyItem);

  nav.append(list);
  block.textContent = '';
  block.append(nav);

  const items = [...list.querySelectorAll('.page-tabs-item:not(.page-tabs-more):not(.page-tabs-apply-item)')];

  // tabs from this index onward collapse into the "More" dropdown
  const VISIBLE = 7;

  const layout = () => {
    // reset: everything back in the main row
    items.forEach((it) => {
      it.hidden = false;
      list.insertBefore(it, more);
    });
    moreMenu.textContent = '';
    more.hidden = true;

    const overflow = items.slice(VISIBLE);
    if (overflow.length) {
      more.hidden = false;
      overflow.forEach((it) => {
        it.hidden = true;
        const clone = it.querySelector('.page-tabs-link').cloneNode(true);
        clone.classList.remove('page-tabs-link');
        clone.classList.add('page-tabs-more-link');
        const li = document.createElement('li');
        li.append(clone);
        moreMenu.append(li);
      });
    }
  };

  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = more.classList.toggle('page-tabs-more-open');
    moreBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', () => {
    more.classList.remove('page-tabs-more-open');
    moreBtn.setAttribute('aria-expanded', 'false');
  });

  layout();
  let raf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(layout);
  });
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => layout()).observe(list);
  }

  // toggle "stuck" state (reveals the Apply Now button) while the strip is
  // pinned below the header — detected with a zero-height sentinel above it.
  const section = block.closest('.section') || block;
  const sentinel = document.createElement('div');
  sentinel.className = 'page-tabs-sentinel';
  section.parentElement.insertBefore(sentinel, section);
  if (typeof IntersectionObserver !== 'undefined') {
    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
      10,
    ) || 64;
    const io = new IntersectionObserver(
      ([entry]) => {
        block.classList.toggle('page-tabs-stuck', !entry.isIntersecting);
      },
      { rootMargin: `-${navHeight + 1}px 0px 0px 0px`, threshold: 0 },
    );
    io.observe(sentinel);
  }
}
