require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// Connexion MongoDB (activée)
connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/users', require('./routes/users'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/movements', require('./routes/movements'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/products', require('./routes/products'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/users', require('./routes/users'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/movements', require('./routes/movements'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/auth', require('./routes/auth'));

app.use('/api/auth', require('./routes/auth'));

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend fonctionne !' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));