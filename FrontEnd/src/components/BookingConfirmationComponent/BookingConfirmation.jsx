/** @format */

import "./bookingConfirmation.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketFront from "../../assets/img/ticketFront.png";
import TicketBack from "../../assets/img/ticketBack.png";
import { patch } from "../../hooksAndUtils/fetchUtil";
import { useAuthGet } from "../../hooksAndUtils/useFetch";

export default function BookingConfirmation(props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [bookingBody, setBookingBody] = useState();
  const [toggleClassName, setToggleClassName] = useState("ticket");
  const [animationStage, setAnimationStage] = useState("start");
  const [bookingNumber, setBookingNumber] = useState("");
  const [displayInput, setDisplayInput] = useState();
  const [displayConfirmBtn, setDisplayConfirmBtn] = useState();
  const [movie, setMovie] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState();
  const [profile, setProfile] = useState();

  const secondHeader =
    animationStage === "start"
      ? "Fyll i din mailadress"
      : animationStage === "middle"
      ? "Kontrollera att uppgifterna stämmer"
      : "Tack för din boking!";


    const token = sessionStorage.getItem("JWT_TOKEN");

  useEffect(() => {
    async function getBody() {
      const body = await JSON.parse(sessionStorage.getItem("bookingData"));
      
      delete body.selectedMovie;
      delete body.selectedWeek;

      setBookingBody(body);
    }
    getBody();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useAuthGet("/api/auth/profile", token, (data) => {
    setProfile(data);
  });

  useEffect(() => {
    if (profile) {
      console.log(profile)
      if (profile.msg !== "jwt malformed") {
        setDisplayInput(false);
        setEmail(profile.emailAdress);
        setDisplayConfirmBtn(true);
      }
    } else {
      setDisplayInput(true);
    }
  }, [profile])

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingBody]);

  function handleBookingBody(e) {
    setEmail(e.target.value);
    if (email?.includes("@")) {
      setDisplayConfirmBtn(true);
    }
  }
  async function handleSendConfirmation() {

    try {
      let bodyCopy = JSON.parse(JSON.stringify(bookingBody));

      bodyCopy.tickets = Object.values(bodyCopy.tickets);
      bodyCopy.tickets = Object.values(bodyCopy.tickets);

      bodyCopy.email = email;

      const booking = await patch("/api/bookings", bodyCopy, token);

      if (booking.message.includes("Booking created!")) {
        setToggleClassName("ticket-spin-back");
        setAnimationStage("end");
        setBookingNumber(
          booking.booking.bookingNumber ? booking.booking.bookingNumber : ""
        );
        sessionStorage.removeItem("bookingData");
      }
    } catch (err) {
      return alert(err);
    }
  }

  function handleCanceling() {
    setBookingBody({});
    props.setView("seatPicker");
  }

  function handleBacking() {
    setToggleClassName("ticket-spin-back");
    
    setTimeout(() => {
      setAnimationStage("start");
      if (token) {
        setDisplayInput(false);
        setDisplayConfirmBtn(true);
      } else {
        setDisplayInput(true);
        setDisplayConfirmBtn(true);
      }
    }, 700);
  }

  return (
    <div className="main-container">
      <h2 className="book-page_header">Boka biljetter</h2>
      {displayInput === false && token ? (
        <div className="change-email-container">
         <h3 className="second-header">Bekräftelsen skickas till</h3>
         <h3 className="second-header-email">{email}</h3>
         <button
           className="change-email-btn"
           onClick={() => {
             setDisplayInput(true);
             setEmail();
           }}>
           Ändra email
         </button>
       </div>
        ) : (
        <h3 className="second-header">{secondHeader}</h3>
      )}
      <div className="ticket-container">
        <div className={toggleClassName}>
          {displayInput === true && (
            <div className="email-container">
              <input
                required
                type="email"
                className="email-field"
                onChange={handleBookingBody}
                onBlur={handleBookingBody}
                value={email || ""}
                name="email"
                id="email"></input>
            </div>
          )}
          {displayConfirmBtn === true && email?.includes("@") && (
            <button
              className="send-btn"
              onClick={() => {
                setDisplayInput();
                setToggleClassName("ticket-spin");
                setTimeout(() => {
                  setDisplayConfirmBtn(false);
                  setAnimationStage("middle");
                }, 600);
              }}>
              Till bekräftelse
            </button>
          )}
          {animationStage === "start" && (
            <button className="cancel-btn" onClick={handleCanceling}>
              Backa
            </button>
          )}
          <img className="ticket-front" src={TicketFront} />
          <img className="ticket-back" src={TicketBack} />
        </div>
        <div>
          {animationStage === "middle" && (
            <div>
              {toggleClassName === "ticket-spin" && (
                <div className={"confirmation-container"}>
                  <p className="price">Pris: {price} kr</p>
                  <p className="movie">
                    {movie.length > 25
                      ? `Film: ${movie.slice(0, 25)}...`
                      : `Film: ${movie}`}
                  </p>
                  <p className="tickets">
                    {bookingBody.seats.length === 1
                      ? `Stol: ${bookingBody.seats.map(
                          (seat) => seat.seatNumber
                        )}`
                      : `Stolar: ${bookingBody.seats
                          .map((seat) => seat.seatNumber)
                          .sort()
                          .join(", ")}`}
                  </p>
                  <p className="date">Datum: {date.slice(0, -8)}</p>
                  <button
                    className="confirm-btn"
                    onClick={handleSendConfirmation}>
                    Bekräfta
                  </button>
                  <button className="back-middle-btn" onClick={handleBacking}>
                    Backa
                  </button>
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
