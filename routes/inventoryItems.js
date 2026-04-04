const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const MonthlyInventory = require('../models/MonthlyInventory');
const auth = require('../middleware/auth');

// GET /api/inventory-items/current?month=Avril&year=2026
router.get('/current', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: 'Mois et année requis' });
    }
    const products = await Product.find();
    const monthIndex = new Date(Date.parse(month + " 1, " + year)).getMonth();
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);

    // Calcul des sorties par produit
    const sales = await Sale.find({
      date: { $gte: startDate, $lte: endDate }
    });
    const sortiesMap = {};
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const pid = item.productId?.toString();
        if (pid) {
          sortiesMap[pid] = (sortiesMap[pid] || 0) + item.cartQuantity;
        }
      });
    });

    // Récupérer les stocks réels déjà saisis pour ce mois
    const savedInventories = await MonthlyInventory.find({ month, year });
    const stockReelMap = {};
    const observationsMap = {};
    savedInventories.forEach(inv => {
      stockReelMap[inv.productId.toString()] = inv.stockReel;
      observationsMap[inv.productId.toString()] = inv.observations || '';
    });

    const items = products.map(product => {
      const sorties = sortiesMap[product._id.toString()] || 0;
      const stockInitial = product.quantity;
      const stockTheorique = stockInitial - sorties; // sans entrées
      const savedStockReel = stockReelMap[product._id.toString()] !== undefined ? stockReelMap[product._id.toString()] : null;
      const ecart = savedStockReel !== null ? savedStockReel - stockTheorique : null;
      const valeurTotale = savedStockReel !== null ? savedStockReel * product.price : null;
      return {
        productId: product._id,
        codeProduit: product.codeProduit || '',
        nomItem: product.name,
        numeroLot: 'N/A',
        datePeremption: product.expirationDate,
        stockInitial,
        entrees: 0, // à calculer si vous avez des mouvements d'entrée
        sorties,
        stockTheorique,
        stockReel: savedStockReel,
        ecart,
        prixUnitaire: product.price,
        valeurTotale,
        month,
        year,
        observations: observationsMap[product._id.toString()] || ''
      };
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/inventory-items/save
router.post('/save', auth, async (req, res) => {
  try {
    const { month, year, items } = req.body;
    const userId = req.user.userId || req.user.id || req.user._id;
    for (let item of items) {
      await MonthlyInventory.findOneAndUpdate(
        { productId: item.productId, month, year },
        { stockReel: item.stockReel, observations: item.observations, updatedBy: userId, updatedAt: Date.now() },
        { upsert: true, new: true }
      );
    }
    res.json({ message: 'Inventaire enregistré' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Optionnel : garder les anciennes routes si nécessaire (commentées)
// router.get('/', auth, ...) etc.

module.exports = router;