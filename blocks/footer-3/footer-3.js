export default function decorate(block) {
  const rows = [...block.children];
  const cells = rows[0] ? [...rows[0].children] : [];
  const copyright = cells[0] ? cells[0].textContent.trim() : '';
  const linksCell = cells[1];

  block.textContent = '';

  const bar = document.createElement('div');
  bar.className = 'footer-3-bar';

  if (copyright) {
    const text = document.createElement('span');
    text.className = 'footer-3-copyright';
    text.textContent = copyright;
    bar.append(text);
  }

  if (linksCell && linksCell.querySelector('a')) {
    const list = document.createElement('ul');
    list.className = 'footer-3-links';
    linksCell.querySelectorAll('a').forEach((a) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      link.textContent = a.textContent.trim();
      li.append(link);
      list.append(li);
    });
    bar.append(list);
  }

  block.append(bar);
}
