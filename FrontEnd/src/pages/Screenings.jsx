/** @format */

import { useState, useEffect } from "react";
import { useGet } from "../hooksAndUtils/useFetch";
import { Link, useLocation } from "react-router-dom";
import "./Screenings.css";

function GetDayFromDate(date) {
  const options = { weekday: "long" };
  const day = new Date(date).toLocaleDateString("sv-SE", options);
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function GetDateFromDate(date) {
  const options = { month: "long" };
  const dayNumber = new Date(date).getDate();
  const ordinalSuffix = getOrdinalSuffix(dayNumber);
  const month = new Date(date).toLocaleDateString("sv-SE", options);
  const formattedDate = dayNumber + ordinalSuffix + " " + month;
  return formattedDate;
}

function getOrdinalSuffix(day) {
  if (day === 1 || day === 2 || day === 21 || day === 22 || day === 31) {
    return ":a";
  } else {
    return ":e";
  }
}

function getUpdatedDate(date) {
  const day = GetDayFromDate(date);
  const month = GetDateFromDate(date);
  const updatedDate = day + " " + month;
  return updatedDate;
}

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
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const date = new Date(screenings).toLocaleDateString("sv-SE", options);
  return date;
}

function organizeScreeningsByDate(screenings) {
  if (!Array.isArray(screenings) || screenings.length === 0) {
    return {}; // Return an empty object if screenings is not an array or is empty
  }

  // Create an object to store screenings by date
  const screeningsByDate = {};

  // Iterate through the screenings
  screenings.forEach((screening) => {
    // Extract date and time components
    const date = new Date(screening.startTime);
    const dateString = date.toISOString().split("T")[0];

    // Check if the date exists in the object, if not, create an array for it
    if (!screeningsByDate[dateString]) {
      screeningsByDate[dateString] = [];
    }

    // Add the screening to the array for that date
    screeningsByDate[dateString].push(screening);
  });

  // Sort the screenings within each date by their start time
  for (const date in screeningsByDate) {
    screeningsByDate[date].sort((a, b) => {
      const dateA = new Date(a.startTime);
      const dateB = new Date(b.startTime);

      // Compare dates first
      if (dateA.getFullYear() !== dateB.getFullYear()) {
        return dateA.getFullYear() - dateB.getFullYear();
      }

      if (dateA.getMonth() !== dateB.getMonth()) {
        return dateA.getMonth() - dateB.getMonth();
      }

      if (dateA.getDate() !== dateB.getDate()) {
        return dateA.getDate() - dateB.getDate();
      }

      // If dates are equal, compare times
      return dateA - dateB;
    });
  }

  return screeningsByDate;
}

