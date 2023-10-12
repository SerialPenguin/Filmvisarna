import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

export default async function sendEmail(subject, text, send_to, reply_to, sent_from, html) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: "587", // for outlook, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false,
        }
    })

    const bookingno = "GTE134";

    //from and subject must be hardcoded here to work! why...who knows -.-
    const options = {
        from: "Filmvisarna <film.visers123@outlook.com>",
        to: send_to,
        subject: "Bokningsbekräftelse Filmvisarna",
        text: text,
        html: html
    }

    //send email
    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })
};

// from: "Filmvisarna <film.visers123@outlook.com>",
//         to: send_to,
//         subject: "Bokningsbekräftelse Filmvisarna",
//         text: "Din bokningsbekräftelse. Ditt bokningsnummer är " + bookingno + ". Välkommen på en fantastisk bioupplevelse hos oss på Filmvisarna.",
//         html: `<h3>Din bokningsbekräftelse</h3> <br> <p>Ditt bokningsnummer är ${bookingno}. Välkommen på en fantastisk bioupplevelse hos oss på Filmvisarna.</p>`