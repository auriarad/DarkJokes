const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/DarkJokes');

    const Admin = mongoose.models.Admin || mongoose.model('Admin', {
      username: String,
      password: String,
      createdAt: { type: Date, default: Date.now }
    });

    const hashedPassword = await bcrypt.hash('1vfr4esZ', 10);

    await Admin.create({
      username: 'auriarad',
      password: hashedPassword
    });

    console.log('Admin created successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();
