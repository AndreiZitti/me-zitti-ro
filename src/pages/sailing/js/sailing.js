// Sailing Page Interactive Features

class SailingInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.addCardInteractions();
    this.addScrollAnimations();
    this.addWaveEffects();
    this.addWindEffect();
  }

  addCardInteractions() {
    // Adventure cards click to expand
    const adventureCards = document.querySelectorAll(".adventure-card");
    adventureCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        this.expandCard(card, index);
      });

      // Add subtle floating animation
      card.style.animationDelay = `${index * 0.2}s`;
      card.classList.add("floating");
    });

    // Skill items hover effects
    const skillItems = document.querySelectorAll(".skill-item");
    skillItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        this.addSkillHoverEffect(item);
      });
    });
  }

  expandCard(card, index) {
    // Create expanded view overlay
    const overlay = document.createElement("div");
    overlay.className = "card-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    const expandedCard = card.cloneNode(true);
    expandedCard.style.cssText = `
      max-width: 600px;
      width: 90%;
      transform: scale(0.8);
      transition: transform 0.3s ease;
      position: relative;
    `;

    // Add close button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 24px;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeExpandedCard(overlay);
    });

    expandedCard.appendChild(closeBtn);
    overlay.appendChild(expandedCard);
    document.body.appendChild(overlay);

    // Animate in
    setTimeout(() => {
      overlay.style.opacity = "1";
      expandedCard.style.transform = "scale(1)";
    }, 10);

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.closeExpandedCard(overlay);
      }
    });
  }

  closeExpandedCard(overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 300);
  }

  addSkillHoverEffect(item) {
    const icon = item.querySelector(".skill-icon");
    if (icon) {
      icon.style.transform = "scale(1.2) rotate(5deg)";
      setTimeout(() => {
        icon.style.transform = "";
      }, 300);
    }
  }

  addScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll("section").forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(30px)";
      section.style.transition = "all 0.6s ease";
      observer.observe(section);
    });
  }

  addWaveEffects() {
    // Add additional wave layers for depth
    const header = document.querySelector(".sailing-header");

    for (let i = 1; i <= 3; i++) {
      const wave = document.createElement("div");
      wave.className = `wave-layer wave-${i}`;
      wave.style.cssText = `
        position: absolute;
        bottom: ${i * 10}px;
        left: 0;
        width: 120%;
        height: 60px;
        background: rgba(255, 255, 255, ${0.05 * i});
        border-radius: 100% 100% 0 0;
        animation: wave-float ${8 + i * 2}s ease-in-out infinite;
        animation-delay: ${i * 0.5}s;
      `;
      header.appendChild(wave);
    }

    // Add wave float animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes wave-float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(1deg); }
        50% { transform: translateY(5px) rotate(-1deg); }
        75% { transform: translateY(-5px) rotate(0.5deg); }
      }
      
      .floating {
        animation: float 4s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
    `;
    document.head.appendChild(style);
  }

  addWindEffect() {
    // Create floating particles to simulate wind
    const createParticle = () => {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        top: ${Math.random() * 100}vh;
        left: -5px;
        animation: wind-drift ${5 + Math.random() * 5}s linear infinite;
      `;

      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 10000);
    };

    // Add wind drift animation
    const windStyle = document.createElement("style");
    windStyle.textContent = `
      @keyframes wind-drift {
        0% {
          left: -5px;
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          left: 100vw;
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(windStyle);

    // Create particles periodically
    setInterval(createParticle, 1000);
  }
}

// Weather simulation for fun
class WeatherSimulation {
  constructor() {
    this.weather = "calm";
    this.init();
  }

  init() {
    this.addWeatherControls();
    this.simulateWeatherChanges();
  }

  addWeatherControls() {
    const weatherPanel = document.createElement("div");
    weatherPanel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      padding: 15px;
      border-radius: 10px;
      color: white;
      font-size: 14px;
      z-index: 1000;
      backdrop-filter: blur(10px);
    `;

    weatherPanel.innerHTML = `
      <div style="margin-bottom: 10px;">
        <strong>⛅ Weather Conditions</strong>
      </div>
      <div id="weather-status">Calm seas, light breeze</div>
      <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
        <span id="wind-speed">5 knots</span> | 
        <span id="wave-height">0.5m</span>
      </div>
    `;

    document.body.appendChild(weatherPanel);
  }

  simulateWeatherChanges() {
    const weatherConditions = [
      { status: "Calm seas, light breeze", wind: "5 knots", waves: "0.5m" },
      {
        status: "Fresh breeze, moderate seas",
        wind: "12 knots",
        waves: "1.2m",
      },
      { status: "Strong wind, rough seas", wind: "25 knots", waves: "2.5m" },
      {
        status: "Gentle breeze, smooth sailing",
        wind: "8 knots",
        waves: "0.8m",
      },
    ];

    setInterval(() => {
      const condition =
        weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

      const statusEl = document.getElementById("weather-status");
      const windEl = document.getElementById("wind-speed");
      const waveEl = document.getElementById("wave-height");

      if (statusEl && windEl && waveEl) {
        statusEl.textContent = condition.status;
        windEl.textContent = condition.wind;
        waveEl.textContent = condition.waves;
      }
    }, 8000);
  }
}

// Initialize all sailing interactions
document.addEventListener("DOMContentLoaded", () => {
  new SailingInteractions();
  new WeatherSimulation();
});

// Add compass navigation indicator
class CompassNavigation {
  constructor() {
    this.createCompass();
  }

  createCompass() {
    const compass = document.createElement("div");
    compass.style.cssText = `
      position: fixed;
      top: 50%;
      right: 30px;
      transform: translateY(-50%);
      width: 60px;
      height: 60px;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      z-index: 999;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    `;

    compass.innerHTML = "🧭";
    compass.title = "Navigation Compass";

    // Rotate compass based on scroll position
    window.addEventListener("scroll", () => {
      const scrollPercent =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        360;
      compass.style.transform = `translateY(-50%) rotate(${scrollPercent}deg)`;
    });

    document.body.appendChild(compass);
  }
}

// Initialize compass
document.addEventListener("DOMContentLoaded", () => {
  new CompassNavigation();
});
