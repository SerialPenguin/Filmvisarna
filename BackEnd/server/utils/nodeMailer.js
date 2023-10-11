import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

export default async function sendEmail(subject, message, send_to, reply_to) {
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

    const options = {
        from: "film.visers123@outlook.com",
        to: send_to,
        subject: "Bokningsbekräftelse Filmvisarna",
        html: "<p>Din bokningsbekräftelse</p>"
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