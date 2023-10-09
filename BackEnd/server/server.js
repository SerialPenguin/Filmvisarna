import express from 'express';
import movieRoutes from './routes/movieRoutes.js';
import screeningRoutes from './routes/screeningRoutes.js';
import './config/db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use('/api/movies', movieRoutes);
app.use('/api/screenings', screeningRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});