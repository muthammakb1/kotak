const ARROW_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
  <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
  <path d="M8 14l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;

export default function decorate(block) {
  const label = block.textContent.trim() || 'Back to Top';
  block.textContent = '';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'back-to-top-button';
  button.innerHTML = `<span class="back-to-top-label">${label}</span><span class="back-to-top-icon">${ARROW_SVG}</span>`;

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  block.append(button);
}
