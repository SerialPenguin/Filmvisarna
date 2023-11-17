import { useEffect, useState } from "react";
import { authGet } from "../../../hooksAndUtils/fetchUtil";
import { useDebounce } from "../../../hooksAndUtils/debounce";
import './HandleBookings.css';


export default function HandleBookings(props) {
  const [search, setSearch] = useState();
  const [booking, setBooking] = useState();
  const [seats, setSeats] = useState([]);
  const [salon, setSalon] = useState();
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState();

  const debounceSearch = useDebounce(search);

  useEffect(() => {

    const getBooking = async () => {
      const result = await authGet("/api/search/auth/admin/getBooking/" 
        + debounceSearch,
        props.token
      )
      if(result.status === 200) setBooking(result.booking);
      else setBooking();
    }
    console.log("DB: ", debounceSearch)
    getBooking();
  }, [debounceSearch])

  useEffect(() => {

    setSeats(booking?.seats.map(seat => {
      return seat.seatNumber;
    }));

    setTickets(booking?.tickets.filter(ticket => {
      if(ticket.quantity !== 0) return ticket;
    }));

    console.log(tickets)

    async function getUserInfo() {
      setUser(await authGet('/api/search/auth/admin/getUser/' + booking?.bookedBy.user, props.token))
      setSalon(await authGet('/api/search/seats/' + booking?.salonId));
    }

    if(booking && booking?.bookedBy.user !== "GUEST") getUserInfo();

  }, [booking])

  return (
    <div>
      {!booking ? (
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
            ): (
              <div className="booked_by-container">
                <h6 className="booked_by-header">Bokad av:</h6>
                <p className="user-guest">Användare: {booking.bookedBy.user === "GUEST" ? "Gäst" : "Guest"}</p>
              </div>
            )}
            <div className="specs-container">
              <h6 className="booking-info-header">Specifikation:</h6>
              <p className="user-confirmation-email">Bekräftelsen till: {booking?.bookedBy.email}</p>
              <p className="user-seats">Stolar: {seats?.length <= 2 ? seats?.join(" & ") : seats?.reduce((text, value, i, array) => text + (i < array.length - 1 ? ', ' : ' & ') + value)}</p>
              <p className="user-tickets">Biljetter: {tickets?.map((value) => {return `${value.ticketType === "adult" ? "Vuxen" : value.ticketType === "senior" ? "Pensionär" : "Barn"}: ${value.quantity}st. `})}</p>
              <p className="user-salon">{salon?.name === "Large salon" ? "Stora salongen" : "Lilla salongen"}</p>
            </div>
          </div>
        )}
    </div>
  )
}
