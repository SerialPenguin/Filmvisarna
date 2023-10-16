import mongoose from 'mongoose';
import Booking from '../models/bookingModel.js';
import Screening from '../models/screeningModel.js';
import User from "../models/userModel.js";
import authService from '../service/authService.js';
import generatorService from '../service/generatorService.js.js';



export const bookSeat = async (req, res) => {
  try {
    const { screeningId, salonId, seat, email, ticketTypeId} = req.body;


    const screening = await Screening.findById(new mongoose.Types.ObjectId(screeningId));

    try {
      const collection = mongoose.connection.collection('seats');
      const seats = await collection.find({ "_id": screening.salonId }).toArray();

      let maxRows;
      let minRows;
      
      if(seats[0].capacity === 55) {
        maxRows = 6;
        minRows = 1;

        if(seat.rowNumber > maxRows || seat.rowNumber < minRows) {
          return res.status(400).json({ msg: "Row does not exist."})
        }
        
        const availableSeats = seats[0].rows[seat.rowNumber - 1].seats;
        
        if(!availableSeats.includes(seat.seatNumber)) {
          return res.status(400).json({ msg: "Seat does not exist on chosen row." })
        }

      }else if(seats[0].capacity === 81) {
        maxRows = 8;
        minRows = 1;

        if(seat.rowNumber > maxRows || seat.rowNumber < minRows) {
          return res.status(400).json({ msg: "Row does not exist."})
        }
        
        const availableSeats = seats[0].rows[seat.rowNumber - 1].seats;
        
        if(!availableSeats.includes(seat.seatNumber)) {
          return res.status(400).json({ msg: "Seat does not exist on chosen row." })
        }
      }

    }catch(err) {
        console.log(err)
    }

    const existingBooking = await Booking.findOne({
      screeningId,
      "seat.rowNumber": seat.rowNumber,
      "seat.seatNumber": seat.seatNumber
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Seat is already booked' });
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
      seat,
      bookedBy: {
        user: userInfo.id ? userInfo.id : userInfo,
        email: userEmail,
      },
      bookingNumber: bookingNumber,
      ticketTypeId,
    });

    await newBooking.save();

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

    const screeningUpdateResponse = await Screening.updateOne(
      { _id: new mongoose.Types.ObjectId(screeningId) },
      { $push: { bookedSeats: seat } }
    );

    res.status(201).json({ message: 'Booking created!', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


