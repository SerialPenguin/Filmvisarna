import './bookingConfirmation.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TicketFront from '../../img/ticketFront.png';
import TicketBack from '../../img/ticketBack.png';
import {patch} from '../../hooksAndUtils/fetchUtil';

export default function BookingConfirmation(props) {

  const navigate = useNavigate();

  const [ email, setEmail ] = useState("");
  const [ bookingBody, setBookingBody ] = useState({});
  const [ toggleClassName, setToggleClassName] = useState("ticket");
  const [ animationDone, setAnimationDone ] = useState(false);
  const [ bookingNumber, setBookingNumber ] = useState('QWE123');

  function handleBookingBody(e) {
    setEmail(e.target.value);
    setBookingBody({...props.body, email});
  }
  
  async function handleSendConfirmation() {

    const booking = await patch('/api/bookings', bookingBody)

    console.log("new booking: ", booking.booking.bookingNumber);


    if(booking.message.includes("Booking created!")) {
      setToggleClassName("ticket-animation");
      setTimeout(() => {
        setAnimationDone(true);
        setBookingNumber(booking.booking.bookingNumber ? booking.booking.bookingNumber : "");
      }, 3200);
    }
  }

  return (
    <div className='main-container'>
      <div className='ticket-container'>
        <div className={toggleClassName === "ticket" ? "ticket" : "ticket-animation"}>
          <img className="ticket-front" src={TicketFront} />
          <img className="ticket-back" src={TicketBack} />
        </div>
      </div>
      {animationDone === false && (
        <div className='email-input'>
          <label htmlFor="email">Email:</label>
          <input
            required
            autoFocus
            type="email"
            className="email-field"
            placeholder="example.mail@example.com"
            onChange={handleBookingBody}
            onBlur={handleBookingBody}
            value={email || ''}
            name="email"
            id="email">
          </input>
          {email.includes('@') && (
            <button className='send-btn' onClick={handleSendConfirmation}>Skicka bekräftelsen</button>
          )}
        </div>
      )}
      {animationDone === true && (
        <div>
          <p>Bokningsnummer: {bookingNumber}</p>
          <button className='navigate-btn' onClick={() => navigate('/')}>Hem</button>
        </div>
      )}
    </div>
  );
}
