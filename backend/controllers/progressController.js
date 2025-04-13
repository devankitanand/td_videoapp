const Progress = require('../models/Progress');
const { mergeIntervals, calculateProgress } = require('../utils/intervalUtils');

// Get progress for a specific user and video
exports.getProgress = async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    const progress = await Progress.findOne({ userId, videoId });
    if (progress) {
      return res.json(progress);
    } else {
      return res.status(404).json({ error: 'No progress found' });
    }
  } catch (error) {
    console.error("Error in getProgress:", error);
    return res.status(500).json({ error: 'Server Error' });
  }
};

// Update progress for a specific user and video

exports.updateProgress = async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    let { newInterval, videoLength, lastPlayed } = req.body;
    
    // CONVERT decimal values into integers using Math.floor.
    // For example, 9.346363 becomes 9.
    newInterval.start = Math.floor(newInterval.start); 
    newInterval.end = Math.floor(newInterval.end);       
    lastPlayed = Math.floor(lastPlayed);                
    videoLength = Math.floor(videoLength);               

    // Basic validation after conversion
    if (newInterval.end <= newInterval.start) {
      return res.status(400).json({ error: 'Invalid interval provided' });
    }
    if (videoLength <= 0) {
      return res.status(400).json({ error: 'Invalid video length' });
    }

    let progress = await Progress.findOne({ userId, videoId });

    if (!progress) {
      progress = new Progress({
        userId,
        videoId,
        watchedIntervals: [newInterval],
        lastPlayed,
        videoLength,
        progressPercentage: 0
      });
    } else {
      // Add and merge new interval
      progress.watchedIntervals.push(newInterval);
      progress.watchedIntervals = mergeIntervals(progress.watchedIntervals);
      progress.lastPlayed = lastPlayed;
      progress.videoLength = videoLength;
    }

    // Calculate updated progress percentage based on unique full seconds watched.
    progress.progressPercentage = calculateProgress(progress.watchedIntervals, videoLength);
    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Reset progress for a specific user and video
exports.resetProgress = async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    const progress = await Progress.findOne({ userId, videoId });
    if (progress) {
      progress.watchedIntervals = [];
      progress.lastPlayed = 0;
      progress.progressPercentage = 0;
      await progress.save();
      return res.json({ message: 'Progress reset successfully', progress });
    } else {
      return res.status(404).json({ error: 'No progress data found for the given user and video' });
    }
  } catch (error) {
    console.error("Error resetting progress:", error);
    res.status(500).json({ error: 'Server Error' });
  }
};
