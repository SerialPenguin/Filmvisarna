import mongoose from 'mongoose';
import Movie from "../models/movieModel.js";

export const getAllMovies = async (req, res) => {
  try {
    const collection = mongoose.connection.collection('movies');
    const movies = await collection.find({}).toArray();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addMovies = async (req, res) => {
  try{

    let {
      title, productionCountries, productionYear, 
      length, genre, distributor, language, 
      subtitles, director, actors, description, 
      images, youtubeTrailers, reviews, age
    } = req.body;

    productionCountries = productionCountries.split(",");
    actors = actors.split(",");
    images = images.split(",");
    youtubeTrailers = youtubeTrailers.split(",");
    reviews = reviews.split(",");

    const newMovie = new Movie({
      title, 
      productionCountries, 
      productionYear, 
      length, 
      genre, 
      distributor, 
      language, 
      subtitles, 
      director, 
      actors, 
      description, 
      images, 
      youtubeTrailers, 
      reviews,
      age
    })

    await newMovie.save();

    res.status(200).send({msg: `New movie, ${newMovie.title} added to database`});

  }catch(err) {
    console.log(err)
  }
};

export const editMovies = async (req, res) => {
  
  const changes = req.body;

  try {
    const collection = mongoose.connection.collection('movies');
    const movie = await collection.findOne({title: changes.search});

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found, check spelling' });
    }

    delete changes.search;

    await collection.updateOne({ _id: movie._id },{$set: changes});

    res.status(200).send({ msg: `Movie ${movie.title} edited successfully`});

  }catch(err) {
    console.log(err);
  }

}