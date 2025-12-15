/**
 * Animations
 * Typing effect, scroll animations, parallax, and interactive effects
 */

class Animations {
    constructor() {
        this.init();
    }

    // Typing Animation
    initTypingAnimation() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;

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

        const typeEffect = () => {
            const currentTitle = titles[titleIndex];

            if (isDeleting) {
                typingText.textContent = currentTitle.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentTitle.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
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
        };

        typeEffect();
    }

    // Skill Bars Animation
    initSkillBars() {
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
    }

    // Counter Animation for Stats
    initCounterAnimation() {
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
    }

    // Optimized Parallax Effect
    initParallax() {
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
    }

    // Glitch Effect for Hero Title
    initGlitchEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

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

    // Fade In on Scroll
    initFadeInOnScroll() {
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
    }

    // 3D Tilt Effect on Cards
    init3DTilt() {
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
    }

    // Particle Effect on Button Hover
    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '5px';
        particle.style.height = '5px';
        particle.style.background = '#00ff41';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.boxShadow = '0 0 10px rgba(0, 255, 65, 0.8)';

        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const lifetime = 500 + Math.random() * 500;
        const startTime = Date.now();

        const animateParticle = () => {
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
        };

        animateParticle();
    }

    initButtonParticles() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                for (let i = 0; i < 3; i++) {
                    this.createParticle(e.clientX, e.clientY);
                }
            });
        });
    }

    init() {
        // Initialize all animations
        this.initTypingAnimation();
        this.initSkillBars();
        this.initCounterAnimation();
        this.initParallax();
        this.initGlitchEffect();
        this.initFadeInOnScroll();
        this.init3DTilt();
        this.initButtonParticles();

        // Console Easter Egg
        console.log('%c[!] SYSTEM ACCESS GRANTED', 'color: #00ff41; font-size: 20px; font-weight: bold; font-family: monospace;');
        console.log('%c[+] Initializing secure connection...', 'color: #00ff41; font-size: 16px; font-family: monospace;');
        console.log('%c[+] Welcome to Akbar\'s Cyber Portfolio', 'color: #00ff41; font-size: 16px; font-family: monospace;');
        console.log('%c[*] GitHub: https://github.com/Akbar2998', 'color: #33ff33; font-size: 14px; font-family: monospace;');
        console.log('%c[*] LinkedIn: https://linkedin.com/in/zarasoft', 'color: #33ff33; font-size: 14px; font-family: monospace;');
        console.log('%c[!] Connection established. Ready for collaboration.', 'color: #00ff41; font-size: 14px; font-family: monospace;');
    }
}

// Initialize Animations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100
            });
        }

        new Animations();
    });
} else {
    new Animations();
}

// Page Load Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Dynamic year in footer
const updateFooterYear = () => {
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('.footer-content p');
    if (footerText) {
        footerText.innerHTML = footerText.innerHTML.replace(/\d{4}/, currentYear);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateFooterYear);
} else {
    updateFooterYear();
}
