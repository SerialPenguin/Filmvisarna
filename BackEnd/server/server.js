import express from "express";
import dotenv from "dotenv";
import "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import screeningRoutes from "./routes/screeningRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import { getSeats } from "./controllers/seatsController.js";
import Booking from "./models/bookingModel.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/screenings", screeningRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/seats", getSeats);

app.get("/api/events/:screeningId", async (req, res) => {
  const { screeningId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const sendBookedSeats = async () => {
    try {
      // Fetch all the bookings for the given screeningId
      const allBookingsForScreening = await Booking.find({
        screeningId: screeningId,
      });

      // Aggregate all booked seats from these bookings
      const aggregatedBookedSeats = allBookingsForScreening.reduce(
        (acc, booking) => {
          return [...acc, ...booking.seats.map((seat) => seat.seatNumber)];
        },
        []
      );

      // Log to check which seats are booked and aggregated into the screening.
      console.log("Aggregated Booked Seats:", aggregatedBookedSeats);

      res.write(`data: ${JSON.stringify(aggregatedBookedSeats)}\n\n`);
    } catch (error) {
      console.error("Error retrieving booked seats:", error);
      res.write(`data: ERROR\n\n`);
    }
  };

  const intervalId = setInterval(sendBookedSeats, 500);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

// Middleware, Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "An unexpected error occurred!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
