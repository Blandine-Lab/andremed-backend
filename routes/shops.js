const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const auth = require('../middleware/auth');

// Middleware to check admin
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès interdit' });
  next();
};

// GET all shops
router.get('/', auth, async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add a shop (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const count = await Shop.countDocuments();
    if (count >= 3) return res.status(400).json({ message: 'Maximum 3 boutiques' });
    const shop = new Shop(req.body);
    await shop.save();
    res.status(201).json(shop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update a shop (admin only)
router.patch('/:id', auth, adminOnly, async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(shop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a shop (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Boutique supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;