import mongoose from 'mongoose';

export const getAllBookings = async (req, res) => {
  try {
    const collection = mongoose.connection.collection('bookings');
    const bookings = await collection.find({}).toArray();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};