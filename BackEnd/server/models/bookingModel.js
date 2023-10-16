import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  screeningId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screening', required: true },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
  ticketTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketType', required: true },
  seats: [{
    rowNumber: { type: Number, required: true },
    seatNumber: { type: Number, required: true }
  }],
  bookedBy: {
    user: { type: String, required: true},
    email: { type: String, required: true}
  },
  bookingNumber: { type: String, required: true}
}, { collection: 'bookings'});

const Booking = mongoose.model('booking', bookingSchema);

export default Booking;