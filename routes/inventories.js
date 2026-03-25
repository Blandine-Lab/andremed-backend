const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/InventoryItem');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const auth = require('../middleware/auth');

// POST /api/inventories/monthly – enregistre l'inventaire mensuel (par produit)
router.post('/monthly', auth, async (req, res) => {
  try {
    const { month, year, items } = req.body; // items = [{ productId, qtyReal, qtyExpired, losses }]

    // Supprimer tout inventaire existant pour ce mois/année/utilisateur (permet la mise à jour)
    await InventoryItem.deleteMany({ month, year, createdBy: req.user.userId });

    // Calculer les quantités vendues dans le mois
    const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);

    const sales = await Sale.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('items.productId');

    const soldQuantities = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const pid = item.productId?._id?.toString();
        if (pid) {
          soldQuantities[pid] = (soldQuantities[pid] || 0) + item.cartQuantity;
        }
      });
    });

    const inventoryDocs = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const qtySold = soldQuantities[item.productId] || 0;

      inventoryDocs.push({
        productId: item.productId,
        month,
        year,
        qtyReal: item.qtyReal,
        qtyExpired: item.qtyExpired,
        losses: item.losses,
        qtySold,
        createdBy: req.user.userId
      });
    }

    await InventoryItem.insertMany(inventoryDocs);
    res.status(201).json({ message: 'Inventaire enregistré' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/inventories/monthly – récupère tous les inventaires
router.get('/monthly', auth, async (req, res) => {
  try {
    const { year, month } = req.query;
    let filter = {};
    if (year) filter.year = parseInt(year);
    if (month) filter.month = month;
    const items = await InventoryItem.find(filter)
      .populate('productId')
      .populate('createdBy', 'name')
      .sort({ year: -1, month: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Erreur' });
  }
});

module.exports = router;