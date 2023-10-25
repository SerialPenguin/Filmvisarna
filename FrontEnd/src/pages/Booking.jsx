import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Booking() {
  const { screeningId } = useParams();
  const [movie, setMovie] = useState(null);
  const [screening, setScreening] = useState(null);
  const [salonLayout, setSalonLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [initialSeatsDataReceived, setInitialSeatsDataReceived] = useState(false);
  const [previousSeat, setPreviousSeat] = useState(null);  // <-- New state


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

    return () => {
      eventSource.close();
    };
  }, [screeningId]);

  const isSeatBooked = (seatNumber) => {
    return bookedSeats.includes(seatNumber);
  };

  const handleSeatClick = async (rowNumber, seatNumber) => {
    if (isSeatBooked(seatNumber)) {
        console.log(`Seat ${seatNumber} in row ${rowNumber} is already booked.`);
    } else {
        try {
            const response = await fetch(`/api/reserveSeats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    screeningId,
                    seats: [{ seatNumber }],
                    previousSeat   // <-- Pass the previous seat to the backend
                })
            });

            const data = await response.json();

            if (data !== undefined) {
                setBookedSeats((prevSeats) => [...prevSeats, seatNumber]);
                setPreviousSeat(seatNumber);  // <-- Set the current seat as the previous one for next time
                console.log(`Seat ${seatNumber} is now temporarily reserved.`);
            } else {
                console.log(data.error);
            }
        } catch (error) {
            console.error('Error reserving seat:', error);
        }
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
      {loading || !initialSeatsDataReceived ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Booking for: {movie?.title}</h1>
          <h2>Director: {movie?.director}</h2>
          <h3>Description: {movie?.description}</h3>
          <h3>Screening Date: {screening?.startTime}</h3>
          <h3>Screening Time: {screening?.endTime}</h3>
          <img src={movie?.images?.[0]} alt={movie?.title} />
          <div className="seats-grid">
            {(salonLayout?.rows ?? []).map((row) => (
              <div key={row.rowNumber} className="row">
                {(row.seats ?? []).map((seatNumber) => (
                  <button
                    key={seatNumber}
                    className={isSeatBooked(seatNumber) ? 'booked' : 'available'}
                    onClick={
                      !isSeatBooked(seatNumber)
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







