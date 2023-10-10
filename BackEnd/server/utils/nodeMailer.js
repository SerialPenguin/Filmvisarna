import nodemailer from 'nodemailer';

export default async function sendEmail(subject, message, send_to, send_from) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: "465", // for gmail, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false,
        }
    })

    const options = {
        from: send_from,
        to: send_to,
        subject: subject,
        html: message
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