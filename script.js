const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a[href^="#"]');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  menuButton.classList.toggle('is-open', isOpen);
  menuButton.setAttribute('aria-expanded', isOpen.toString());
});

links.forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('is-open');
  menuButton.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const sections = document.querySelectorAll('main section[id], footer[id]');
const activeNavigation = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => activeNavigation.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

document.querySelector('#year').textContent = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', () => {
  // Find all photo containers on the page
  const sliders = document.querySelectorAll('.project-photo-container');

  sliders.forEach(slider => {
    const images = slider.querySelectorAll('.project-photo');
    const prevBtn = slider.querySelector('.photo-nav.prev');
    const nextBtn = slider.querySelector('.photo-nav.next');

    // If there is only 1 photo (or 0), hide the arrow buttons
    if (images.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    let currentIndex = 0;

    function updateSlide(index) {
      images.forEach(img => img.classList.remove('active'));
      images[index].classList.add('active');
    }

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      updateSlide(currentIndex);
    });

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateSlide(currentIndex);
    });
  });
});
