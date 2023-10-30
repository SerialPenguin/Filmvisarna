/** @format */
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingConfirmation from "../Components/BookingConfirmationComponent/BookingConfirmation";
import SeatsGrid from "../components/seatsGrid";
import "./Booking.css";

function Booking() {
  const { screeningId } = useParams();
  const history = useNavigate();
  const loadState = (key, defaultValue) => {
    const bookingData = localStorage.getItem("bookingData");
    if (bookingData) {
      const parsedData = JSON.parse(bookingData);
      return key in parsedData ? parsedData[key] : defaultValue;
    }
    return defaultValue;
  };
  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [screening, setScreening] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(() =>
    loadState("selectedMovie", "")
  );
  const [salonLayout, setSalonLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [view, setView] = useState("seatPicker");
  const [initialSeatsDataReceived, setInitialSeatsDataReceived] =
    useState(false);
  const [seats, setSeats] = useState(() => loadState("seats", []));
  const [selectedWeek, setSelectedWeek] = useState(() =>
    loadState("selectedWeek", "")
  );
  const [tickets, setTickets] = useState(() =>
    loadState("tickets", {
      adults: { ticketType: "adult", quantity: 0, price: 140 },
      seniors: { ticketType: "senior", quantity: 0, price: 120 },
      children: { ticketType: "child", quantity: 0, price: 100 },
    })
  );
  const [chosenScreening, setChosenScreening] = useState();
  const inputRef = useRef(null);
  const [onBlur, setOnBlur] = useState(false);

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

  useEffect(() => {
    // Function to get the week number of a date
    const getWeekNumber = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return weekNumber;
    };

    const groupScreeningsByWeek = (screenings) => {
      const grouped = {};
      for (const screening of screenings) {
        const week = getWeekNumber(new Date(screening.startTime));
        if (!grouped[week]) {
          grouped[week] = [];
        }
        grouped[week].push(screening);
      }
      return Object.keys(grouped).map((week) => ({
        week,
        screenings: grouped[week],
      }));
    };

    if (selectedMovie) {
      fetch(`/api/screenings`)
        .then((response) => response.json())
        .then((data) => {
          const filteredScreenings = data.filter(
            (screening) => screening.movieId === selectedMovie
          );

          const groupedScreenings = groupScreeningsByWeek(filteredScreenings);

          setScreenings(groupedScreenings);

          if (groupedScreenings.length > 0) {
            // Use history to navigate to the first screening of the first week
            const firstWeekScreenings = groupedScreenings[0].screenings;
            if (firstWeekScreenings.length > 0) {
              history(`/booking/${firstWeekScreenings[0]._id}`);
            }
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
    if (seats.includes(seatNumber)) {
      setSeats((prevSeats) => prevSeats.filter((seat) => seat !== seatNumber));
      return;
    }

    // Determine if we should remove an existing seat from selection
    let seatToRemove = null;
    const totalTicketCount = getTotalTicketCount();
    if (totalTicketCount <= 0) {
      console.log("Please select a ticket before choosing a seat.");
      return;
    } // Use this to check against number of selected seats
    if (seats.length >= totalTicketCount) {
      seatToRemove = seats[0];
      setSeats((prevSeats) => prevSeats.slice(1)); // Remove the first seat
    }

    setSeats((prevSeats) => [...prevSeats, seatNumber]);
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

  const formatSeats = (seatsArray) => {
    return seatsArray.map((seat) => ({ seatNumber: seat }));
  };

  const extractSeatNumbers = (seatsArray) => {
    return seatsArray.map((seatObj) => seatObj.seatNumber);
  };

  const saveToLocalStorage = useCallback((data) => {
    const formattedSeats = formatSeats(data.seats);
    localStorage.setItem(
      "bookingData",
      JSON.stringify({ ...data, seats: formattedSeats })
    );
  }, []);

  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    saveToLocalStorage({
      seats,
      salonId: screening?.salonId,
      tickets,
      selectedMovie,
      selectedWeek,
      screeningId: screeningId, // Storing the screeningId
    });
  }, [
    seats,
    screening?.salonId,
    tickets,
    selectedMovie,
    selectedWeek,
    screeningId, // Add this dependency
    saveToLocalStorage,
  ]);

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem("bookingData");
    if (data) {
      return JSON.parse(data);
    }
    return null;
  };

  useEffect(() => {
    const storedData = loadFromLocalStorage();
    if (storedData) {
      setSeats(extractSeatNumbers(storedData.seats));
      setTickets(storedData.tickets);
      setSelectedMovie(storedData.selectedMovie);
      setSelectedWeek(storedData.selectedWeek);
    }
  }, []);

  // Check if the screeningId in the route matches the stored one
  useEffect(() => {
    const storedScreeningId = JSON.parse(localStorage.getItem("screeningId"));
    if (storedScreeningId && storedScreeningId !== screeningId) {
      history(`/booking/${storedScreeningId}`);
    }
  }, [screeningId, history]);

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
          seats: [], // Empty array to show removal
        }),
      });

      if (!res.ok) {
        throw new Error("Error clearing selected seats");
      }

      setSeats([]);

      setTickets((prev) => ({
        adults: { ...prev.adults, quantity: 0 },
        seniors: { ...prev.seniors, quantity: 0 },
        children: { ...prev.children, quantity: 0 },
      }));
    } catch (error) {
      console.error("Error clearing selected seats:", error);
    }
  };

  const filterScreenings = screenings
    .filter((weekData) => weekData.week === selectedWeek) // Filter screenings based on selected week
    .map((weekData) =>
      weekData.screenings.map((s) => {
        const dateOptions = {
          weekday: "long",
          year: "numeric",
          month: "short",
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
      })
    );

  if (selectedMovie && selectedWeek && !onBlur) {
    // inputRef.current.focus();
  }

  const ticketTranslations = {
    adults: "Vuxenbiljetter",
    seniors: "Pensionärsbiljetter",
    childrens: "Barnbiljetter",
  };

  if (loading) {
    return <div>Laddar...</div>;
  }

  return (
    <div>
      {view === "seatPicker" && (
        <div className="App">
          {loading || !initialSeatsDataReceived ? (
            <p>Laddar...</p>
          ) : (
            <>
              <select
                style={{ width: "129px", height: "30px" }}
                value={selectedMovie}
                onChange={(e) => {
                  const newMovieId = e.target.value;
                  if (newMovieId === "") return; // Prevent further action if it's the placeholder value
                  setSelectedMovie(newMovieId);
                  setSelectedWeek("");
                  setOnBlur(false);
                }}>
                <option value="" key="select-movie">
                  Välj film
                </option>
                {movies.map((m) => (
                  <option key={`movie-${m._id}`} value={m._id}>
                    {m.title}
                  </option>
                ))}
              </select>

              <select
                style={{ width: "129px", height: "30px" }}
                value={selectedWeek}
                onChange={(e) => {
                  const newSelectedWeek = e.target.value;
                  setSelectedWeek(newSelectedWeek);
                  setOnBlur(false);
                }}>
                <option value="">Välj vecka</option>
                {screenings.map((weekData) => (
                  <option key={weekData.week} value={weekData.week}>
                    Vecka {weekData.week}
                  </option>
                ))}
              </select>

              <select
                style={{ width: "129px", height: "30px" }}
                value={screeningId}
                ref={inputRef}
                onBlur={(e) => {
                  setOnBlur(true);
                  setChosenScreening(e.target.value);
                }}
                onChange={(e) => {
                  const newScreeningId = e.target.value;
                  if (newScreeningId === "") return; // Prevent navigation if it's the placeholder value
                  history(`/booking/${newScreeningId}`);
                }}>
                <option value="">Välj visning</option>
                {filterScreenings}
              </select>
              <div className="ticket-counter">
                <h3>Antal Biljetter: {getTotalTicketCount()}</h3>
                <h3>Valda Säten: {seats.length}</h3>
                {seats.length > 0 && (
                  <button onClick={handleClearSelectedSeats}>
                    Rensa Valda Säten
                  </button>
                )}
              </div>
              <div className="total-amount">
                <h3>Summa: {getTotalAmount()} Kr</h3>
              </div>
              {movie && movie.age <= 14 && (
                <div className="ticket-counter-container" key="ticket-children">
                  <h4>Barnbiljetter</h4>
                  <div
                    className="ticket-counter-arrow"
                    onClick={() => handleTicketChange("children", -1)}>
                    -
                  </div>
                  <div className="ticket-counter-value">
                    {tickets.children.quantity}
                  </div>
                  <div
                    className="ticket-counter-arrow"
                    onClick={() => handleTicketChange("children", 1)}>
                    +
                  </div>
                </div>
              )}

              {Object.keys(tickets).map((ticketType) => {
                // Exclude children tickets if the movie age is above 14
                if (ticketType === "children" && movie.age > 14) {
                  return null;
                }

                // Exclude children tickets if they have already been rendered
                if (ticketType === "children" && movie.age <= 14) {
                  return null;
                }

                return (
                  <div
                    className="ticket-counter-container"
                    key={`ticket-${ticketType}`}>
                    <h4>{ticketTranslations[ticketType]}</h4>
                    <div
                      className="ticket-counter-arrow"
                      onClick={() => handleTicketChange(ticketType, -1)}>
                      -
                    </div>
                    <div className="ticket-counter-value">
                      {tickets[ticketType].quantity}
                    </div>
                    <div
                      className="ticket-counter-arrow"
                      onClick={() => handleTicketChange(ticketType, 1)}>
                      +
                    </div>
                  </div>
                );
              })}

              <h2>Bokning för: {movie?.title}</h2>
              <h2>Direktör: {movie?.director}</h2>
              <h3>Beskrivning: {movie?.description}</h3>
              <h3>Visningsdatum: {screening?.startTime}</h3>
              <h3>Visningstid: {screening?.endTime}</h3>
              <img
                className="images"
                src={movie?.images?.[0]}
                alt={movie?.title}
              />
              <div className="theatre">
                <div className="movie-screen"></div>
                <div className="seats">
                  <SeatsGrid
                    salonLayout={salonLayout}
                    isSeatBooked={isSeatBooked}
                    handleSeatClick={handleSeatClick}
                  />
                </div>
              </div>
            </>
          )}
          <button onClick={() => setView("confirmation")}>Boka</button>
        </div>
      )}
      ;
      {view === "confirmation" && (
        <BookingConfirmation
          movies={movies}
          movieId={selectedMovie}
          screening={chosenScreening}
          filter={filterScreenings}
        />
      )}
    </div>
  );
}

export default Booking;
