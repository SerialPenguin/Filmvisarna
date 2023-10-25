/** @format */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Booking() {
  const { screeningId } = useParams();
  const history = useNavigate();

  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState([]); // For the dropdown
  const [screening, setScreening] = useState(null);
  const [screenings, setScreenings] = useState([]); // For the dropdown
  const [selectedMovie, setSelectedMovie] = useState("");
  const [salonLayout, setSalonLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [initialSeatsDataReceived, setInitialSeatsDataReceived] =
    useState(false);
  const [previousSeat, setPreviousSeat] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);

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
        console.log(data); // Check the movies data you get
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
          // Filter the screenings by the selected movieId
          const filteredScreenings = data.filter(
            (screening) => screening.movieId === selectedMovie
          );
          setScreenings(filteredScreenings);

          // Redirect to the first screening for the selected movie
          if (filteredScreenings.length > 0) {
            history(`/booking/${filteredScreenings[0]._id}`);
          } else {
            setScreenings([]); // No screenings found for selected movie
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

    try {
      // Determine if we should remove an existing seat from selection
      let seatToRemove = null;
      if (selectedSeats.length >= ticketCount) {
        seatToRemove = selectedSeats.shift(); // remove the first seat
        setSelectedSeats([...selectedSeats]);
        setBookedSeats((bookedSeats) =>
          bookedSeats.filter((seat) => seat !== seatToRemove)
        );
      }

      const res = await fetch(`/api/reserveSeats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningId,
          seats: [{ seatNumber }],
          previousSeat: seatToRemove, // this seat will be removed from the backend's temporary bookings
        }),
      });

      if (!res.ok) throw new Error("Error reserving seat");
      const data = await res.json();

      if (data) {
        setBookedSeats((prevSeats) => [...prevSeats, seatNumber]);
        setSelectedSeats((prevSeats) => [...prevSeats, seatNumber]);
        console.log(`Seat ${seatNumber} is now temporarily reserved.`);
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
            {screenings.map((s) => (
              <option key={s._id} value={s._id}>
                {new Date(s.startTime).toLocaleDateString()} at{" "}
                {new Date(s.startTime).toLocaleTimeString()}
              </option>
            ))}
          </select>
          <div className="ticket-counter">
            <h3>Tickets: {ticketCount}</h3>
            <h3>Selected Seats: {selectedSeats.length}</h3>
            {selectedSeats.length > 0 && (
              <button
                onClick={() => {
                  setSelectedSeats([]);
                  setPreviousSeat(null); // Reset the previous seat
                  // Logic to un-reserve these seats might be necessary.
                }}>
                Clear Selected Seats
              </button>
            )}
          </div>
          <label>
            Number of Tickets:
            <input
              type="number"
              value={ticketCount}
              onChange={(e) =>
                setTicketCount(Math.max(1, parseInt(e.target.value)))
              }
            />
          </label>

          <h1>Booking for: {movie?.title}</h1>
          <h2>Director: {movie?.director}</h2>
          <h3>Description: {movie?.description}</h3>
          <h3>Screening Date: {screening?.startTime}</h3>
          <h3>Screening Time: {screening?.endTime}</h3>
          <img src={movie?.images?.[0]} alt={movie?.title} />
          <div className="seats-grid">
            {salonLayout?.rows?.map((row) => (
              <div key={row.rowNumber} className="row">
                {row.seats?.map((seatNumber) => (
                  <button
                    key={seatNumber}
                    className={
                      isSeatBooked(seatNumber) ? "booked" : "available"
                    }
                    onClick={() => handleSeatClick(row.rowNumber, seatNumber)}>
                    {seatNumber}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Booking;
