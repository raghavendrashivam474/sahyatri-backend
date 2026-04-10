const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/update', auth, async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { location: { lat, lng }, lastUpdated: Date.now() },
      { returnDocument: 'after', runValidators: true }
    ).select('-password');

    req.app.get('io').emit('locationUpdate', {
      userId: user._id,
      location: user.location,
      name: user.name
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
