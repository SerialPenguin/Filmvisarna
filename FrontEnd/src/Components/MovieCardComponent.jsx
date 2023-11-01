/** @format */

import { useState } from "react";
import { useGet } from "../hooksAndUtils/useFetch.js";
import { Link } from "react-router-dom";
import '../frontpage.css'

const MovieCardComponent = () => {
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);

  useGet("/api/movies", setMovies);
  console.log(movies);

  //to eventually make booking link
  useGet("/api/screenings", setScreenings);
  console.log(screenings);

  return (
    <div>
      <div>
      <h2>Aktuella filmer</h2>
      <div className="movie-card-container">
      {movies.map((movie) => (
        <div
          key={movie._id}
          className="movie-card">
          <img src={movie.images} alt="" className="movie-card-img" />
          <div>
            <p className="movie-card-title">{movie.title}</p>
            <div
              className="movie-card-info">
              <p style={{ fontSize: "0.7rem" }}>{movie.productionYear}</p>
              <p style={{ fontSize: "0.7rem" }}>{movie.length} min</p>
            </div>
            <p
              className="movie-card-description">
              {movie.description}
            </p>
            <div className="movie-card-links">
              {screenings.map((screening) =>
                movie._id === screening.movieId &&
                screening.startTime < "2023-12-04T19:12:00.000Z" ? (
                  <Link key={screening._id} to={`/booking/${screening._id}`}>
                    <button
                      style={{
                        marginLeft: "1em",
                        padding: "0.4em",
                        backgroundColor: "#C699EA",
                      }}>
                      Boka
                    </button>
                  </Link>
                ) : null
              )}
              <Link to={`/search/movies/${movie._id}`}>
                <p style={{ color: "#FFB800" }}>visa mer...</p>
              </Link>
            </div>
          </div>
        </div>
      ))}
      </div>
      </div>
    </div>
  );
};

export default MovieCardComponent;
