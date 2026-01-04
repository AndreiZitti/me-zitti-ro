/**
 * Starfield - Animated twinkling stars background
 */

class Starfield {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 150;
        this.animationId = null;

        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Adjust star count based on screen size
        this.numStars = Math.floor((this.canvas.width * this.canvas.height) / 8000);
        this.numStars = Math.max(50, Math.min(this.numStars, 200));

        // Recreate stars on resize
        if (this.stars.length > 0) {
            this.createStars();
        }
    }

    createStars() {
        this.stars = [];

        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                baseOpacity: Math.random() * 0.5 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                // Color variation: white to blue to purple
                hue: Math.random() > 0.7 ? 250 + Math.random() * 30 : 220 + Math.random() * 20,
                saturation: Math.random() * 30 + 10
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const star of this.stars) {
            // Twinkle effect
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6;
            const opacity = star.baseOpacity * twinkle;

            // Draw star with glow
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

            // Subtle color - mostly white with hint of blue/purple
            const lightness = 85 + Math.random() * 15;
            this.ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, ${lightness}%, ${opacity})`;
            this.ctx.fill();

            // Add subtle glow for brighter stars
            if (star.radius > 1 && opacity > 0.4) {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, ${lightness}%, ${opacity * 0.2})`;
                this.ctx.fill();
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resize);
    }
}

// Export for module use or attach to window
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Starfield;
} else {
    window.Starfield = Starfield;
}
