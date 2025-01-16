const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

async function getBlogPosts({ tag = null, page = 1, perPage = 5 } = {}) {
  const posts = [];
  const blogDir = path.join(__dirname, '../../content/blog');
  
  const files = await fs.readdir(blogDir);
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const content = await fs.readFile(path.join(blogDir, file), 'utf-8');
      const { metadata, markdown } = parsePostMetadata(content);
      
      // Skip posts that don't match the tag filter
      if (tag && (!metadata.tags || !metadata.tags.includes(tag))) {
        continue;
      }
      
      posts.push({
        slug: file.replace('.md', ''),
        title: metadata.title || 'Untitled',
        date: metadata.date || 'No date',
        summary: metadata.summary || '',
        tags: metadata.tags || [],
        content: markdown
      });
    }
  }
  
  // Sort posts by date, newest first
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Calculate pagination
  const totalPosts = sortedPosts.length;
  const totalPages = Math.ceil(totalPosts / perPage);
  const start = (page - 1) * perPage;
  const paginatedPosts = sortedPosts.slice(start, start + perPage);
  
  return {
    posts: paginatedPosts,
    pagination: {
      page,
      perPage,
      totalPosts,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

async function getAllTags() {
  const posts = await getBlogPosts();
  const tagCount = {};
  
  posts.posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

function parsePostMetadata(content) {
  const metadataRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const matches = content.match(metadataRegex);
  
  if (!matches) {
    return {
      metadata: {},
      markdown: content
    };
  }
  
  const metadata = {};
  const metadataStr = matches[1];
  const markdown = matches[2];
  
  metadataStr.split('\n').forEach(line => {
    const [key, ...values] = line.split(':');
    if (key && values.length) {
      const value = values.join(':').trim();
      if (key === 'tags') {
        metadata[key] = value.split(',').map(tag => tag.trim());
      } else {
        metadata[key] = value;
      }
    }
  });
  
  return { metadata, markdown };
}

module.exports = { getBlogPosts, parsePostMetadata, getAllTags }; 