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


app.get('/movies', async (req, res) => {
  try {
    const collection = db.collection('Moovies');
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


