const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  videoId: { type: String, required: true },
  watchedIntervals: [
    {
      start: Number,
      end: Number
    }
  ],
  lastPlayed: { type: Number, default: 0 },
  videoLength: { type: Number, required: true },
  progressPercentage: { type: Number, default: 0 }
});

module.exports = mongoose.model('Progress', progressSchema);
