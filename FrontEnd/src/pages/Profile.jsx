import { useEffect, useState } from "react";
const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzBlNTAzMWRlMWViMGRmZWU1NmZjMCIsImlhdCI6MTY5ODIzNTUzNX0.hB_kZ4hcoEF-0GUESTHr2JtFxjGJroxpFPPbmNl1l38";

export function Profile() {
  const [userData, setUserData] = useState("");
  const [bookingHistory, setBookingHistory] = useState([]);
  const [screeningId, setScreeningId] = useState([]);
  const [movieId, setMovieId] = useState([]);
  const [movieInfo, setMovieInfo] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        });

        if (!response.ok) throw new Error("Fel");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.log("Error " + error);
      }

      setBookingHistory(userData.bookingHistory);
    };

    const fetchBookings = async () => {
      const url = `/api/search/bookings/`;

      try {
        const mapData = bookingHistory.map(async (id) => {
          const response = await fetch(`${url}${id}`);
          if (!response.ok) {
            throw new Error("error");
          }
          return response.json();
        });

        const data = await Promise.all(mapData);
        const extract = data.map((item) => item.screeningId);
        setScreeningId(extract);
      } catch (error) {
        console.log("error");
      }
    };

    const fetchScreenings = async () => {
      const url = `/api/search/screenings/`;
      try {
        const mapData = screeningId.map(async (id) => {
          const response = await fetch(`${url}${id}`);
          if (!response.ok) {
            throw new Error("error");
          }
          return response.json();
        });
        const data = await Promise.all(mapData);
        const extract = data.map((item) => item.movieId);
        setMovieId(extract);
      } catch (error) {
        console.log("error");
      }
    };

    const fetchMovies = async () => {
      const url = `/api/search/movies/`;
      try {
        const mapData = movieId.map(async (id) => {
          const response = await fetch(`${url}${id}`);
          if (!response.ok) {
            throw new Error("error");
          }
          return response.json();
        });
        const data = await Promise.all(mapData);
        const mapMovie = data.map((item) => item);

        setMovieInfo(mapMovie);
      } catch (error) {
        console.log("error");
      }
    };

    fetchUser();
    fetchBookings();
    fetchScreenings();
    fetchMovies();
  }, []);

  console.table(movieId);

  return (
    <div>
      <h2>Profil</h2>
      <h3>Dina uppgifter:</h3>
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

      <h3>Tidigare bokningar:</h3>
      <ul>
        {movieInfo.length === 0 ? (
          <p>Inga tidiagre bokningar hittades</p>
        ) : (
          movieInfo.map((movie, i) => <li key={i}>{movie.title}</li>)
        )}
      </ul>
    </div>
  );
}
