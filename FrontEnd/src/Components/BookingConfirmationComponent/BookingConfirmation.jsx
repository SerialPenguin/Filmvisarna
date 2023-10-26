import './bookingConfirmation.css'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TicketFront from '../../img/ticketFront.png';
import TicketBack from '../../img/ticketBack.png';


export default function BookingConfirmation() {

  const navigate = useNavigate();

  const body = {
    tickets: [{ticketType: "child", quantity: 2}, {ticketType: "adult", quantity: 2}],
    seats: [{"seatNumber": 1}, {"seatNumber": 2},{"seatNumber": 3},{"seatNumber": 4}],
  }

  const [ confirmationEmail, setConfirmationEmail ] = useState("");
  const [ bookingBody, setBookingBody ] = useState({});
  const [ toggleClassName, setToggleClassName] = useState("ticket");
  const [ animationDone, setAnimationDone ] = useState(false);
  const [ bookingNumber, setBookingNumber ] = useState('QWE123');

  //This function is going to take the body with tickets and seats with props
  function handleBookingBody(e) {
    setConfirmationEmail(e.target.value);
    setBookingBody({...body, confirmationEmail});
    console.log("BB: ", bookingBody);
  }

  console.log("out func: ", toggleClassName)
  
  function handleSendConfirmation() {
    // usePatch(('/api/bookings', bookingBody), setBookingNumber )
    setToggleClassName("ticket-animation");
    console.log("in func: ", toggleClassName);
    setTimeout(() => {
      setAnimationDone(true);
    }, 3200);
    
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
            name="email"
            onChange={handleBookingBody}
            value={confirmationEmail || ''}
            id="email">
          </input>
          {confirmationEmail.includes('@') && (
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