function Screenings() {
  /* First filter options*/
  const ALL_MOVIES_OPTION = "Alla filmer";
  const ALL_AGES_OPTION = "Välj åldersgräns";
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

  // ----------------- FILTER LOGIC FOR MOVIE -----------------
  function filterByMovieTitle(screenings, selectedFilterOption) {
    if (selectedFilterOption !== ALL_MOVIES_OPTION) {
      screenings = screenings.filter(
        (screening) => screening.movie.title === selectedFilterOption
      );
    }
    return screenings;
  }
  // ----------------- FILTER LOGIC FOR AGE -----------------
  function filterByAge(screenings, selectedAgeOption) {
    if (selectedAgeOption !== ALL_AGES_OPTION) {
      screenings = screenings.filter(
        (screening) => screening.movie.age === parseInt(selectedAgeOption)
      );
    }
    return screenings;
  }
  // ----------------- FILTER LOGIC FOR WEEK -----------------
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
    return screenings;
  }
  // ----------------- FILTER LOGIC FOR DATE -----------------
  function filterByDate(screenings, selectedDate) {
    if (selectedDate !== ALL_DATES_OPTION) {
      screenings = screenings.filter((screening) => {
        return fixDateStartTime(screening.startTime) === selectedDate;
      });
    }
    return screenings;
  }
  // ----------------- FILTER RESET FOR OPTIONS -----------------
  const resetFilters = () => {
    // Reset all filter options to their default values
    setSelectedFilterOption(ALL_MOVIES_OPTION);
    setSelectedAgeOption(ALL_AGES_OPTION);
    setSelectedWeek(ALL_WEEKS_OPTION);
    setSelectedDate(ALL_DATES_OPTION);
  };

  // filter list logic
  useEffect(() => {
    // Uppdatera den filtrerade listan när selectedFilterOption, selectedAgeOption, selectedDate  eller selectedWeek ändras
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
      <h2 className="main-text-title">ALLA VISNINGAR</h2>
      <div className="filters-containers">
        {/*------------------------- MOVIE FILTER SELECT -------------------------*/}
        <select
          className="screenings-selectors"
          value={selectedFilterOption}
          onChange={(e) => setSelectedFilterOption(e.target.value)}>
          <option key={ALL_MOVIES_OPTION} value={ALL_MOVIES_OPTION}>
            {ALL_MOVIES_OPTION}
          </option>
          {[
            ...new Set(screenings.map((screening) => screening.movie.title)),
          ].map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
        {/*------------------------- AGE FILTER SELECT -------------------------*/}
        <select
          className="screenings-selectors"
          value={selectedAgeOption}
          onChange={(e) => setSelectedAgeOption(e.target.value)}>
          <option value={ALL_AGES_OPTION}>{ALL_AGES_OPTION}</option>
          <option value="0">Barntillåtet</option>
          <option value="7">7-årsgräns</option>
          <option value="11">11-årsgräns</option>
          <option value="15">15-årsgräns</option>
        </select>
        {/*------------------------- WEEK FILTER SELECT -------------------------*/}
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
          ]
            .sort((a, b) => a - b) // Sort in ascending order
            .map((weekNumber) => (
              <option key={weekNumber} value={weekNumber}>
                Vecka {weekNumber}
              </option>
            ))}
        </select>
        {/*------------------------- DATE FILTER SELECT -------------------------*/}
        {selectedWeek !== ALL_WEEKS_OPTION && (
          <select
            className="screenings-selectors"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}>
            <option value={ALL_DATES_OPTION}>{ALL_DATES_OPTION}</option>
            {Object.keys(screeningsByDate)
              .sort((a, b) => new Date(a) - new Date(b)) // Sort keys in ascending order
              .map((date) => (
                <option key={date} value={date}>
                  {getUpdatedDate(date)}
                </option>
              ))}
          </select>
        )}
      </div>
      {loading ? (
        <p className="Laddar">Laddar...</p>
      ) : (
        <>
          {Object.keys(screeningsByDate).length === 0 ? (
            <div>
              <p className="no-results-text">
                Inga visningar matchar dina filter.
              </p>
              <p className="clear-filters-text" onClick={resetFilters}>
                Klicka här för att återställa filtreringen
              </p>
            </div>
          ) : (
            Object.keys(screeningsByDate)
              .sort((a, b) => new Date(a) - new Date(b))
              .map((date) => (
                <div key={date}>
                  <div className="date-container">
                    <h2 className="date-title">{GetDayFromDate(date)}</h2>
                    <p className="date-dates">{GetDateFromDate(date)}</p>
                  </div>
                  <ul className="screenings-list-container">
                    <div className="seperator"></div>
                    {screeningsByDate[date].map((screening) => (
                      <li key={screening._id} className="screenings-list">
                        <img
                          src={screening.movie.images[0]}
                          className="movie-poster-img"></img>
                        <div className="list-item-container">
                          <h3 className="list-movie-title">
                            <Link
                              to={`/sok/filmer/${screening.movie._id}`}
                              state={{ from: location.pathname }}
                              className="link-color">
                              {screening.movie.title}
                            </Link>
                          </h3>
                          <div className="screenings-info-container">
                            {screening.salon.name === "Small salon" ? (
                              <p className="screenings-p">Lilla salongen</p>
                            ) : (
                              <p className="screenings-p">Stora salongen</p>
                            )}
                            <p className="screenings-p">
                              {formatTimeToHHMM(screening.startTime)}
                            </p>
                            <p className="screenings-p desktopvye">
                              {screening.movie.age} år
                            </p>
                          </div>
                        </div>
                        <div className="link-container">
                          <Link
                            to={`/bokning/${screening._id}`}
                            className="main-btn-container">
                            <button className="main-btn-color">Boka</button>
                          </Link>
                          <Link
                            to={`/sok/filmer/${screening.movie._id}`}
                            state={{ from: location.pathname }}
                            className="visa-mer desktopvye">
                            Visa mer
                          </Link>
                        </div>
                      </li>
                    ))}
                    <div className="seperator"></div>
                  </ul>
                </div>
              ))
          )}
        </>
      )}
    </div>
  );
}

export default Screenings;
