# Personal Book Library - 3D Showcase

A clean, interactive 3D book library showcasing personal book collection with CSS 3D transforms and smooth animations.

## Features

- **3D Book Animation**: Books displayed on realistic shelves with 3D rotation effects
- **Interactive Pages**: Click books to open and navigate through content pages
- **Filtering & Sorting**: Filter by genre and sort by title, author, or genre
- **Responsive Design**: Optimized for desktop and mobile devices
- **Clean Architecture**: Separated HTML, CSS, and JavaScript for maintainability

## Current Collection

### Science & Physics Shelf

- **Brief Answers to the Big Questions** by Stephen Hawking (9/10)
- **The Universe in a Nutshell** by Stephen Hawking (8/10)
- **A Brief History of Time** by Stephen Hawking (10/10)

### Fiction & Literature Shelf

- **IT** by Stephen King (9/10)
- **The Stand** by Stephen King (9/10)
- **Pet Sematary** by Stephen King (8/10)
- **1984** by George Orwell (10/10)

## File Structure

```
book-library/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling and 3D effects
├── js/
│   └── bookLibrary.js  # Book data and interactions
├── images/
│   └── shelf.png       # Bookshelf background image
└── README.md           # This file
```

## Usage

1. **Local Development**:

   ```bash
   cd book-library
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

2. **Adding New Books**:

   - Edit `js/bookLibrary.js`
   - Add book object to the `books` array
   - Include: title, author, genre, category, shelf, rating, quote, description

3. **Customizing Styles**:
   - Modify `css/styles.css`
   - Genre colors defined in `.book-{category}` classes
   - 3D effects in `.bk-list` and related classes

## React Conversion Notes

This library is designed to be easily converted to React:

### Recommended Component Structure:

```
components/
├── BookLibrary.jsx      # Main container component
├── BookShelf.jsx        # Individual shelf component
├── Book.jsx             # Single book component
├── BookPage.jsx         # Book content pages
├── FilterControls.jsx   # Filter and sort controls
└── styles/
    ├── BookLibrary.css
    ├── BookShelf.css
    └── Book.css
```

### Key Conversion Points:

1. **State Management**: Convert current class properties to React state
2. **Event Handlers**: Transform DOM event listeners to React event handlers
3. **Component Lifecycle**: Use useEffect for initialization and cleanup
4. **Props**: Pass book data and handlers as props between components
5. **CSS Modules**: Consider using CSS modules or styled-components

### Recommended Libraries:

- **Framer Motion**: For enhanced 3D animations
- **React Spring**: Alternative animation library
- **CSS-in-JS**: Emotion or styled-components for dynamic styling

## Browser Support

- Modern browsers with CSS 3D transform support
- Chrome 12+, Firefox 10+, Safari 4+, IE 10+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- Uses hardware acceleration via CSS 3D transforms
- Optimized for 60fps animations
- Minimal DOM manipulation during interactions
- Efficient event delegation

## Future Enhancements

- [ ] Book search functionality
- [ ] Reading progress tracking
- [ ] Book recommendations
- [ ] Reading notes and highlights
- [ ] Export/import book data
- [ ] Integration with reading APIs (Goodreads, etc.)
