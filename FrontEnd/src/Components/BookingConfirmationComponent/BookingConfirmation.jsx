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

  const secondHeader = animationStage === "start" ? "Fyll i din mailadress" : animationStage === "middle" ? "Kontrollera att uppgifterna stämmer" : "Tack för din boking!";

  function handleBookingBody(e) {
    setEmail(e.target.value);
    setBookingBody({...props.body, email});
  }
  
  async function handleSendConfirmation() {

    const booking = await patch('/api/bookings', bookingBody)

    console.log("new booking: ", booking.booking.bookingNumber);

    if(booking.message.includes("Booking created!")) {
        setToggleClassName('ticket-spin-back');
        setAnimationStage('end');
        setBookingNumber(booking.booking.bookingNumber ? booking.booking.bookingNumber : "");
    }
  }

  return (
    <div className='main-container'>
      <h2 className='book-page_header'>Boka biljetter</h2>
      <h3 className='second-header'>{secondHeader}</h3>
      <div className='ticket-container'>
        <div className={toggleClassName}>
        {displayInput === true && (
        <div className='email-container'>
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
          <img className="ticket-front" src={TicketFront} />
          <img className="ticket-back" src={TicketBack} />
        </div>
      </div>
      <div>
        {animationStage === "middle" && (
          <div>
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
          <p className='booking-num--para'>Ditt bokningsnummer: </p>
        <div className='booking-done-container'>
          <p className='booking-num'>{bookingNumber}</p>
          <button className='nav-btn' onClick={() => navigate('/')}>Hem</button>
        </div>
        </div>
      )}
    </div>
  );
}
