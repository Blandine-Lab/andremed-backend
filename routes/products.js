const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const auth = require('../middleware/auth');

// GET tous les produits
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST créer un produit
router.post('/', auth, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    if (!newProduct.qrCode) newProduct.qrCode = `prod_${Date.now()}`;
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH mettre à jour un produit
router.patch('/:id', auth, async (req, res) => {
  try {
    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) return res.status(404).json({ message: 'Produit non trouvé' });

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Calculer la variation de quantité
    const oldQty = oldProduct.quantity;
    const newQty = updated.quantity;
    const diff = newQty - oldQty;
    
    if (diff !== 0) {
      const userId = req.user.userId || req.user.id || req.user._id;
      await StockMovement.create({
        productId: req.params.id,
        type: diff > 0 ? 'entrée' : 'sortie',
        quantity: Math.abs(diff),
        reason: 'Modification manuelle du stock',
        createdBy: userId
      });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE supprimer un produit
router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;