// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const typedTextElement = document.getElementById('typed-text');
const html = document.documentElement;
const body = document.body;
const header = document.querySelector('header');

const skills = [
    "Python (beginner)",
    "C Programming (beginner)",
    "Linux System Configuration",
    "Circuit Analysis",
    "Laplace Transform",
    "Semiconductor Devices",
    "Ohm's Law & KVL",
    "Mathematical Modeling"
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
        setTimeout(typeEffect, 2000);
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentSkillIndex = (currentSkillIndex + 1) % skills.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
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
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = html.classList.contains('dark-mode');
            setTheme(isDark ? 'light' : 'dark');
        });
    }
}

function initMenu() {
    if (!menuToggle || !nav) return;
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

function initScrollEffects() {
    const animated = document.querySelectorAll('.glass-card, .content h2, .content h3, .content p, .content li');
    animated.forEach((el, idx) => {
        el.classList.add('reveal');
        if (el.closest('.cards-grid')) el.style.setProperty('--stagger', `${idx * 70}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${Math.min(idx * 70, 420)}ms`;
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    animated.forEach(el => observer.observe(el));

    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}


function initScrollSpy() {
    const links = Array.from(document.querySelectorAll('#main-nav a[href^="#"]'));
    const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    if (!sections.length) return;

    const activate = (id) => {
        links.forEach(link => {
            const on = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', on);
            if (on) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
        if (visible[0]) activate(visible[0].target.id);
    }, { threshold: [0.2, 0.4, 0.6], rootMargin: '-25% 0px -45% 0px' });

    sections.forEach(section => observer.observe(section));
}
function initResizeClose() {
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

if (typedTextElement) setTimeout(typeEffect, 1000);
initTheme();
initMenu();
initScrollEffects();
initSmoothScroll();
initScrollSpy();
initResizeClose();
