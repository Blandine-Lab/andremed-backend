const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const Sale = require('../models/Sale'); // Ajout pour calculer les sorties
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
    const userId = req.user.userId || req.user.id || req.user._id;
    if (!userId) throw new Error('userId manquant dans le token');
    console.log('userId extrait:', userId);
    console.log('req.body reçu:', req.body);

    // Extraire les champs utiles (ignorer les anciens)
    const {
      productId,
      codeProduit,
      nomItem,           // nouveau nom
      numeroLot,
      datePeremption,
      stockInitial,
      entrees,
      stockReel,
      prixUnitaire,
      month,
      year,
      observations
    } = req.body;

    // Calcul des sorties (quantités vendues) pour ce produit pendant le mois/année
    const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);
    const sales = await Sale.find({
      date: { $gte: startDate, $lte: endDate },
      'items.productId': productId
    });
    let sorties = 0;
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (item.productId.toString() === productId) {
          sorties += item.cartQuantity;
        }
      });
    });
    console.log('Sorties calculées:', sorties);

    const newItem = new InventoryItem({
      productId,
      codeProduit,
      nomItem: nomItem || req.body.nomMedicament, // compatibilité ancien champ
      numeroLot,
      datePeremption,
      stockInitial: stockInitial || 0,
      entrees: entrees || 0,
      sorties,
      stockReel: stockReel || 0,
      prixUnitaire: prixUnitaire || 0,
      month,
      year,
      observations: observations || '',
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