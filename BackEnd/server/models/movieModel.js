const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  // other fields...
});

module.exports = mongoose.model('Movie', movieSchema);