const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const validateUser = require('../middleware/validateUser');
const User = require('../models/User');

// GET /users — get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /users/:id — get one user by id
router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({ status: 404, message: 'User not found' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return next({ status: 404, message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST /users — create a new user
router.post('/', validateUser, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// PUT /users/:id — update a user
router.put('/:id', validateUser, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({ status: 404, message: 'User not found' });
    }

    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) return next({ status: 404, message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE /users/:id — delete a user
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({ status: 404, message: 'User not found' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next({ status: 404, message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
