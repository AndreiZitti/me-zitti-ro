/**
 * Landing Page JavaScript
 * Personal Website Redesign
 *
 * Handles:
 * - tsParticles initialization
 * - Projects card terminal effect
 * - Stars card canvas animation
 * - Card interactions
 */

// ========================================
// tsParticles Configuration
// ========================================

const particlesConfig = {
    fullScreen: {
        enable: false
    },
    background: {
        color: { value: "transparent" }
    },
    fpsLimit: 120,
    particles: {
        number: {
            value: 40,
            density: {
                enable: true,
                area: 800
            }
        },
        color: {
            value: "#8b5cf6"
        },
        opacity: {
            value: 0.3
        },
        size: {
            value: { min: 1, max: 3 }
        },
        links: {
            enable: true,
            color: "#8b5cf6",
            opacity: 0.15,
            distance: 150,
            width: 1
        },
        move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
                default: "out"
            }
        }
    },
    interactivity: {
        detectsOn: "window",
        events: {
            onHover: {
                enable: true,
                mode: "repulse"
            },
            onClick: {
                enable: false
            },
            resize: true
        },
        modes: {
            repulse: {
                distance: 80,
                duration: 0.4,
                speed: 0.3
            }
        }
    },
    detectRetina: true
};

// Reduce particles on mobile
function getResponsiveConfig() {
    const config = { ...particlesConfig };
    if (window.innerWidth < 768) {
        config.particles.number.value = 20;
        config.interactivity.events.onHover.enable = false;
    }
    return config;
}

// ========================================
// Projects Card - Terminal Effect
// ========================================

class TerminalCard {
    constructor(cardElement) {
        this.card = cardElement;
        this.output = cardElement.querySelector('.terminal-output');
        this.cursor = cardElement.querySelector('.terminal-cursor');
        this.prompt = cardElement.querySelector('.terminal-prompt');
        this.isAnimating = false;
        this.projects = ['noscan', 'cortiscope', 'star-map'];

        this.init();
    }

    init() {
        this.card.addEventListener('mouseenter', () => this.startAnimation());
        this.card.addEventListener('mouseleave', () => this.resetAnimation());
    }

    async startAnimation() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Clear and show typing effect
        this.output.innerHTML = '';
        this.output.style.opacity = '1';

        // Hide cursor
        if (this.cursor) this.cursor.style.opacity = '0';

        // Type "ls projects"
        const command = 'ls projects';
        await this.typeText(command);

        // Add newline and show projects
        this.output.innerHTML = '';
        await this.delay(100);

        for (const project of this.projects) {
            await this.delay(80);
            this.output.innerHTML += `<div style="color: #8b5cf6;">${project}</div>`;
        }
    }

    async typeText(text) {
        const promptEl = this.card.querySelector('.terminal-prompt');
        const container = promptEl.parentElement;

        // Create typing container after prompt
        let typingSpan = container.querySelector('.typing-text');
        if (!typingSpan) {
            typingSpan = document.createElement('span');
            typingSpan.className = 'typing-text';
            typingSpan.style.color = '#a1a1aa';
            container.insertBefore(typingSpan, this.cursor);
        }

        typingSpan.textContent = '';

        for (let i = 0; i < text.length; i++) {
            typingSpan.textContent += text[i];
            await this.delay(50);
        }
    }

    resetAnimation() {
        this.isAnimating = false;
        this.output.style.opacity = '0';
        this.output.innerHTML = '';

        // Remove typing text
        const typingSpan = this.card.querySelector('.typing-text');
        if (typingSpan) typingSpan.remove();

        // Restore cursor
        if (this.cursor) this.cursor.style.opacity = '1';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ========================================
// Stars Card - Canvas Animation
// ========================================

class StarsCard {
    constructor(cardElement) {
        this.card = cardElement;
        this.canvas = cardElement.querySelector('.stars-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.isHovering = false;
        this.animationId = null;
        this.shootingStar = null;

        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.animate();

        this.card.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.triggerShootingStar();
        });

        this.card.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.shootingStar = null;
        });

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.card.querySelector('.card-preview').getBoundingClientRect();
        this.canvas.width = rect.width || 200;
        this.canvas.height = 100;
    }

    createStars() {
        this.stars = [];
        const numStars = 25;

        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1
            });
        }
    }

    triggerShootingStar() {
        this.shootingStar = {
            x: -20,
            y: Math.random() * 40 + 10,
            length: 40,
            speed: 8,
            opacity: 1
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stars
        for (const star of this.stars) {
            // Twinkle effect
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;

            // Move stars slightly when hovering
            if (this.isHovering) {
                star.x += star.vx * 2;
                star.y += star.vy * 2;

                // Wrap around
                if (star.x < 0) star.x = this.canvas.width;
                if (star.x > this.canvas.width) star.x = 0;
                if (star.y < 0) star.y = this.canvas.height;
                if (star.y > this.canvas.height) star.y = 0;
            }

            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(139, 92, 246, ${star.opacity * twinkle})`;
            this.ctx.fill();
        }

        // Draw shooting star
        if (this.shootingStar) {
            const ss = this.shootingStar;

            const gradient = this.ctx.createLinearGradient(
                ss.x, ss.y,
                ss.x - ss.length, ss.y + ss.length * 0.5
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
            gradient.addColorStop(0.3, `rgba(139, 92, 246, ${ss.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

            this.ctx.beginPath();
            this.ctx.moveTo(ss.x, ss.y);
            this.ctx.lineTo(ss.x - ss.length, ss.y + ss.length * 0.5);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            ss.x += ss.speed;
            ss.y += ss.speed * 0.5;
            ss.opacity -= 0.02;

            if (ss.x > this.canvas.width + 50 || ss.opacity <= 0) {
                this.shootingStar = null;
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ========================================
// Initialization
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize tsParticles
    try {
        await tsParticles.load({
            id: "tsparticles",
            options: getResponsiveConfig()
        });

        // Re-enable pointer events for interactivity
        const particlesContainer = document.getElementById('tsparticles');
        if (particlesContainer) {
            particlesContainer.style.pointerEvents = 'auto';
        }
    } catch (error) {
        console.warn('tsParticles failed to load:', error);
    }

    // Initialize Projects Card
    const projectsCard = document.querySelector('.card-projects');
    if (projectsCard) {
        new TerminalCard(projectsCard);
    }

    // Initialize Stars Card
    const starsCard = document.querySelector('.card-stars');
    if (starsCard) {
        new StarsCard(starsCard);
    }

    // Add hover sound effect placeholder (optional)
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Could add subtle sound here
        });
    });
});

// Handle window resize for particles
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(async () => {
        const container = tsParticles.domItem(0);
        if (container) {
            await container.refresh();
        }
    }, 200);
});

// Respect reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations
    document.documentElement.style.setProperty('--animation-duration', '0s');
}
