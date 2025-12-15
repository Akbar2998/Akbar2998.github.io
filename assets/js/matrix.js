/**
 * Matrix Background Animation
 * Optimized Matrix-style digital rain effect
 */

class MatrixBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        // Matrix characters
        this.matrix = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*(){}[]<>/?\\|';
        this.chars = this.matrix.split('');
        this.fontSize = 16;
        this.columns = Math.floor(this.canvasWidth / this.fontSize);
        this.drops = Array(this.columns).fill(1);

        // Performance optimization
        this.lastFrameTime = 0;
        this.fps = 30;
        this.frameDelay = 1000 / this.fps;

        this.init();
    }

    draw(currentTime) {
        if (currentTime - this.lastFrameTime < this.frameDelay) {
            requestAnimationFrame((time) => this.draw(time));
            return;
        }
        this.lastFrameTime = currentTime;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.ctx.fillStyle = '#00ff41'; // Hacker green
        this.ctx.font = this.fontSize + 'px "Fira Code", monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            this.ctx.fillText(text, x, y);

            if (y > this.canvasHeight && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }

        requestAnimationFrame((time) => this.draw(time));
    }

    resize() {
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.columns = Math.floor(this.canvasWidth / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    init() {
        // Start animation
        requestAnimationFrame((time) => this.draw(time));

        // Optimized resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 250);
        });
    }
}

// Initialize Matrix background when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MatrixBackground('matrix-canvas');
    });
} else {
    new MatrixBackground('matrix-canvas');
}
