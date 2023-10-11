import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js';
import Screening from '../models/screeningModel.js';
import User from "../models/userModel.js";
import authService from '../service/authService.js';


export const bookSeat = async (req, res) => {
  try {
    const { screeningId, salonId, seat, bookedBy } = req.body;
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

    const randomChars = []
    const min = 10;
    const max = 123;

    let result = generateBookingNumber(min, max);

    function generateBookingNumber(min, max) {
      for(let i = 0; i < 6; i++) {

        let random;
        let randomModulus = Math.floor(Math.random() * (3 - 1) + 1);
  
        if(i%randomModulus === 0){
          random = Math.floor(Math.random() * (max - min) + min);
        }
        else {
          random = Math.floor(Math.random() * min);
        }
  
        if(random < 10 || random > 65 && random < 91 || random > 96) {
          if(random > 64) random = String.fromCharCode(random)
          randomChars.push(random);
        }else i--;
      }

      let result = randomChars.join('');
      console.log("Booking number:" + result);
      return result;
    }

    let existingBookingNumber = await Booking.findOne({
      bookingNumber: result
    })

    if(existingBookingNumber) {
      result = generateBookingNumber(min, max);
    }else {

      const authHeader = req.headers["authorization"];

      const userInfo = authService.verifyJwt(authHeader);

      const userID = userInfo.id ? userInfo.id : "GUEST";
      const userEmail = userInfo.email ? userInfo.email : "email";

      const newBooking = new Booking({
        screeningId,
        salonId,
        seat,
        bookedBy: {
          user: userID,
          email: userEmail,
        },
        bookingNumber: result
      });

      await newBooking.save();
      console.log("Booking saved:", newBooking);

      console.log("ScreeningId Type and Value:", typeof screeningId, screeningId);

      const user = await User.findOne({_id: userInfo.id});

      const updateUserBookingHistory = await user.updateOne(
        { $push: {bookingHistory: screeningId }},
      );

      console.log("User update Response:", updateUserBookingHistory);

      const screeningUpdateResponse = await Screening.updateOne(
        { _id: new mongoose.Types.ObjectId(screeningId) },
        { $push: { bookedSeats: seat } }
      );

      console.log("Screening update Response:", screeningUpdateResponse);

      // Fetch updated screening for logging
      const updatedScreening = await Screening.findOne(
        { _id: new mongoose.Types.ObjectId(screeningId) }
      );

      console.log("Updated Screening:", updatedScreening);

      res.status(201).json({ message: 'Booking created!', booking: newBooking });
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


