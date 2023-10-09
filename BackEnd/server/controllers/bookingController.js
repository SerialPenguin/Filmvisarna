import Booking from '../models/bookingModel.js';

export const bookSeat = async (req, res) => {
  try {
    console.log("PATCH /api/bookings - Received a request.");
    const { screeningId, salonId, seat } = req.body;
    console.log("Request body:", req.body);

    // Check if a booking with the same screeningId and seat already exists
    const existingBooking = await Booking.findOne({
      screeningId,
      "seat.rowNumber": seat.rowNumber,
      "seat.seatNumber": seat.seatNumber
    });

    // If a booking already exists, return a relevant message without creating a new booking
    if (existingBooking) {
      console.log("Booking attempt for already booked seat:", seat);
      return res.status(400).json({ error: 'Seat is already booked' });
    }

    const newBooking = new Booking({
      screeningId,
      salonId,
      seat
    });

    await newBooking.save();
    console.log("Booking saved to the database:", newBooking);
    res.status(201).json({ message: 'Booking successfully created!', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};