import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js';
import Screening from '../models/screeningModel.js';
import User from "../models/userModel.js";
import authService from '../service/authService.js';
import generatorService from '../service/generatorService.js.js';
import sendConfirmation from '../service/mailService.js';

export const bookSeat = async (req, res) => {
  try {
    const { screeningId, salonId, seats, email, ticketTypeId } = req.body;

    const screening = await Screening.findById(new mongoose.Types.ObjectId(screeningId));
    const collection = mongoose.connection.collection('seats');
    const salon = await collection.find({ "_id": screening.salonId }).toArray();
    const movieInfo = await mongoose.connection.collection('movies').findOne({ "_id": screening.movieId });

    // Check for age restrictions
    if (movieInfo.age >= 15 && ticketTypeId.includes("65279fcd702eef67b26ef3c4")) {
      return res.status(405).json({ msg: "Ticket for children is unavailable, age restriction is applied!" });
    }

    // Validate seat numbers and rows based on salon's capacity
    const requestedSeats = seats.map(seat => ({ rowNumber: seat.rowNumber, seatNumber: seat.seatNumber }));
    
    for (let seat of requestedSeats) {
      if (salon[0].capacity === 55 && (seat.seatNumber > 55 || seat.seatNumber < 1)) {
        return res.status(400).json({ msg: `Seat doesn't exist in the ${salon[0].name}` });
      } else if (salon[0].capacity === 81 && (seat.seatNumber > 81 || seat.seatNumber < 1)) {
        return res.status(400).json({ msg: `Seat doesn't exist in the ${salon[0].name}` });
      }
    }

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
      salonId,
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

    await Screening.updateOne(
      { _id: new mongoose.Types.ObjectId(screeningId) },
      { $push: { bookings: newBooking._id } }
    );

    // Send email confirmation
    await sendConfirmation({ body: { email: userEmail, bookingno: bookingNumber } }, res);

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