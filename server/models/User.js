const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true, // Allows null/undefined while maintaining unique constraint
  },
  password: {
    type: String,
    // Not required because of social login and phone auth
  },
  phoneNumber: {
    type: String,
    sparse: true, // Allows null/undefined while maintaining unique constraint
  },
  googleId: {
    type: String,
    sparse: true,
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg',
  },
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  likedSongs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }],
  followedArtists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }],
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
