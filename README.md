# Personal Portfolio Website

A comprehensive portfolio website showcasing projects and interests in astronomy, literature, sailing, and web development.

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

1. **Local Development**:

   ```bash
   # Clone and navigate to project
   cd PersonalWebsite

   # Start local server
   python3 -m http.server 8000

   # Visit http://localhost:8000
   ```

2. **Navigation**:
   - Main page: Beautiful landing page with project cards
   - Click any card to explore that project
   - Use "Back to Main" buttons or ESC key to return
   - External links open in new tabs

## 📁 Project Structure

```
PersonalWebsite/
├── index.html                 # Main landing page
├── main/                      # Main app assets and navigation
│   ├── assets/               # Project thumbnails
│   ├── css/styles.css        # Main styling
│   └── js/navigation.js      # Navigation logic
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

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS3 Animations
- **Interactive**: Canvas API (Star Map), DOM manipulation
- **Responsive**: Mobile-first responsive design
- **Performance**: Optimized images, efficient animations

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
