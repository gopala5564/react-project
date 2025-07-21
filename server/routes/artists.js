const router = require('express').Router();
const Artist = require('../models/Artist');
const Track = require('../models/Track');
const auth = require('../middleware/auth');

// Get all artists
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artist by ID
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .populate('tracks');
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Follow artist
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    if (!artist.followers.includes(req.user.id)) {
      artist.followers.push(req.user.id);
      await artist.save();
    }

    res.json({ followers: artist.followers.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unfollow artist
router.post('/:id/unfollow', auth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    artist.followers = artist.followers.filter(
      followerId => followerId.toString() !== req.user.id
    );
    await artist.save();

    res.json({ followers: artist.followers.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artist's top tracks
router.get('/:id/top-tracks', async (req, res) => {
  try {
    const tracks = await Track.find({ artist: req.params.id })
      .sort({ playCount: -1 })
      .limit(10);
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
