/**
 * Main JavaScript Entry Point
 * Initializes all modules and global configurations
 */

// Global configuration
const CONFIG = {
    siteName: 'Akbar Makhmanazarov',
    siteUrl: 'https://akbar2998.github.io',
    social: {
        github: 'https://github.com/Akbar2998',
        linkedin: 'https://linkedin.com/in/zarasoft',
        twitter: 'https://twitter.com/onesm1le',
        email: 'akbar.uzatom@mail.ru'
    }
};

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export for use in other modules
window.APP = {
    CONFIG,
    utils
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c[SYSTEM] Portfolio initialized successfully', 'color: #00ff41; font-family: monospace;');
});
