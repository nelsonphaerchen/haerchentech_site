// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (CSS, JS, images) from a 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the main terminal page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Terminal website running at http://localhost:${port}`);
});