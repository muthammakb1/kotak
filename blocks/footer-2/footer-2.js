export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  const columns = document.createElement('div');
  columns.className = 'footer-2-columns';

  rows.forEach((row) => {
    const cells = [...row.children];
    const headingCell = cells[0];
    const linksCell = cells[1];
    if (!headingCell) return;

    const section = document.createElement('div');
    section.className = 'footer-2-section';

    const headingLink = headingCell.querySelector('a');
    const heading = document.createElement(headingLink ? 'a' : 'h3');
    heading.className = 'footer-2-heading';
    if (headingLink) heading.href = headingLink.getAttribute('href');
    heading.textContent = headingCell.textContent.trim();
    section.append(heading);

    if (linksCell && linksCell.querySelector('a')) {
      const list = document.createElement('ul');
      list.className = 'footer-2-links';
      linksCell.querySelectorAll('a').forEach((a) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = a.textContent.trim();
        li.append(link);
        list.append(li);
      });
      section.append(list);
    }

    columns.append(section);
  });

  block.append(columns);
}
