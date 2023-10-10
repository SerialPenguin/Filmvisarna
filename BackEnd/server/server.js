import express from 'express';
import dotenv from 'dotenv';
import './config/db.js';
import bookingRoutes from './routes/bookingRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import screeningRoutes from './routes/screeningRoutes.js';
import sendEmail from './utils/nodeMailer.js'


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/movies', movieRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/bookings', bookingRoutes);

//nodemailer tryout
// app.get("/api/sendmail", (req, res) => {
//   res.send("")
// })

app.post("/api/sendmail", async (req, res) => {
  const { email } = req.body;

  try {
    //hardcode email to test
    const send_to = email;
    const send_from = process.env.EMAIL_USER;
    const subject = "Bokningsbekräftelse Filmvisarna";
    const message = `
      <h3>Här är din bokningsbekräftelse</h3>
      <p>Bokningsnummer</p>
      <p>Hoppas du får en fin bioupplevelse hos oss! Välkommen åter! / Filmvisarna</p>
    `
    await sendEmail(send_to, send_from, subject, message);
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    res.status(500).json(error.message)
  }
})

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'An unexpected error occurred!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});