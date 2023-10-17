import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js';
import Screening from '../models/screeningModel.js';
import User from "../models/userModel.js";
import authService from '../service/authService.js';
import generatorService from '../service/generatorService.js.js'; 
import sendConfirmation from '../service/mailService.js';

export const bookSeat = async (req, res) => {
  try {
    const { screeningId, seats, email, ticketTypeId } = req.body;
    
    const screening = await Screening.findById(screeningId);
    const movieInfo = await mongoose.connection.collection('movies').findOne({ "_id": screening.movieId });

    if (movieInfo.age >= 15 && ticketTypeId.includes("65279fcd702eef67b26ef3c4")) {
      return res.status(405).json({ msg: "Ticket for children is unavailable, age restriction is applied!" });
    }

    const requestedSeats = seats.map(seat => ({ rowNumber: seat.rowNumber, seatNumber: seat.seatNumber }));
    
    const existingBookings = await Booking.find({ screeningId });

    const bookedSeats = existingBookings.reduce((acc, booking) => {
      return acc.concat(booking.seats.map(s => ({ rowNumber: s.rowNumber, seatNumber: s.seatNumber })));
    }, []);

    for (let seat of requestedSeats) {
      const isSeatBooked = bookedSeats.some(
        bookedSeat => bookedSeat.rowNumber === seat.rowNumber && bookedSeat.seatNumber === seat.seatNumber
      );

      if (isSeatBooked) {
        return res.status(400).json({ error: `Seat ${seat.seatNumber} is already booked` });
      }
    }

    
    let bookingNumber;
    do {
      bookingNumber = generatorService.generateBookingNumber();
    } while (await Booking.findOne({ bookingNumber: bookingNumber }));

    const authHeader = req.headers["authorization"];
    const userId = await authService.verifyJwt(authHeader);
    const userEmail = email ? email : "no email";

    const newBooking = new Booking({
      screeningId,
      seats,
      bookedBy: {
        user: userId === undefined ? "GUEST" : userId,
        email: userEmail,
      },
      bookingNumber: bookingNumber,
      ticketTypeId,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created!', booking: newBooking });

    // Update the screening with the new booking
    await Screening.updateOne(
      { _id: screeningId },
      { $push: { bookings: newBooking._id } }
    );

    // Send email confirmation
    await sendConfirmation({ body: { email: userEmail, bookingno: bookingNumber } }, res);

    // Update user's booking history if they are logged in
    if (userId) {
      await User.updateOne(
        { _id: userId },
        { $push: { bookingHistory: newBooking._id } }
      );
    }

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};