import { useParams, Link, useLocation } from "react-router-dom";
import { useGet } from "../hooksAndUtils/useFetch";
import { useState } from "react";
import "../styling.css"

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

function findAScreeningUrl(movieId, screenings){
    const screeningsForMovie = screenings.find((screening) => screening.movieId === movieId)

    let bookingLink = '';
    if (screeningsForMovie) {
      bookingLink = `/booking/${screeningsForMovie._id}`;
    } else {
      bookingLink = ''; // Default link if no matching screening is found
    }

    return bookingLink;
}

function MovieInfo() {
    const { movieId } = useParams();
    const location = useLocation();
    
    const [movie, setMovie] = useState({});
    const [screenings, setScreenings] = useState([]);

    useGet(`/api/search/movies/${movieId}`, setMovie);
    useGet(`/api/screenings`, setScreenings);
   
    const hasTrailers = movie.youtubeTrailers && movie.youtubeTrailers.length > 0;
    
    return (
        <div className="movieinfo-container">
            <h1 className="main-text-title">{movie.title}</h1>
            
            {hasTrailers ? (
                <div className="iframe-container">
                <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(movie.youtubeTrailers[0])}`}
                    title="Trailer"
                    allowFullScreen
                />
                </div>
            ) : (
                <p>No trailer available</p>
            )}
            <div className="text-containers">
                <h2 className="text-title">Beskrivning</h2>
                <p className="normal-text">{movie.description}</p>
                <p>Genre: {movie.genre}</p>
                <p>Längd: {MinutsToHoursAndMinuts(movie.length)}</p>
                <p>
                {movie.actors && movie.actors.length > 0
                    ? `Actors: ${movie.actors.join(', ')}`
                    : 'Inga skådespelare lagrade'
                }
                </p>
                <p>Språk: {movie.language ? movie.language.charAt(0).toUpperCase() + movie.language.slice(1) : "Inget språk lagrade"}</p>
                <p>Undertext: {movie.subtitles ? movie.subtitles.charAt(0).toUpperCase() + movie.subtitles.slice(1) : "Inget undertext lagrade"}</p>
                <p>Regissör: {movie.director}</p>
                <p>Släppte: {movie.productionYear}</p>
            </div>
            <div className="button-container">
                <Link to={findAScreeningUrl(movie._id, screenings)}>
                    <button className="main-btn">Boka film</button>
                </Link>
                <Link to={location.state ? location.state.from : "/" }>
                    <button className="sec-btn">Tillbaka</button>
                </Link>
            </div>
        </div>
    );
}

export default MovieInfo;
