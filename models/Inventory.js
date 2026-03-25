const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  qtySold: { type: Number, default: 0 },
  qtyReal: { type: Number, default: 0 },
  qtyExpired: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
