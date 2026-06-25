/**
 * Authoring: one row per card.
 *   <image> | <title> | <link>
 */
export default function decorate(block) {
  const rows = [...block.children];

  const grid = document.createElement('div');
  grid.className = 'cards-list-grid';

  rows.forEach((row) => {
    const cells = [...row.children];
    const img = cells[0] ? cells[0].querySelector('img') : null;
    const title = cells[1] ? cells[1].textContent.trim() : '';
    const linkCell = cells[2];
    let href = '#';
    if (linkCell) {
      const a = linkCell.querySelector('a');
      href = a ? a.getAttribute('href') : linkCell.textContent.trim() || '#';
    }
    if (!img && !title) return;

    const card = document.createElement('a');
    card.className = 'cards-list-card';
    card.href = href;

    if (img) {
      const media = document.createElement('div');
      media.className = 'cards-list-media';
      const picture = document.createElement('img');
      picture.src = img.getAttribute('src');
      picture.alt = title || img.getAttribute('alt') || '';
      picture.loading = 'lazy';
      media.append(picture);
      card.append(media);
    }

    if (title) {
      const caption = document.createElement('p');
      caption.className = 'cards-list-title';
      caption.textContent = title;
      card.append(caption);
    }

    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}
