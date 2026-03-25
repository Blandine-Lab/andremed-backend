const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Autre' },
  quantity: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true },
  unit: { type: String, default: 'pièce' },
  seuilAlerte: { type: Number, default: 10 },
  qrCode: { type: String, unique: true },
  storageTemp: String,
  usage: String,
  expirationDate: { type: Date }   // <-- ligne ajoutée
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);