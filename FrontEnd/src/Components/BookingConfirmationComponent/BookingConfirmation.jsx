import './bookingConfirmation.css'
import { useState } from "react";
import TicketFront from '../../img/ticketFront.png';
import TicketBack from '../../img/ticketBack.png';


export default function BookingConfirmation() {

  const body = {
    tickets: [{ticketType: "child", quantity: 2}, {ticketType: "adult", quantity: 2}],
    seats: [{"seatNumber": 1}, {"seatNumber": 2},{"seatNumber": 3},{"seatNumber": 4}],
  }

  const [ confirmationEmail, setConfirmationEmail ] = useState();
  const [ bookingBody, setBookingBody ] = useState({});


  //This function is going to take the body with tickets and seats with props
  function handleBookingBody(e) {
    setConfirmationEmail(e.target.value);
    setBookingBody({...body, confirmationEmail});
    console.log("BB: ", bookingBody);
  }

  return (
    <div className='main-container'>
      <div className='ticket-container'>
        <div className='ticket'>
          <img className="ticket-front" src={TicketFront} />
          <img className="ticket-back" src={TicketBack} />
        </div>
      </div>
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
          id="email"></input>
        <button>Skicka bekräftelsen</button>
      </div>
    </div>
  );
}
