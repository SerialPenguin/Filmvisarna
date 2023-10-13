import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";

export const getAllScreenings = async (req, res) => {
  try {
    const screeningsCollection = mongoose.connection.collection("screenings");
    const screenings = await screeningsCollection
      .aggregate([
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $lookup: {
            from: "seats",
            localField: "salonId",
            foreignField: "_id",
            as: "salon",
          },
        },
        {
          $unwind: "$movie",
        },
        {
          $unwind: "$salon",
        },
      ])
      .toArray();

    for (let i = 0; i < screenings.length; i++) {
      const totalCapacity = screenings[i].salon.capacity;
      // Find the number of bookings for this screening.
      const bookedSeatsCount = await Booking.find({
        screeningId: screenings[i]._id,
      }).countDocuments();
      console.log(
        `Screening ID: ${screenings[i]._id}, Booked Seats: ${bookedSeatsCount}, Total Capacity: ${totalCapacity}`
      );
      screenings[i].availableSeats = totalCapacity - bookedSeatsCount;
    }

    screenings.forEach((screening) => {
      console.log("Movie title:", screening.movie.title);
      console.log("Salon name:", screening.salon.name);
      console.log("Available seats:", screening.availableSeats);
    });

    res.json(screenings);
  } catch (error) {
    console.error("Error fetching screenings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
