// (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
//diff --git a/script.js b/script.js
//index b0627c65792cb051cc69758fd47db36c9372f741..c9a7e9a81360c5aadc42b4abd4ac0fa0d3707017 100644
//--- a/script.js
//+++ b/script.js
//@@ -1,75 +1,41 @@
-// Smooth scrolling for navigation links
-document.querySelectorAll('a[href^="#"]').forEach(anchor => {
-    anchor.addEventListener('click', function (e) {
-        e.preventDefault();
-        const target = document.querySelector(this.getAttribute('href'));
-        if (target) {
-            target.scrollIntoView({
-                behavior: 'smooth',
-                block: 'start'
-            });
-        }
-    });
+const header = document.querySelector('.site-header');
+const menuButton = document.querySelector('.menu-toggle');
+const navLinks = document.querySelector('.nav-links');
+const links = document.querySelectorAll('.nav-links a[href^="#"]');
+
+const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
+window.addEventListener('scroll', updateHeader, { passive: true });
+updateHeader();
+
+menuButton.addEventListener('click', () => {
+  const isOpen = navLinks.classList.toggle('is-open');
+  menuButton.classList.toggle('is-open', isOpen);
+  menuButton.setAttribute('aria-expanded', isOpen.toString());
 });
 
-// Add active state to navigation based on scroll position
-window.addEventListener('scroll', () => {
-    const sections = document.querySelectorAll('section[id]');
-    const navLinks = document.querySelectorAll('.nav-menu a');
-
-    let current = '';
-    sections.forEach(section => {
-        const sectionTop = section.offsetTop;
-        const sectionHeight = section.clientHeight;
-        if (window.pageYOffset >= sectionTop - 200) {
-            current = section.getAttribute('id');
-        }
-    });
-
-    navLinks.forEach(link => {
-        link.classList.remove('active');
-        if (link.getAttribute('href').slice(1) === current) {
-            link.classList.add('active');
-        }
-    });
-});
-
-// Add animation on scroll
-const observerOptions = {
-    threshold: 0.1,
-    rootMargin: '0px 0px -50px 0px'
-};
-
-const observer = new IntersectionObserver((entries) => {
-    entries.forEach(entry => {
-        if (entry.isIntersecting) {
-            entry.target.style.opacity = '1';
-            entry.target.style.transform = 'translateY(0)';
-        }
-    });
-}, observerOptions);
-
-// Observe all project cards and skill items
-document.querySelectorAll('.project-card, .skill-category').forEach(element => {
-    element.style.opacity = '0';
-    element.style.transform = 'translateY(20px)';
-    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
-    observer.observe(element);
-});
-
-// Form handling (if you add a contact form)
-const handleFormSubmit = (e) => {
-    e.preventDefault();
-    // Add your form submission logic here
-    console.log('Form submitted');
-};
-
-// Mobile menu toggle (for future mobile menu implementation)
-const mobileMenuToggle = () => {
-    const navMenu = document.querySelector('.nav-menu');
-    if (navMenu) {
-        navMenu.classList.toggle('active');
+links.forEach(link => link.addEventListener('click', () => {
+  navLinks.classList.remove('is-open');
+  menuButton.classList.remove('is-open');
+  menuButton.setAttribute('aria-expanded', 'false');
+}));
+
+const sections = document.querySelectorAll('main section[id], footer[id]');
+const activeNavigation = new IntersectionObserver(entries => {
+  entries.forEach(entry => {
+    if (!entry.isIntersecting) return;
+    links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
+  });
+}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
+sections.forEach(section => activeNavigation.observe(section));
+
+const revealObserver = new IntersectionObserver(entries => {
+  entries.forEach(entry => {
+    if (entry.isIntersecting) {
+      entry.target.classList.add('is-visible');
+      revealObserver.unobserve(entry.target);
     }
-};
+  });
+}, { threshold: 0.12 });
+document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
 
-console.log('Portfolio website loaded successfully!');
\ No newline at end of file
+document.querySelector('#year').textContent = new Date().getFullYear();
 
EOF
)
