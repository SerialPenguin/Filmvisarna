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
import { reserveSeats } from "./controllers/temporarySeatsController.js";
import TemporaryBooking from "./models/temporaryBookingModel.js";

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
app.use("/api/reserveSeats", reserveSeats);

app.get("/api/events/:screeningId", async (req, res) => {
  const { screeningId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  


  const sendBookedSeats = async () => {
    try {
      const allBookingsForScreening = await Booking.find({ screeningId });
      const tempBookingsForScreening = await TemporaryBooking.find({ screeningId }); 

      const aggregatedBookedSeats = allBookingsForScreening.reduce((acc, booking) => [...acc, ...booking.seats.map(seat => seat.seatNumber)], []);
      const aggregatedTempBookedSeats = tempBookingsForScreening.reduce((acc, booking) => [...acc, ...booking.seats.map(seat => seat.seatNumber)], []); 

      const allSeats = [...aggregatedBookedSeats, ...aggregatedTempBookedSeats]; 

      res.write(`data: ${JSON.stringify(allSeats)}\n\n`);
    } catch (error) {
      console.error("Error retrieving booked seats:", error);
      res.write(`data: ERROR\n\n`);
    }
};
  sendBookedSeats();
  
  const KEEP_ALIVE_INTERVAL = 30000;

  const sendKeepAlive = () => {
    res.write (': keep-alive\n\n');
  };

  const keepAliveIntervalId = setInterval(sendKeepAlive, KEEP_ALIVE_INTERVAL);

  const bookingChangeStream = Booking.watch();
  const tempBookingChangeStream = TemporaryBooking.watch();

  bookingChangeStream.on('change', sendBookedSeats);
  tempBookingChangeStream.on('change', sendBookedSeats);

  req.on("close", () => {
    clearInterval(keepAliveIntervalId);
    bookingChangeStream.close();
    tempBookingChangeStream.close();
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
