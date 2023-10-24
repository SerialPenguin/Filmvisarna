import { useParams, Link } from "react-router-dom";
import { useGet } from "../hooksAndUtils/useFetch";
import { useState } from "react";

function getYouTubeVideoId(url) {
    const match = url.match(/[?&]v=([^?&]+)/);
    if (match && match[1]) {
        return match[1];
    } else {
        // Handle invalid URLs
        return '';
    }
}

function MovieInfo() {
    const { movieId } = useParams();
    
    const [movie, setMovie] = useState({});
    
    useGet(`/api/search/movies/${movieId}`, setMovie);
    
    //console.log(movie);

    const hasTrailers = movie.youtubeTrailers && movie.youtubeTrailers.length > 0;
    
    return (
        <div>
            <h1>{movie.title}</h1>
            {hasTrailers ? (
                <iframe
                    width="350"
                    height="200"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(movie.youtubeTrailers[0])}`}
                    title="Trailer"
                    allowFullScreen
                />
            ) : (
                <p>No trailer available</p>
            )}

            <h2>Beskrivning</h2>
            <p>{movie.description}</p>
            <p>Genre: {movie.genre}</p>
            <p>Längd: {movie.length} minuter</p>
            <p>Språk: {movie.language}</p>
            <p>Undertext: {movie.subtitles}</p>
            <p>Regissör: {movie.director}</p>
            <p>Släppte: {movie.productionYear}</p>
            
            <button>
                <Link to="/">Tillbaka till startsidan</Link>
            </button>

            <button>
                <Link to={`/booking/${movieId}`}>Boka film</Link>
            </button>
        </div>
    );
}

export default MovieInfo;
