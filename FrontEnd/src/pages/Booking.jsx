import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Booking() {
  const { screeningId } = useParams();
  const [movie, setMovie] = useState(null);
  const [screening, setScreening] = useState(null);
  const [salonLayout, setSalonLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  // SSE (Server-Sent Events) useEffect
  useEffect(() => {
    if (!screeningId) return;

    const eventSource = new EventSource(`/api/events/${screeningId}`);

    eventSource.onmessage = function (event) {
      try {
        const bookedSeats = JSON.parse(event.data);
        // Update the bookedSeats data in the screening state
        setScreening((prevScreening) => ({
          ...prevScreening,
          bookedSeats: bookedSeats,
        }));
      } catch (err) {
        console.error('Error parsing booked seats:', err);
      }
    };

    eventSource.onerror = function (err) {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [screeningId]);  // Now the effect is dependent on screeningId

  const isSeatBooked = (rowNumber, seatNumber) => {
    return screening?.bookedSeats.some(
      (seat) => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
    ) ?? false;
  };

  const handleSeatClick = (rowNumber, seatNumber) => {
    if (isSeatBooked(rowNumber, seatNumber)) {
      console.log(`Seat ${seatNumber} in row ${rowNumber} is already booked.`);
    } else {
      console.log(`Seat ${seatNumber} in row ${rowNumber} is available.`);
    }
  };

  useEffect(() => {
    const fetchScreening = async () => {
      try {
        const response = await fetch(`/api/search/screenings/${screeningId}`);
        if (!response.ok) throw new Error('Failed to fetch screening');
        const data = await response.json();
        setScreening(data);
        fetchMovie(data.movieId);
        if (data.salonId) fetchSeats(data.salonId);
      } catch (error) {
        console.error('Error fetching screening data:', error);
      }
    };

    const fetchMovie = async (movieId) => {
      try {
        const response = await fetch(`/api/search/movies/${movieId}`);
        if (!response.ok) throw new Error('Failed to fetch movie');
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    const fetchSeats = async (salonId) => {
      try {
        const response = await fetch(`/api/search/seats/${salonId}`);
        if (!response.ok) throw new Error('Failed to fetch seats');
        const data = await response.json();
        setSalonLayout(data);
      } catch (error) {
        console.error('Error fetching seats data:', error);
      }
    };

    fetchScreening();
  }, [screeningId]);

  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Booking for: {movie?.title}</h1>
          <h2>Director: {movie?.director}</h2>
          <h3>Description: {movie?.description}</h3>
          <img src={movie?.images?.[0]} alt={movie?.title} />
          <div className="seats-grid">
            {(salonLayout?.rows ?? []).map((row) => (
              <div key={row.rowNumber} className="row">
                {(row.seats ?? []).map((seatNumber) => (
                  <button
                    key={seatNumber}
                    className={isSeatBooked(row.rowNumber, seatNumber) ? 'booked' : 'available'}
                    onClick={
                      !isSeatBooked(row.rowNumber, seatNumber)
                        ? () => handleSeatClick(row.rowNumber, seatNumber)
                        : null
                    }
                  >
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