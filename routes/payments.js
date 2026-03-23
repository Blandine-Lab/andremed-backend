const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PaymentSettings = require('../models/PaymentSettings');

// Get payment settings
router.get('/settings', auth, async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = new PaymentSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update payment settings (admin only)
router.put('/settings', auth, async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = new PaymentSettings();
    }
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mobile money payment simulation (to be replaced with real API)
router.post('/mobile-money', auth, async (req, res) => {
  const { operator, phone, amount, saleData } = req.body;
  // Simulate successful payment after 1 second
  setTimeout(() => {
    res.json({ success: true, message: 'Paiement simulé avec succès' });
  }, 1000);
});

module.exports = router;