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

    const {
      title, productionCountries, productionYear, 
      length, genre, distributor, language, 
      subtitles, director, actors, description, 
      images, youtubeTrailers, age
    } = req.body;

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
      age
    })

    await newMovie.save();

    res.status(200).send({msg: `New movie, ${newMovie.title} added to database`});

  }catch(err) {
    console.log(err)
  }
};

export const editMovies = async (req, res) => {
  const {title} = req.body;
  
  try {
    const collection = mongoose.connection.collection('movies');
    const movie = await collection.findOne({title: title});
    res.json(movie);
  }catch(err) {
    console(err);
  }
}