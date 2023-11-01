/** @format */

import "./bookingConfirmation.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketFront from "../../img/ticketFront.png";
import TicketBack from "../../img/ticketBack.png";
import { patch } from "../../hooksAndUtils/fetchUtil";

export default function BookingConfirmation(props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [bookingBody, setBookingBody] = useState();
  const [toggleClassName, setToggleClassName] = useState("ticket");
  const [animationStage, setAnimationStage] = useState("start");
  const [bookingNumber, setBookingNumber] = useState("");
  const [displayInput, setDisplayInput] = useState(true);
  const [movie, setMovie] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState();
  const [user, setUser] = useState();

  const secondHeader =
    animationStage === "start"
      ? "Fyll i din mailadress"
      : animationStage === "middle"
      ? "Kontrollera att uppgifterna stämmer"
      : "Tack för din boking!";

  useEffect(() => {
    async function getBody() {
      const body = await JSON.parse(sessionStorage.getItem("bookingData"));
      const user = sessionStorage.getItem("JWT_TOKEN");

      delete body.selectedMovie;
      delete body.selectedWeek;

      setBookingBody(body);
      setUser(user);
    }

    getBody();
  }, []);

  useEffect(() => {
    props.filter[0].map((screening) => {
      if (screening.key === props.screening.toString()) {
        setDate(screening.props.children.toString().split(",").join(" "));
      }
    });

    props.movies.map((movie) => {
      if (movie._id === props.movieId) {
        setMovie(movie.title);
      }
    });

    if (bookingBody) {
      let adults = bookingBody.tickets.adults;
      let children = bookingBody.tickets.children;
      let seniors = bookingBody.tickets.seniors;

      let adultsSum = adults.price * adults.quantity;
      let childrenSum = children.price * children.quantity;
      let seniorsSum = seniors.price * seniors.quantity;

      setPrice((adultsSum += childrenSum += seniorsSum));
    }
    
    console.log("BB 2: ", bookingBody);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingBody]);

  function handleBookingBody(e) {
    setEmail(e.target.value);
    setBookingBody({ ...bookingBody, email });
    console.log("BB 3: ", bookingBody);
  }

  async function handleSendConfirmation() {
    try {
      let bodyCopy = JSON.parse(JSON.stringify(bookingBody));

      bodyCopy.tickets = Object.values(bodyCopy.tickets);

      const booking = await patch("/api/bookings", bodyCopy, user);

      console.log("new booking: ", booking);
      console.log(bookingBody);

      if(booking.message.includes("Booking created!")) {
          setToggleClassName('ticket-spin-back');
          setAnimationStage('end');
          setBookingNumber(booking.booking.bookingNumber ? booking.booking.bookingNumber : "");
          sessionStorage.removeItem("bookingData");
      }
    } catch (err) {
      return alert(err);
    }
  }

  return (
    <div className="main-container">
      <h2 className="book-page_header">Boka biljetter</h2>
      <h3 className="second-header">{secondHeader}</h3>
      <div className="ticket-container">
        <div className={toggleClassName}>
          {displayInput === true && (
            <div className="email-container">
              <input
                required
                type="email"
                autoFocus
                className="email-field"
                placeholder="example.mail@example.com"
                onChange={handleBookingBody}
                onBlur={handleBookingBody}
                value={email || ""}
                name="email"
                id="email"></input>
              {email.includes("@") && (
                <button
                  className="send-btn"
                  onClick={() => {
                    handleBookingBody;
                    setDisplayInput(false);
                    setAnimationStage("middle");
                    setToggleClassName("ticket-spin");
                  }}>
                  Skicka bekräftelsen
                </button>
              )}
            </div>
          )}
          <img className="ticket-front" src={TicketFront} />
          <img className="ticket-back" src={TicketBack} />
        </div>
        <div>
        {animationStage === "middle" && (
          <div>
            {toggleClassName === 'ticket-spin' && (
              <div className='confirmation-container'>
                <p className='price'>Pris: {price} kr</p>
                <p className='movie'>{movie.length > 25 ? `Film: ${movie.slice(0, 25)}...` : `Film: ${movie}`}</p>
                <p className='tickets'>{bookingBody.seats.length === 1 ? `Stol: ${bookingBody.seats.map((seat) => seat.seatNumber)}` : `Stolar: ${bookingBody.seats.map((seat) => seat.seatNumber).sort().join(", ")}`}</p>
                <p className='date'>Datum: {date.slice(0, 30)}</p>
                <button className="confirm-btn" onClick={handleSendConfirmation}>Bekräfta</button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      {animationStage === "end" && (
        <div>
          <p className="booking-num--para">Ditt bokningsnummer: </p>
          <div className="booking-done-container">
            <p className="booking-num">{bookingNumber}</p>
            <button className="nav-btn" onClick={() => navigate("/")}>
              Hem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
