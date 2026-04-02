const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const auth = require('../middleware/auth');

// GET tous les items d'inventaire
router.get('/', auth, async (req, res) => {
  try {
    const items = await InventoryItem.find().populate('productId createdBy');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET un item par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id).populate('productId createdBy');
    if (!item) return res.status(404).json({ message: 'Item non trouvé' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST créer un item
router.post('/', auth, async (req, res) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT mettre à jour un item
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item non trouvé' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE supprimer un item
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item non trouvé' });
    res.json({ message: 'Item supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;