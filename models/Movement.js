const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  productName: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  type: { type: String, enum: ['entrée', 'sortie'] },
  quantity: Number,
  reason: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movement', movementSchema);