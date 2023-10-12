import sendEmail from '../utils/nodeMailer.js'
import dotenv from 'dotenv';

dotenv.config();

export default async function sendConfirmation(req, res) {
    const { email, bookingno } = req.body;

    try {
        const to = email;
        const from = `Filmvisarna <${process.env.EMAIL_USER}>`;
        const replyTo = email;
        const subject = "Bokningsberäftelse Filmvisarna";
        const text = `Din bokningsbekräftelse. Ditt bokningsnummer är ${bookingno}. Välkommen på en fantastisk bioupplevelse hos oss på Filmvisarna.`;
        const html = `<h3>Din bokningsbekräftelse</h3> <br> <p>Ditt bokningsnummer är ${bookingno}. Välkommen på en fantastisk bioupplevelse hos oss på Filmvisarna.</p>`

        await sendEmail({ from, to, replyTo, subject, text, html });
        res.status(200).json({ success: true, message: "Email sent" });
    } catch (error) {
        res.status(500).json(error.message)
    }
}