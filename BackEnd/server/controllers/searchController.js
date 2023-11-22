import Booking from '../models/bookingModel.js';
import Screening from '../models/screeningModel.js';
import Movie from '../models/movieModel.js';
import mongoose from 'mongoose';
import Seat from '../models/seatsModel.js';


export const getResourceById = async (req, res) => {
    const { type, id } = req.params;
    let resource;
    try {
      if (type === 'movies'){
        resource = await Movie.findById(new mongoose.Types.ObjectId(id));
      } else if (type === 'screenings'){
        resource = await Screening.findById(new mongoose.Types.ObjectId(id));
      } else if (type === 'bookings'){
        resource = await Booking.findById(new mongoose.Types.ObjectId(id));
      }  else if (type === 'seats') {
        resource = await Seat.findById(new mongoose.Types.ObjectId(id));
      }
      
  
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }
  
      res.json(resource);
    } catch (error) {
      console.error('Error fetching resource:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  export const getMovieByTitle = async (req, res) => {
    const param = req.params
    
    try {
      const collection = mongoose.connection.collection('movies');
      const movie = await collection.findOne({title: param.title});

      if (!movie) {
        return res.status(404).json({ error: 'Movie not found, check spelling' });
      }

      res.json(movie);
    }catch(err) {
      console.error(err);
    }
  }

  export const getSalon = async (req, res) => {

    try{
      const collection = mongoose.connection.collection('seats');
      const salon = await collection.find({}).toArray();

      res.json(salon);
      
    }catch(err) {
      console.error(err);
    }
  }

  export const getScreeningByTitle = async(req, res) => {
    const param = req.params

    try {
      const moviesCollection = mongoose.connection.collection('movies');
      const screeningsCollection = mongoose.connection.collection('screenings');

      const movie = await moviesCollection.findOne({title: param.title});
      const screenings = await screeningsCollection.find({movieId: movie._id}).toArray([]);

      res.json(screenings);
    }catch(err){
      console.error(err)
    }
  }

  export const getBookingByQuery = async (req, res) => {
    const param = req.params;

    try {

      const bookingCollection = mongoose.connection.collection('bookings');
      const booking = await bookingCollection.findOne({bookingNumber: param.query});

      if(!booking) {
        res.status(404).send({ msg: "Booking not found, check booking number"});
      }else {
        res.status(200).send({ status: 200, booking: booking});        
      }

    }catch(err) {
      console.error(err);
    }
  }

  export const getUserById = async (req, res) => {
    const param = req.params;

    try {

      const id = new mongoose.Types.ObjectId(param.id);
      
      const collection = mongoose.connection.collection('users');
      const user = await collection.findOne({_id: id});

      if(user) {
        res.status(200).send({status: 200, user: user});
      }else {
        res.status(404).send({msg: "Could not find a user"});
      }
    }catch(err) {
      console.error(err)
    }
  }