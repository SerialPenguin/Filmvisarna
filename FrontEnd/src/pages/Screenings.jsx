/** @format */

import { useState, useEffect } from "react";
import { useGet } from "../hooksAndUtils/useFetch";
import { Link, useLocation } from "react-router-dom";
import "./Screenings.css"

function formatTimeToHHMM(dateTimeString) {
  const date = new Date(dateTimeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return weekNumber;
}

function fixDateStartTime(screenings) {
  const options = { weekday: "long", month: "long", day: "numeric" };
  const date = new Date(screenings).toLocaleDateString("sv-SE", options);
  return date;
}
function organizeScreeningsByDate(screenings) {
  return screenings.reduce((acc, screening) => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    const date = new Date(screening.startTime).toLocaleDateString(
      "sv-SE",
      options
    );
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(screening);
    return acc;
  }, {});
}



function Screenings() {
  /* First filter options*/
  const ALL_MOVIES_OPTION = "Alla filmer";
  const ALL_AGES_OPTION = "Ålder Filter";
  const ALL_WEEKS_OPTION = "Alla veckor";
  const ALL_DATES_OPTION = "Alla Datum";

  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterOption, setSelectedFilterOption] =
    useState(ALL_MOVIES_OPTION);
  const [filteredScreenings, setFilteredScreenings] = useState([]);
  const [selectedAgeOption, setSelectedAgeOption] = useState(ALL_AGES_OPTION);
  const [selectedWeek, setSelectedWeek] = useState(ALL_WEEKS_OPTION);
  const [selectedDate, setSelectedDate] = useState(ALL_DATES_OPTION);
  const location = useLocation();

  useGet("/api/screenings", (data) => {
    setScreenings(data);
    setLoading(false);
    setFilteredScreenings(data);
  });

  function filterByMovieTitle(screenings, selectedFilterOption) {
    if (selectedFilterOption !== ALL_MOVIES_OPTION) {
      screenings = screenings.filter(
        (screening) => screening.movie.title === selectedFilterOption
      );
    }

  }
  
  function filterByAge(screenings, selectedAgeOption) {
    if (selectedAgeOption !== ALL_AGES_OPTION) {
      screenings = screenings.filter(
        (screening) => screening.movie.age <= selectedAgeOption
      );
    }

  }
  
  function filterByWeek(screenings, selectedWeek) {
    if (selectedWeek !== ALL_WEEKS_OPTION) {
      screenings = screenings.filter((screening) => {
        return (
          getWeekNumber(screening.startTime) === parseInt(selectedWeek, 10)
        );
      });
    } else {
      setSelectedDate(ALL_DATES_OPTION);
    }
  }
  
  function filterByDate(screenings, selectedDate) {
    if (selectedDate !== ALL_DATES_OPTION) {
      screenings = screenings.filter((screening) => {
        return fixDateStartTime(screening.startTime) === selectedDate;
      });
    }
  }

  useEffect(() => {
    // Uppdatera den filtrerade listan när selectedFilterOption, selectedAgeOption,selectedDate  eller selectedWeek ändras
    let filteredList = screenings;
    
    filteredList = filterByMovieTitle(filteredList, selectedFilterOption);
    filteredList = filterByAge(filteredList, selectedAgeOption);
    filteredList = filterByWeek(filteredList, selectedWeek);
    filteredList = filterByDate(filteredList, selectedDate);

    setFilteredScreenings(filteredList);
  }, [
    selectedFilterOption,
    selectedAgeOption,
    screenings,
    selectedWeek,
    selectedDate,
  ]);

  // Organisera screenings efter datum
  const screeningsByDate = organizeScreeningsByDate(filteredScreenings);

  return (
    <div className="return-container">
      <h1 className="main-text-title">ALLA VISNINGAR</h1>
      <div className="filters-containers">
        <select
          className="screenings-selectors"
          value={selectedFilterOption}
          onChange={(e) => setSelectedFilterOption(e.target.value)}>
          <option key={ALL_MOVIES_OPTION} value={ALL_MOVIES_OPTION}>
          {ALL_MOVIES_OPTION}
          </option>
          {[
            ...new Set(
              filteredScreenings.map((screening) => screening.movie.title)
            ),
          ].map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
        <select
          className="screenings-selectors"
          value={selectedAgeOption}
          onChange={(e) => setSelectedAgeOption(e.target.value)}>
          <option value={ALL_AGES_OPTION}>{ALL_AGES_OPTION}</option>
          <option value="7">7</option>
          <option value="11">11</option>
          <option value="15">15</option>
        </select>
        <select
          className="screenings-selectors"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}>
          <option value={ALL_WEEKS_OPTION}>{ALL_WEEKS_OPTION}</option>
          {[
            ...new Set(
              filteredScreenings.map((screening) =>
                getWeekNumber(screening.startTime)
              )
            ),
          ].map((weekNumber) => (
            <option key={weekNumber} value={weekNumber}>
              Vecka {weekNumber}
            </option>
          ))}
        </select>
        {selectedWeek !== ALL_WEEKS_OPTION && (
          <select
            className="screenings-selectors"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}>
            <option value={ALL_DATES_OPTION}>{ALL_DATES_OPTION}</option>
            {Object.keys(screeningsByDate).map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        )}
      </div>
      {loading ? (
        <p className="Laddar">Laddar...</p>
      ) : (
        Object.keys(screeningsByDate).map((date) => (
          <div key={date}>
            <h2 className="date-title">
              {date.charAt(0).toUpperCase() + date.slice(1)}
            </h2>
            <ul className="screenings-list-container">
              <div className="seperator"></div>
              {screeningsByDate[date].map((screening) => (
                <li key={screening._id} className="screenings-list">
                  {/* Rendera här informationen för varje screening */}

                  <h3 className="list-movie-title">
                    <Link
                      to={`/search/movies/${screening.movie._id}`}
                      state={{ from: location.pathname }}
                      className="link-color">
                      {screening.movie.title}
                    </Link>
                  </h3>

                  <p className="screenings-p">Salong: {screening.salon.name}</p>
                  <p className="screenings-p">
                    Börjar: {formatTimeToHHMM(screening.startTime)}
                  </p>
                  <Link to={`/booking/${screening._id}`}>
                    <button className="main-btn-color">Boka</button>
                  </Link>
                </li>
              ))}
              <div className="seperator"></div>
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default Screenings;
