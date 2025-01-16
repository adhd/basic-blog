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
├── content/
│ ├── blog/ # Markdown blog posts
│ └── pages/ # Static page content
├── public/
│ └── css/ # Stylesheets
├── src/
│ ├── templates/ # HTML templates
│ ├── utils/ # Helper functions
│ └── server.js # Express server


## Quick Start

bash
npm install
npm start
:
markdown
---
title: Post Title
date: YYYY-MM-DD
tags: [tag1, tag2]
---

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
