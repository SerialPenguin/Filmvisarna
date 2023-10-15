// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// function Booking() {
//   const { screeningId } = useParams(); 
//   const [movie, setMovie] = useState(null);
//   const [screening, setScreening] = useState(null);
//   const [salonLayout, setSalonLayout] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState('');

//   useEffect(() => {
//     const eventSource = new EventSource('http://localhost:3000/events');

//     eventSource.onmessage = function(event) {
//       setCurrentTime(event.data);
//     };

//     eventSource.onerror = function(err) {
//       console.error('EventSource failed:', err);
//       eventSource.close();
//     };

//     return () => {
//       eventSource.close();
//     };
//   }, []);
  
//   const isSeatBooked = (rowNumber, seatNumber) => {
//     return screening?.bookedSeats.some(
//       (seat) => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
//     ) ?? false;
//   };

  
//   const handleSeatClick = (rowNumber, seatNumber) => {
//     if (isSeatBooked(rowNumber, seatNumber)) {
//       console.log(`Seat ${seatNumber} in row ${rowNumber} is already booked.`);
//     } else {
//       console.log(`Seat ${seatNumber} in row ${rowNumber} is available.`);
//     }
//   };

//   useEffect(() => {
//     // Function to fetch a specific screening
//     const fetchScreening = async () => {
//       try {
//         const response = await fetch(`/api/screenings/${screeningId}`);
//         if (!response.ok) throw new Error('Failed to fetch screening');
//         const data = await response.json();
//         setScreening(data);

//         // Fetch the movie data using movieId from the screening data
//         fetchMovie(data.movieId);

//         // Fetch the seats/salon layout
//         if (data.salonId) {
//           fetchSeats(data.salonId);
//         }
//       } catch (error) {
//         console.error('Error fetching screening data:', error);
//       }
//     };

//     // Function to fetch a specific movie
//     const fetchMovie = async (movieId) => {
//       try {
//         const response = await fetch(`/api/movies/${movieId}`);
//         if (!response.ok) throw new Error('Failed to fetch movie');
//         const data = await response.json();
//         setMovie(data);
//         setLoading(false); // Set loading to false when the fetch completes to avoid null values
//         console.log("Fetched Movie Data:", data)
//       } catch (error) {
//         console.error('Error fetching movie data:', error);
        
//       }
//     };

//     // Function to fetch seats of a specific salon
//     const fetchSeats = async (salonId) => {
//       try {
//         const response = await fetch(`/api/seats/${salonId}`);
//         if (!response.ok) throw new Error('Failed to fetch seats');
//         const data = await response.json();
//         setSalonLayout(data);
//         console.log("Fetched Screening Data:", data)
//       } catch (error) {
//         console.error('Error fetching seats data:', error);
//       }
//     };

//     // Fetch the screening first, then use the resulting data to fetch movie and seats
//     fetchScreening();
//   }, [screeningId]); // Dependency array updated to screeningId

//   return (
//     <div className="App">
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <h1>Booking for: {movie?.title}</h1>
//           <h2>Director: {movie?.director}</h2>
//           <h3>Description: {movie?.description}</h3>
//           <img src={movie?.images?.[0]} alt={movie?.title} />
//           <div>
//             <h1>Server Time:</h1>
//             <p>{currentTime}</p>
//           </div>
//           <div className="seats-grid">
//             {(salonLayout?.rows ?? []).map((row) => (
//               <div key={row.rowNumber} className="row">
//                 {(row.seats ?? []).map((seatNumber) => (
//                  <button
//                  key={seatNumber}
//                  className={isSeatBooked(row.rowNumber, seatNumber) ? 'booked' : 'available'}
//                  onClick={
//                      !isSeatBooked(row.rowNumber, seatNumber) 
//                      ? () => handleSeatClick(row.rowNumber, seatNumber)
//                      : null
//                  }
//              >
//                  {seatNumber}
//              </button>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Booking;


import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Booking() {
  const { screeningId } = useParams();
  const [movie, setMovie] = useState(null);
  const [screening, setScreening] = useState(null);
  const [salonLayout, setSalonLayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/events');

    eventSource.onmessage = function (event) {
      try {
        const bookedSeats = JSON.parse(event.data);
        // Update the bookedSeats data in the screening state
        setScreening((prevScreening) => ({
          ...prevScreening,
          bookedSeats: bookedSeats,
        }));
      } catch (err) {
        console.error('Error parsing booked seats:', err);
      }
    };

    eventSource.onerror = function (err) {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const isSeatBooked = (rowNumber, seatNumber) => {
    return screening?.bookedSeats.some(
      (seat) => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
    ) ?? false;
  };

  const handleSeatClick = (rowNumber, seatNumber) => {
    if (isSeatBooked(rowNumber, seatNumber)) {
      console.log(`Seat ${seatNumber} in row ${rowNumber} is already booked.`);
    } else {
      console.log(`Seat ${seatNumber} in row ${rowNumber} is available.`);
    }
  };

  useEffect(() => {
    const fetchScreening = async () => {
      try {
        const response = await fetch(`/api/screenings/${screeningId}`);
        if (!response.ok) throw new Error('Failed to fetch screening');
        const data = await response.json();
        setScreening(data);
        fetchMovie(data.movieId);
        if (data.salonId) fetchSeats(data.salonId);
      } catch (error) {
        console.error('Error fetching screening data:', error);
      }
    };

    const fetchMovie = async (movieId) => {
      try {
        const response = await fetch(`/api/movies/${movieId}`);
        if (!response.ok) throw new Error('Failed to fetch movie');
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    const fetchSeats = async (salonId) => {
      try {
        const response = await fetch(`/api/seats/${salonId}`);
        if (!response.ok) throw new Error('Failed to fetch seats');
        const data = await response.json();
        setSalonLayout(data);
      } catch (error) {
        console.error('Error fetching seats data:', error);
      }
    };

    fetchScreening();
  }, [screeningId]);

  return (
    <div className="App">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Booking for: {movie?.title}</h1>
          <h2>Director: {movie?.director}</h2>
          <h3>Description: {movie?.description}</h3>
          <img src={movie?.images?.[0]} alt={movie?.title} />
          <div className="seats-grid">
            {(salonLayout?.rows ?? []).map((row) => (
              <div key={row.rowNumber} className="row">
                {(row.seats ?? []).map((seatNumber) => (
                  <button
                    key={seatNumber}
                    className={isSeatBooked(row.rowNumber, seatNumber) ? 'booked' : 'available'}
                    onClick={
                      !isSeatBooked(row.rowNumber, seatNumber)
                        ? () => handleSeatClick(row.rowNumber, seatNumber)
                        : null
                    }
                  >
                    {seatNumber}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Booking;