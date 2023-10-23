import mongoose from 'mongoose';

const SeatSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  rows: [
    {
      rowNumber: Number,
      seats: [Number],
    },
  ],
}, { collection: 'seats'});

const Seat = mongoose.model('seat', SeatSchema);
export default Seat;