# Quirky Personal Blog

A dynamic blog platform with some unconventional features. Built with Node.js and Express, using markdown for content management.

## Core Features

- **Dynamic Theme System**: Rainbow toggle (🌈) switches between light/dark modes with randomized color palettes
- **The Void Board**: Public message wall where thoughts float in digital space
  - Messages drift naturally with physics-based animations
  - Chaos mode (🌀) for wild message behavior
  - One-time boost system per message
- **Blog System**:
  - Tag-based navigation
  - Markdown posts with frontmatter
  - Pagination
- **Dynamic About Page**: Stats that change based on time:
  - Tab count varies by hour
  - Existential crises count changes weekly
  - Coffee dependency shifts between weekday/weekend
  - Project status adapts to day of week

## Project Structure

.
├── src/
│ ├── server.js # Main Express server
│ ├── templates/ # HTML templates
│ │ ├── base.html # Base template others inherit from
│ │ ├── blog.html # Blog listing template
│ │ └── void.html # Void page template
│ └── utils/ # Helper functions
│ ├── blogUtils.js # Blog post handling
│ └── quotes.js # Random quotes generator
├── public/
│ ├── css/
│ │ └── style.css # Main stylesheet
│ └── js/
│ └── voidEffects.js # Void page interactions
├── content/
│ ├── blog/ # Markdown blog posts
│ │ └── _.md
│ └── pages/ # Markdown static pages
│ └── _.md
└── package.json

Key aspects:

1. src/ - Server-side code and templates
2. public/ - Static assets (CSS, JS, images)
3. content/ - Markdown content for blog posts and pages
4. Templates use Nunjucks templating
5. Express serves the app
6. Blog posts and pages are written in Markdown
7. CSS is organized in a single file (could be split if it grows)
8. Client-side JS is modular per feature

## Quick Start

```
bash
npm install
npm start
```

### Static Pages

Add `.md` files to `content/pages/`

## Key Components

- `src/utils/metrics.js`: Generates time-based metrics for about page
- `src/templates/void.html`: Handles floating message board
- `src/utils/blogUtils.js`: Blog post parsing and pagination
- `src/utils/quotes.js`: Random quote generation for footer

## Notes

- Messages in The Void persist via localStorage
- Theme preferences are saved between sessions
- Particle effects trigger on navigation/theme

```

```
