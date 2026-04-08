/** -------------- Http Server -------------- */
// const http = require('http');

// const server = http.createServer((req, res) => {
//   res.end('Hello from Node.js 🚀');
// });

// server.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });

/** -------------- EXPRESS -------------- */

const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json()); // Parse JSON bodies (like fetch/axios POST data)
// GET route — like a Next.js API route GET handler
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});