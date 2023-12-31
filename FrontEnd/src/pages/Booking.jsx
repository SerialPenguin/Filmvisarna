/** @format */
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingConfirmation from "../components/BookingConfirmationComponent/BookingConfirmation";
import SeatsGrid from "../components/SeatsGrid";
import { groupScreeningsByWeek } from "../hooksAndUtils/weekUtil";
import DropdownSelect from "../components/DropdownSelectComponent";
import TicketCounter from "../components/TicketCounterComponent";
import ClearSeatsButton from "../components/ClearSeatsButtonComponent";
import { getWeekNumber } from "../hooksAndUtils/weekUtil";
import SeatReleaseOnUnload from "../components/SeatReleaseOnUnload";
import useFetchMovies from "../hooksAndUtils/useFetchMovies";
import "./Booking.css";

function Booking() {
  const { screeningId } = useParams();
  const history = useNavigate();
  const loadState = (key, defaultValue) => {
    const bookingData = sessionStorage.getItem("bookingData");
    if (bookingData) {
      const parsedData = JSON.parse(bookingData);
      return key in parsedData ? parsedData[key] : defaultValue;
    }
    return defaultValue;
  };
  const [movie, setMovie] = useState(null);
  const movies = useFetchMovies();
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
      adults: { ticketType: "adult", quantity: 2, price: 140 },
      seniors: { ticketType: "senior", quantity: 0, price: 120 },
      children: { ticketType: "child", quantity: 0, price: 100 },
    })
  );
  const [chosenScreening, setChosenScreening] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [groupSeats, setGroupSeats] = useState(false);
  const [selectedSeatsId, setSelectedSeatsId] = useState([]);

  const selectedMovieRef = useRef(null);

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

  useEffect(() => {
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
            // Check if the current screeningId is in the available screenings
            const isScreeningAvailable = groupedScreenings.some((week) =>
              week.screenings.some((screening) => screening._id === screeningId)
            );

            if (!isScreeningAvailable) {
              // If the current screeningId isn't available, navigate to the first screening of the first week
              const targetScreeningId = groupedScreenings[0].screenings[0]._id;
              history(`/bokning/${targetScreeningId}`);
            }
          } else {
            setScreenings([]);
          }
        })
        .catch((err) => console.error("Error fetching screenings:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMovie, history]);

  const isSeatBooked = (seatNumber) => {
    return bookedSeats.includes(seatNumber);
  };

  let clickedRowNumber = 0;

  function findContiguousSeats(initialSeatNumber, totalTicketCount = 3) {
    const result = [];
    let seatsNeeded = totalTicketCount;

    function findSeatsInRow(row, relativeIndex) {
      const seatsInRow = salonLayout.rows[row - 1].seats;
      let searchIndex =
        row === clickedRowNumber
          ? seatsInRow.indexOf(initialSeatNumber)
          : relativeIndex !== undefined
          ? Math.min(
              Math.max(Math.round(seatsInRow.length * relativeIndex), 0),
              seatsInRow.length - 1
            )
          : 0; // Start from the beginning of the row if it's not the clicked row

      let leftIndex = searchIndex - 1;
      let rightIndex = searchIndex;
      while (
        seatsNeeded > 0 &&
        (leftIndex >= 0 || rightIndex < seatsInRow.length)
      ) {
        if (
          rightIndex < seatsInRow.length &&
          !isSeatBooked(seatsInRow[rightIndex])
        ) {
          result.push(seatsInRow[rightIndex]);
          seatsNeeded--;
          rightIndex++;
        } else if (leftIndex >= 0 && !isSeatBooked(seatsInRow[leftIndex])) {
          result.unshift(seatsInRow[leftIndex]);
          seatsNeeded--;
          leftIndex--;
        } else {
          break; // No more seats to check in this row
        }
      }
    }

    // Start with the clicked row
    findSeatsInRow(clickedRowNumber, undefined);

    // Check adjacent rows if needed
    let offset = 1;
    let initialRowRelativeIndex =
      salonLayout.rows[clickedRowNumber - 1].seats.indexOf(initialSeatNumber) /
      salonLayout.rows[clickedRowNumber - 1].seats.length;

    while (seatsNeeded > 0 && offset < salonLayout.rows.length) {
      if (clickedRowNumber - offset > 0) {
        findSeatsInRow(clickedRowNumber - offset, initialRowRelativeIndex);
      }
      if (
        seatsNeeded > 0 &&
        clickedRowNumber + offset <= salonLayout.rows.length
      ) {
        findSeatsInRow(clickedRowNumber + offset, initialRowRelativeIndex);
      }
      offset++;
    }

    return result;
  }

  const handleSeatClick = async (rowNumber, seatNumber) => {
    const totalTicketCount = getTotalTicketCount();
    if (isSeatBooked(seatNumber)) {
      return;
    }

    clickedRowNumber = rowNumber;

    if (groupSeats) {
      const desiredSeats = findContiguousSeats(seatNumber, totalTicketCount);
      for (let seat of desiredSeats) {
        if (isSeatBooked(seat)) {
          return;
        }
      }
    }

    // Check if the seat is already in selectedSeats
    if (seats.includes(seatNumber)) {
      setSeats((prevSeats) => prevSeats.filter((seat) => seat !== seatNumber));
      return;
    }

    // Determine if we should remove an existing seat from selection
    let seatToRemove = null;
    if (totalTicketCount <= 0) {
      return;
    }
    if (groupSeats) {
      setSeats(findContiguousSeats(seatNumber, totalTicketCount));
      if (selectedSeatsId.length > 0) {
        for (let id of selectedSeatsId) {
          fetch(`/api/deleteSeats`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              screeningId,
              // seats: [],
              selectedSeatsId: id, // Empty array to show removal
            }),
          });
        }
      }

      setSelectedSeatsId([]);
    } else {
      // Use this to check against the number of selected seats
      if (seats.length >= totalTicketCount) {
        seatToRemove = seats[0];
        setSeats((prevSeats) => prevSeats.slice(1)); // Remove the first seat
      }
      setSeats((prevSeats) => [...prevSeats, seatNumber]);
    }

    try {
      // Construct an array of seat objects for all selected seats
      const selectedSeatsArray = groupSeats
        ? findContiguousSeats(seatNumber, totalTicketCount).map((seat) => ({
            seatNumber: seat,
          }))
        : [{ seatNumber }];

      // Send all selected seats to the backend
      const res = await fetch(`/api/reserveSeats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screeningId,
          seats: selectedSeatsArray,
          previousSeat: seatToRemove, // This seat will be removed from the backend's temporary bookings
        }),
      });

      if (!res.ok) throw new Error("Error reserving seat");
      const data = await res.json();
      setSelectedSeatsId([...selectedSeatsId, data.selectedSeatsId]);

      if (groupSeats) {
        setSelectedSeats(findContiguousSeats(seatNumber, totalTicketCount));
      } else {
        if (selectedSeats.length === totalTicketCount) {
          setSelectedSeats([...selectedSeats.slice(1), seatNumber]);
        } else {
          setSelectedSeats([...selectedSeats, seatNumber]);
        }
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
        const weekNumber = getWeekNumber(data.startTime);
        setSelectedWeek(weekNumber.toString());
        setSelectedMovie(data.movieId);
        selectedMovieRef.current = data.movieId;
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

  const saveToSessionStorage = useCallback((data) => {
    sessionStorage.setItem("bookingData", JSON.stringify(data));
  }, []);

  const hasMounted = useRef(false);

  const isTransformed = (obj) =>
    Object.prototype.hasOwnProperty.call(obj, "seatNumber");

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const alreadyTransformed = seats.length > 0 && isTransformed(seats[0]);

    const transformedSeats = alreadyTransformed
      ? seats
      : seats.map((seat) => ({ seatNumber: seat }));

    saveToSessionStorage({
      seats: transformedSeats,
      salonId: screening?.salonId,
      tickets,
      selectedMovie,
      selectedWeek,
      screeningId: screeningId,
    });
  }, [
    seats,
    screening?.salonId,
    tickets,
    selectedMovie,
    selectedWeek,
    screeningId,
    saveToSessionStorage,
  ]);

  const isSeatObject = (seatObj) =>
    Object.prototype.hasOwnProperty.call(seatObj, "seatNumber");

  const loadFromSessionStorage = () => {
    const data = sessionStorage.getItem("bookingData");
    if (data) {
      const parsedData = JSON.parse(data);

      if (
        parsedData.seats &&
        parsedData.seats.length > 0 &&
        isSeatObject(parsedData.seats[0])
      ) {
        parsedData.seats = parsedData.seats.map(
          (seatObj) => seatObj.seatNumber
        );
      }

      return parsedData;
    }
    return null;
  };

  useEffect(() => {
    const storedData = loadFromSessionStorage();
    if (storedData) {
      setSeats(storedData.seats);
      setTickets(storedData.tickets);
      setSelectedMovie(storedData.selectedMovie);
      setSelectedWeek(storedData.selectedWeek);
    }
    return () => {
      sessionStorage.removeItem("bookingData");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if the screeningId in the route matches the stored one
  useEffect(() => {
    const storedScreeningId = JSON.parse(sessionStorage.getItem("screeningId"));
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

  // Move out into its own component so that we can reuse this
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
        const date = new Date(s.startTime);
        const day = date.getDate();
        const month = date.toLocaleDateString("sv-SE", { month: "short" });
        const year = date.getFullYear();

        // Function to get the ordinal suffix based on the day value
        const getOrdinalSuffix = (day) => {
          if (
            day === 1 ||
            day === 2 ||
            day === 21 ||
            day === 22 ||
            day === 31
          ) {
            return ":a";
          } else {
            return ":e";
          }
        };

        const formattedDate = `${date.toLocaleDateString("sv-SE", {
          dateOptions,
          weekday: "long",
        })} ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
        const capitalizedDate = capitalizeFirstLetter(formattedDate);

        const startTime = new Date(s.startTime)
          .toLocaleTimeString("sv-SE")
          .slice(0, -3);
        const endTime = new Date(s.endTime)
          .toLocaleTimeString("sv-SE")
          .slice(0, -3);

        return (
          <option key={s._id} value={s._id}>
            {capitalizedDate} kl {startTime} - {endTime}
          </option>
        );
      })
    );

  const ticketTranslations = {
    adults: "Vuxenbiljetter",
    seniors: "Pensionärsbiljetter",
    children: "Barnbiljetter",
  };

  function handleScreeningInput(e) {
    if (seats.length !== getTotalTicketCount() || getTotalTicketCount() === 0) {
      showAlert("Vänligen välj lika många säten som biljetter.");
      return;
    }
    setChosenScreening(e.target.parentNode.children[4].firstChild.value);
    setView("confirmation");
  }

  function showAlert(message) {
    document.getElementById("alertMessage").textContent = message;
    let modal = document.getElementById("customAlert");
    modal.style.display = "block";

    document.querySelector(".close-btn").onclick = function () {
      modal.style.display = "none";
    };
  }

  return (
    <div className="booking-page-container">
      {view === "seatPicker" && (
        <div className="booking">
          {loading || !initialSeatsDataReceived ? (
            <p>Laddar...</p>
          ) : (
            <>
              <div>
                <SeatReleaseOnUnload
                  screeningId={screeningId}
                  selectedSeats={selectedSeats}
                />
                <h2 className="booking-poster-title">{movie?.title}</h2>
                <img
                  className="booking-poster"
                  src={movie.images[0]}
                  alt={movie.title}
                />
                <h2 className="booking-poster-text"></h2>
              </div>
              <h2 className="book-text">Boka Biljetter</h2>
              <div className="dropdown-container">
                <DropdownSelect
                  value={selectedMovie}
                  options={movies}
                  placeholder="Välj film"
                  onChangeHandler={(newMovieId) => {
                    if (newMovieId === "") return;
                    setSelectedMovie(newMovieId);
                    setSelectedWeek("");
                  }}
                />
              </div>
              <div className="dropdown-container">
                <DropdownSelect
                  value={selectedWeek}
                  options={screenings}
                  placeholder="Välj vecka"
                  onChangeHandler={(newSelectedWeek) => {
                    setSelectedWeek(newSelectedWeek);
                  }}
                />
              </div>
              <div className="dropdown-container">
                <DropdownSelect
                  value={screeningId}
                  customOptions={filterScreenings}
                  placeholder="Välj visning"
                  onChangeHandler={(newScreeningId) => {
                    if (newScreeningId === "") return;
                    history(`/bokning/${newScreeningId}`);
                  }}
                />
              </div>
              {movie && movie.age <= 14 && (
                <TicketCounter
                  type="children"
                  label="Barnbiljetter"
                  quantity={tickets.children.quantity}
                  onChange={handleTicketChange}
                />
              )}

              {Object.keys(tickets).map((ticketType) => {
                // Exclude children tickets if the movie age is above 14 or below
                if (
                  ticketType === "children" &&
                  (movie?.age > 14 || movie?.age <= 14)
                ) {
                  return null;
                }
                return (
                  <TicketCounter
                    key={ticketType}
                    type={ticketType}
                    label={ticketTranslations[ticketType]}
                    quantity={tickets[ticketType].quantity}
                    onChange={handleTicketChange}
                  />
                );
              })}
              {seats.length > 0 && (
                <ClearSeatsButton
                  screeningId={screeningId}
                  setSeats={setSeats}
                  setTickets={setTickets}
                  setSelectedSeats={setSelectedSeats}
                  selectedSeatsId={selectedSeatsId}
                  setSelectedSeatsId={setSelectedSeatsId}
                />
              )}
              <div className="total-amount">
                <h3 className="sum">Summa: {getTotalAmount()} Kr</h3>
              </div>
              <div className="seat-select-container">
                <label
                  htmlFor="grouped-seats-checkbox"
                  className="seat-select-label">
                  Välj grupperade säten
                  <input
                    type="checkbox"
                    id="grouped-seats-checkbox"
                    className="seat-select"
                    name="Select Grouped Seats"
                    checked={groupSeats}
                    onChange={(e) => {
                      setGroupSeats(e.target.checked);
                    }}
                  />
                </label>

                <h3 className="seat-select-label-not-happy">
                  Inte nöjd med placeringen? Fyll på med individuella säten
                </h3>
              </div>
              <div className="theatre">
                <div className="movie-screen">
                  <div className="drape-left"></div>
                  <div className="drape-right"></div>
                </div>
                <div className="seats">
                  <SeatsGrid
                    salonLayout={salonLayout}
                    isSeatBooked={isSeatBooked}
                    handleSeatClick={handleSeatClick}
                    selectedSeats={selectedSeats}
                  />
                </div>
              </div>
            </>
          )}
          <div id="customAlert" className="alert-modal">
            <div className="alert-content">
              <span className="close-btn">Stäng</span>
              <p id="alertMessage">
                Vänligen välj lika många säten som biljetter.
              </p>
            </div>
          </div>
          {}
          <button className="book-button" onClick={handleScreeningInput}>
            Boka biljetter
          </button>
        </div>
      )}
      {view === "confirmation" && (
        <BookingConfirmation
          movies={movies}
          movieId={selectedMovie}
          screening={chosenScreening}
          filter={filterScreenings}
          setView={setView}
        />
      )}
    </div>
  );
}

export default Booking;
