// Merge overlapping or contiguous intervals
function mergeIntervals(intervals) {
  if (!intervals || intervals.length === 0) return [];
  // Sort intervals based on start time
  intervals.sort((a, b) => a.start - b.start);

  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];
    // If overlapping or contiguous, merge them
    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push(current);
    }
  }
  return merged;
}

// Calculate progress based on unique full seconds watched
function calculateProgress(mergedIntervals, videoLength) {
  if (videoLength <= 0) return 0;
  
  // Use a set to store each full second watched
  const watchedSeconds = new Set();
  
  mergedIntervals.forEach(interval => {
    // Floor the start and ceil the end so we cover partially-watched seconds
    const start = Math.floor(interval.start);
    const end = Math.ceil(interval.end);
    for (let s = start; s < end; s++) {
      // Only count seconds within the video length
      if (s < videoLength) {
        watchedSeconds.add(s);
      }
    }
  });
  
  // Calculate percentage based on total seconds in the video
  return Math.min(100, (watchedSeconds.size / videoLength) * 100);
}

module.exports = { mergeIntervals, calculateProgress };
