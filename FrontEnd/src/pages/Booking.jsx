/** @format */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeatsGrid from "../components/seatsGrid";

function Booking() {
  const { screeningId } = useParams();
  const history = useNavigate();

  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [screening, setScreening] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [salonLayout, setSalonLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [initialSeatsDataReceived, setInitialSeatsDataReceived] =
    useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [tickets, setTickets] = useState({
    adults: { ticketType: "adult", quantity: 0, price: 140 },
    seniors: { ticketType: "senior", quantity: 0, price: 100 },
    children: { ticketType: "child", quantity: 0, price: 120 },
  });

  // EventSource for live booking updates
  useEffect(() => {
    const eventSource = new EventSource(`/api/events/${screeningId}`);
    eventSource.onmessage = (event) => {
      const updatedBookedSeats = JSON.parse(event.data);
      setBookedSeats(updatedBookedSeats);
      setInitialSeatsDataReceived(true);
    };
    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };
    return () => eventSource.close();
  }, [screeningId]);

  // Fetch movies for dropdown
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Fetch screenings when a movie is selected
  useEffect(() => {
    if (selectedMovie) {
      fetch(`/api/screenings`)
        .then((response) => response.json())
        .then((data) => {
          const filteredScreenings = data.filter(
            (screening) => screening.movieId === selectedMovie
          );
          setScreenings(filteredScreenings);
          if (filteredScreenings.length > 0) {
            history(`/booking/${filteredScreenings[0]._id}`);
          } else {
            setScreenings([]);
          }
        })
        .catch((err) => console.error("Error fetching screenings:", err));
    }
  }, [selectedMovie, history]);

  const isSeatBooked = (seatNumber) => {
    return bookedSeats.includes(seatNumber);
  };

  const handleSeatClick = async (rowNumber, seatNumber) => {
    if (isSeatBooked(seatNumber)) {
      console.log(`Seat ${seatNumber} in row ${rowNumber} is already booked.`);
      return;
    }

    // Check if the seat is already in selectedSeats
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats((prevSeats) =>
        prevSeats.filter((seat) => seat !== seatNumber)
      );
      return; // Exit after removing the seat
    }

    // Determine if we should remove an existing seat from selection
    let seatToRemove = null;
    const totalTicketCount = getTotalTicketCount(); // Use this to check against number of selected seats
    if (selectedSeats.length >= totalTicketCount) {
      seatToRemove = selectedSeats[0]; // The first seat in the selectedSeats array
      setSelectedSeats((prevSeats) => prevSeats.slice(1)); // Remove the first seat
    }

    setSelectedSeats((prevSeats) => [...prevSeats, seatNumber]);
    console.log(`Seat ${seatNumber} is now temporarily reserved.`);

    try {
      const res = await fetch(`/api/reserveSeats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningId,
          seats: [{ seatNumber }],
          previousSeat: seatToRemove, // This seat will be removed from the backend's temporary bookings
        }),
      });

      if (!res.ok) throw new Error("Error reserving seat");
      const data = await res.json();

      if (data && data.success) {
        // If backend logic requires, update frontend state based on the backend response
        console.log(`Seat ${seatNumber} is now confirmed as reserved.`);
      }
    } catch (error) {
      console.error("Error reserving seat:", error);
    }
  };

  useEffect(() => {
    const fetchScreening = async () => {
      try {
        const response = await fetch(`/api/search/screenings/${screeningId}`);
        if (!response.ok) throw new Error("Failed to fetch screening");
        const data = await response.json();
        setScreening(data);
        fetchMovie(data.movieId);
        if (data.salonId) fetchSeats(data.salonId);
      } catch (error) {
        console.error("Error fetching screening data:", error);
      }
    };

    const fetchMovie = async (movieId) => {
      try {
        const response = await fetch(`/api/search/movies/${movieId}`);
        if (!response.ok) throw new Error("Failed to fetch movie");
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    const fetchSeats = async (salonId) => {
      try {
        const response = await fetch(`/api/search/seats/${salonId}`);
        if (!response.ok) throw new Error("Failed to fetch seats");
        const data = await response.json();
        setSalonLayout(data);
      } catch (error) {
        console.error("Error fetching seats data:", error);
      }
    };

    fetchScreening();
  }, [screeningId]);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getTotalTicketCount = () => {
    return Object.values(tickets).reduce(
      (acc, ticket) => acc + ticket.quantity,
      0
    );
  };

  const getTotalAmount = () => {
    return Object.values(tickets).reduce(
      (acc, ticket) => acc + ticket.quantity * ticket.price,
      0
    );
  };

  const handleTicketChange = (type, delta) => {
    setTickets((prev) => {
      const updatedQuantity = Math.max(0, prev[type].quantity + delta);
      return {
        ...prev,
        [type]: {
          ...prev[type],
          quantity: updatedQuantity,
        },
      };
    });
  };

  const handleClearSelectedSeats = async () => {
    try {
      // Clear all selected seats in the backend by sending an empty array
      const res = await fetch(`/api/reserveSeats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningId,
          seats: [], // An empty array to indicate removal of all selected seats
        }),
      });

      if (!res.ok) {
        throw new Error("Error clearing selected seats");
      }

      // Reset the selectedSeats state to an empty array
      setSelectedSeats([]);

      // Update the state of tickets to reset all quantities to 0
      setTickets((prev) => ({
        adults: { ...prev.adults, quantity: 0 },
        seniors: { ...prev.seniors, quantity: 0 },
        children: { ...prev.children, quantity: 0 },
      }));
    } catch (error) {
      console.error("Error clearing selected seats:", error);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {loading || !initialSeatsDataReceived ? (
        <p>Loading...</p>
      ) : (
        <>
          <select
            style={{ width: "300px", height: "30px" }}
            value={selectedMovie}
            onChange={(e) => {
              const newMovieId = e.target.value;
              if (newMovieId === "") return; // Prevent further action if it's the placeholder value
              setSelectedMovie(newMovieId);
            }}>
            <option value="">Select a Movie</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>

          <select
            style={{ width: "300px", height: "30px" }}
            value={screeningId}
            onChange={(e) => {
              const newScreeningId = e.target.value;
              if (newScreeningId === "") return; // Prevent navigation if it's the placeholder value
              history(`/booking/${newScreeningId}`);
            }}>
            <option value="">Select a Screening</option>
            {screenings.map((s) => {
              const dateOptions = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              };
              const formattedDate = new Date(s.startTime).toLocaleDateString(
                "sv-SE",
                dateOptions
              );
              const capitalizedDate = capitalizeFirstLetter(formattedDate);

              return (
                <option key={s._id} value={s._id}>
                  {capitalizedDate} kl{" "}
                  {new Date(s.startTime).toLocaleTimeString("sv-SE")}
                </option>
              );
            })}
          </select>
          <div className="ticket-counter">
            <h3>Total Tickets: {getTotalTicketCount()}</h3>
            <h3>Selected Seats: {selectedSeats.length}</h3>
            {selectedSeats.length > 0 && (
              <button onClick={handleClearSelectedSeats}>
                Clear Selected Seats
              </button>
            )}
          </div>
          <div className="total-amount">
            <h3>Total Amount: {getTotalAmount()} SEK</h3>
          </div>

          {Object.keys(tickets).map((ticketType) => (
            <div className="ticket-counter-container" key={ticketType}>
              <h4>
                {ticketType.charAt(0).toUpperCase() + ticketType.slice(1)}{" "}
                Tickets
              </h4>
              <div
                className="ticket-counter-arrow"
                onClick={() => handleTicketChange(ticketType, -1)}>
                ←
              </div>
              <div className="ticket-counter-value">
                {tickets[ticketType].quantity}
              </div>
              <div
                className="ticket-counter-arrow"
                onClick={() => handleTicketChange(ticketType, 1)}>
                →
              </div>
            </div>
          ))}

          <h1>Booking for: {movie?.title}</h1>
          <h2>Director: {movie?.director}</h2>
          <h3>Description: {movie?.description}</h3>
          <h3>Screening Date: {screening?.startTime}</h3>
          <h3>Screening Time: {screening?.endTime}</h3>
          <img src={movie?.images?.[0]} alt={movie?.title} />
          <SeatsGrid
            salonLayout={salonLayout}
            isSeatBooked={isSeatBooked}
            handleSeatClick={handleSeatClick}
          />
        </>
      )}
    </div>
  );
}

export default Booking;
