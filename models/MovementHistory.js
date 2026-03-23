const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  productName: String,
  type: { type: String, enum: ['entrée', 'sortie'] },
  quantity: Number,
  reason: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('MovementHistory', movementSchema);