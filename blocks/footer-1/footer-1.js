export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  rows.forEach((row) => {
    const cells = [...row.children];
    const heading = cells[0] ? cells[0].textContent.trim() : '';
    const linksCell = cells[1];
    if (!heading || !linksCell) return;

    const section = document.createElement('div');
    section.className = 'footer-1-section';

    const title = document.createElement('h3');
    title.className = 'footer-1-title';
    title.textContent = heading;
    section.append(title);

    const list = document.createElement('ul');
    list.className = 'footer-1-links';
    linksCell.querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      li.append(link);
      list.append(li);
    });
    section.append(list);

    block.append(section);
  });
}
