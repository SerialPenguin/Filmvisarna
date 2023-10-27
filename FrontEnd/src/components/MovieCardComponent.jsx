import { useState } from "react";
import useGet from "../hooksAndUtils/useFetch.js";
import { Link } from "react-router-dom";

const MovieCardComponent = () => {
  const [movies, setMovies] = useState([]);
  const [screenings, setScreenings] = useState([]);

  useGet("/api/movies", setMovies);
  console.log(movies);

  //to eventually make booking link
  useGet("/api/screenings", setScreenings);
  console.log(screenings);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2em",
      }}>
      <h2>Aktuella filmer</h2>
      {movies.map((movie) => (
        <div key={movie.id} style={{ width: "390px", display: "flex" }}>
          <img src={movie.images} alt="" style={{ width: "100px" }} />
          <div>
            <p style={{ margin: "0" }}>{movie.title}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "-1em",
                marginBottom: "-1em",
              }}>
              <p style={{ fontSize: "0.7rem" }}>{movie.productionYear}</p>
              <p style={{ fontSize: "0.7rem" }}>{movie.length} min</p>
            </div>
            <p
              style={{
                padding: ".5em",
                fontSize: "0.7rem",
                height: "47px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
              {movie.description}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Link to={"/booking/:screeningId"}>
                <button>Boka</button>
              </Link>
              <Link to={`/search/movies/${movie._id}`}>
                <p>visa mer...</p>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieCardComponent;