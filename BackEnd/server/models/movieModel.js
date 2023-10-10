import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: String,
  // other fields...
});

const Movie = mongoose.model('movie', movieSchema);

export default Movie;