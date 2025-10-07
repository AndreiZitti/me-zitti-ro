# Azitti Portfolio - Interactive Particle Animation Website

A comprehensive portfolio website featuring particle-to-object animations and showcasing projects and interests in astronomy, literature, sailing, and web development.

## 🌟 Projects Overview

### 🔭 **Star Map** (`/star-map/`)

An interactive constellation explorer with:

- Real-time navigation and zoom
- Detailed star information
- Constellation filtering
- Realistic Milky Way background
- Touch and mobile support

### 📚 **Book Library** (`/book-library/`)

A 3D showcase of personal book collection featuring:

- Interactive 3D book animations
- Filtering by genre and rating
- Detailed book information
- Admin panel for book management
- Responsive design

### 👤 **Contact Me** (`/contact-me/`)

Professional contact page with:

- Contact form with validation
- Social media links
- Personal information and interests
- Interactive animations

### ⛵ **Sailing Adventures** (`/sailing/`)

Maritime journey showcase including:

- Adventure stories and experiences
- Skills and certifications
- Interactive weather simulation
- Animated ocean effects

### 💻 **External Links**

Direct links to external repositories and profiles.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher)

### Installation & Development

1. **Clone and Setup**:

   ```bash
   # Clone the repository
   git clone <repository-url>
   cd azitti

   # Install dependencies
   npm install

   # Start development server with live reload
   npm start
   ```

   This opens the particle animation website at `http://localhost:3000`

2. **Alternative Development**:

   ```bash
   # Using simple HTTP server
   npm run serve

   # Or traditional Python server (no live reload)
   python3 -m http.server 8000
   ```

3. **Production Build**:

   ```bash
   # Build optimized version
   npm run build

   # Preview production build
   npm run preview
   ```

### Navigation
- **Main Animation**: Scroll-triggered particle-to-object transformations
- **Interactive Objects**: Click laptop, bookshelf, or telescope to explore sections
- **Keyboard**: Tab navigation, Enter/Space activation, ESC to return
- **Mobile**: Touch-friendly responsive design

## 🎨 Particle Animation Features

### ✨ Main Animation Sequence
1. **Boring Intro** (0-25% scroll) - Simple text introduction
2. **Background Formation** (25-35% scroll) - Particles cluster and background fades in
3. **Laptop Formation** (40-45% scroll) - Particles form laptop outline
4. **Bookshelf Formation** (55-60% scroll) - Complex multi-shelf particle arrangement
5. **Telescope Formation** (70-75% scroll) - Cylindrical particle formation
6. **Scene Completion** (85%+ scroll) - All objects become interactive

### ⚡ Performance Features
- **Device Detection**: Automatic performance level assessment (high/medium/low)
- **Dynamic Optimization**: Real-time FPS monitoring and particle count adjustment
- **GPU Acceleration**: CSS transforms for smooth 60fps animations
- **Memory Management**: Object pooling and efficient resource cleanup
- **Accessibility**: Reduced motion support and keyboard navigation

## 📜 Available NPM Scripts

### Development
- `npm start` or `npm run dev` - Start development server with live reload
- `npm run serve` - Alternative HTTP server

### Production
- `npm run build` - Build optimized production version
- `npm run preview` - Preview production build locally
- `npm run clean` - Clean build directory

### Code Quality
- `npm run lint` - Run ESLint on JavaScript files
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run validate` - Run linting and formatting checks

## 📁 Project Structure

```
azitti/
├── package.json               # NPM project configuration
├── main/                      # Particle animation website
│   ├── index.html            # Main HTML with particle canvas
│   ├── assets/               # Animation assets (background, objects)
│   │   └── main_animation/   # PNG files for particle-to-object formation
│   ├── css/                  # Stylesheets
│   │   ├── main.css         # Base styles and responsive design
│   │   ├── particles.css    # Particle system styling
│   │   └── animations.css   # GSAP animation definitions
│   └── js/                   # JavaScript modules
│       ├── main.js          # Application controller
│       ├── particles.js     # Canvas-based particle system (300 particles)
│       ├── scroll-controller.js # GSAP ScrollTrigger integration
│       ├── object-formation.js  # Particle-to-object transformation logic
│       └── performance.js   # Performance monitoring and optimization
├── star-map/                 # Interactive star map
│   ├── index.html
│   ├── css/styles.css
│   ├── js/
│   │   ├── starData.js       # Astronomical data
│   │   └── starMap.js        # Main app logic
│   └── images/MilkyWay.jpg
├── book-library/             # 3D book showcase
│   ├── index.html
│   ├── admin.html           # Book management
│   ├── css/
│   ├── js/
│   └── images/
├── contact-me/               # Contact and about page
│   ├── index.html
│   ├── css/styles.css
│   └── js/contact.js
├── sailing/                  # Sailing adventures
│   ├── index.html
│   ├── css/styles.css
│   └── js/sailing.js
└── README.md                # This file
```

## ✨ Features

### Main Portfolio

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Transitions**: Loading animations and smooth navigation
- **Interactive Cards**: Hover effects and click animations
- **Background Management**: Beautiful gradient backgrounds
- **Keyboard Navigation**: ESC to return, Enter/Space to select

### Cross-Project Features

- **Back Navigation**: Universal back-to-main functionality
- **Loading States**: Smooth transitions between projects
- **Error Handling**: Graceful fallbacks for missing resources
- **SEO Friendly**: Proper meta tags and semantic HTML

## 🛠️ Technologies Used

### Core Animation Stack
- **JavaScript**: Vanilla ES6+ with classes and modules
- **Animation**: GSAP 3.12+ with ScrollTrigger plugin
- **Graphics**: HTML5 Canvas API for particle rendering
- **Styling**: CSS3 with Grid, Flexbox, and transforms
- **Performance**: RequestAnimationFrame with FPS monitoring

### Development Tools
- **Build**: PostCSS with Autoprefixer and CSSnano
- **Minification**: Terser for JavaScript compression
- **Development**: Live Server with hot reload
- **Code Quality**: ESLint and Prettier
- **Package Management**: NPM with modern scripts

### Browser APIs
- **Canvas**: 2D context for particle rendering
- **Intersection Observer**: Viewport-based optimizations
- **Device Memory API**: Performance level detection
- **Reduced Motion**: Accessibility preferences
- **WebGL**: Optional GPU detection for capability assessment

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Design Philosophy

- **Minimalist**: Clean, focused interfaces
- **Interactive**: Engaging user experiences
- **Educational**: Learning through exploration
- **Personal**: Reflects individual interests and personality
- **Accessible**: Keyboard navigation and responsive design

## 🔧 Development

### Adding New Projects

1. Create new project directory
2. Add thumbnail to `main/assets/`
3. Update navigation in `main/js/navigation.js`
4. Add new route and portfolio card in `index.html`

### Customization

- Update project information in each section
- Modify colors and themes in CSS files
- Add new animations or interactions in JS files
- Replace placeholder content with personal information

## 📊 Performance Notes

- **Optimized Images**: Properly sized thumbnails and backgrounds
- **Lazy Loading**: Content loads as needed
- **Efficient Animations**: Hardware-accelerated CSS transforms
- **Minimal Dependencies**: Pure vanilla JavaScript for fast loading

## 🌐 Deployment

Ready for deployment to:

- **GitHub Pages**: Static hosting
- **Netlify**: Continuous deployment
- **Vercel**: Edge network deployment
- **Any Static Host**: Works with any static file hosting

## 📝 License

Personal portfolio project. Feel free to use as inspiration for your own portfolio.

---

_Built with passion for web development, astronomy, literature, and sailing adventures_ ⭐📚⛵💻
