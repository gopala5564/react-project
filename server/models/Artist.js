const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  biography: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  genres: [{
    type: String,
  }],
  monthlyListeners: {
    type: Number,
    default: 0,
  },
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Artist', artistSchema);
