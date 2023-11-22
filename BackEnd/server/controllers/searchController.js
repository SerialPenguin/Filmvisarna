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
  };
