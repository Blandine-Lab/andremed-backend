const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);