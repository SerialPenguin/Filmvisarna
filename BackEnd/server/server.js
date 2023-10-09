const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.get('/api/movies', async (req, res) => {
  try {
    const collection = db.collection('Movies');
    const movies = await collection.find({}).toArray();

    console.log('Fetched movies from MongoDB:', movies); 

    if (movies.length === 0) {
      res.status(404).json({ message: 'No movies found' });
    } else {
      res.json(movies);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/screenings', async (req, res) => {
  try {
    const collection = db.collection('Screenings');
    const screenings = await collection.aggregate([
      {
        $lookup: {
          from: 'Movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie'
        }
      },
      {
        $unwind: {
          path: "$movie"
        }
      },
      {
        $lookup: {
          from: 'Seats',
          localField: 'salonId',
          foreignField: '_id',
          as: 'salon'
        }
      },
      {
        $unwind: {
          path: "$salon"
        }
      }
    ]).toArray();

    console.log('Fetched screenings from MongoDB:', screenings); 

    screenings.forEach(screening => {
      if(screening.movie && screening.salon) {
        console.log('Movie title:', screening.movie.title);
        console.log('Salon name:', screening.salon.name);
      } else {
        console.error('Incomplete screening data:', screening);
      }
    });

    if (screenings.length === 0) {
      res.status(404).json({ message: 'No screenings found' });
    } else {
      res.json(screenings);
    }
  } catch (error) {
    console.error('Error fetching screenings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


