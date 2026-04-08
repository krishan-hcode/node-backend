// Logger middleware — runs on every request
// Like console.log but for every API call automatically

function logger(req, res, next) {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next(); // pass to next middleware or route
}

module.exports = logger;
