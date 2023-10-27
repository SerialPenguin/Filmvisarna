/** @format */

import { useParams, Link, useLocation } from "react-router-dom";
import { useGet } from "../hooksAndUtils/useFetch";
import { useState } from "react";

function getYouTubeVideoId(url) {
  const match = url.match(/[?&]v=([^?&]+)/);
  if (match && match[1]) {
    return match[1];
  } else {
    // Handle invalid URLs
    return "";
  }
}

function MinutsToHoursAndMinuts(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    if (remainingMinutes > 0) {
      return `${hours} timmar och ${remainingMinutes} minuter`;
    } else {
      return `${hours} timmar`;
    }
  } else {
    return `${remainingMinutes} minuter`;
  }
}

function MovieInfo() {
  const { movieId } = useParams();
  const location = useLocation();

  const [movie, setMovie] = useState({});

  useGet(`/api/search/movies/${movieId}`, setMovie);

  console.log(movie);

  const hasTrailers = movie.youtubeTrailers && movie.youtubeTrailers.length > 0;

  return (
    <div>
      <h1>{movie.title}</h1>
      {hasTrailers ? (
        <iframe
          width="350"
          height="200"
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(
            movie.youtubeTrailers[0]
          )}`}
          title="Trailer"
          allowFullScreen
        />
      ) : (
        <p>No trailer available</p>
      )}

      <h2>Beskrivning</h2>
      <p>{movie.description}</p>
      <p>Genre: {movie.genre}</p>
      <p>Längd: {MinutsToHoursAndMinuts(movie.length)}</p>
      <p>
        {movie.actors && movie.actors.length > 0
          ? `Actors: ${movie.actors.join(", ")}`
          : "Inga skådespelare lagrade"}
      </p>
      <p>
        Språk:{" "}
        {movie.language
          ? movie.language.charAt(0).toUpperCase() + movie.language.slice(1)
          : "Inget språk lagrade"}
      </p>
      <p>
        Undertext:{" "}
        {movie.subtitles
          ? movie.subtitles.charAt(0).toUpperCase() + movie.subtitles.slice(1)
          : "Inget undertext lagrade"}
      </p>
      <p>Regissör: {movie.director}</p>
      <p>Släppte: {movie.productionYear}</p>

      <button>
        <Link to={location.state ? location.state.from : "/"}>Tillbaka</Link>
      </button>

      <button>
        <Link to={`/booking/${movieId}`}>Boka film</Link>
      </button>
    </div>
  );
}

export default MovieInfo;
