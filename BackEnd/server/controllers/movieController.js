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
      images, youtubeTrailers, age
    } = req.body;

    productionCountries = productionCountries.split(",");
    actors = actors.split(",");
    images = images.split(",");
    youtubeTrailers = youtubeTrailers.split(",");

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
  
  const changes = req.body;

  try {
    const collection = mongoose.connection.collection('movies');
    const movie = await collection.findOne({title: changes.title});

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found, check spelling' });
    }

    delete changes.title;

    await collection.updateOne({ _id: movie._id },{$set: changes});

    res.status(200).send({ msg: `Movie ${movie.title} edited succesfully`});

  }catch(err) {
    console.log(err);
  }
}

export const deleteMovies = async (req, res) => {

  const param = req.params;

  try{
    const movieCollection = mongoose.connection.collection('movies');
    const screeningCollection = mongoose.connection.collection('screenings');

    const movie = await movieCollection.findOne({title: param.title})

    const screenings = await screeningCollection.find({movieId: movie._id}).toArray([])

    const bookingLength = screenings.map((screening) => screening.bookings.length > 0);

    if(bookingLength.includes(true)) {
      res.status(403).send({ msg: `This movie is included in ${bookingLength.filter(value => (value === true)).length} screenings which contains customer bookings and can therefore not be deleted.`})
    }else {
      const movie = await movieCollection.deleteOne({title: param.title});

      if(movie.deletedCount === 1) {
        res.status(200).send({ msg: `Movie ${param.title} deleted succesfully`});
      }else {
        res.status(500).send({ msg: `Something went wrong` })
      }
    }
    
  }catch(err){
    console.log(err)
  }
} 