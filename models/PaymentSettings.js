const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
  airtel: { type: String, default: '' },
  mpesa: { type: String, default: '' },
  orange: { type: String, default: '' }
});

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);