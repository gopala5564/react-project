const router = require('express').Router();
const Track = require('../models/Track');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');

// Search across all entities
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, 'i');

    const [tracks, artists, playlists] = await Promise.all([
      // Search tracks
      Track.find({
        $or: [
          { title: regex },
          { album: regex },
          { genre: regex }
        ]
      }).populate('artist').limit(5),

      // Search artists
      Artist.find({
        $or: [
          { name: regex },
          { genres: regex }
        ]
      }).limit(5),

      // Search playlists
      Playlist.find({
        $and: [
          { isPublic: true },
          {
            $or: [
              { name: regex },
              { description: regex }
            ]
          }
        ]
      }).populate('creator', 'username').limit(5)
    ]);

    res.json({
      tracks,
      artists,
      playlists
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search by type
router.get('/:type', async (req, res) => {
  try {
    const { q } = req.query;
    const { type } = req.params;
    const regex = new RegExp(q, 'i');
    let results;

    switch (type) {
      case 'tracks':
        results = await Track.find({
          $or: [
            { title: regex },
            { album: regex },
            { genre: regex }
          ]
        }).populate('artist');
        break;

      case 'artists':
        results = await Artist.find({
          $or: [
            { name: regex },
            { genres: regex }
          ]
        });
        break;

      case 'playlists':
        results = await Playlist.find({
          $and: [
            { isPublic: true },
            {
              $or: [
                { name: regex },
                { description: regex }
              ]
            }
          ]
        }).populate('creator', 'username');
        break;

      default:
        return res.status(400).json({ message: 'Invalid search type' });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
