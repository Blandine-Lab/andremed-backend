const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const auth = require('../middleware/auth');
const Movement = require('../models/Movement');

// GET /api/reports/sales?startDate=...&endDate=...&category=...&sellerId=...
router.get('/sales', auth, async (req, res) => {
  try {
    const { startDate, endDate, category, sellerId } = req.query;
    let filter = {};
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (sellerId) filter.user = sellerId;
    let sales = await Sale.find(filter)
      .populate('user', 'name')
      .populate('items.productId');
    if (category) {
      sales = sales.filter(sale =>
        sale.items.some(item => item.productId?.category === category)
      );
    }
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fonction utilitaire pour convertir un tableau d'objets en CSV
const json2csv = (items) => {
  if (!items || items.length === 0) return '';
  const first = items[0]._doc || items[0];
  const headers = Object.keys(first);
  const rows = items.map(item => {
    const obj = item._doc || item;
    return headers.map(h => {
      let val = obj[h];
      if (val && typeof val === 'object') val = JSON.stringify(val);
      if (val && val.toString) val = val.toString().replace(/"/g, '""');
      return `"${val || ''}"`;
    }).join(',');
  });
  return [headers.join(','), ...rows].join('\n');
};

// Export CSV
router.get('/export/:collection', auth, async (req, res) => {
  const { collection } = req.params;
  let data;
  switch (collection) {
    case 'products':
      data = await Product.find();
      break;
    case 'sales':
      data = await Sale.find().populate('user', 'name');
      break;
    // case 'movements':  // commenté pour l'instant, à activer quand le modèle Movement sera créé
    //   data = await Movement.find().populate('user', 'name');
    //   break;
    default:
      return res.status(400).json({ message: 'Collection invalide' });
  }
  const csv = json2csv(data);
  res.setHeader('Content-Disposition', `attachment; filename=${collection}.csv`);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.send(csv);
});

module.exports = router;