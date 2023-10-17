import mongoose, { Schema } from 'mongoose';

const bookingSchema = new mongoose.Schema({
  screeningId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screening', required: true },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  ticketTypeId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketType', required: true }],
  seats: [{
    seatNumber: { type: Number, required: true }
  }],
  bookedBy: {
    user: { type: mongoose.Schema.Types.Mixed, required: true},
    email: { type: String, required: true}
  },
  bookingNumber: { type: String, required: true}
}, { collection: 'bookings'});

const Booking = mongoose.model('booking', bookingSchema);

export default Booking;