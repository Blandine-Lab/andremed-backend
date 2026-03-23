require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@andremed.com' });
    if (adminExists) {
      console.log('Admin existe déjà');
      process.exit();
    }
    const admin = new User({
      name: 'Administrateur',
      email: 'admin@andremed.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('Admin créé avec succès');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
