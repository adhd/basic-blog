const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// Import all required utilities
const {
    setupRoutes,
    renderPage,
    marked,
    getRandomQuote
} = require('../../src/server');

// Configure marked
marked.setOptions({
    headerIds: false,
    mangle: false,
    html: true,
    xhtml: true
});

// Set base path for file operations
const BASE_PATH = path.join(__dirname, '../..');

// Setup middleware
app.use(express.static(path.join(BASE_PATH, 'public')));
app.use(express.urlencoded({ extended: true }));

// Setup template engine
app.set('views', path.join(BASE_PATH, 'src/templates'));

// Setup routes
setupRoutes(app);

// Error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

// Export handler
module.exports.handler = serverless(app, {
    binary: ['image/*', 'font/*'],
    basePath: '/'
}); 