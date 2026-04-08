// Global error handler — must have 4 parameters (err, req, res, next)
// Express recognizes it as an error handler because of the 4th param
// Place this LAST in index.js after all routes

function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
