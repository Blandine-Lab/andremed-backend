const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  cartQuantity: Number,
  unit: String
});

const saleSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  items: [saleItemSchema],
  total: Number,
  itemsCount: Number,
  paymentMethod: { type: String, enum: ['cash', 'mobile_money'] },
  paymentDetails: {
    operator: String,
    phone: String,
    merchant: String
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);