import sendEmail from '../utils/nodeMailer.js'

export default async function sendConfirmation(req, res) {
    const { email, bookingno } = req.body;

    try {
        //hardcode email to test
        const send_to = email;
        const sent_from = process.env.EMAIL_USER;
        const reply_to = email;
        const subject = "";
        const text = "Din bokningsbekräftelse. Ditt bokningsnummer är " + bookingno + ". Välkommen på en fantastisk bioupplevelse hos oss på Filmvisarna.";
        const html = `<h3>Din bokningsbekräftelse</h3> <br> <p>Ditt bokningsnummer är ${bookingno}. Välkommen på en fantastisk bioupplevelse hos oss på Filmvisarna.</p>`
        console.log(send_to, sent_from, reply_to)
        await sendEmail(send_to, sent_from, reply_to, subject, text, html);
        res.status(200).json({ success: true, message: "Email sent" });
    } catch (error) {
        res.status(500).json(error.message)
    }
}