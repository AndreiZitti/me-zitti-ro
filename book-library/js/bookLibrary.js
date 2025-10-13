// Personal Book Library - 3D Showcase
// Clean implementation with user's specific books

class BookLibrary {
  constructor() {
    this.books = [];
    this.currentFilters = ["all"];
    this.currentSort = "title";
    this.booksPerShelf = 13; // Maximum books per shelf - forces overflow to second shelf

    this.init();
  }

  // Load books from JSON file
  async loadBooks() {
    try {
      const response = await fetch('data/books.json');
      this.books = await response.json();
      console.log(`Loaded ${this.books.length} books from JSON`);
    } catch (error) {
      console.error('Error loading books:', error);
      this.books = [];
    }
  }

  async init() {
    await this.loadBooks();
    this.renderBooks();
    this.setupEventListeners();
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

  renderBooks() {
    const filteredBooks = this.filterBooks();
    const sortedBooks = this.sortBooks(filteredBooks);

    // Update Three.js display if available
    if (window.bookshelf3D) {
      window.bookshelf3D.refreshDisplay(sortedBooks);
    }
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

  }
}

// Initialize the library when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.bookLibrary = new BookLibrary();
});
