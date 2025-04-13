import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const VideoPlayer = ({ userId, videoId, videoLength }) => {
  const videoRef = useRef(null);
  
  // progress holds the calculated percentage,
  // lastPlayed is used as the resume point,
  // segmentStart marks the beginning of the current viewing segment.
  const [progress, setProgress] = useState(0);
  const [lastPlayed, setLastPlayed] = useState(0);
  const [segmentStart, setSegmentStart] = useState(0);
  
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

   // Base API URL fetched from .env variables
   const baseApiUrl = process.env.REACT_APP_API_URL;

  // On component mount, fetch progress from the backend.
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`${baseApiUrl}/api/progress/${userId}/${videoId}`);
        const data = response.data;
        if (data) {
          setProgress(data.progressPercentage);
          setLastPlayed(data.lastPlayed);
          if (videoRef.current) {
            videoRef.current.currentTime = data.lastPlayed;
          }
        }
      } catch (error) {
        console.error("Error fetching progress", error);
        setErrorMessage("Failed to fetch progress. Please reload the page.");
      }
    };
    fetchProgress();
  }, [userId, videoId]);

  // When the video starts/resumes, record the segment start time.
  const handlePlay = (e) => {
    setSegmentStart(e.target.currentTime);
  };

  // When the video is paused or ends, create a new viewing interval and update progress.
  const handlePause = async (e) => {
    const currentTime = e.target.currentTime;
    const newInterval = { start: segmentStart, end: currentTime };

    // Only update if the interval duration is positive.
    if (newInterval.end <= newInterval.start) return;

    try {
      const response = await axios.post(`${baseApiUrl}/api/progress/${userId}/${videoId}`, {
        newInterval,
        videoLength,
        lastPlayed: currentTime,
      });
      const data = response.data;
      setProgress(data.progressPercentage);
      setLastPlayed(currentTime);
      // Reset segmentStart for future segments.
      setSegmentStart(currentTime);
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating progress on pause", error);
      setErrorMessage("Failed to update progress. Please try again.");
    }
  };

  // Reset the video progress.
  const handleResetProgress = async () => {
    setIsResetting(true);
    try {
      const response = await axios.delete(`${baseApiUrl}/api/progress/${userId}/${videoId}`);
      const data = response.data;
      setProgress(0);
      setLastPlayed(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      alert(data.message);
    } catch (error) {
      console.error("Error resetting progress", error);
      alert("Failed to reset progress");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        controls
        onPlay={handlePlay}         // Set the segment start when playing
        onPause={handlePause}       // Record the viewing interval when paused
        onEnded={handlePause}       // Also update when the video ends
        width="640"
      >
        Your browser does not support the video tag.
      </video>
      <div className="progress-bar-container" style={{ marginTop: "10px" }}>
        <div
          className="progress-bar"
          style={{
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: "#34d399",
            height: "10px",
            borderRadius: "5px",
            transition: "width 0.5s ease",
          }}
        ></div>
      </div>
      <p>Progress: {Math.min(parseFloat(progress).toFixed(2), 100)}%</p>
      {/* {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} */}
      <button
        onClick={handleResetProgress}
        disabled={isResetting}
        style={{
          marginTop: "10px",
          padding: "10px",
          backgroundColor: isResetting ? "#d1d5db" : "#3b82f6",
          color: isResetting ? "#9ca3af" : "white",
          border: "none",
          borderRadius: "5px",
          cursor: isResetting ? "not-allowed" : "pointer",
        }}
      >
        {isResetting ? "Resetting..." : "Reset Progress"}
      </button>
    </div>
  );
};

export default VideoPlayer;
