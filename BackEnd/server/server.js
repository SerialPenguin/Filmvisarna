import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bookingRoutes from './routes/bookingRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import screeningRoutes from './routes/screeningRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(`MongoDB connection error: ${err}`));

app.use(express.json());
app.use('/api/movies', movieRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});