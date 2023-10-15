import express from "express";
import dotenv from "dotenv";
import "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import screeningRoutes from "./routes/screeningRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import nodeMailerRoutes from './routes/nodeMailerRoutes.js';
import { getSeats } from './controllers/seatsController.js'
import Screening from "./models/screeningModel.js";



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//   req.on('close', () => {
//     clients.splice(clients.indexOf(res), 1);
//   })

//   setInterval(() => {
//     res.write(`data: ${new Date().toISOString()}\n\n`);
//   }, 1000);
// });

app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/screenings", screeningRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/api/sendmail', nodeMailerRoutes); // nodemailer-endpoint - the logic will go into bookingendpoint later perhaps
app.use("/api/auth", userRoutes);
app.use("/api", searchRoutes);
app.use("/api/seats", getSeats);

const clients = [];

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');  // Needed specific route to work
  res.flushHeaders();

  const sendBookedSeats = async () => {
    try {
      const fetchedScreening = await Screening.findById("6523d4a61451567f3ed4cebd");
      res.write(`data: ${JSON.stringify(fetchedScreening.bookedSeats)}\n\n`);
    } catch (error) {
      console.error('Error retrieving booked seats:', error);
      res.write(`data: ERROR\n\n`);
    }
};

   clients.push(res);
  // Send updates at a regular interval (e.g., every second)
  const intervalId = setInterval(sendBookedSeats, 500);

  // Cleanup interval and close SSE channel upon client disconnect
  req.on('close', () => {
    clients.splice(clients.indexOf(res), 1);
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


