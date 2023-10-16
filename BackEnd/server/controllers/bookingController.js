import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js';
import Screening from '../models/screeningModel.js';
import User from "../models/userModel.js";
import authService from '../service/authService.js';

export const bookSeat = async (req, res) => {
  try {
    const { screeningId, salonId, seats, email, ticketTypeId } = req.body;
    const screening = await Screening.findById(new mongoose.Types.ObjectId(screeningId));
    const collection = mongoose.connection.collection('seats');
    const salonSeats = await collection.find({ "_id": screening.salonId }).toArray();

    let maxRows;
    let minRows;

    // Check all seats for availability
    for (let seat of seats) {
      if (salonSeats[0].capacity === 55) {
        maxRows = 6;
        minRows = 1;
      } else if (salonSeats[0].capacity === 81) {
        maxRows = 8;
        minRows = 1;
      }
      
      if (seat.rowNumber > maxRows || seat.rowNumber < minRows) {
        return res.status(400).json({ msg: `Row ${seat.rowNumber} does not exist.` });
      }

      const availableSeatsArray = salonSeats[0].rows[seat.rowNumber - 1].seats;

      if (!availableSeatsArray.includes(seat.seatNumber)) {
        return res.status(400).json({ msg: `Seat ${seat.seatNumber} does not exist on chosen row.` });
      }

      const existingBooking = await Booking.findOne({
        screeningId,
        "seat.rowNumber": seat.rowNumber,
        "seat.seatNumber": seat.seatNumber
      });

      if (existingBooking) {
        return res.status(400).json({ error: `Seat ${seat.seatNumber} on row ${seat.rowNumber} is already booked` });
      }
    }

    let bookingNumber = generateBookingNumber();

    while (await Booking.findOne({ bookingNumber })) {
      bookingNumber = generateBookingNumber();
    }

    const authHeader = req.headers["authorization"];
    const userInfo = await authService.verifyJwt(authHeader);
    const userEmail = email ? email : "no email";

    const newBooking = new Booking({
      screeningId,
      salonId,
      seats, // Save seats as an array
      bookedBy: {
        user: userInfo.id ? userInfo.id : userInfo,
        email: userEmail,
      },
      bookingNumber,
      ticketTypeId,
    });

    await newBooking.save();

    if (userInfo.id) {
      const user = await User.findOne({ _id: userInfo.id });
      await user.updateOne({ $push: { bookingHistory: screeningId } });
    }

    const bookedSeats = seats.map(seat => ({ rowNumber: seat.rowNumber, seatNumber: seat.seatNumber }));
    await Screening.updateOne(
      { _id: new mongoose.Types.ObjectId(screeningId) },
      { $push: { bookedSeats: { $each: bookedSeats } } }
    );

    res.status(201).json({ message: 'Booking created!', booking: newBooking });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function generateBookingNumber() {
  const randomChars = [];
  for (let i = 0; i < 6; i++) {
    let random;
    if (i <= 2) {
      random = Math.floor(Math.random() * (90 - 65) + 65);
      randomChars.push(String.fromCharCode(random));
    } else {
      random = Math.floor(Math.random() * 10);
      randomChars.push(random);
    }
  }
  return randomChars.join('');
}
