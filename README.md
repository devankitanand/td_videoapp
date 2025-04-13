# MERN Video Progress Tracker

This MERN stack application tracks a user's unique progress on a video lecture by recording the specific seconds they've watched. In this version, no authentication is implemented—every user sees the same video, and progress is stored based on a provided user identifier.

## Features

- **Video Progress Tracking:**
  - Records viewing intervals and merges overlapping intervals.
  - Counts only unique full seconds watched (e.g., re-watching seconds does not increase progress).
  - Calculates progress as the percentage of unique seconds watched relative to the video’s total length.
  - Provides a "Reset Progress" option.

- **Environment Configuration:**
  - Uses `.env` files in both backend and frontend to manage configuration (ports, API URLs, MongoDB connection, etc.).


## Prerequisites

- **Node.js** (v12 or later)
- **MongoDB** (local installation or hosted, e.g., MongoDB Atlas)
- **npm or yarn**

## Setup Instructions

### 1. Backend Setup

1. **Navigate to the backend folder:**

   ```bash
   cd mern-video-progress-app/backend
  ```bash
  npm install
```
  Run the backend server:
```bash
For development, you can use nodemon:
```
```bash
npm run dev
```
2. Frontend Setup
Navigate to the frontend folder:

```bash
cd mern-video-progress-app/frontend
```
Install dependencies:

```bash
npm install
```
Create a .env file in the frontend folder:

Create a file named .env with the following content:

dotenv
```bash
REACT_APP_API_URL=http://localhost:5001
```
Make sure this URL matches your backend's address and port.

Run the frontend application:

```bash
npm start
```
This will start the Create React App server (usually on port 3000).
