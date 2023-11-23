import { useEffect, useState } from "react";
import { authGet } from "../../../hooksAndUtils/fetchUtil";
import { useDebounce } from "../../../hooksAndUtils/debounce";
import './HandleBookings.css';


export default function HandleBookings(props) {
  const [search, setSearch] = useState();
  const [booking, setBooking] = useState();
  const [message, setMessage] = useState("");
  const [seats, setSeats] = useState([]);
  const [salon, setSalon] = useState();
  const [tickets, setTickets] = useState([]);
  const [price, setPrice] = useState();
  const [user, setUser] = useState();
  const [formState, setFormState] = useState("searching");
  
  const sum = [];

  const debounceSearch = useDebounce(search);

  useEffect(() => {
    const getBooking = async () => {
      const result = await authGet("/api/auth/admin/getBooking/" 
        + debounceSearch,
        props.token
      )
      if(result.status === 200) {
        setBooking(result.booking);
        setFormState("found")
      }else{
        setMessage(result.msg);
        setTimeout(() => {
          setMessage("");
          setBooking();
        }, 3000); 
      }
    }

    if(search) getBooking();
  }, [debounceSearch])

  useEffect(() => {

    setSeats(booking?.seats.map(seat => {
      return seat.seatNumber;
    }));

    setTickets(booking?.tickets.filter(ticket => {
      if(ticket.quantity !== 0) return ticket;
    }));

    async function getUserInfo() {
      setUser(await authGet('/api/auth/admin/getUserById/' + booking?.bookedBy.user, props.token))
      setSalon(await authGet('/api/search/seats/' + booking?.salonId));
    }

    if(booking && booking?.bookedBy.user !== "GUEST") getUserInfo();

  }, [booking])

  useEffect(() => {
    tickets?.forEach(ticket => {
      if(ticket.ticketType === "adult") {
        sum.push(140);
      }
      if(ticket.ticketType === "senior") {
        sum.push(120);
      }
      if(ticket.ticketType === "child") {
        sum.push(80);
      }
      return setPrice(sum.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
    })
  }, [tickets])

  return (
    <div>
      {!message && (
        <div>
          {formState === "searching" ? (
            <div className="find-booking-container">
              <h4 className="find-booking-header">Hitta bokning</h4>
              <form className="search-form">
                <label className="find-booking-lbl">Sök på bokningsnummer</label>
                <input autoFocus className="booking-num-input" value={search?.toUpperCase() || ""} name="bookingNum" onChange={(e) => setSearch(e.target.value)}></input>
              </form>
            </div>
            ) : (
              <div>
                <h4 className="booking-num-header">{booking.bookingNumber}</h4>
                {user?.status === 200 ? (
                  <div className="booked_by-container">
                    <h6 className="booked_by-header">Bokad av:</h6>
                    <p className="users-name">Användare: {`${user.user?.firstName} ${user.user?.lastName}`}</p>
                    <p className="users-mail">Användarens e-post: {user?.user.emailAdress}</p>
                  </div>
                ) : (
                  <div className="booked_by-container">
                    <h6 className="booked_by-header">Bokad av:</h6>
                    <p className="user-guest">Användare: {booking.bookedBy.user === "GUEST" ? "Gäst" : "Guest"}</p>
                  </div>
                )}
                <div className="specs-container">
                  <h6 className="booking-info-header">Specifikation:</h6>
                  <p className="user-confirmation-email">Bekräftelsen till: {booking?.bookedBy.email}</p>
                  <p className="user-salon">{salon?.name === "Large salon" ? "Stora salongen" : "Lilla salongen"}</p>
                  <p className="user-seats">Stolar: {seats?.length <= 2 ? seats?.join(" & ") : seats?.reduce((text, value, i, array) => text + (i < array.length - 1 ? ', ' : ' & ') + value)}</p>
                  <p className="user-tickets">Biljetter: {tickets?.map((value) => {return `${value.ticketType === "adult" ? "Vuxen" : value.ticketType === "senior" ? "Pensionär" : "Barn"}: ${value.quantity}st. `})}</p>
                  <p className="user-price">Pris: {price} kr</p>
                </div>
                <button className="booking-search-btn" onClick={() => {setSearch(""); setFormState("searching")}}>Sök på nytt</button>
              </div>
            )}
          </div>
        )}
        {message && (
          <p className="error-msg">{message}</p>
        )}
    </div>
  )
}
