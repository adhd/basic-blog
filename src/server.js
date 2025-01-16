const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { marked } = require('marked');
const { getBlogPosts, parsePostMetadata, getAllTags } = require('./utils/blogUtils');
const { getRandomQuote } = require('./utils/quotes');
const { getMetrics } = require('./utils/metrics');

// Add this configuration for marked
marked.setOptions({
  headerIds: false,
  mangle: false,
  html: true,  // Allow HTML in markdown
  xhtml: true  // Use XHTML style tags
});

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Helper function to render pages
async function renderPage(templatePath, content, res) {
    try {
        const template = await fs.readFile(path.join(__dirname, 'templates/base.html'), 'utf-8');
        let htmlContent;

        // If content is a file path, read and process it
        if (content.includes('/')) {
            const fileContent = await fs.readFile(content, 'utf-8');
            htmlContent = marked(fileContent);
        } else {
            // Content is already a string, just process it
            htmlContent = marked(content);
        }
        
        // Add wrapper div for special pages
        let wrappedContent = htmlContent;
        if (content.includes('about')) {
            wrappedContent = `<div class="about-content">${htmlContent}</div>`;
        } else if (content.includes('faq')) {
            wrappedContent = `<div class="faq-content">${htmlContent}</div>`;
        }
        
        const randomQuote = getRandomQuote();
        const page = template
            .replace('{{content}}', wrappedContent)
            .replace('{{random_quote}}', randomQuote);
        
        res.send(page);
    } catch (error) {
        console.error('Page rendering error:', error);
        res.status(404).send('Page not found');
    }
}

// Routes
app.get('/', async (req, res) => {
  try {
    const template = await fs.readFile(path.join(__dirname, 'templates/home.html'), 'utf-8');
    const randomQuote = getRandomQuote();
    const page = template.replace('{{random_quote}}', randomQuote);
    res.send(page);
  } catch (error) {
    console.error('Home page error:', error);
    res.status(500).send('Error loading home page');
  }
});

// Add the /blog route before the generic /:page route
app.get('/blog', async (req, res) => {
  try {
    const template = await fs.readFile(path.join(__dirname, 'templates/base.html'), 'utf-8');
    const page = parseInt(req.query.page) || 1;
    const tag = req.query.tag || null;
    
    const { posts, pagination } = await getBlogPosts({ tag, page });
    const tags = await getAllTags();
    
    let content = '# Blog Posts\n\n';
    
    // Add tag filter UI with better formatting
    content += '<div class="tags-container">\n';
    content += tags.map(({ tag, count }) => 
      `<a href="${tag === req.query.tag ? '/blog' : `/blog?tag=${tag}`}" class="tag">
        ${tag} <span class="tag-count">${count}</span>
      </a>`
    ).join('\n');
    content += '\n</div>\n\n';
    
    // Add posts with better formatting
    if (posts.length === 0) {
      content += '<div class="no-posts">*No posts found.*</div>\n\n';
    } else {
      content += '<div class="blog-posts">\n';
      for (const post of posts) {
        content += '<article class="post-preview">\n';
        content += `<h2><a href="/blog/${post.slug}">${post.title}</a></h2>\n`;
        content += `<div class="post-meta">${post.date}</div>\n`;
        content += `<div class="post-summary">${post.summary}</div>\n`;
        
        if (post.tags.length) {
          content += '<div class="post-tags">\n';
          content += post.tags.map(tag => 
            `<a href="/blog?tag=${tag}" class="tag">${tag}</a>`
          ).join('\n');
          content += '\n</div>\n';
        }
        content += '</article>\n\n';
      }
      content += '</div>\n';
    }
    
    // Add pagination with better formatting
    if (pagination.totalPages > 1) {
      content += '<nav class="pagination">\n';
      
      if (pagination.hasPrev) {
        content += `<a href="/blog?page=${page - 1}${tag ? `&tag=${tag}` : ''}" class="page-link">← Previous</a>\n`;
      }
      
      content += '<div class="page-numbers">\n';
      for (let i = 1; i <= pagination.totalPages; i++) {
        if (i === page) {
          content += `<span class="page-current">${i}</span>\n`;
        } else {
          content += `<a href="/blog?page=${i}${tag ? `&tag=${tag}` : ''}" class="page-link">${i}</a>\n`;
        }
      }
      content += '</div>\n';
      
      if (pagination.hasNext) {
        content += `<a href="/blog?page=${page + 1}${tag ? `&tag=${tag}` : ''}" class="page-link">Next →</a>\n`;
      }
      
      content += '</nav>\n';
    }
    
    const htmlContent = marked(content);
    const renderedPage = template.replace('{{content}}', htmlContent);
    res.send(renderedPage);
  } catch (error) {
    console.error('Blog index error:', error);
    res.status(500).send('Error loading blog posts');
  }
});

