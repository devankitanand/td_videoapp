import React from 'react';
import VideoPlayer from './components/VideoPlayer';

function App() {
  // For demonstration, we use static values.
  const userId = "user123";
  const videoId = "videoABC";
  const videoLength = 10; 

  return (
    <div className="App">
      <h1>MERN Video Progress Tracker</h1>
      <VideoPlayer userId={userId} videoId={videoId} videoLength={videoLength} />
    </div>
  );
}

export default App;
