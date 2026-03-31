const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add player name'],
    trim: true
  },
  ringName: {
    type: String,
    trim: true
  },
  nativePlace: {
    type: String,
    trim: true
  },
  profession: {
    type: String,
    trim: true
  },
  height: {
    type: String,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  chest: {
    type: String,
    trim: true
  },
  biceps: {
    type: String,
    trim: true
  },
  age: {
    type: Number
  },
  matchesWon: {
    type: Number,
    default: 0
  },
  socialMedia: {
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    youtube: { type: String, trim: true }
  },
  contact: {
    phone: String,
    email: String,
    address: String
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Player', playerSchema);
