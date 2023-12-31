import mongoose from 'mongoose';


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