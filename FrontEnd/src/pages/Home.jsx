import { useState, useEffect } from 'react';

function Home() {
  const [screenings, setScreenings] = useState([]);

  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const response = await fetch('/api/screenings');
        if (!response.ok) throw new Error('Failed to fetch screenings');
        const data = await response.json();
        setScreenings(data);
      } catch (error) {
        console.error('Error fetching screenings data:', error);
      }
    };

    fetchScreenings(); 
  }, []);

  return (
    <div className="App">
      <h1>Screenings</h1>
      <div className="screening-grid">
        {screenings.length === 0 ? (
          <p>No screenings found</p>
        ) : (
          screenings.map((screening) => (
            <div key={screening._id} className="screening-card">
              <h2>{screening.movie.title}</h2>
              <p>{screening.movie.description}</p>
              <img src={screening.movie.images[0]} alt={screening.movie.title} />
              <button>Book Now</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;