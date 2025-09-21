// BookEventHandlers - Handles filter/sort event handling
export class BookEventHandlers {
  constructor(onFilterChange, onSortChange, onCloseBook, bookInteraction) {
    this.onFilterChange = onFilterChange;
    this.onSortChange = onSortChange;
    this.onCloseBook = onCloseBook;
    this.bookInteraction = bookInteraction;
    this.currentFilters = ["all"];
    this.currentSort = "title";
    
    this.setupEventListeners();
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

        this.onFilterChange(this.currentFilters);
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
        this.onFilterChange(this.currentFilters);
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

        this.onSortChange(this.currentSort);
      });
    });

    // Close book when clicking outside
    document.addEventListener("click", (e) => {
      // Don't close if clicking on controls or if transitioning
      if (
        this.bookInteraction.getIsTransitioning() ||
        e.target.closest(".bk-book") ||
        e.target.closest(".filter-controls") ||
        e.target.closest(".sort-btn") ||
        this.bookInteraction.getCurrentBook() === -1
      ) {
        return;
      }

      // Close the current book
      this.onCloseBook();
    });
  }

  getCurrentFilters() {
    return this.currentFilters;
  }

  getCurrentSort() {
    return this.currentSort;
  }

  setCurrentFilters(filters) {
    this.currentFilters = filters;
  }

  setCurrentSort(sort) {
    this.currentSort = sort;
  }
}