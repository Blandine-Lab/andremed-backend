require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connexion MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/users', require('./routes/users'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/movements', require('./routes/movements'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/inventories', require('./routes/inventories'));
app.use('/api/inventory-items', require('./routes/inventoryItems')); // <-- NOUVELLE ROUTE
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings')); // for logo
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sellers', require('./routes/sellers'));
app.use('/api/sellers', require('./routes/sellers')); // new sellers route (doublon facultatif)

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend fonctionne !' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));