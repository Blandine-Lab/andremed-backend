const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const items = await InventoryItem.find().populate('productId createdBy');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id).populate('productId createdBy');
    if (!item) return res.status(404).json({ message: 'Item non trouvé' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    console.log('=== POST /inventory-items ===');
    console.log('req.user:', req.user);
    // Récupération robuste de l'ID utilisateur
    const userId = req.user.userId || req.user.id || req.user._id;
    if (!userId) {
      throw new Error('userId manquant dans le token');
    }
    console.log('userId extrait:', userId);
    console.log('req.body reçu:', req.body);
    const newItem = new InventoryItem({
      ...req.body,
      createdBy: userId
    });
    await newItem.save();
    console.log('Item créé:', newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Erreur POST /inventory-items:', err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { createdBy, ...updateData } = req.body;
    const updated = await InventoryItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item non trouvé' });
    res.json(updated);
  } catch (err) {
    console.error('Erreur PUT /inventory-items:', err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item non trouvé' });
    res.json({ message: 'Item supprimé' });
  } catch (err) {
    console.error('Erreur DELETE /inventory-items:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;