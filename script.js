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
