// Main Portfolio Navigation

class PortfolioNavigation {
  constructor() {
    this.portfolioItems = document.querySelectorAll(".portfolio-item");
    this.currentLocation = window.location.pathname;

    this.init();
  }

  init() {
    this.bindEvents();
    this.addLoadingOverlay();
  }

  bindEvents() {
    this.portfolioItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleNavigation(item);
      });

      // Add keyboard navigation
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.handleNavigation(item);
        }
      });

      // Make items focusable
      item.setAttribute("tabindex", "0");
    });

    // Add escape key to return to main page
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.isMainPage()) {
        this.navigateToMain();
      }
    });
  }

  handleNavigation(item) {
    const target = item.dataset.target;
    const externalUrl = item.dataset.url;

    // Add click effect
    this.addClickEffect(item);

    if (target === "external" && externalUrl) {
      // Handle external link
      window.open(externalUrl, "_blank");
      return;
    }

    // Show loading animation
    this.showLoading();

    // Navigate to internal pages
    setTimeout(() => {
      this.navigateToPage(target);
    }, 500);
  }

  navigateToPage(target) {
    const routes = {
      "star-map": "./star-map/index.html",
      "book-library": "./book-library/index.html",
      "contact-me": "./contact-me/index.html",
      sailing: "./sailing/index.html",
    };

    const targetUrl = routes[target];

    if (targetUrl) {
      window.location.href = targetUrl;
    } else {
      console.error(`Unknown target: ${target}`);
      this.hideLoading();
    }
  }

  navigateToMain() {
    this.showLoading();
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  }

  addClickEffect(item) {
    item.style.transform = "scale(0.95)";
    setTimeout(() => {
      item.style.transform = "";
    }, 150);
  }

  addLoadingOverlay() {
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "loading";
    loadingOverlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingOverlay);
    this.loadingOverlay = loadingOverlay;
  }

  showLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add("active");
    }
  }

  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove("active");
    }
  }

  isMainPage() {
    return (
      this.currentLocation === "/" ||
      this.currentLocation === "/index.html" ||
      this.currentLocation.endsWith("/PersonalWebsite/")
    );
  }
}

// Navigation helper for sub-pages
class SubPageNavigation {
  constructor() {
    this.init();
  }

  init() {
    this.addBackToMainButton();
    this.addKeyboardNavigation();
  }

  addBackToMainButton() {
    // Only add if we're not on the main page
    if (this.isSubPage()) {
      const backButton = document.createElement("button");
      backButton.className = "back-to-main";
      backButton.innerHTML = "← Back to Main";
      backButton.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      `;

      backButton.addEventListener("mouseenter", () => {
        backButton.style.background = "rgba(0, 0, 0, 0.9)";
        backButton.style.transform = "translateY(-2px)";
      });

      backButton.addEventListener("mouseleave", () => {
        backButton.style.background = "rgba(0, 0, 0, 0.7)";
        backButton.style.transform = "translateY(0)";
      });

      backButton.addEventListener("click", () => {
        this.navigateToMain();
      });

      document.body.appendChild(backButton);
    }
  }

  addKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || (e.altKey && e.key === "ArrowLeft")) {
        e.preventDefault();
        this.navigateToMain();
      }
    });
  }

  navigateToMain() {
    window.location.href = "../index.html";
  }

  isSubPage() {
    const path = window.location.pathname;
    return (
      path.includes("/star-map/") ||
      path.includes("/book-library/") ||
      path.includes("/contact-me/") ||
      path.includes("/sailing/")
    );
  }
}

// Initialize appropriate navigation based on current page
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  if (
    currentPath === "/" ||
    currentPath === "/index.html" ||
    currentPath.endsWith("/PersonalWebsite/") ||
    currentPath.endsWith("/PersonalWebsite/index.html")
  ) {
    // Main page navigation
    new PortfolioNavigation();
  } else {
    // Sub-page navigation
    new SubPageNavigation();
  }
});

// Utility functions for smooth page transitions
window.portfolioUtils = {
  smoothTransition: (callback, delay = 300) => {
    document.body.style.opacity = "0";
    setTimeout(() => {
      callback();
      setTimeout(() => {
        document.body.style.opacity = "1";
      }, 100);
    }, delay);
  },

  preloadImages: (imagePaths) => {
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  },
};

// Preload key images for better performance
window.portfolioUtils.preloadImages([
  "./main/assets/telescope.jpg",
  "./main/assets/library.jpg",
  "./main/assets/person.jpg",
  "./main/assets/boat.jpg",
  "./main/assets/computer.png",
]);
