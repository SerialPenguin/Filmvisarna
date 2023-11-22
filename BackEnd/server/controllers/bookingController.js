import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Screening from "../models/screeningModel.js";
import User from "../models/userModel.js";
import authService from "../service/authService.js";
import generatorService from "../service/generatorService.js.js";
import sendConfirmation from "../service/mailService.js";

const TICKET_PRICES = {
  "65279fcd702eef67b26ef3c4": 80,  // child
  "6527a006702eef67b26ef3c5": 140, // adult
  "6527a045702eef67b26ef3c6": 120   // senior
};

const calculateTotalPrice = (tickets) => {
  let totalPrice = 0;
  for (let ticket of tickets) {
    totalPrice += (TICKET_PRICES[ticket.ticketType] || 0) * ticket.quantity;
  }
  return totalPrice;
};

export const bookSeat = async (req, res) => {
  try {
    const { screeningId, salonId, seats, email, tickets } = req.body;

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

    let ticketIds = [];
    let remodeledTicketType;
    let quantity = 0;

    for (let i = 0; i < tickets.length; i++) {
      if (tickets[i].ticketType === "adult") {
        remodeledTicketType = { ...tickets[i], ticketType: "6527a006702eef67b26ef3c5" }
        quantity += tickets[i].quantity;
        ticketIds.push(remodeledTicketType);
      }
      if (tickets[i].ticketType === "senior") {
        remodeledTicketType = { ...tickets[i], ticketType: "6527a045702eef67b26ef3c6" }
        quantity += tickets[i].quantity;
        ticketIds.push(remodeledTicketType);
      }
      if (tickets[i].ticketType === "child") {
        remodeledTicketType = { ...tickets[i], ticketType: "65279fcd702eef67b26ef3c4" }
        quantity += tickets[i].quantity;
        ticketIds.push(remodeledTicketType);
      }
    }


    // Check for age restrictions
    if (movieInfo.age >= 15 && tickets[2]?.quantity !== 0) {
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
    let userId = await authService.verifyJwt(authHeader);

    const newBooking = new Booking({
      screeningId,
      salonId,
      seats,
      bookedBy: {
        user: userId || "GUEST",
        email: email,
      },
      bookingNumber: bookingNumber,
      tickets,
    });

    await newBooking.save();

    await Screening.updateOne({ _id: screeningId }, { $push: { bookings: newBooking._id } });

    const totalPrice = calculateTotalPrice(ticketIds);

    // To render seats in mail
    const seatingInfo = [];
    seats.map(seat => {
      seatingInfo.push(seat.seatNumber);
    })

    // To render movie name in mail
    let movieName = movieInfo.title;

    // To render date and time for screening in mail
    let screeningDate = new Date(screening.startTime).toLocaleDateString("sv-SE").slice();
    let screeningTime = new Date(screening.startTime).toLocaleTimeString("sv-SE").slice(0, -3);
    
    let salonName;
    if (salon[0].name === "Small salon") {
      salonName = "Lilla salongen"
    } else {
      salonName = "Stora salongen"
    }

    // Send email confirmation
    sendConfirmation({ bookingNumber, email, totalPrice, seatingInfo, movieName, screeningTime, screeningDate, salonName });

    if (userId) {
      const checkUser = await User.findOne({ _id: userId });

      if (checkUser) await User.updateOne({ _id: userId }, { $push: { bookingHistory: newBooking._id } });
      else return res.status(400).json({ msg: "User does not exist anymore" });

    }

    res.status(201).json({ message: "Booking created!", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


