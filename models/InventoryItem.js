const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  month: { type: String, required: true },   // ex: "Janvier"
  year: { type: Number, required: true },
  qtyReal: { type: Number, default: 0 },     // stock réel compté
  qtyExpired: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  qtySold: { type: Number, default: 0 },     // calculé automatiquement lors de l'enregistrement
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);