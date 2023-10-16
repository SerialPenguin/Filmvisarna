import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js';
import Screening from '../models/screeningModel.js';
import User from "../models/userModel.js";
import authService from '../service/authService.js';
import generatorService from '../service/generatorService.js.js';


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

    let bookingNumber = generatorService.generateBookingNumber();
    
    let existingBookingNumber = await Booking.findOne({
      bookingNumber: bookingNumber
    })
  
    if(existingBookingNumber) {
      bookingNumber = generatorService.generateBookingNumber();
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
      bookingNumber: bookingNumber,
      ticketTypeId,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created!', booking: newBooking });

    
    const bookedSeats = seats.map(seat => ({ rowNumber: seat.rowNumber, seatNumber: seat.seatNumber }));
    await Screening.updateOne(
      { _id: new mongoose.Types.ObjectId(screeningId) },
      { $push: { bookedSeats: { $each: bookedSeats } } }
    );

    if(userInfo.id) {
      const user = await User.findOne({_id: userInfo.id});

      const booking = await Booking.findOne({
        screeningId,
        "bookingNumber": bookingNumber,
      })

      const updateUserBookingHistory = await user.updateOne(
        { $push: {bookingHistory: booking._id}},
      );
    }

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
