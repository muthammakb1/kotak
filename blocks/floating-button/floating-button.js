const OPTIONS = ['Find a credit card', 'Check loan eligibility', 'Talk to a person'];

const RECOMMENDATIONS = {
  'Find a credit card': {
    reason: 'Based on everyday urban spending, the Kotak League Card gives you the strongest rewards rate with a low joining fee.',
    title: 'Kotak League Credit Card',
    cta: 'Apply Now',
    href: 'https://www.kotak.bank.in/en/personal-banking/cards/credit-cards.html',
  },
  'Check loan eligibility': {
    reason: 'For a salaried profile, you’re likely eligible for a personal loan up to ₹18,00,000 at 10.5% p.a. Want a precise quote?',
    title: 'Personal Loan · pre-eligible',
    cta: 'Check my offer',
    href: 'https://www.kotak.bank.in/en/personal-banking/loans/personal-loan.html',
  },
  'Talk to a person': {
    reason: 'Connecting you to a banking specialist. Average wait time is under 40 seconds — your chat history travels with you.',
    title: 'Talk to a specialist',
    cta: 'Start secure chat',
    href: 'https://www.kotak.bank.in/en/help-center.html',
  },
};

function buildRecommendation(data) {
  const wrap = document.createElement('div');
  wrap.className = 'floating-button-panel-rec';

  const reason = document.createElement('p');
  reason.className = 'floating-button-panel-rec-reason';
  reason.textContent = data.reason;

  const card = document.createElement('div');
  card.className = 'floating-button-panel-rec-card';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'floating-button-panel-rec-eyebrow';
  eyebrow.textContent = 'Recommended';
  const title = document.createElement('p');
  title.className = 'floating-button-panel-rec-title';
  title.textContent = data.title;
  const cta = document.createElement('a');
  cta.className = 'floating-button-panel-rec-cta';
  cta.href = data.href;
  cta.textContent = data.cta;
  card.append(eyebrow, title, cta);

  wrap.append(reason, card);
  return wrap;
}

function buildPanel() {
  const panel = document.createElement('div');
  panel.className = 'floating-button-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Kotak Assistant');
  panel.hidden = true;

  const header = document.createElement('div');
  header.className = 'floating-button-panel-header';

  const titleWrap = document.createElement('div');
  titleWrap.innerHTML = `
    <p class="floating-button-panel-title">Kotak Assistant</p>
    <p class="floating-button-panel-subtitle">
      <span class="floating-button-panel-dot" aria-hidden="true"></span>
      <span>AI · Human handoff ready</span>
    </p>`;

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'floating-button-panel-close';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
  header.append(titleWrap, close);

  const body = document.createElement('div');
  body.className = 'floating-button-panel-body';

  const greeting = document.createElement('p');
  greeting.className = 'floating-button-panel-greeting';
  greeting.textContent = 'Hi — what can I help you with today? Ask anything, or pick up where you left off.';
  body.append(greeting);

  const list = document.createElement('div');
  list.className = 'floating-button-panel-options';
  OPTIONS.forEach((label) => {
    const opt = document.createElement('button');
    opt.type = 'button';
    opt.className = 'floating-button-panel-option';
    opt.textContent = label;
    const data = RECOMMENDATIONS[label];
    if (data) {
      opt.addEventListener('click', () => {
        if (body.querySelector(`[data-rec="${label}"]`)) return;
        const rec = buildRecommendation(data);
        rec.dataset.rec = label;
        body.append(rec);
        rec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
    list.append(opt);
  });
  body.append(list);

  const footer = document.createElement('div');
  footer.className = 'floating-button-panel-footer';
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'floating-button-panel-input';
  input.placeholder = 'Ask anything…';
  const send = document.createElement('button');
  send.type = 'button';
  send.className = 'floating-button-panel-send';
  send.setAttribute('aria-label', 'Send');
  send.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>';
  footer.append(input, send);

  panel.append(header, body, footer);
  return { panel, close };
}

export default function decorate(block) {
  const label = block.textContent.trim() || 'Ask Kotak';
  block.textContent = '';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'floating-button-btn';
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = `<span class="floating-button-dot" aria-hidden="true"></span><span class="floating-button-label">${label}</span>`;

  const { panel, close } = buildPanel();

  const setOpen = (open) => {
    panel.hidden = !open;
    button.hidden = open;
    button.setAttribute('aria-expanded', String(open));
  };

  button.addEventListener('click', () => setOpen(true));
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  block.append(button, panel);
}
