// const express = require('express');
// const movieRoutes = require('./routes/movieRoutes');
// const screeningRoutes = require('./routes/screeningRoutes');
// require('./config/db');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use('/api/movies', movieRoutes);
// app.use('/api/screenings', screeningRoutes);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Importing modules and routes using ECMAScript modules syntax
import express from 'express';
import movieRoutes from './routes/movieRoutes.js';
import screeningRoutes from './routes/screeningRoutes.js';
import './config/db.js'; // If db.js is not exporting anything, you can simply import to run it

// Setting up express app
const app = express();
const port = process.env.PORT || 3000;

// Using routes
app.use('/api/movies', movieRoutes);
app.use('/api/screenings', screeningRoutes);

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});