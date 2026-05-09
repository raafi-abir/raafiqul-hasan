// Resolved: one-page interaction source of truth
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
const mobileNav = document.getElementById('mobile-nav');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const typedTextElement = document.getElementById('typed-text');
const html = document.documentElement;
const body = document.body;
const header = document.querySelector('.site-header');

const skills = [
  'Python (beginner)', 'C Programming (beginner)', 'Linux System Configuration',
  'Circuit Analysis', 'Laplace Transform', 'Semiconductor Devices', "Ohm's Law & KVL", 'Mathematical Modeling'
];

let currentSkillIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typedTextElement) return;
  const currentSkill = skills[currentSkillIndex];
  typedTextElement.textContent = isDeleting
    ? currentSkill.substring(0, currentCharIndex - 1)
    : currentSkill.substring(0, currentCharIndex + 1);
  currentCharIndex += isDeleting ? -1 : 1;

  if (!isDeleting && currentCharIndex === currentSkill.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1800);
  } else if (isDeleting && currentCharIndex === 0) {
    isDeleting = false;
    currentSkillIndex = (currentSkillIndex + 1) % skills.length;
    setTimeout(typeEffect, 450);
  } else {
    setTimeout(typeEffect, isDeleting ? 45 : 95);
  }
}

function setTheme(theme) {
  html.classList.remove('dark-mode', 'light-mode');
  body.classList.remove('dark-mode', 'light-mode');
  html.classList.add(`${theme}-mode`);
  body.classList.add(`${theme}-mode`);
  html.setAttribute('data-theme', theme);
  if (sunIcon && moonIcon) {
    sunIcon.style.display = theme === 'dark' ? 'none' : 'block';
    moonIcon.style.display = theme === 'dark' ? 'block' : 'none';
  }
  localStorage.setItem('theme', theme);
}

function initTheme() {
  setTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
  if (!themeToggle) return;
  themeToggle.addEventListener('click', () => {
    setTheme(html.classList.contains('dark-mode') ? 'light' : 'dark');
  });
}

function initMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('hidden');
  });
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileNav.classList.add('hidden');
    });
  });
  document.addEventListener('click', (e) => {
    if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target) && !mobileNav.classList.contains('hidden')) {
      menuToggle.classList.remove('active');
      mobileNav.classList.add('hidden');
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('#main-nav a[href^="#"], #mobile-nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = targetId ? document.querySelector(targetId) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function initScrollEffects() {
  const animated = document.querySelectorAll('.reveal, .project-card');
  if (!animated.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -12% 0px' });
  animated.forEach((el) => observer.observe(el));

  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('#main-nav a[href^="#"], #mobile-nav a[href^="#"]'));
  const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;

  const activate = (id) => {
    links.forEach((l) => {
      const on = l.getAttribute('href') === `#${id}`;
      l.classList.toggle('active', on);
      if (on) l.setAttribute('aria-current', 'page');
      else l.removeAttribute('aria-current');
    });
  };

  const spy = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) activate(visible[0].target.id);
  }, { threshold: [0.2, 0.4, 0.6], rootMargin: '-20% 0px -45% 0px' });

  sections.forEach((section) => spy.observe(section));
  activate(sections[0].id);
}

function initResizeClose() {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      menuToggle?.classList.remove('active');
      mobileNav?.classList.add('hidden');
    }
  });
}

if (typedTextElement) setTimeout(typeEffect, 900);
initTheme();
initMenu();
initSmoothScroll();
initScrollEffects();
initScrollSpy();
initResizeClose();
