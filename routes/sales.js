const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// GET all sales
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('user', 'name')
      .populate('sellerId', 'name')
      .sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new sale
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      total,
      itemsCount,
      paymentMethod,
      paymentDetails,
      comment,
      sellerId,
      sellerName,
      buyerName
    } = req.body;

    if (!items || !total) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    const sale = new Sale({
      date: new Date(),
      items,
      total,
      itemsCount,
      paymentMethod,
      paymentDetails,
      comment,
      sellerId,
      sellerName,
      buyerName,
      user: req.user.id
    });

    await sale.save();

    // Mise à jour des stocks
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.cartQuantity }
      });
    }

    res.status(201).json(sale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;