import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  screeningId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screening', required: true },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  seat: {
    rowNumber: { type: Number, required: true },
    seatNumber: { type: Number, required: true }
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;