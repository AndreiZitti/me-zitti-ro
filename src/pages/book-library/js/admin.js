// Book Library Admin Panel
// Handles CRUD operations for book management

class BookLibraryAdmin {
  constructor() {
    this.books = [];
    this.editingBookId = null;
    this.currentFilter = "";

    this.init();
  }

  init() {
    this.loadBooks();
    this.setupEventListeners();
    this.renderBooksTable();
  }

  // Load books from localStorage or use default data
  loadBooks() {
    const storedBooks = localStorage.getItem("bookLibraryData");
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    } else {
      // Default books + new books from user
      this.books = [
        // All books (shelves assigned dynamically)
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
      this.saveBooks();
    }
  }

  // Save books to localStorage
  saveBooks() {
    localStorage.setItem("bookLibraryData", JSON.stringify(this.books));
    // Trigger a storage event to update the main library if it's open
    window.dispatchEvent(new Event("storage"));
  }

  // Get next available ID
  getNextId() {
    return Math.max(...this.books.map((book) => book.id), 0) + 1;
  }

  // Filter books based on search term
  filterBooks() {
    if (!this.currentFilter) {
      return this.books;
    }

    const filter = this.currentFilter.toLowerCase();
    return this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(filter) ||
        book.author.toLowerCase().includes(filter) ||
        book.genre.toLowerCase().includes(filter) ||
        book.category.toLowerCase().includes(filter)
    );
  }

  // Render the books table
  renderBooksTable() {
    const tbody = document.getElementById("booksTableBody");
    const filteredBooks = this.filterBooks();

    if (filteredBooks.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <h3>No books found</h3>
            <p>${
              this.currentFilter
                ? "Try adjusting your search terms."
                : 'Click "Add New Book" to get started.'
            }</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filteredBooks
      .map(
        (book) => `
      <tr>
        <td class="book-title">${this.escapeHtml(book.title)}</td>
        <td class="book-author">${this.escapeHtml(book.author)}</td>
        <td class="book-genre">${this.escapeHtml(book.genre)}</td>
        <td>
          <span class="book-category category-${book.category}">
            ${this.escapeHtml(book.category)}
          </span>
        </td>

        <td class="book-rating">${this.escapeHtml(book.rating || "N/A")}</td>
        <td class="actions">
          <button class="btn btn-secondary" onclick="admin.editBook(${
            book.id
          })">Edit</button>
          <button class="btn btn-danger" onclick="admin.deleteBook(${
            book.id
          })">Delete</button>
        </td>
      </tr>
    `
      )
      .join("");
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Show the book modal for adding/editing
  showBookModal(book = null) {
    const modal = document.getElementById("bookModal");
    const modalTitle = document.getElementById("modalTitle");
    const form = document.getElementById("bookForm");

    if (book) {
      modalTitle.textContent = "Edit Book";
      this.editingBookId = book.id;
      this.populateForm(book);
    } else {
      modalTitle.textContent = "Add New Book";
      this.editingBookId = null;
      form.reset();
    }

    modal.classList.add("show");
    modal.style.display = "block";
  }

  // Hide the book modal
  hideBookModal() {
    const modal = document.getElementById("bookModal");
    modal.classList.remove("show");
    modal.style.display = "none";
    this.editingBookId = null;
  }

  // Populate form with book data
  populateForm(book) {
    document.getElementById("bookTitle").value = book.title || "";
    document.getElementById("bookAuthor").value = book.author || "";
    document.getElementById("bookGenre").value = book.genre || "";
    document.getElementById("bookCategory").value = book.category || "";
    // Note: shelf assignment is now handled dynamically
    document.getElementById("bookRating").value = book.rating || "";
    document.getElementById("bookQuote").value = book.quote || "";
    document.getElementById("bookDescription").value = book.description || "";
  }

  // Save book (add or edit)
  saveBook(formData) {
    const bookData = {
      title: formData.get("title").trim(),
      author: formData.get("author").trim(),
      genre: formData.get("genre").trim(),
      category: formData.get("category"),
      // Note: shelf assignment is now handled dynamically in the main library
      rating: formData.get("rating").trim(),
      quote: formData.get("quote").trim(),
      description: formData.get("description").trim(),
    };

    // Validation
    if (
      !bookData.title ||
      !bookData.author ||
      !bookData.genre ||
      !bookData.category
    ) {
      this.showMessage("Please fill in all required fields.", "error");
      return false;
    }

    if (this.editingBookId) {
      // Edit existing book
      const bookIndex = this.books.findIndex(
        (book) => book.id === this.editingBookId
      );
      if (bookIndex !== -1) {
        this.books[bookIndex] = { ...this.books[bookIndex], ...bookData };
        this.showMessage("Book updated successfully!", "success");
      }
    } else {
      // Add new book
      const newBook = {
        id: this.getNextId(),
        ...bookData,
      };
      this.books.push(newBook);
      this.showMessage("Book added successfully!", "success");
    }

    this.saveBooks();
    this.renderBooksTable();
    this.hideBookModal();
    return true;
  }

  // Edit book
  editBook(id) {
    const book = this.books.find((book) => book.id === id);
    if (book) {
      this.showBookModal(book);
    }
  }

  // Delete book
  deleteBook(id) {
    const book = this.books.find((book) => book.id === id);
    if (book) {
      const modal = document.getElementById("deleteModal");
      const titleSpan = document.getElementById("deleteBookTitle");
      titleSpan.textContent = book.title;

      // Store the ID for deletion
      document.getElementById("confirmDeleteBtn").onclick = () => {
        this.confirmDelete(id);
      };

      modal.classList.add("show");
      modal.style.display = "block";
    }
  }

  // Confirm delete
  confirmDelete(id) {
    const bookIndex = this.books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
      const bookTitle = this.books[bookIndex].title;
      this.books.splice(bookIndex, 1);
      this.saveBooks();
      this.renderBooksTable();
      this.hideDeleteModal();
      this.showMessage(`"${bookTitle}" deleted successfully!`, "success");
    }
  }

  // Hide delete modal
  hideDeleteModal() {
    const modal = document.getElementById("deleteModal");
    modal.classList.remove("show");
    modal.style.display = "none";
  }

  // Show message
  showMessage(text, type = "success") {
    // Remove existing messages
    const existingMessages = document.querySelectorAll(".message");
    existingMessages.forEach((msg) => msg.remove());

    // Create new message
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;

    // Insert at the top of the container
    const container = document.querySelector(".container");
    container.insertBefore(message, container.firstChild.nextSibling);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 5000);
  }

  // Setup event listeners
  setupEventListeners() {
    // Add book button
    document.getElementById("addBookBtn").addEventListener("click", () => {
      this.showBookModal();
    });

    // Search functionality
    document.getElementById("searchBooks").addEventListener("input", (e) => {
      this.currentFilter = e.target.value;
      this.renderBooksTable();
    });

    // Book form submission
    document.getElementById("bookForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      this.saveBook(formData);
    });

    // Cancel button
    document.getElementById("cancelBtn").addEventListener("click", () => {
      this.hideBookModal();
    });

    // Modal close buttons
    document.querySelectorAll(".close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        if (modal.id === "deleteModal") {
          this.hideDeleteModal();
        } else {
          this.hideBookModal();
        }
      });
    });

    // Cancel delete button
    document.getElementById("cancelDeleteBtn").addEventListener("click", () => {
      this.hideDeleteModal();
    });

    // Click outside modal to close
    window.addEventListener("click", (e) => {
      const bookModal = document.getElementById("bookModal");
      const deleteModal = document.getElementById("deleteModal");

      if (e.target === bookModal) {
        this.hideBookModal();
      } else if (e.target === deleteModal) {
        this.hideDeleteModal();
      }
    });

    // Form data collection
    const form = document.getElementById("bookForm");
    const formInputs = form.querySelectorAll("input, select, textarea");

    formInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const formData = new FormData();
        formData.append("title", document.getElementById("bookTitle").value);
        formData.append("author", document.getElementById("bookAuthor").value);
        formData.append("genre", document.getElementById("bookGenre").value);
        formData.append(
          "category",
          document.getElementById("bookCategory").value
        );
        // Note: shelf assignment is now handled dynamically
        formData.append("rating", document.getElementById("bookRating").value);
        formData.append("quote", document.getElementById("bookQuote").value);
        formData.append(
          "description",
          document.getElementById("bookDescription").value
        );
      });
    });
  }
}

// Initialize admin panel when DOM is loaded
let admin;
document.addEventListener("DOMContentLoaded", () => {
  admin = new BookLibraryAdmin();
});

// Export for global access
window.admin = admin;
