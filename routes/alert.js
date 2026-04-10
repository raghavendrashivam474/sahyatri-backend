const express = require('express');
const Alert = require('../models/Alert');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/sos', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const alert = new Alert({
      userId: user._id,
      type: 'SOS',
      location: user.location,
      message: req.body.message || 'Emergency SOS triggered'
    });

    await alert.save();

    user.status = 'danger';
    await user.save();

    req.app.get('io').emit('newAlert', {
      alert,
      user: { name: user.name, email: user.email }
    });

    res.json({ message: 'SOS alert sent', alert });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const alerts = await Alert.find().populate('userId', 'name email').sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/resolve', auth, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id, 
      { resolved: true }, 
      { returnDocument: 'after' }
    );
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
