import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

export default async function sendEmail({ from, to, replyTo, subject, text, html, attachments }) {
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

    //send options from nodeMailerController
    const options = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: attachments,
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