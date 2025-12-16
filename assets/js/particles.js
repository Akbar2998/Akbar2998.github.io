/**
 * Particle Effects System
 * Creates interactive floating particles with mouse interaction
 */

(function() {
    'use strict';

    class ParticleSystem {
        constructor(containerId = 'particle-container') {
            this.container = document.getElementById(containerId);
            if (!this.container) {
                this.createContainer();
            }

            this.particles = [];
            this.particleCount = this.isMobile() ? 30 : 50;
            this.mouse = { x: 0, y: 0 };
            this.connectionDistance = 150;

            this.init();
        }

        createContainer() {
            this.container = document.createElement('div');
            this.container.id = 'particle-container';
            this.container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                overflow: hidden;
            `;
            document.body.insertBefore(this.container, document.body.firstChild);
        }

        isMobile() {
            return window.innerWidth < 768;
        }

        init() {
            this.createParticles();
            this.bindEvents();
            this.animate();
        }

        createParticles() {
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push(this.createParticle());
            }
        }

        createParticle() {
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 1;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                box-shadow: 0 0 ${size * 2}px var(--primary-color);
                opacity: ${Math.random() * 0.5 + 0.3};
            `;

            particle.x = Math.random() * window.innerWidth;
            particle.y = Math.random() * window.innerHeight;
            particle.vx = (Math.random() - 0.5) * 0.5;
            particle.vy = (Math.random() - 0.5) * 0.5;
            particle.size = size;

            particle.style.left = particle.x + 'px';
            particle.style.top = particle.y + 'px';

            this.container.appendChild(particle);
            return particle;
        }

        bindEvents() {
            // Track mouse movement
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            // Handle resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.handleResize();
                }, 200);
            });

            // Theme change event
            document.addEventListener('themechange', () => {
                this.updateParticleColors();
            });
        }

        handleResize() {
            const newCount = this.isMobile() ? 30 : 50;

            if (newCount < this.particles.length) {
                // Remove excess particles
                for (let i = newCount; i < this.particles.length; i++) {
                    this.particles[i].remove();
                }
                this.particles = this.particles.slice(0, newCount);
            } else if (newCount > this.particles.length) {
                // Add more particles
                const diff = newCount - this.particles.length;
                for (let i = 0; i < diff; i++) {
                    this.particles.push(this.createParticle());
                }
            }
        }

        updateParticleColors() {
            // Force repaint to update CSS variables
            this.particles.forEach(particle => {
                particle.style.background = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color');
            });
        }

        animate() {
            this.particles.forEach((particle, i) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Mouse interaction
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx -= (dx / distance) * force * 0.1;
                    particle.vy -= (dy / distance) * force * 0.1;
                }

                // Boundary check
                if (particle.x < 0 || particle.x > window.innerWidth) {
                    particle.vx *= -1;
                    particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
                }

                if (particle.y < 0 || particle.y > window.innerHeight) {
                    particle.vy *= -1;
                    particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
                }

                // Apply velocity damping
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Keep minimum velocity
                if (Math.abs(particle.vx) < 0.1) {
                    particle.vx = (Math.random() - 0.5) * 0.5;
                }
                if (Math.abs(particle.vy) < 0.1) {
                    particle.vy = (Math.random() - 0.5) * 0.5;
                }

                // Update DOM
                particle.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
            });

            requestAnimationFrame(() => this.animate());
        }

        destroy() {
            this.particles.forEach(particle => particle.remove());
            this.particles = [];
            if (this.container) {
                this.container.remove();
            }
        }
    }

    // Initialize particle system when DOM is ready
    function init() {
        // Only initialize if not on mobile or if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            window.particleSystem = new ParticleSystem();
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose to global scope
    window.ParticleSystem = ParticleSystem;

})();
