import { useState } from "react";
import { useGet } from "../hooksAndUtils/useFetch";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function formatTimeToHHMM(dateTimeString) {
  const date = new Date(dateTimeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function Screenings() {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useGet('/api/screenings', (data) => {
    setScreenings(data);
    setLoading(false);
  });
  console.log(screenings)

  // Organisera screenings efter datum
  const screeningsByDate = screenings.reduce((acc, screening) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const date = new Date(screening.startTime).toLocaleDateString('sv-SE', options);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(screening);
    return acc;
  }, {});

  return (
    <div>
      <h1>Screenings</h1>
      {loading ? (
        <p>Laddar...</p>
      ) : (
        Object.keys(screeningsByDate).map((date) => (
          <div key={date}>
            <h2>{date}</h2>
            <ul>
              {screeningsByDate[date].map((screening) => (
                <li key={screening._id}>
                  {/* Rendera här informationen för varje screening */}
                  <h3>{screening.movie.title}</h3>
                  <p>Salong: {screening.salon.name}</p>
                  <p>Starttid: {formatTimeToHHMM(screening.startTime)}</p>
                  <p>Sluttid: {formatTimeToHHMM(screening.endTime)}</p>
                  <p>Antal tillgängliga platser: {screening.availableSeats}</p>
                  <Link to={`/bookings`}>
                    <button>Boka</button>
                  </Link>
                  <Link to={`/search/movies/${screening.movie._id}`} state={{ from: location.pathname }}>
                     Mer info...
                  </Link>

                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Screenings;
