import express from 'express';
import dotenv from 'dotenv';
import './config/db.js';
import bookingRoutes from './routes/bookingRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import screeningRoutes from './routes/screeningRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/movies', movieRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/bookings', bookingRoutes);

// Middleware, Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'An unexpected error occurred!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});