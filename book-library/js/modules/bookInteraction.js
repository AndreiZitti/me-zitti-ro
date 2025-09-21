// BookInteraction - Handles book animations and interactions
export class BookInteraction {
  constructor() {
    this.currentBook = -1;
    this.isTransitioning = false;
    this.transEndEventName = this.getTransitionEndEvent();
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

  setupBookInteraction(bookItem, globalIndex, totalBooks) {
    const bookEl = bookItem.querySelector(".bk-book");
    const pageEl = bookItem.querySelector(".bk-page");
    const contentElements = bookItem.querySelectorAll(".bk-content");
    let currentPage = 0;

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
      bookItem.style.zIndex = totalBooks + 10;
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

  // Public getter for current book state
  getCurrentBook() {
    return this.currentBook;
  }

  // Public getter for transition state
  getIsTransitioning() {
    return this.isTransitioning;
  }
}