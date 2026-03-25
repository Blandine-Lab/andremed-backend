const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// GET logo – public (pas besoin de token)
router.get('/logo', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    res.json({ logoUrl: settings.logoUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT logo – réservé à l'admin (avec authentification)
router.put('/logo', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    settings.logoUrl = req.body.logoUrl;
    await settings.save();
    res.json({ logoUrl: settings.logoUrl });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;