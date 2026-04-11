// sahyatri-backend/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ email: 'admin@sahyatri.com' });
  if (exists) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await User.create({
    name: 'Admin',
    email: 'admin@sahyatri.com',
    password: hashedPassword,
    role: 'admin',
    phone: '9999999999',
  });

  console.log('✅ Admin created!');
  console.log('Email: admin@sahyatri.com');
  console.log('Password: admin123');
  process.exit();
};

createAdmin();