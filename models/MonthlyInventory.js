const mongoose = require('mongoose');

const monthlyInventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  stockReel: { type: Number, required: true },
  observations: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MonthlyInventory', monthlyInventorySchema);