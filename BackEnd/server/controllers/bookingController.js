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
    const movie = mongoose.connection.collection('movies');
    const movieInfo = await movie.find({ "_id": screening.movieId }).toArray();

    if (movieInfo[0].age >= 15) {
      if (ticketTypeId.includes("65279fcd702eef67b26ef3c4")) {
        return res.status(405).json({ msg: "Ticket for children is unavailable, age restriction is applied!" });
      }
    }

    // Controlling that seat number from body is within range of salon
    for (let seat of seats) {
      if (salon[0].capacity === 55) {
        if (seat > 55 || seat < 1) {
          return res.status(400).json({ msg: `Seat doesnt exist in the ${salon[0].name}` });
        }
      } else if (salon[0].capacity === 81) {
        if (seat > 81 || seat < 1) {
          return res.status(400).json({ msg: `Seat doesnt exist in the ${salon[0].name}` });
        }
      }

      // const existingBooking = await Booking.findOne({
      //   screeningId,
      // });

      // if (existingBooking) {
      //   return res.status(400).json({ error: `Seat ${seat.seatNumber} is already booked` });
      // };
    }

    let bookingNumber = generatorService.generateBookingNumber();

    let existingBookingNumber = await Booking.findOne({
      bookingNumber: bookingNumber
    })

    if (existingBookingNumber) {
      bookingNumber = generatorService.generateBookingNumber();
    }

    const authHeader = req.headers["authorization"];
    console.log(email);
    const userId = await authService.verifyJwt(authHeader);
    const userEmail = email ? email : "no email";

    const newBooking = new Booking({
      screeningId,
      salonId,
      seats, // Save seats as an array
      bookedBy: {
        user: userId === undefined ? "GUEST" : userId,
        email: userEmail,
      },
      bookingNumber: bookingNumber,
      ticketTypeId,
    });

 await newBooking.save();
res.status(201).json({ message: 'Booking created!', booking: newBooking });

// Send email confirmation here
await sendConfirmation({ body: { email: userEmail, bookingno: bookingNumber } }, res);

await Screening.updateOne(
  { _id: new mongoose.Types.ObjectId(screeningId) },
  { $push: { bookings: newBooking._id } }
);

    sendConfirmation(bookingNumber, email);

    await Screening.updateOne(
      { _id: new mongoose.Types.ObjectId(screeningId) },
      { $push: { bookings: newBooking._id } }
    );

    if (userId) {
      const user = await User.findOne({ _id: userId });

      const updateUserBookingHistory = await user.updateOne(
        { $push: { bookingHistory: newBooking._id } },
      );
    }



  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
