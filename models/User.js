const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['tourist', 'admin'], default: 'tourist' },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['safe', 'danger'], default: 'safe' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
