// BookRenderer - Handles DOM manipulation and book creation
export class BookRenderer {
  constructor() {
    this.booksPerShelf = 6; // Maximum books per shelf
    this.currentShelfCount = 0;
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

  createBookElement(book, globalIndex, totalBooks, onBookCreated) {
    const bookItem = document.createElement("li");
    const pageContent = this.generateBookPages(book);

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
        <div class="bk-left">
          <h2>
            <span>${book.author}</span>
            <span>${book.title}</span>
          </h2>
        </div>
        <div class="bk-top"></div>
        <div class="bk-bottom"></div>
      </div>
    `;

    // Set z-index for proper stacking
    if (globalIndex < totalBooks / 2) {
      bookItem.style.zIndex = globalIndex;
      bookItem.setAttribute("data-stackval", globalIndex);
    } else {
      const stackVal = totalBooks - 1 - globalIndex;
      bookItem.style.zIndex = stackVal;
      bookItem.setAttribute("data-stackval", stackVal);
    }

    // Add page navigation
    this.addPageNavigation(bookItem);

    // Callback to setup interactions
    if (onBookCreated) {
      onBookCreated(bookItem, globalIndex, totalBooks);
    }

    return bookItem;
  }

  addPageNavigation(bookItem) {
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

  renderBooks(books, onBookCreated) {
    // Clear all existing shelves
    this.clearAllShelves();

    // Calculate how many shelves we need
    const totalBooks = books.length;
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
      const shelfBooks = books.slice(startIndex, endIndex);

      // Add books to this shelf
      const shelfContainer = document.getElementById(`bk-list-${shelfNum}`);
      if (shelfContainer) {
        shelfBooks.forEach((book, localIndex) => {
          const globalIndex = startIndex + localIndex;
          const bookElement = this.createBookElement(
            book,
            globalIndex,
            totalBooks,
            onBookCreated
          );
          shelfContainer.appendChild(bookElement);
        });
      }
    }
  }
}