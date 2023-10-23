import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Screening from "../models/screeningModel.js";
import User from "../models/userModel.js";
import authService from "../service/authService.js";
import generatorService from "../service/generatorService.js.js";
import sendConfirmation from "../service/mailService.js";

export const bookSeat = async (req, res) => {
  try {
    const { screeningId, salonId, seats, email, ticketTypeId } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required for booking completion." });
    }

    const screening = await Screening.findById(screeningId);
    if (!screening) {
      return res.status(404).json({ msg: "Screening not found." });
    }

    const collection = mongoose.connection.collection("seats");
    const salon = await collection.find({ _id: screening.salonId }).toArray();
    if (!salon || !salon[0]) {
      return res.status(404).json({ msg: "Salon not found." });
    }

    const movieInfo = await mongoose.connection.collection("movies").findOne({ _id: screening.movieId });
    if (!movieInfo) {
      return res.status(404).json({ msg: "Movie not found." });
    }

    // Check for age restrictions
    if (movieInfo.age >= 15 && ticketTypeId.includes("65279fcd702eef67b26ef3c4")) {
      return res.status(405).json({
        msg: "Ticket for children is unavailable, age restriction is applied!",
      });
    }

    // Validate seat numbers and rows based on salon's capacity
    for (let seat of seats) {
      if ((salon[0].capacity === 55 || salon[0].capacity === 81) && (seat.seatNumber > salon[0].capacity || seat.seatNumber < 1)) {
        return res.status(400).json({ msg: `Seat doesn't exist in the ${salon[0].name}` });
      }
    }

    const existingBookings = await Booking.find({ screeningId });
    const bookedSeats = existingBookings.reduce((acc, booking) => {
      return acc.concat(booking.seats.map((s) => ({ seatNumber: s.seatNumber })));
    }, []);

    for (let seat of seats) {
      const isSeatBooked = bookedSeats.some((bookedSeat) => bookedSeat.seatNumber === seat.seatNumber);
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

    if(userId === "invalid signature") {
      return res.status(400).json({ msg: 'JsonWebTokenError: "Invalid signature". Please check jwt.'});
    }

    const newBooking = new Booking({
      screeningId,
      salonId,
      seats,
      bookedBy: {
        user: userId || "GUEST",
        email: email,
      },
      bookingNumber: bookingNumber,
      ticketTypeId,
    });

    await newBooking.save();

    await Screening.updateOne({ _id: screeningId }, { $push: { bookings: newBooking._id } });

    // Send email confirmation
    sendConfirmation({ bookingNumber, email });

    if (userId) {
      await User.updateOne({ _id: userId }, { $push: { bookingHistory: newBooking._id } });
    }

    res.status(201).json({ message: "Booking created!", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


