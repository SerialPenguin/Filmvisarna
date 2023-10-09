import mongoose from 'mongoose';

const screeningSchema = new mongoose.Schema({
  movieId: mongoose.Schema.Types.ObjectId,
  salonId: mongoose.Schema.Types.ObjectId,
  startTime: Date,
  endTime: Date,
  bookedSeats: [
    {
      rowNumber: Number,
      seatNumber: Number,
    },
  ],
}, { collection: 'screenings'});

const Screening = mongoose.model('screening', screeningSchema, 'screenings');

export default Screening;