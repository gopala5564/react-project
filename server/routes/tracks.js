const router = require('express').Router();
const Track = require('../models/Track');
const auth = require('../middleware/auth');

// Get all tracks
router.get('/', async (req, res) => {
  try {
    const tracks = await Track.find().populate('artist');
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get track by ID
router.get('/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id).populate('artist');
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Increment play count
router.post('/:id/play', auth, async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    
    track.playCount += 1;
    await track.save();
    
    res.json({ playCount: track.playCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tracks by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const tracks = await Track.find({ genre: req.params.genre }).populate('artist');
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
