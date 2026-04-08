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

const usersRouter = require('./routes/users');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Parse JSON bodies (like fetch/axios POST data)
app.use(express.json());

// Logger runs on EVERY request — registered before routes
app.use(logger);

// GET route — like a Next.js API route GET handler
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Node.js!' });
});

// All /users routes are handled in routes/users.js
app.use('/users', usersRouter);

// Global error handler — must be LAST (after all routes)
// Express knows it's an error handler because it has 4 params: (err, req, res, next)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
