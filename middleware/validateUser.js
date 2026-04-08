// Middleware to validate user input on POST and PUT requests
// Think of this like form validation in React, but on the server side

function validateUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'name and email are required' });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'name must be a non-empty string' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ message: 'email is invalid' });
  }

  next(); // all good — move on to the route handler
}

module.exports = validateUser;
