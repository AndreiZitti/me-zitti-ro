// Personal Book Library - 3D Showcase
// Clean implementation with user's specific books

class BookLibrary {
  constructor() {
    this.loadBooks();

    this.currentBook = -1;
    this.currentFilters = ["all"];
    this.currentSort = "title";
    this.transEndEventName = this.getTransitionEndEvent();
    this.isTransitioning = false;
    this.booksPerShelf = 6; // Maximum books per shelf
    this.currentShelfCount = 0;

    this.init();
  }

  // Load books from localStorage or use default data
  loadBooks() {
    const storedBooks = localStorage.getItem("bookLibraryData");
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    } else {
      // Default books + new books
      this.books = [
        // All books (dynamic shelf assignment)
        {
          id: 1,
          title: "Brief Answers to the Big Questions",
          author: "Stephen Hawking",
          genre: "Science, Non-fiction",
          category: "science",
          rating: "9/10",
          quote:
            "However difficult life may seem, there is always something you can do and succeed at.",
          description:
            "Stephen Hawking's final book addresses the biggest questions facing humanity.",
        },
        {
          id: 2,
          title: "The Universe in a Nutshell",
          author: "Stephen Hawking",
          genre: "Science, Physics",
          category: "science",
          rating: "8/10",
          quote:
            "Imaginary time is a new dimension, at right angles to ordinary, real time.",
          description:
            "A journey through the universe's most fascinating concepts in physics.",
        },
        {
          id: 3,
          title: "A Brief History of Time",
          author: "Stephen Hawking",
          genre: "Science, Cosmology",
          category: "science",
          rating: "10/10",
          quote:
            "If time travel is possible, where are the tourists from the future?",
          description:
            "The landmark volume on the frontier of scientific knowledge.",
        },
        {
          id: 4,
          title: "IT",
          author: "Stephen King",
          genre: "Horror, Fiction",
          category: "horror",
          rating: "9/10",
          quote: "We all float down here.",
          description:
            "A terrifying tale of seven kids who face their worst nightmare.",
        },
        {
          id: 5,
          title: "The Stand",
          author: "Stephen King",
          genre: "Horror, Post-apocalyptic",
          category: "horror",
          rating: "9/10",
          quote:
            "The place where you made your stand never mattered. Only that you were there... and still on your feet.",
          description:
            "An epic tale of good vs. evil in a post-apocalyptic world.",
        },
        {
          id: 6,
          title: "Pet Sematary",
          author: "Stephen King",
          genre: "Horror, Thriller",
          category: "horror",
          rating: "8/10",
          quote: "Sometimes dead is better.",
          description:
            "A chilling story about the boundaries between life and death.",
        },
        {
          id: 7,
          title: "1984",
          author: "George Orwell",
          genre: "Dystopian, Political fiction",
          category: "dystopian",
          rating: "10/10",
          quote: "War is peace. Freedom is slavery. Ignorance is strength.",
          description:
            "A dystopian masterpiece about totalitarian control and surveillance.",
        },
        {
          id: 8,
          title:
            "These Strange New Minds: How AI Learned to Talk and What It Means",
          author: "Christopher Summerfield",
          genre: "AI, Cognitive Science, Technology History",
          category: "ai",
          rating: "8/10",
          quote:
            "AI chatbots are error‑prone prediction engines that differ from humans in crucial ways.",
          description:
            "An exploration of how artificial intelligence developed language capabilities and its implications for humanity.",
        },
        {
          id: 9,
          title: "Future‑Proof Yourself: An AI Era Survival Guide",
          author: "Taehoon Kim",
          genre: "AI, Popular Science",
          category: "ai",
          rating: "8/10",
          quote:
            "Designed for a general audience, the text avoids heavy technical jargon and presents complex ideas in clear, straightforward language.",
          description:
            "A practical guide to thriving in an age of artificial intelligence and technological disruption.",
        },
        {
          id: 10,
          title: "Probabilistic Artificial Intelligence",
          author: "Andreas Krause & Jonas Hübotter",
          genre: "Machine Learning, Probabilistic Methods",
          category: "ai",
          rating: "8/10",
          quote:
            "A key aspect of intelligence is to not only make predictions, but reason about the uncertainty in these predictions.",
          description:
            "Advanced concepts in probabilistic approaches to artificial intelligence and machine learning.",
        },
        {
          id: 11,
          title:
            "The Coming Wave: Technology, Power, and the Twenty‑first Century's Greatest Dilemma",
          author: "Mustafa Suleyman & Michael Bhaskar",
          genre: "AI Ethics, Risk, Policy",
          category: "ai",
          rating: "8/10",
          quote:
            "The same technologies that allow us to cure a disease could be used to cause one.",
          description:
            "An examination of emerging technologies and their potential risks and benefits for society.",
        },
        {
          id: 12,
          title:
            "Continuous Discovery Habits: Discover Products that Create Customer Value and Business Value",
          author: "Teresa Torres",
          genre: "Product Management, UX Research, Business Strategy",
          category: "business",
          rating: "9/10",
          quote:
            "If you haven't had the good fortune to be coached by a strong leader or product coach, this book can help fill that gap and set you on the path to success.",
          description:
            "A comprehensive guide to building customer-centric products through continuous discovery practices.",
        },
        {
          id: 13,
          title:
            "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
          author: "James Clear",
          genre: "Self‑Help, Behavioural Science, Productivity",
          category: "self-help",
          rating: "9/10",
          quote:
            "Goals are about the results you want. Systems are about the processes that lead to those results.",
          description:
            "A practical framework for building good habits and breaking bad ones through small, incremental changes.",
        },
      ];

      // Save to localStorage for future use
      localStorage.setItem("bookLibraryData", JSON.stringify(this.books));
    }

