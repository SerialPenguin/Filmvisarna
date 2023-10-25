const temporaryBookingSchema = new mongoose.Schema({
    screeningId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screening', required: true },
    seats: [{
        seatNumber: { type: Number, required: true }
    }],
    reservedAt: { type: Date, default: Date.now }
}, { collection: 'temporaryBookings' });