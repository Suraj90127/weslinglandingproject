const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  matchNumber: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a match name']
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  status: {
    type: String,
    enum: ['scheduled','upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  result: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    score: String,
    notes: String
  },
  scheduledTime: {
    type: String
  },
  venue: String
}, {
  timestamps: true
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  venue: {
    type: String,
    required: [true, 'Please add venue']
  },
  date: {
    type: Date,
    required: [true, 'Please add date']
  },
  time: {
    type: String,
    required: [true, 'Please add time']
  },
  image: {
    type: String
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  matches: [matchSchema],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);