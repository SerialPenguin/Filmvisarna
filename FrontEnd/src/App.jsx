import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    console.log('Fetching movies...');

    fetch('/movies')
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
      <ul>
        {movies.length === 0 ? (
          <li>No movies found</li>
        ) : (
          movies.map((movie) => (
            <li key={movie._id}>{movie.title}</li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;