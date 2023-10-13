import mongoose from 'mongoose';

export const getSeats = async (req, res) => {
    try {
      const collection = mongoose.connection.collection('seats');
      let seats;
      
      if (req.params.salonId) {
        const salonId = new mongoose.Types.ObjectId(req.params.salonId);
        seats = await collection.findOne({ _id: salonId });
      } else {
        seats = await collection.find({}).toArray();
      }
  
      if (!seats) {
        return res.status(404).json({ error: 'Seats not found' });
      }
  
      res.json(seats);
    } catch (error) {
      console.error('Error fetching seats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };