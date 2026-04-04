const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const StockMovement = require('../models/StockMovement');
const MonthlyInventory = require('../models/MonthlyInventory');
const auth = require('../middleware/auth');

// Mapping des mois français vers index
const monthIndexMap = {
  "Janvier": 0, "Février": 1, "Mars": 2, "Avril": 3,
  "Mai": 4, "Juin": 5, "Juillet": 6, "Août": 7,
  "Septembre": 8, "Octobre": 9, "Novembre": 10, "Décembre": 11
};

router.get('/current', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: 'Mois et année requis' });
    }
    const monthIndex = monthIndexMap[month];
    if (monthIndex === undefined) {
      return res.status(400).json({ message: 'Mois invalide' });
    }
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);

    const products = await Product.find();

    // 1. Calcul des sorties (ventes)
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

    // 2. Calcul des entrées (mouvements de stock de type 'entrée')
    const movements = await StockMovement.find({
      type: 'entrée',
      date: { $gte: startDate, $lte: endDate }
    });
    const entreesMap = {};
    movements.forEach(m => {
      const pid = m.productId.toString();
      entreesMap[pid] = (entreesMap[pid] || 0) + m.quantity;
    });

    // 3. Récupérer les stocks réels déjà saisis
    const savedInventories = await MonthlyInventory.find({ month, year });
    const stockReelMap = {};
    const observationsMap = {};
    savedInventories.forEach(inv => {
      stockReelMap[inv.productId.toString()] = inv.stockReel;
      observationsMap[inv.productId.toString()] = inv.observations || '';
    });

    const items = products.map(product => {
      const pid = product._id.toString();
      const sorties = sortiesMap[pid] || 0;
      const entrees = entreesMap[pid] || 0;
      const stockInitial = product.quantity;
      const stockTheorique = stockInitial + entrees - sorties;
      const savedStockReel = stockReelMap[pid] !== undefined ? stockReelMap[pid] : null;
      const ecart = savedStockReel !== null ? savedStockReel - stockTheorique : null;
      const valeurTotale = savedStockReel !== null ? savedStockReel * product.price : null;

      return {
        productId: product._id,
        codeProduit: product.codeProduit || '',
        nomItem: product.name,
        numeroLot: 'N/A',
        datePeremption: product.expirationDate,
        stockInitial,
        entrees,
        sorties,
        stockTheorique,
        stockReel: savedStockReel,
        ecart,
        prixUnitaire: product.price,
        valeurTotale,
        month,
        year,
        observations: observationsMap[pid] || ''
      };
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/inventory-items/save (identique)
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

module.exports = router;