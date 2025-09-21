// Personal Book Library - 3D Showcase
// Refactored modular implementation

import { BookRenderer } from './modules/bookRenderer.js';
import { BookInteraction } from './modules/bookInteraction.js';
import { BookEventHandlers } from './modules/bookEventHandlers.js';

class BookLibrary {
  constructor() {
    this.books = [];
    this.renderer = new BookRenderer();
    this.interaction = new BookInteraction();
    this.eventHandlers = null; // Will be initialized after other setup
    
    this.init();
  }

  async init() {
    await this.loadBooks();
    this.setupEventHandlers();
    this.renderBooks();
  }

  // Load books from localStorage or JSON file
  async loadBooks() {
    const storedBooks = localStorage.getItem("bookLibraryData");
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    } else {
      try {
        // Load from JSON file
        const response = await fetch('./data/books.json');
        if (response.ok) {
          this.books = await response.json();
          // Save to localStorage for future use
          localStorage.setItem("bookLibraryData", JSON.stringify(this.books));
        } else {
          console.error('Failed to load books.json');
          this.books = [];
        }
      } catch (error) {
        console.error('Error loading books:', error);
        this.books = [];
      }
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

  setupEventHandlers() {
    this.eventHandlers = new BookEventHandlers(
      (filters) => this.handleFilterChange(filters),
      (sort) => this.handleSortChange(sort),
      () => this.handleCloseBook(),
      this.interaction
    );
  }

  handleFilterChange(filters) {
    this.eventHandlers.setCurrentFilters(filters);
    this.renderBooks();
  }

  handleSortChange(sort) {
    this.eventHandlers.setCurrentSort(sort);
    this.renderBooks();
  }

  handleCloseBook() {
    this.interaction.closeCurrent();
  }

  filterBooks() {
    const currentFilters = this.eventHandlers.getCurrentFilters();
    
    if (
      currentFilters.includes("all") ||
      currentFilters.length === 0
    ) {
      return this.books;
    }
    return this.books.filter((book) =>
      currentFilters.includes(book.category)
    );
  }

  sortBooks(books) {
    const currentSort = this.eventHandlers.getCurrentSort();
    
    return books.sort((a, b) => {
      if (currentSort === "title") {
        return a.title.localeCompare(b.title);
      } else if (currentSort === "author") {
        return a.author.localeCompare(b.author);
      } else if (currentSort === "genre") {
        return a.genre.localeCompare(b.genre);
      }
      return 0;
    });
  }

  renderBooks() {
    // Close any currently open book before re-rendering
    this.interaction.closeAllBooks();

    const filteredBooks = this.filterBooks();
    const sortedBooks = this.sortBooks(filteredBooks);

    // Render books using the renderer module
    this.renderer.renderBooks(sortedBooks, (bookItem, globalIndex, totalBooks) => {
      // Setup interactions for each book
      this.interaction.setupBookInteraction(bookItem, globalIndex, totalBooks);
    });
  }
}

// Initialize the library when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BookLibrary();
});