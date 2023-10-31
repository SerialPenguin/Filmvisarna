import { useEffect, useState } from "react";
import "./profile.css";
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzBlNTAzMWRlMWViMGRmZWU1NmZjMCIsImlhdCI6MTY5ODIzNTUzNX0.hB_kZ4hcoEF-0GUESTHr2JtFxjGJroxpFPPbmNl1l38";

const token = sessionStorage.getItem("JWT_TOKEN");

export function Profile() {
  const [userData, setUserData] = useState("");
  const [bookingId, setBookingId] = useState([]);
  const [movieInfo, setMovieInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUser = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!fetchUser.ok) {
          throw new Error("Error fetching user data");
        }

        const userData = await fetchUser.json();
        setUserData(userData);

        const bookingId = userData.bookingHistory;
        if (bookingId.length === 0) {
          setBookingId(false);
        }

        const fetchBookings = await Promise.all(
          bookingId.map(async (bookingId) => {
            const response = await fetch(`/api/search/bookings/${bookingId}`);
            if (!response.ok) {
              throw new Error("Error fetching booking data");
            }
            const bookingData = await response.json();
            return bookingData.screeningId;
          })
        );

        const fetchScreenings = await Promise.all(
          fetchBookings.map(async (screeningId) => {
            const response = await fetch(
              `/api/search/screenings/${screeningId}`
            );
            if (!response.ok) {
              throw new Error("Error fetching screening data");
            }
            const screeningData = await response.json();
            return screeningData.movieId;
          })
        );

        const fetchMovies = await Promise.all(
          fetchScreenings.map(async (movieId) => {
            const response = await fetch(`/api/search/movies/${movieId}`);
            if (!response.ok) {
              throw new Error("Error fetching movie data");
            }
            const movie = await response.json();
            return movie;
          })
        );

        setMovieInfo(fetchMovies);
      } catch (error) {
        console.error("Error: " + error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2>Profil</h2>
      <h3>Dina uppgifter:</h3>
      <table>
        <tbody>
          <tr>
            <td>Förnamn:</td>
            <td>{userData.firstName}</td>
          </tr>
          <tr>
            <td>Efternamn:</td>
            <td>{userData.lastName}</td>
          </tr>
          <tr>
            <td>E-post:</td>
            <td>{userData.emailAdress}</td>
          </tr>
        </tbody>
      </table>

      <h3>Tidigare bokningar:</h3>
      <ul>
        {bookingId === false ? (
          <p>Inga tidigare bokningar hittades</p>
        ) : movieInfo.length === 0 ? (
          <p>Laddar tidigare bokningar...</p>
        ) : (
          movieInfo.map((movie, i) => (
            <li key={i}>
              <img src={movie.images} />
              {movie.title}
            </li>
          ))
        )}
      </ul>
    </>
  );
}
