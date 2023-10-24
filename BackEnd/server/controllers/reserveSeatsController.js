// export const reserveSeats = async (req, res) => {

//   const reservedSeats = [];

//   const seats = req.body.seats;
//   console.log("Seats: ", seats);

//   seats.map((seat) => reservedSeats.push(seat));

//   console.log("ReservedSeats: ", reservedSeats);

//   if(seats) res.status(200).json({ msg: "Reserved seats properly"});
// };

import TemporaryBooking from '../models/temporaryBookingModel.js';

export const reserveSeats = async (req, res) => {
  try {
    const { screeningId, seats } = req.body;

    if (!screeningId || !seats || seats.length === 0) {
      return res.status(400).json({ msg: "Invalid request parameters." });
    }

    // Check if the seats are already reserved or booked
    const existingReservations = await TemporaryBooking.find({
      screeningId,
      'seats.seatNumber': { $in: seats.map(seat => seat.seatNumber) }
    });

    if (existingReservations.length > 0) {
      return res.status(400).json({ msg: "Some of the seats are already reserved." });
    }

    // Insert the temporary reservation
    const newReservation = new TemporaryBooking({
      screeningId,
      seats
    });

    await newReservation.save();

    return res.status(200).json({ msg: "Seats reserved successfully." });

  } catch (error) {
    console.error("Error reserving seats:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};