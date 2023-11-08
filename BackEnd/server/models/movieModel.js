import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  productionCountries: { type: Array, required: true },
  productionYear: { type: Number, required: true },
  length: { type: Number, required: true },
  genre: { type: String, required: true },
  distributor: { type: String, required: true },
  language: { type: String, required: true },
  subtitles: { type: String, required: true },
  director: { type: String, required: true },
  actors: { type: Array, required: true },
  description: { type: String, required: true },
  images: { type: Array, required: true },
  youtubeTrailers: { type: Array, required: true },
  reviews: { type: Array, required: false },
  age: { type: Number, required: true },
});

const Movie = mongoose.model('movie', movieSchema);

export default Movie;