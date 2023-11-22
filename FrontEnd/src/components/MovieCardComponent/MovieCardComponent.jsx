/** @format */

import { useState } from "react";
import { useGet } from "../../hooksAndUtils/useFetch.js";
import { Link, useNavigate } from "react-router-dom";
import "../MovieCardComponent/MovieCardComponent.css";

const MovieCardComponent = () => {
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useGet("/api/movies", setMovies);
  console.log(movies);

  useGet("/api/screenings", setScreenings);
  console.log(screenings);

  const handleMouseEnter = (cardId) => {
    setIsHovered(cardId);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleBookingClick = (id) => {
    screenings.forEach((screening) => {
      if (id === screening.movieId) {
        navigate(`/bokning/${screening._id}`);
      }
    });
  };

  function convertTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      if (remainingMinutes > 0) {
        return `${hours} t ${remainingMinutes} m`;
      } else {
        return `${hours} t`;
      }
    } else {
      return `${remainingMinutes} m`;
    }
  }

  return (
    <div>
      <h2 className="movie-card-header">Aktuella filmer</h2>
      <div className="movie-card-container">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <img src={movie.images[0]} alt="" className="movie-card-img" />
            <div
              className={`moviecard-desktop${
                isHovered === movie._id ? "hovered" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(movie._id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="moviecard-styling-desktop">
                <p className="movie-card-title">{movie.title}</p>
                <div className="movie-card-info">
                  <p style={{ fontSize: "0.7rem" }}>{movie.productionYear}</p>
                  <p style={{ fontSize: "0.7rem" }}>
                    {movie.genre.toLowerCase()}
                  </p>
                  <p style={{ fontSize: "0.7rem" }}>
                    {convertTime(movie.length)}
                  </p>
                </div>
                <p className="movie-card-description">{movie.description}</p>
                <div className="movie-card-links">
                  <button
                    className="movie-card-btn"
                    onClick={() => handleBookingClick(movie._id)}
                  >
                    Boka
                  </button>

                  <Link to={`/sok/filmer/${movie._id}`}>
                    <p className="moviecard-showmore-link">visa mer...</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieCardComponent;