    // Listen for changes from admin panel
    window.addEventListener("storage", () => {
      const updatedBooks = localStorage.getItem("bookLibraryData");
      if (updatedBooks) {
        this.books = JSON.parse(updatedBooks);
        this.renderBooks();
      }
    });
  }

  getTransitionEndEvent() {
    const transitions = {
      transition: "transitionend",
      WebkitTransition: "webkitTransitionEnd",
      MozTransition: "transitionend",
      OTransition: "oTransitionEnd",
    };

    for (let t in transitions) {
      if (document.body.style[t] !== undefined) {
        return transitions[t];
      }
    }
    return "transitionend";
  }

  init() {
    this.renderBooks();
    this.setupEventListeners();
  }

  generateBookPages(book) {
    // Title Page
    const titlePage = `
      <div class="book-title-page">
        <h1>${book.title}</h1>
        <h2>by ${book.author}</h2>
        <div class="book-genre">${book.genre}</div>
        <div class="book-rating">Rating: ${book.rating}</div>
      </div>
    `;

    // Quote Page
    const quotePage = `
      <div class="book-quote-page">
        <h3>Memorable Quote</h3>
        <blockquote>
          "${book.quote}"
        </blockquote>
        <cite>— ${book.author}</cite>
      </div>
    `;

    return [titlePage, quotePage];
  }

  createBookElement(book, globalIndex) {
    const bookItem = document.createElement("li");
    const pageContent = this.generateBookPages(book);

    // Randomize book dimensions for variety
    const height = 360 + Math.random() * 80; // 360-440px
    const spineWidth = 30 + Math.random() * 25; // 30-55px
    const bookDepth = 250 + Math.random() * 100; // 250-350px

    bookItem.innerHTML = `
      <div class="bk-book book-${book.category}" data-opened="false">
        <div class="bk-front">
          <div class="bk-cover-back"></div>
          <div class="bk-cover">
            <h2>
              <span>${book.author}</span>
              <span>${book.title}</span>
            </h2>
          </div>
        </div>
        <div class="bk-page">
          <div class="bk-content bk-content-current">
            ${pageContent[0]}
          </div>
          <div class="bk-content">
            ${pageContent[1]}
          </div>
        </div>
        <div class="bk-back">
          <p>${book.description}</p>
        </div>
        <div class="bk-right"></div>
        <div class="bk-left"></div>
        <div class="bk-top"></div>
        <div class="bk-bottom"></div>
      </div>
    `;

    // Apply randomized dimensions
    bookItem.style.width = `${spineWidth}px`;
    bookItem.style.height = `${height}px`;

    const bookEl = bookItem.querySelector(".bk-book");
    bookEl.style.height = `${height}px`;

    // Apply dimensions to various book parts
    const frontBackCover = bookItem.querySelectorAll(".bk-front, .bk-back, .bk-front > div");
    frontBackCover.forEach(el => {
      el.style.width = `${bookDepth}px`;
      el.style.height = `${height}px`;
    });

    // Fix front cover position to match spine width
    const bkFront = bookItem.querySelector(".bk-front");
    bkFront.style.transform = `translate3d(0, 0, ${spineWidth / 2}px)`;

    // Fix back cover position
    const bkBack = bookItem.querySelector(".bk-back");
    bkBack.style.transform = `rotate3d(0, 1, 0, -180deg) translate3d(0, 0, ${spineWidth / 2}px)`;

    const leftRight = bookItem.querySelectorAll(".bk-left, .bk-right");
    leftRight.forEach(el => {
      el.style.width = `${spineWidth}px`;
      el.style.left = `-${spineWidth / 2}px`;
    });

    const bkLeft = bookItem.querySelector(".bk-left");
    bkLeft.style.height = `${height}px`;

    const bkRight = bookItem.querySelector(".bk-right");
    bkRight.style.height = `${height - 10}px`;
    bkRight.style.transform = `rotate3d(0, 1, 0, 90deg) translate3d(0, 0, ${bookDepth - 5}px)`;

    const topBottom = bookItem.querySelectorAll(".bk-top, .bk-bottom");
    topBottom.forEach(el => {
      el.style.width = `${bookDepth - 5}px`;
      el.style.height = `${spineWidth}px`;
    });

    const bkBottom = bookItem.querySelector(".bk-bottom");
    bkBottom.style.transform = `rotate3d(1, 0, 0, -90deg) translate3d(0, 0, ${height - 10}px)`;

    const bkPage = bookItem.querySelector(".bk-page");
    bkPage.style.width = `${bookDepth - 5}px`;
    bkPage.style.height = `${height - 10}px`;
    bkPage.style.transform = `translate3d(0, 0, ${spineWidth / 2 - 1}px)`;

    // Set z-index for proper stacking (keep books above shelf)
    const totalBooks = this.books.length;
    if (globalIndex < totalBooks / 2) {
      bookItem.style.zIndex = 10 + globalIndex;
      bookItem.setAttribute("data-stackval", 10 + globalIndex);
    } else {
      const stackVal = 10 + totalBooks - 1 - globalIndex;
      bookItem.style.zIndex = stackVal;
      bookItem.setAttribute("data-stackval", stackVal);
    }

    this.setupBookInteraction(bookItem, globalIndex, totalBooks);
    return bookItem;
  }

  setupBookInteraction(bookItem, globalIndex, totalBooks) {
    const bookEl = bookItem.querySelector(".bk-book");
    const pageEl = bookItem.querySelector(".bk-page");
    const contentElements = bookItem.querySelectorAll(".bk-content");
    let currentPage = 0;

    // Add page navigation if multiple pages
    if (contentElements.length > 1) {
      const nav = document.createElement("nav");
      const prevBtn = document.createElement("span");
      const nextBtn = document.createElement("span");

      prevBtn.textContent = "‹";
      nextBtn.textContent = "›";
      prevBtn.className = "bk-page-prev";
      nextBtn.className = "bk-page-next";

      nav.appendChild(prevBtn);
      nav.appendChild(nextBtn);
      pageEl.appendChild(nav);

      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (currentPage > 0) {
          contentElements[currentPage].classList.remove("bk-content-current");
          currentPage--;
          contentElements[currentPage].classList.add("bk-content-current");
        }
      });

      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (currentPage < contentElements.length - 1) {
          contentElements[currentPage].classList.remove("bk-content-current");
          currentPage++;
          contentElements[currentPage].classList.add("bk-content-current");
        }
      });
    }

    // Main book click interaction
    bookEl.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      // Prevent multiple rapid clicks during transitions
      if (this.isTransitioning) {
        return;
      }

      const allBooks = document.querySelectorAll(".bk-book");
      const bookIndex = Array.from(allBooks).indexOf(bookEl);

      // Check if this book is currently open by looking at both state and DOM
      const isCurrentlyOpen =
        this.currentBook === bookIndex ||
        bookEl.getAttribute("data-opened") === "true";

      // If this exact book is already open or opening, close it
      if (isCurrentlyOpen) {
        this.closeBook(bookEl, bookItem, contentElements, () => {
          currentPage = 0;
        });
        return;
      }

      // If another book is open, close it first
      if (this.currentBook !== -1 && this.currentBook !== bookIndex) {
        this.closeCurrent(() => {
          // After closing current book, open this one
          this.openBook(bookEl, bookItem, bookIndex, totalBooks);
        });
      } else {
        // No book is open, just open this one
        this.openBook(bookEl, bookItem, bookIndex, totalBooks);
      }
    });
  }

  closeCurrent(callback) {
    if (this.currentBook === -1) {
      if (callback) callback();
      return;
    }

    const allBooks = document.querySelectorAll(".bk-book");
    const bookEl = allBooks[this.currentBook];

    if (!bookEl) {
      this.currentBook = -1;
      if (callback) callback();
      return;
    }

    const bookItem = bookEl.parentElement;
    const contentElements = bookEl.querySelectorAll(".bk-content");

    this.closeBook(bookEl, bookItem, contentElements, callback);
  }

  openBook(bookEl, bookItem, bookIndex, totalBooks) {
    this.isTransitioning = true;
    this.currentBook = bookIndex;

    // Remove any existing transition listeners to prevent duplicates
    const existingHandler = bookEl._openTransitionHandler;
    if (existingHandler) {
      bookEl.removeEventListener(this.transEndEventName, existingHandler);
    }

    bookEl.setAttribute("data-opened", "true");
    bookEl.classList.add("bk-outside");

    // Create and store the handler for later cleanup
    const openHandler = function () {
      bookEl.removeEventListener(this.transEndEventName, openHandler);
      bookEl._openTransitionHandler = null;
      bookEl.classList.add("bk-viewinside");
      bookItem.style.zIndex = totalBooks + 100;
      this.isTransitioning = false;
    }.bind(this);

    bookEl._openTransitionHandler = openHandler;
    bookEl.addEventListener(this.transEndEventName, openHandler);
  }

  closeBook(bookEl, bookItem, contentElements, callback) {
    this.isTransitioning = true;

    // Remove any existing transition listeners to prevent duplicates
    const existingOpenHandler = bookEl._openTransitionHandler;
    if (existingOpenHandler) {
      bookEl.removeEventListener(this.transEndEventName, existingOpenHandler);
      bookEl._openTransitionHandler = null;
    }

    const existingCloseHandler = bookEl._closeTransitionHandler;
    if (existingCloseHandler) {
      bookEl.removeEventListener(this.transEndEventName, existingCloseHandler);
    }

    bookEl.setAttribute("data-opened", "false");
    bookEl.classList.remove("bk-viewinside");

    // Create and store the handler for later cleanup
    const closeHandler = function () {
      bookEl.removeEventListener(this.transEndEventName, closeHandler);
      bookEl._closeTransitionHandler = null;
      bookEl.classList.remove("bk-outside");
      bookItem.style.zIndex = bookItem.getAttribute("data-stackval");

      // Reset to first page
      if (contentElements) {
        contentElements.forEach((el) =>
          el.classList.remove("bk-content-current")
        );
        if (contentElements[0]) {
          contentElements[0].classList.add("bk-content-current");
        }
      }

      // Reset state only after transition completes
      this.currentBook = -1;
      this.isTransitioning = false;

      if (callback) callback();
    }.bind(this);

    bookEl._closeTransitionHandler = closeHandler;
    bookEl.addEventListener(this.transEndEventName, closeHandler);
  }

  closeAllBooks() {
    // Force close any open books immediately
    const allBooks = document.querySelectorAll(".bk-book");
    allBooks.forEach((bookEl) => {
      // Clean up any pending transition handlers
      const openHandler = bookEl._openTransitionHandler;
      const closeHandler = bookEl._closeTransitionHandler;

      if (openHandler) {
        bookEl.removeEventListener(this.transEndEventName, openHandler);
        bookEl._openTransitionHandler = null;
      }

      if (closeHandler) {
        bookEl.removeEventListener(this.transEndEventName, closeHandler);
        bookEl._closeTransitionHandler = null;
      }

      if (bookEl.getAttribute("data-opened") === "true") {
        const bookItem = bookEl.parentElement;
        bookEl.setAttribute("data-opened", "false");
        bookEl.classList.remove("bk-viewinside", "bk-outside");
        if (bookItem) {
          bookItem.style.zIndex = bookItem.getAttribute("data-stackval");
        }

        // Reset to first page
        const contentElements = bookEl.querySelectorAll(".bk-content");
        if (contentElements) {
          contentElements.forEach((el) =>
            el.classList.remove("bk-content-current")
          );
          if (contentElements[0]) {
            contentElements[0].classList.add("bk-content-current");
          }
        }
      }
    });
    this.currentBook = -1;
    this.isTransitioning = false;
  }

  filterBooks() {
    if (
      this.currentFilters.includes("all") ||
      this.currentFilters.length === 0
    ) {
      return this.books;
    }
    return this.books.filter((book) =>
      this.currentFilters.includes(book.category)
    );
  }

  sortBooks(books) {
    return books.sort((a, b) => {
      if (this.currentSort === "title") {
        return a.title.localeCompare(b.title);
      } else if (this.currentSort === "author") {
        return a.author.localeCompare(b.author);
      } else if (this.currentSort === "genre") {
        return a.genre.localeCompare(b.genre);
      }
      return 0;
    });
  }

  createShelf(shelfNumber) {
    const shelfContainer = document.createElement("div");
    shelfContainer.className = "shelf-container";
    shelfContainer.innerHTML = `
      <ul id="bk-list-${shelfNumber}" class="bk-list clearfix"></ul>
      <div class="bookshelf"></div>
    `;
    return shelfContainer;
  }

  clearAllShelves() {
    const container = document.getElementById("dynamic-shelves-container");
    if (container) {
      container.innerHTML = "";
    }
    this.currentShelfCount = 0;
  }

  renderBooks() {
    // Close any currently open book before re-rendering
    this.closeAllBooks();

    const filteredBooks = this.filterBooks();
    const sortedBooks = this.sortBooks(filteredBooks);

    // Update Three.js display if available
    if (window.bookshelf3D) {
      window.bookshelf3D.refreshDisplay(sortedBooks);
    }

    // === OLD CSS 3D RENDERING CODE (No longer used - Three.js handles rendering) ===
    // Keeping this code commented for reference/rollback purposes
    /*
    // Clear all existing shelves
    this.clearAllShelves();

    // Calculate how many shelves we need
    const totalBooks = sortedBooks.length;
    const shelvesNeeded = Math.ceil(totalBooks / this.booksPerShelf);

    // Create shelves and distribute books
    const container = document.getElementById("dynamic-shelves-container");

    for (let shelfNum = 1; shelfNum <= shelvesNeeded; shelfNum++) {
      // Create new shelf
      const shelfElement = this.createShelf(shelfNum);
      container.appendChild(shelfElement);
      this.currentShelfCount++;

      // Calculate which books go on this shelf
      const startIndex = (shelfNum - 1) * this.booksPerShelf;
      const endIndex = Math.min(startIndex + this.booksPerShelf, totalBooks);
      const shelfBooks = sortedBooks.slice(startIndex, endIndex);

      // Add books to this shelf
      const shelfContainer = document.getElementById(`bk-list-${shelfNum}`);
      if (shelfContainer) {
        shelfBooks.forEach((book, localIndex) => {
          const globalIndex = startIndex + localIndex;
          const bookElement = this.createBookElement(book, globalIndex);
          shelfContainer.appendChild(bookElement);
        });
      }
    }
    */
  }

  setupEventListeners() {
    // Category filter dropdown
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
      categoryFilter.addEventListener("change", () => {
        const selectedOptions = Array.from(categoryFilter.selectedOptions);
        this.currentFilters = selectedOptions.map((option) => option.value);

        if (this.currentFilters.includes("all")) {
          this.currentFilters = ["all"];
          Array.from(categoryFilter.options).forEach((option) => {
            option.selected = option.value === "all";
          });
        }

        this.renderBooks();
      });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById("clearFilters");
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        this.currentFilters = ["all"];
        if (categoryFilter) {
          Array.from(categoryFilter.options).forEach((option) => {
            option.selected = option.value === "all";
          });
        }
        this.renderBooks();
      });
    }

    // Sort buttons
    document.querySelectorAll(".sort-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentSort = btn.dataset.sort;

        document
          .querySelectorAll(".sort-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        this.renderBooks();
      });
    });

    // Close book when clicking outside
    document.addEventListener("click", (e) => {
      // Don't close if clicking on controls or if transitioning
      if (
        this.isTransitioning ||
        e.target.closest(".bk-book") ||
        e.target.closest(".filter-controls") ||
        e.target.closest(".sort-btn") ||
        this.currentBook === -1
      ) {
        return;
      }

      // Close the current book
      this.closeCurrent();
    });
  }
}

// Initialize the library when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.bookLibrary = new BookLibrary();
});
