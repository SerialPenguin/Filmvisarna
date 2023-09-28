import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    console.log('Fetching movies...');

    fetch('/api/movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then((data) => {
        console.log('Fetched movies:', data);
        setMovies(data); 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log('Rendered with movies:', movies); 

  return (
    <div className="App">
      <h1>Movies</h1>
      <div className="movie-grid">
        {movies.length === 0 ? (
          <p>No movies found</p>
        ) : (
          movies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <h2>{movie.title}</h2>
              <p>{movie.description}</p>
              <img src={movie.images} alt={movie.title}></img>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;