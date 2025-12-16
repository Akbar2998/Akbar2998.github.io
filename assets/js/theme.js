/**
 * Theme Switcher
 * Handles theme switching with localStorage persistence
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'akbar-portfolio-theme';
    const DEFAULT_THEME = 'cyber-green';

    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const themeOptions = document.getElementById('themeOptions');
    const themeButtons = document.querySelectorAll('.theme-option');

    /**
     * Get saved theme from localStorage or return default
     */
    function getSavedTheme() {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    }

    /**
     * Save theme to localStorage
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            console.warn('Failed to save theme to localStorage:', e);
        }
    }

    /**
     * Apply theme to document
     */
    function applyTheme(theme) {
        // Remove all theme attributes
        document.documentElement.removeAttribute('data-theme');

        // Apply new theme (if not default)
        if (theme && theme !== 'cyber-green') {
            document.documentElement.setAttribute('data-theme', theme);
        }

        // Update active state on theme buttons
        themeButtons.forEach(btn => {
            const btnTheme = btn.getAttribute('data-theme');
            if (btnTheme === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Save theme
        saveTheme(theme);

        // Dispatch custom event for theme change
        const event = new CustomEvent('themechange', {
            detail: { theme }
        });
        document.dispatchEvent(event);
    }

    /**
     * Toggle theme options visibility
     */
    function toggleThemeOptions() {
        themeOptions.classList.toggle('active');

        // Add animation to theme toggle button
        if (themeOptions.classList.contains('active')) {
            themeToggle.style.transform = 'rotate(180deg)';
        } else {
            themeToggle.style.transform = 'rotate(0deg)';
        }
    }

    /**
     * Initialize theme switcher
     */
    function init() {
        // Apply saved theme on load
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);

        // Toggle theme options on button click
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleThemeOptions);
        }

        // Handle theme selection
        themeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);

                // Add ripple effect
                createRipple(e, this);

                // Close theme options after selection
                setTimeout(() => {
                    toggleThemeOptions();
                }, 300);
            });
        });

        // Close theme options when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.theme-switcher')) {
                if (themeOptions.classList.contains('active')) {
                    toggleThemeOptions();
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Press 'T' to toggle theme switcher
            if (e.key === 't' || e.key === 'T') {
                if (!e.target.matches('input, textarea')) {
                    toggleThemeOptions();
                }
            }
            // Escape to close
            if (e.key === 'Escape' && themeOptions.classList.contains('active')) {
                toggleThemeOptions();
            }
        });
    }

    /**
     * Create ripple effect on theme option click
     */
    function createRipple(event, element) {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - element.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - element.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = element.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        element.appendChild(circle);

        setTimeout(() => {
            circle.remove();
        }, 600);
    }

    /**
     * Add smooth theme transition effect
     */
    function addThemeTransition() {
        document.documentElement.style.setProperty('--theme-transition', 'all 0.3s ease');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add theme transition
    addThemeTransition();

    // Expose theme API globally (optional)
    window.ThemeManager = {
        applyTheme,
        getSavedTheme,
        themes: ['cyber-green', 'neon-purple', 'ocean-blue', 'sunset-orange', 'electric-red', 'cyber-yellow']
    };

})();
