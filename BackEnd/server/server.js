const express = require('express');
const movieRoutes = require('./routes/movieRoutes');
const screeningRoutes = require('./routes/screeningRoutes');
require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

app.use('/api/movies', movieRoutes);
app.use('/api/screenings', screeningRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});