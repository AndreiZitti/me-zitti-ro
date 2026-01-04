// Contact Form Handler

class ContactForm {
  constructor() {
    this.form = document.querySelector(".contact-form");
    this.statusMessage = document.getElementById("statusMessage");

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.form) {
      this.form.addEventListener("submit", this.handleSubmit.bind(this));
    }

    // Add real-time validation
    const inputs = this.form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    this.setSubmitButtonState(true);

    try {
      // Simulate form submission (replace with actual endpoint)
      await this.simulateFormSubmission(data);

      this.showStatus(
        "Message sent successfully! I'll get back to you soon.",
        "success"
      );
      this.form.reset();
    } catch (error) {
      this.showStatus("Failed to send message. Please try again.", "error");
    } finally {
      this.setSubmitButtonState(false);
    }
  }

  async simulateFormSubmission(data) {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          console.log("Form submitted:", data);
          resolve();
        } else {
          reject(new Error("Simulated network error"));
        }
      }, 1500);
    });
  }

  validateForm() {
    const requiredFields = this.form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Check if required field is empty
    if (field.hasAttribute("required") && !value) {
      errorMessage = "This field is required";
      isValid = false;
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = "Please enter a valid email address";
        isValid = false;
      }
    }

    // Name validation
    if (field.name === "name" && value) {
      if (value.length < 2) {
        errorMessage = "Name must be at least 2 characters long";
        isValid = false;
      }
    }

    // Message validation
    if (field.name === "message" && value) {
      if (value.length < 10) {
        errorMessage = "Message must be at least 10 characters long";
        isValid = false;
      }
    }

    this.displayFieldError(field, errorMessage);
    return isValid;
  }

  displayFieldError(field, message) {
    // Remove existing error
    this.clearFieldError(field);

    if (message) {
      field.style.borderColor = "#f44336";
      field.style.background = "rgba(244, 67, 54, 0.1)";

      const errorElement = document.createElement("span");
      errorElement.className = "field-error";
      errorElement.textContent = message;
      errorElement.style.cssText = `
        color: #f44336;
        font-size: 12px;
        margin-top: 5px;
        display: block;
      `;

      field.parentNode.appendChild(errorElement);
    }
  }

  clearFieldError(field) {
    field.style.borderColor = "";
    field.style.background = "";

    const existingError = field.parentNode.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
  }

  setSubmitButtonState(loading) {
    const button = this.form.querySelector(".submit-btn");
    const buttonText = button.querySelector("span:first-child");
    const buttonIcon = button.querySelector(".btn-icon");

    if (loading) {
      button.disabled = true;
      buttonText.textContent = "Sending...";
      buttonIcon.textContent = "⏳";
      button.style.opacity = "0.7";
    } else {
      button.disabled = false;
      buttonText.textContent = "Send Message";
      buttonIcon.textContent = "✨";
      button.style.opacity = "1";
    }
  }

  showStatus(message, type) {
    this.statusMessage.textContent = message;
    this.statusMessage.className = `status-message ${type} show`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.statusMessage.classList.remove("show");
    }, 5000);
  }
}

// Initialize contact form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ContactForm();
});

// Add some interactive animations
class ContactAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.animateCards();
    this.addHoverEffects();
  }

  animateCards() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "fadeInUp 0.6s ease-out forwards";
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".info-card, .contact-form").forEach((card) => {
      observer.observe(card);
    });
  }

  addHoverEffects() {
    // Add ripple effect to contact links
    document.querySelectorAll(".contact-link").forEach((link) => {
      link.addEventListener("click", this.createRipple);
    });
  }

  createRipple(e) {
    const ripple = document.createElement("span");
    const rect = e.currentTarget.getBoundingClientRect();
    const size = 60;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    // Add ripple animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    e.currentTarget.style.position = "relative";
    e.currentTarget.style.overflow = "hidden";
    e.currentTarget.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Initialize animations
document.addEventListener("DOMContentLoaded", () => {
  new ContactAnimations();
});
