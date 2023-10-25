import { useState, useEffect } from "react";
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
  const [selectedFilterOption, setSelectedFilterOption] = useState("Alla filmer");
  const [filteredScreenings, setFilteredScreenings] = useState([]);
  const [selectedAgeOption, setSelectedAgeOption] = useState("Alla åldrar");
  const [selectedDateOption, setSelectedDateOption] = useState("Alla datum");
  const location = useLocation();

  const movieOptions = [
    "Alla filmer",
    "The Blue Hour",
    "Parasit",
    "Det sjunde inseglet",
    "Mio min Mio",
    "Aliens Abducted My Parents and Now I feel Kinda Left Out"
  ];

  useGet('/api/screenings', (data) => {
    setScreenings(data);
    setLoading(false);
    setFilteredScreenings(data);
  });

  useEffect(() => {
    // Uppdatera den filtrerade listan när selectedFilterOption eller selectedAgeOption ändras
    let filteredList = screenings;
  
    if (selectedFilterOption !== "Alla filmer") {
      filteredList = filteredList.filter((screening) => screening.movie.title === selectedFilterOption);
    }

    if (selectedAgeOption === "Barn Filmer") {
      filteredList = filteredList.filter((screening) => screening.movie.age === 7);
    }

    if (selectedDateOption !== "Alla datum") {
      filteredList = filteredList.filter((screening) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const date = new Date(screening.startTime).toLocaleDateString('sv-SE', options);
        return date === selectedDateOption; // Return the result of the comparison
      });      
    }
  
    setFilteredScreenings(filteredList);
  }, [selectedFilterOption, selectedAgeOption, screenings, selectedDateOption]);
  console.log(screenings)

  // Organisera screenings efter datum
  const screeningsByDate = filteredScreenings.reduce((acc, screening) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const date = new Date(screening.startTime).toLocaleDateString('sv-SE', options);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(screening);
    return acc;
  }, {});
  
  const screeningsDates = screeningsByDate;
  console.log(screeningsDates)
  return (
    <div>
      <h1>Screenings</h1>
      <select
        value={selectedFilterOption}
        onChange={(e) => setSelectedFilterOption(e.target.value)}
      >
        {movieOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        value={selectedAgeOption}
        onChange={(e) => setSelectedAgeOption(e.target.value)}
      >
        <option value="Alla åldrar">Alla åldrar</option>
        <option value="Barn Filmer">Barn Filmer</option>
      </select>
      <select 
        value={selectedDateOption}
        onChange={(e) => setSelectedDateOption(e.target.value)}>
        <option value="Alla datum">
          Alla datum
        </option>
        {Object.keys(screeningsByDate).map((date) => (
        <option key={date}>
          {date}
        </option>
      ))}
      </select>
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
                  
                    <button>
                      <Link to={`/bookings`}>Boka</Link>
                    </button>
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