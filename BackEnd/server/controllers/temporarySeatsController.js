import TemporaryBooking from '../models/temporaryBookingModel.js';

export const getTemporaryBookings = async (req, res) => {
  try {
    const { screeningId } = req.params;
    const tempBookings = await TemporaryBooking.find({ screeningId });
    const tempBookedSeats = tempBookings.reduce((acc, booking) => {
      return [...acc, ...booking.seats.map(seat => seat.seatNumber)];
    }, []);
    res.status(200).json(tempBookedSeats);
  } catch (error) {
    console.error("Error fetching temporary bookings:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
};

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