const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a[href^="#"]');

// Header background change on scroll
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Mobile menu toggle
menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  menuButton.classList.toggle('is-open', isOpen);
  menuButton.setAttribute('aria-expanded', isOpen.toString());
});

// Close mobile menu on link click
links.forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('is-open');
  menuButton.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// Highlight active section in nav
const sections = document.querySelectorAll('main section[id], footer[id]');
const activeNavigation = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach(section => activeNavigation.observe(section));

// Scroll reveal animations
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

// Dynamic footer copyright year
const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Main DOM Loaded logic
document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. PHOTO/VIDEO SLIDER CAROUSEL LOGIC ---
  const sliders = document.querySelectorAll('.project-photo-container');

  sliders.forEach(slider => {
    const images = slider.querySelectorAll('.project-photo');
    const prevBtn = slider.querySelector('.photo-nav.prev');
    const nextBtn = slider.querySelector('.photo-nav.next');

    // If there is only 1 media item (or 0), hide arrow buttons
    if (images.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    let currentIndex = 0;

    function updateSlide(index) {
      images.forEach(img => {
        img.classList.remove('active');
        // Pause playing video when sliding to another item
        if (img.tagName === 'VIDEO') {
          img.pause();
        }
      });
      images[index].classList.add('active');
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents opening the lightbox when clicking arrows
        currentIndex = (currentIndex + 1) % images.length;
        updateSlide(currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevents opening the lightbox when clicking arrows
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateSlide(currentIndex);
      });
    }
  });


  // --- 2. MEDIA LIGHTBOX LOGIC (ENLARGE ON CLICK) ---
  const lightbox = document.getElementById('media-lightbox');
  
  if (lightbox) {
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.close-lightbox');

    // Open enlarged view when clicking any photo or video
    document.querySelectorAll('.project-photo').forEach(media => {
      media.addEventListener('click', () => {
        lightboxContent.innerHTML = ''; // Clear previous content

        if (media.tagName === 'IMG') {
          const img = document.createElement('img');
          img.src = media.src;
          img.alt = media.alt || 'Enlarged project photo';
          lightboxContent.appendChild(img);
        } else if (media.tagName === 'VIDEO') {
          const video = document.createElement('video');
          video.src = media.src;
          video.controls = true;
          video.autoplay = true;
          lightboxContent.appendChild(video);
        }

        lightbox.classList.add('active');
      });
    });

    // Close lightbox handler
    const closeLightboxModal = () => {
      lightbox.classList.remove('active');
      lightboxContent.innerHTML = ''; // Stops audio/video playback on close
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightboxModal);
    }

    // Close on clicking backdrop
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightboxModal();
      }
    });

    // Close on pressing 'Escape' key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightboxModal();
      }
    });
  }
});
