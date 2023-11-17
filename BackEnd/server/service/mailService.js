import sendEmail from '../utils/nodeMailer.js'
import dotenv from 'dotenv';
import __dirname from '../assets/dir.js';

dotenv.config();

export default async function sendConfirmation({ bookingNumber, email, totalPrice, seatingInfo, movieName, screeningTime, screeningDate, salonName }) {

    try {
        const to = email;
        const from = `Filmvisarna <${process.env.EMAIL_USER}>`;
        const replyTo = email;
        const subject = "Bokningsberäftelse Filmvisarna";
        const text = `Din bokningsbekräftelse. Ditt bokningsnummer är ${bookingNumber}. Välkommen på en fantastisk bioupplevelse hos oss på Filmvisarna.`;
        const html = `
        <div style="border:purple; border-width:2px; border-style:solid; padding:10px; text-align:center; width:400px; border-radius:15px; font-size:16px;">
        <h2 style="color:purple;">Din bokningsbekräftelse</h2> 
        <p>Ditt bokningsnummer är 
        <br><h1>${bookingNumber}</h1> 
        Ta med ditt bokningsnummer till biografen för att kunna betala och få biljetterna till din valda visning.
        <br>
        <h2>${movieName}</h2>
        <h4>Platser: ${seatingInfo} i ${salonName}</h4>
        <h4>Dag: ${screeningDate}</h4>
        <h4>Tid: ${screeningTime}</h4>
        <h3>Pris: ${totalPrice} Kr</h3>
        <br>
        Välkommen på en fantastisk bioupplevelse hos oss på </p> 
        <br><img src="cid:logo.ee">
        <br>
        </div>`
        const attachments = [{
            filename: 'FilmvisarnaLogoTwo.png',
            path: __dirname + '/FilmvisarnaLogoTwo.png',
            cid: 'logo.ee'
        }]

        await sendEmail({ from, to, replyTo, subject, text, html, attachments });
    } catch (error) {
        console.log(error.message);
    }
}