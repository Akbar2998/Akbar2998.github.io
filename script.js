// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Optimized Matrix Canvas Background (Hacker Style)
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const matrix = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*(){}[]<>/?\\|';
const chars = matrix.split('');
const fontSize = 16;
let columns = Math.floor(canvasWidth / fontSize);
let drops = Array(columns).fill(1);

// Use requestAnimationFrame for better performance
let lastFrameTime = 0;
const fps = 30; // Limit to 30 FPS for smoother performance
const frameDelay = 1000 / fps;

function drawMatrix(currentTime) {
    if (currentTime - lastFrameTime < frameDelay) {
        requestAnimationFrame(drawMatrix);
        return;
    }
    lastFrameTime = currentTime;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#00ff41'; // Hacker green
    ctx.font = fontSize + 'px "Fira Code", monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvasHeight && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }

    requestAnimationFrame(drawMatrix);
}

requestAnimationFrame(drawMatrix);

// Optimized resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        columns = Math.floor(canvasWidth / fontSize);
        drops = Array(columns).fill(1);
    }, 250);
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Typing animation for hero section - Cybersecurity focus
const typingText = document.querySelector('.typing-text');
const titles = [
    'IT Specialist',
    'Cyber Security Expert',
    'Network Engineer',
    'Penetration Tester',
    'Linux Enthusiast',
    'Ethical Hacker'
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        typingText.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 500; // Pause before starting new word
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect
typeEffect();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Skill bars animation on scroll
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-category').forEach(category => {
    skillObserver.observe(category);
});

// Counter animation for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + '+';
                    }
                }, 30);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// Optimized parallax effect with throttle
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < 800) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = Math.max(0, 1 - scrolled / 600);
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Add active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// Enhanced hacker-style glitch effect
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    setInterval(() => {
        heroTitle.style.textShadow = `
            ${Math.random() * 3 - 1.5}px ${Math.random() * 3 - 1.5}px 0 rgba(0, 255, 65, 0.8),
            ${Math.random() * 3 - 1.5}px ${Math.random() * 3 - 1.5}px 0 rgba(0, 255, 255, 0.6)
        `;
        setTimeout(() => {
            heroTitle.style.textShadow = '0 0 20px rgba(0, 255, 65, 0.5)';
        }, 50);
    }, 4000);
}

// Cursor trail effect (optional - can be disabled if too distracting)
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Only on desktop
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

        if (cursorTrail.length > maxTrailLength) {
            cursorTrail.shift();
        }

        // Clean up old trails
        cursorTrail = cursorTrail.filter(point => Date.now() - point.time < 500);
    }
});

// Add floating animation to achievement cards
const achievementCards = document.querySelectorAll('.achievement-card');
achievementCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// Add particle effect on button hover (optional)
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            createParticle(e.clientX, e.clientY);
        }
    });
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '5px';
    particle.style.height = '5px';
    particle.style.background = '#00ffff';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.8)';

    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const lifetime = 500 + Math.random() * 500;

    let opacity = 1;
    const startTime = Date.now();

    function animateParticle() {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / lifetime;

        if (progress < 1) {
            const currentX = parseFloat(particle.style.left) + Math.cos(angle) * velocity;
            const currentY = parseFloat(particle.style.top) + Math.sin(angle) * velocity;

            particle.style.left = currentX + 'px';
            particle.style.top = currentY + 'px';
            particle.style.opacity = 1 - progress;

            requestAnimationFrame(animateParticle);
        } else {
            particle.remove();
        }
    }

    animateParticle();
}

// Easter egg: Hacker-style Console message
console.log('%c[!] SYSTEM ACCESS GRANTED', 'color: #00ff41; font-size: 20px; font-weight: bold; font-family: monospace;');
console.log('%c[+] Initializing secure connection...', 'color: #00ff41; font-size: 16px; font-family: monospace;');
console.log('%c[+] Welcome to Akbar\'s Cyber Portfolio', 'color: #00ff41; font-size: 16px; font-family: monospace;');
console.log('%c[*] GitHub: https://github.com/Akbar2998', 'color: #33ff33; font-size: 14px; font-family: monospace;');
console.log('%c[*] LinkedIn: https://linkedin.com/in/zarasoft', 'color: #33ff33; font-size: 14px; font-family: monospace;');
console.log('%c[!] Connection established. Ready for collaboration.', 'color: #00ff41; font-size: 14px; font-family: monospace;');

// Loading animation (optional - add if you want a loading screen)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add 3D tilt effect to cards on mouse move
const cards = document.querySelectorAll('.achievement-card, .skill-category, .timeline-content');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Intersection Observer for fade-in animations
const fadeElements = document.querySelectorAll('.timeline-item, .achievement-card, .skill-category, .contact-item');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// Dynamic year in footer
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-content p');
if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace('2025', currentYear);
}
