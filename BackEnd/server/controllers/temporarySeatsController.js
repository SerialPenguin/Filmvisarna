import TemporaryBooking from '../models/temporaryBookingModel.js';

export const getTemporaryBookings = async (req, res) => {
  try {
    const { screeningId } = req.params;
    
    const currentTime = new Date();
    const tempBookings = await TemporaryBooking.find({ 
      screeningId, 
      createdAt: { $gte: new Date(currentTime - 5000) } 
    });

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
    const { screeningId, seats, previousSeat } = req.body;
    
    if (!screeningId || !seats || seats.length === 0) {
      return res.status(400).json({ msg: "Invalid request parameters." });
    }

    // If a previous seat is provided, remove its reservation
    if (previousSeat) {
      await TemporaryBooking.deleteOne({ screeningId, 'seats.seatNumber': previousSeat });
    }

    // Check if the seats are already reserved or booked
    const existingReservations = await TemporaryBooking.find({
      screeningId,
      'seats.seatNumber': { $in: seats.map(seat => seat.seatNumber) }
    });

    if (existingReservations.length > 0) {
      return res.status(400).json({ msg: "Some of the seats are already reserved." });
    }

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


const cleanupExpiredBookings = async () => {
  const currentTime = new Date();
  const expiredReservations = await TemporaryBooking.find({ 
    createdAt: { $lt: new Date(currentTime - 5000) } 
  });
  await TemporaryBooking.deleteMany({ _id: { $in: expiredReservations.map(res => res._id) } });
};

await cleanupExpiredBookings();