const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const progressRoutes = require('./routes/progressRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/progress', progressRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error", err);
  });
