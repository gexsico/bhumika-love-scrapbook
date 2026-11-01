const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('.reason').forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
  });
});

const surpriseButton = document.querySelector('#surprise');
const surpriseMessage = document.querySelector('#surprise-message');
surpriseButton.addEventListener('click', () => {
  surpriseMessage.classList.toggle('show');
  surpriseButton.setAttribute('aria-expanded', String(surpriseMessage.classList.contains('show')));
  surpriseButton.firstChild.textContent = surpriseMessage.classList.contains('show')
    ? 'read it again '
    : 'one last little thing ';
});

const tulipCursor = document.querySelector('.tulip-cursor');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let lastTrailPoint = null;
let lastTrailTime = 0;
let liveBlossoms = 0;

function scatterBlossom(x, y, speed) {
  if (liveBlossoms >= 36) return;
  const flower = document.createElement('span');
  flower.className = 'blossom';
  flower.setAttribute('aria-hidden', 'true');
  flower.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 10C8 8 8 4 12 2c4 2 4 6 0 8Z"/><path d="M12 10C8 8 8 4 12 2c4 2 4 6 0 8Z" transform="rotate(72 12 12)"/><path d="M12 10C8 8 8 4 12 2c4 2 4 6 0 8Z" transform="rotate(144 12 12)"/><path d="M12 10C8 8 8 4 12 2c4 2 4 6 0 8Z" transform="rotate(216 12 12)"/><path d="M12 10C8 8 8 4 12 2c4 2 4 6 0 8Z" transform="rotate(288 12 12)"/><circle cx="12" cy="12" r="1.7"/></svg>';
  const driftX = Math.round((Math.random() - 0.5) * (75 + speed * 7));
  const driftY = Math.round(-22 - Math.random() * (60 + speed * 3));
  const life = 1150 + Math.random() * 550;
  const size = 10 + Math.random() * 11;
  flower.style.left = `${x + (Math.random() - 0.5) * 12}px`;
  flower.style.top = `${y + (Math.random() - 0.5) * 12}px`;
  flower.style.width = `${size}px`;
  flower.style.height = `${size}px`;
  flower.style.setProperty('--petal', ['#ed9bb8', '#f3afc6', '#e77eaa', '#f6bfd0'][Math.floor(Math.random() * 4)]);
  flower.style.setProperty('--drift-x', `${driftX}px`);
  flower.style.setProperty('--drift-y', `${driftY}px`);
  flower.style.setProperty('--spin', `${Math.random() > 0.5 ? '' : '-'}${80 + Math.random() * 220}deg`);
  flower.style.setProperty('--life', `${life}ms`);
  document.body.appendChild(flower);
  liveBlossoms += 1;
  window.setTimeout(() => {
    flower.remove();
    liveBlossoms = Math.max(0, liveBlossoms - 1);
  }, life + 80);
}

const heroTitle = document.querySelector('#hero-title');
const heroName = document.querySelector('.hero-name');
const heroNoteToggle = document.querySelector('#hero-note-toggle');
const heroNote = document.querySelector('#hero-note');

function releaseHeroPetals() {
  if (reduceMotion.matches) return;
  const bounds = heroName.getBoundingClientRect();
  const centerX = bounds.left + bounds.width * 0.55;
  const centerY = bounds.top + bounds.height * 0.55;
  for (let index = 0; index < 7; index += 1) {
    window.setTimeout(() => {
      scatterBlossom(centerX + (Math.random() - 0.5) * 58, centerY + (Math.random() - 0.5) * 28, 4);
    }, index * 70);
  }
}

heroNoteToggle.addEventListener('click', () => {
  const isOpen = heroNoteToggle.getAttribute('aria-expanded') === 'true';
  heroNoteToggle.setAttribute('aria-expanded', String(!isOpen));
  heroNote.setAttribute('aria-hidden', String(isOpen));
  heroNote.classList.toggle('is-open', !isOpen);
  heroNoteToggle.querySelector('.note-toggle-label').textContent = isOpen ? 'open a little note' : 'close this little note';
});

heroTitle.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'touch' || !finePointer.matches) return;
  heroTitle.classList.add('is-blooming');
  releaseHeroPetals();
});
heroTitle.addEventListener('pointerleave', () => heroTitle.classList.remove('is-blooming'));

window.setTimeout(releaseHeroPetals, 1650);

if (finePointer.matches) {
  document.body.classList.add('tulip-active');

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    tulipCursor.classList.add('is-visible');
    const now = performance.now();
    const dx = lastTrailPoint ? event.clientX - lastTrailPoint.x : 0;
    const dy = lastTrailPoint ? event.clientY - lastTrailPoint.y : 0;
    const distance = Math.hypot(dx, dy);
    const speed = Math.min(10, distance / Math.max(12, now - lastTrailTime) * 10);
    const tilt = Math.max(-18, Math.min(18, dx * 0.28));

    tulipCursor.style.transform = `translate(${event.clientX - 16}px, ${event.clientY - 40}px) rotate(${tilt}deg)`;

    if (!reduceMotion.matches && distance > 10 && now - lastTrailTime > 24) {
      scatterBlossom(event.clientX - dx * 0.12, event.clientY - dy * 0.12, speed);
      if (speed > 5 && Math.random() > 0.35) {
        scatterBlossom(event.clientX - dx * 0.28, event.clientY - dy * 0.28, speed);
      }
      lastTrailPoint = { x: event.clientX, y: event.clientY };
      lastTrailTime = now;
    } else if (!lastTrailPoint) {
      lastTrailPoint = { x: event.clientX, y: event.clientY };
      lastTrailTime = now;
    }
  }, { passive: true });

  window.addEventListener('pointerdown', () => tulipCursor.classList.add('is-blooming'));
  window.addEventListener('pointerup', () => tulipCursor.classList.remove('is-blooming'));
  document.documentElement.addEventListener('mouseleave', () => tulipCursor.classList.remove('is-visible'));
  document.documentElement.addEventListener('mouseenter', () => {
    if (lastTrailPoint) tulipCursor.classList.add('is-visible');
  });
}
