import mongoose from 'mongoose';

const temporaryBookingSchema = new mongoose.Schema({
    screeningId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screening', required: true },
    seats: [{
        seatNumber: { type: Number, required: true }
    }],
    createdAt: {
        type: Date, 
        default: Date.now,
        index: { expires: '300s' }
    } // MongoDB will only remove documents ever 60 seconds, need a workaround.
}, { collection: 'temporaryBookings' });


const TemporaryBooking = mongoose.model('temporaryBooking', temporaryBookingSchema, 'temporaryBookings');


export default TemporaryBooking;