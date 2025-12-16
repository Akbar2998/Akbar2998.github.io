/**
 * Animations
 * Typing effect, scroll animations, parallax, and interactive effects
 */

class Animations {
    constructor() {
        this.init();
    }

    // Hacker-Style Typing Animation
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

        const hackerChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let scrambleCount = 0;

        const scrambleText = (targetText, currentLength) => {
            let scrambled = '';
            for (let i = 0; i < currentLength; i++) {
                if (i < targetText.length - 1) {
                    scrambled += targetText[i];
                } else {
                    scrambled += hackerChars[Math.floor(Math.random() * hackerChars.length)];
                }
            }
            return scrambled;
        };

        const typeEffect = () => {
            const currentTitle = titles[titleIndex];

            if (isDeleting) {
                // Deleting with glitch effect
                const deleteText = currentTitle.substring(0, charIndex);
                if (Math.random() > 0.7) {
                    typingText.textContent = scrambleText(deleteText, charIndex);
                } else {
                    typingText.textContent = deleteText;
                }
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    titleIndex = (titleIndex + 1) % titles.length;
                    setTimeout(typeEffect, 500);
                } else {
                    setTimeout(typeEffect, 30);
                }
            } else {
                // Typing with scramble effect
                if (scrambleCount < 3 && charIndex < currentTitle.length) {
                    typingText.textContent = currentTitle.substring(0, charIndex) +
                                           hackerChars[Math.floor(Math.random() * hackerChars.length)];
                    scrambleCount++;
                    setTimeout(typeEffect, 50);
                } else {
                    scrambleCount = 0;
                    charIndex++;
                    typingText.textContent = currentTitle.substring(0, charIndex);

                    if (charIndex === currentTitle.length) {
                        isDeleting = true;
                        setTimeout(typeEffect, 2000);
                    } else {
                        setTimeout(typeEffect, 80);
                    }
                }
            }
        };

        // Initial scramble effect
        let initScramble = 0;
        const initialEffect = setInterval(() => {
            typingText.textContent = hackerChars[Math.floor(Math.random() * hackerChars.length)].repeat(5);
            initScramble++;
            if (initScramble > 10) {
                clearInterval(initialEffect);
                typeEffect();
            }
        }, 50);
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

    // World-Class Counter Animation with Digit Rolling
    initCounterAnimation() {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const targetText = stat.textContent;
                        const target = parseInt(targetText);
                        const hasPlusSign = targetText.includes('+');

                        // Create digit rolling effect
                        stat.style.position = 'relative';
                        stat.style.display = 'inline-block';
                        stat.style.overflow = 'hidden';
                        stat.innerHTML = '';

                        const targetStr = target.toString();
                        const digits = targetStr.split('');

                        // Create container for each digit
                        digits.forEach((digit, index) => {
                            const digitContainer = document.createElement('span');
                            digitContainer.style.cssText = `
                                display: inline-block;
                                position: relative;
                                width: 1ch;
                                height: 1em;
                                overflow: hidden;
                                vertical-align: top;
                            `;

                            const digitRoller = document.createElement('span');
                            digitRoller.style.cssText = `
                                display: block;
                                position: absolute;
                                top: 0;
                                left: 0;
                                transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                            `;

                            // Create rolling numbers 0-9 and the target digit
                            const rollNumbers = [];
                            const rollCount = 10 + parseInt(digit);
                            for (let i = 0; i <= rollCount; i++) {
                                const num = document.createElement('div');
                                num.textContent = i % 10;
                                num.style.cssText = `
                                    height: 1em;
                                    line-height: 1em;
                                    text-align: center;
                                `;

                                // Add glitch effect during roll
                                if (i < rollCount - 1 && Math.random() > 0.7) {
                                    num.style.color = 'var(--secondary-color)';
                                    num.style.textShadow = '0 0 10px var(--secondary-color)';
                                }

                                digitRoller.appendChild(num);
                                rollNumbers.push(num);
                            }

                            digitContainer.appendChild(digitRoller);
                            stat.appendChild(digitContainer);

                            // Animate with delay for each digit
                            setTimeout(() => {
                                const offset = rollCount * -1; // Move up
                                digitRoller.style.transform = `translateY(${offset}em)`;

                                // Add glow effect on completion
                                setTimeout(() => {
                                    digitContainer.style.animation = 'neon-pulse 1s ease-in-out';
                                }, 800);
                            }, index * 150);
                        });

                        // Add plus sign with fade-in effect
                        if (hasPlusSign) {
                            const plusSign = document.createElement('span');
                            plusSign.textContent = '+';
                            plusSign.style.cssText = `
                                display: inline-block;
                                opacity: 0;
                                transform: scale(0);
                                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                                margin-left: 2px;
                            `;
                            stat.appendChild(plusSign);

                            setTimeout(() => {
                                plusSign.style.opacity = '1';
                                plusSign.style.transform = 'scale(1)';
                                plusSign.style.textShadow = '0 0 20px var(--primary-color)';
                            }, digits.length * 150 + 800);
                        }

                        // Add particle burst effect on completion
                        setTimeout(() => {
                            this.createCounterParticleBurst(stat);
                        }, digits.length * 150 + 1000);
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

    // Particle burst effect for counter completion
    createCounterParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                box-shadow: 0 0 10px var(--primary-color);
            `;
            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / 8;
            const velocity = 3;
            const distance = 50;

            setTimeout(() => {
                particle.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                particle.style.left = `${centerX + Math.cos(angle) * distance}px`;
                particle.style.top = `${centerY + Math.sin(angle) * distance}px`;
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0)';
            }, 50);

            setTimeout(() => particle.remove(), 700);
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
