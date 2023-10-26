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
  const [ animationStage, setAnimationStage ] = useState("start");
  const [ bookingNumber, setBookingNumber ] = useState('QWE123');
  const [displayInput, setDisplayInput] = useState(true);

  function handleBookingBody(e) {
    setEmail(e.target.value);
    setBookingBody({...props.body, email});
  }
  
  async function handleSendConfirmation() {

    const booking = await patch('/api/bookings', bookingBody)

    console.log("new booking: ", booking.booking.bookingNumber);

    if(booking.message.includes("Booking created!")) {
      setTimeout(() => {
        setToggleClassName('ticket-spin-back');
        setAnimationStage('end');
        setBookingNumber(booking.booking.bookingNumber ? booking.booking.bookingNumber : "");
      }, 3200);
    }
  }

  return (
    <div className='main-container'>
      <div className='ticket-container'>
        <div className={toggleClassName}>
          <img className="ticket-front" src={TicketFront} />
          <img className="ticket-back" src={TicketBack} />
        </div>
      </div>
      {displayInput === true && (
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
            <button className='send-btn' onClick={() => {setDisplayInput(false); setAnimationStage('middle'); setToggleClassName("ticket-spin");}}>Skicka bekräftelsen</button>
          )}
        </div>
      )}
      <div>
        {animationStage === "middle" && (
          <div>
            <h3 className='confirm-header'>Kontrollera att uppgifterna stämmer</h3>
            {toggleClassName === 'ticket-spin' && (
              <div className='confirmation-container'>
                <p className='price'>Pris:</p>
                <p className='movie'>Film:</p>
                <p className='tickets'>Biljetter:</p>
                <p className='date'>Datum:</p>
                <button className="confirm-btn" onClick={handleSendConfirmation}>Bekräfta</button>
              </div>
            )}
          </div>
        )}
      </div>
      {animationStage === "end" && (
        <div>
        <div className='header-and-para'>
          <h3 className='thank-you-msg'>Tack för din bokning!</h3>
          <p className='booking-num--para'>Ditt bokningsnummer: </p>
        </div>
        <div className='booking-done-container'>
          <p className='booking-num'>{bookingNumber}</p>
          <button className='nav-btn' onClick={() => navigate('/')}>Hem</button>
        </div>
        </div>
      )}
    </div>
  );
}
