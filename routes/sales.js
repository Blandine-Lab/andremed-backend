const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const MovementHistory = require('../models/MovementHistory');
const auth = require('../middleware/auth');

// GET all sales
router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 }).populate('user', 'name');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a sale with stock update and movement recording
router.post('/', auth, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, total, itemsCount, paymentMethod, paymentDetails } = req.body;

    // 1. Verify and update stock for each product
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product ${item.name} not found`);
      }
      if (product.quantity < item.cartQuantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      product.quantity -= item.cartQuantity;
      await product.save({ session });

      // 2. Record movement
      const movement = new MovementHistory({
        productName: product.name,
        type: 'sortie',
        quantity: item.cartQuantity,
        reason: 'Vente',
        user: req.user.userId
      });
      await movement.save({ session });
    }

    // 3. Create the sale
    const sale = new Sale({
      items,
      total,
      itemsCount,
      paymentMethod,
      paymentDetails,
      user: req.user.userId
    });
    await sale.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(sale);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;