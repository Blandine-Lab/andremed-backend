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
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'mobile_money', 'bank_transfer', 'credit', 'contract'] 
  },
  paymentDetails: mongoose.Schema.Types.Mixed,
  comment: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  sellerName: String,
  buyerName: String
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);