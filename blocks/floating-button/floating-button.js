export default function decorate(block) {
  const label = block.textContent.trim() || 'Ask Kotak';
  block.textContent = '';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'floating-button-btn';
  button.innerHTML = `<span class="floating-button-dot" aria-hidden="true"></span><span class="floating-button-label">${label}</span>`;

  block.append(button);
}
