import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js';
import Screening from '../models/screeningModel.js';


export const bookSeat = async (req, res) => {
  try {
    const { screeningId, salonId, seat } = req.body;
    console.log("Request body:", req.body);

    const screening = await Screening.findById(new mongoose.Types.ObjectId(screeningId));
    console.log("Find Screening:", screening);

    const existingBooking = await Booking.findOne({
      screeningId,
      "seat.rowNumber": seat.rowNumber,
      "seat.seatNumber": seat.seatNumber
    });

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
    console.log("Booking saved:", newBooking);

    console.log("ScreeningId Type and Value:", typeof screeningId, screeningId);

    const screeningUpdateResponse = await Screening.updateOne(
      { _id: new mongoose.Types.ObjectId(screeningId) },
      { $push: { bookedSeats: seat } }
    );

    console.log("Update Response:", screeningUpdateResponse);

    // Fetch updated screening for logging
    const updatedScreening = await Screening.findOne(
      { _id: new mongoose.Types.ObjectId(screeningId) }
    );

    console.log("Updated Screening:", updatedScreening);

    res.status(201).json({ message: 'Booking created!', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


