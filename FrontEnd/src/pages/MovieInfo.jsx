import { useParams, Link, useLocation } from "react-router-dom";
import { useGet } from "../hooksAndUtils/useFetch";
import { useState } from "react";
import "./MovieInfo.css"

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
            <h2 className="movie-title-header">{movie.title}</h2>
            
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
            <div className="poster-btn-text-container">
              {movie.images ? (
              <img className="movie-poster" src={`${movie.images[0]}`} alt="" />
              ):(
                <div>no img</div>
              )}
              <div className="btn-text-container">
                <div className="text-containers">
                    <p className="normal-text">{movie.description}</p>
                    <p className="normal-text">Genre: {movie.genre}</p>
                    <p className="normal-text">Längd: {MinutsToHoursAndMinuts(movie.length)}</p>
                    <p className="normal-text">
                    {movie.actors && movie.actors.length > 0
                        ? `Skådespelare: ${movie.actors.join(', ')}`
                        : 'Inga skådespelare lagrade'
                    }
                    </p>
                    <p className="normal-text">Språk: {movie.language ? movie.language.charAt(0).toUpperCase() + movie.language.slice(1) : "Inget språk lagrade"}</p>
                    <p className="normal-text">Undertext: {movie.subtitles ? movie.subtitles.charAt(0).toUpperCase() + movie.subtitles.slice(1) : "Inget undertext lagrade"}</p>
                    <p className="normal-text">Regissör: {movie.director}</p>
                    <p className="normal-text">Släppte: {movie.productionYear}</p>
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
            </div>
        </div>
    );
}

export default MovieInfo;
