const express = require('express');
const router = express.Router();
const MovementHistory = require('../models/MovementHistory');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const movements = await MovementHistory.find().sort({ createdAt: -1 }).limit(100).populate('user', 'name');
    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;