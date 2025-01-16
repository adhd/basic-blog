const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');
const { getBlogPosts, parsePostMetadata } = require('./utils/blogUtils');

// Configure marked
marked.setOptions({
  headerIds: false,
  mangle: false,
  html: true
});

async function buildSite() {
  try {
    // Create dist directory
    await fs.mkdir('dist', { recursive: true });
    await fs.mkdir('dist/blog', { recursive: true });
    await fs.mkdir('dist/pages', { recursive: true });
    
    // Copy static assets
    await fs.cp('public', 'dist', { recursive: true });
    
    // Read base template
    const template = await fs.readFile(path.join(__dirname, 'templates/base.html'), 'utf-8');
    
    // Build index page
    const indexContent = await fs.readFile(path.join(__dirname, '../content/index.md'), 'utf-8');
    const indexHtml = template.replace('{{content}}', marked(indexContent));
    await fs.writeFile('dist/index.html', indexHtml);
    
    // Build blog index
    const { posts } = await getBlogPosts();
    let blogIndexContent = '# Blog Posts\n\n';
    
    for (const post of posts) {
      blogIndexContent += `## [${post.title}](/blog/${post.slug})\n`;
      blogIndexContent += `*${post.date}*\n\n`;
      blogIndexContent += `${post.summary}\n\n`;
      if (post.tags.length) {
        blogIndexContent += `Tags: ${post.tags.join(', ')}\n\n`;
      }
      blogIndexContent += '---\n\n';
    }
    
    const blogIndexHtml = template.replace('{{content}}', marked(blogIndexContent));
    await fs.writeFile('dist/blog/index.html', blogIndexHtml);
    
    // Build individual blog posts
    for (const post of posts) {
      const postContent = await fs.readFile(path.join(__dirname, `../content/blog/${post.slug}.md`), 'utf-8');
      const postHtml = template.replace('{{content}}', marked(postContent));
      await fs.writeFile(`dist/blog/${post.slug}.html`, postHtml);
    }
    
    // Build static pages
    const pages = ['about', 'faq'];
    for (const page of pages) {
      const pageContent = await fs.readFile(path.join(__dirname, `../content/pages/${page}.md`), 'utf-8');
      const pageHtml = template.replace('{{content}}', marked(pageContent));
      await fs.writeFile(`dist/${page}.html`, pageHtml);
    }
    
    // Copy contact page
    const contactTemplate = await fs.readFile(path.join(__dirname, 'templates/contact.html'), 'utf-8');
    await fs.writeFile('dist/contact.html', contactTemplate);
    
    console.log('Site built successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildSite(); 