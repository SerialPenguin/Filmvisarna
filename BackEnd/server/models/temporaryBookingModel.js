import mongoose from 'mongoose';

const temporaryBookingSchema = new mongoose.Schema({
    screeningId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screening', required: true },
    seats: [{
        seatNumber: { type: Number, required: true }
    }],
}, { collection: 'temporaryBookings' });

const TemporaryBooking = mongoose.model('temporaryBooking', temporaryBookingSchema, 'temporaryBookings');

export default TemporaryBooking;