app.get('/blog/:post', async (req, res) => {
  try {
    const template = await fs.readFile(path.join(__dirname, 'templates/base.html'), 'utf-8');
    const postPath = path.join(__dirname, `../content/blog/${req.params.post}.md`);
    const content = await fs.readFile(postPath, 'utf-8');
    
    // Parse the frontmatter and content
    const { metadata, markdown } = parsePostMetadata(content);
    
    // Create formatted content with metadata
    let formattedContent = `<article class="blog-post">\n`;
    formattedContent += `<h1>${metadata.title}</h1>\n`;
    
    // Add subtitle if it exists in metadata
    if (metadata.subtitle) {
      formattedContent += `<p class="post-subtitle">${metadata.subtitle}</p>\n`;
    }
    
    formattedContent += `<div class="post-meta">
      <time datetime="${metadata.date}">${metadata.date}</time>
    </div>\n`;
    
    // Add tags if they exist
    if (metadata.tags && metadata.tags.length) {
      formattedContent += '<div class="post-tags">\n';
      formattedContent += metadata.tags.map(tag => 
        `<a href="/blog?tag=${tag}" class="tag">${tag}</a>`
      ).join('\n');
      formattedContent += '</div>\n';
    }
    
    // Add the main content
    formattedContent += `<div class="post-content">\n${marked(markdown)}\n</div>`;
    formattedContent += '</article>';
    
    const renderedPage = template.replace('{{content}}', formattedContent);
    res.send(renderedPage);
  } catch (error) {
    console.error('Blog post error:', error);
    res.status(404).send('Blog post not found');
  }
});

// Add contact routes before the generic /:page route
app.get('/contact', async (req, res) => {
  try {
    const template = await fs.readFile(path.join(__dirname, 'templates/void.html'), 'utf-8');
    const randomQuote = getRandomQuote();
    const page = template.replace('{{random_quote}}', randomQuote);
    res.send(page);
  } catch (error) {
    console.error('Contact page error:', error);
    res.status(500).send('Error loading contact page');
  }
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;
  
  // For now, just log the submission and send a success message
  // In a real app, you'd want to send an email or save to a database
  console.log('Contact form submission:', { name, email, message });
  
  // Redirect back to contact page with a success parameter
  res.redirect('/contact?success=true');
});

// Update the about page route
app.get('/about', async (req, res) => {
    try {
        const metrics = getMetrics();
        const aboutContent = await fs.readFile(path.join(__dirname, '../content/pages/about.md'), 'utf-8');
        
        // Replace placeholders with dynamic metrics
        const dynamicContent = aboutContent
            .replace('{{average_tabs}}', metrics.averageTabs)
            .replace('{{existential_crises}}', metrics.crises)
            .replace('{{coffee_dependency}}', metrics.coffeeDependency)
            .replace('{{unfinished_projects}}', metrics.unfinishedProjects);
        
        await renderPage('templates/base.html', dynamicContent, res);
    } catch (error) {
        console.error('About page error:', error);
        res.status(500).send('Error loading about page');
    }
});

// This should be last as it's a catch-all route
app.get('/:page', async (req, res) => {
  const page = req.params.page;
  await renderPage(
    'templates/base.html',
    path.join(__dirname, `../content/pages/${page}.md`),
    res
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 