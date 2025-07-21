const router = require('express').Router();
const Playlist = require('../models/Playlist');
const auth = require('../middleware/auth');

// Get all public playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate('creator', 'username')
      .populate('tracks');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new playlist
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const playlist = new Playlist({
      name,
      description,
      creator: req.user.id,
      isPublic
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add track to playlist
router.post('/:id/tracks', auth, async (req, res) => {
  try {
    const { trackId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    playlist.tracks.push(trackId);
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove track from playlist
router.delete('/:id/tracks/:trackId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    if (playlist.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    playlist.tracks = playlist.tracks.filter(
      track => track.toString() !== req.params.trackId
    );
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
