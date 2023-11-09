/** @format */

import { useEffect, useState } from "react";
import "./profile.css";
// import { getProfile } from "../hooksAndUtils/fetchUtil.js";
const token = sessionStorage.getItem("JWT_TOKEN");

export default function Profile() {
  const [userData, setUserData] = useState("");
  const [bookingId, setBookingId] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [movieId, setMovieId] = useState([]);
  const [movieInfo, setMovieInfo] = useState([]);
  const [screeningId, setScreeningId] = useState([]);
  const [screeningData, setScreeningData] = useState([]);

  // const currentDate = new Date().getTime();

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching user data");
      }

      const userData = await response.json();
      const bookingId = userData.bookingHistory;
      setUserData(userData);
      setBookingId(bookingId);

      // en array med alla bokningsID
      // console.log(bookingId);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingPromises = bookingId.map((id) =>
          fetch(`/api/search/bookings/${id}`).then((response) =>
            response.json()
          )
        );
        const allBookings = await Promise.all(bookingPromises);
        setBookingData(allBookings);
        // console.log(allBookings);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
  }, [bookingId]);

  console.log(bookingData);

  // useEffect(() => {
  //   const fetchScreeningData = async () => {
  //     try {
  //       const drinksPromises = bookingId.map((obj) =>
  //         fetch(`/api/search/bookings/${obj}`).then((res) => res.json())
  //       );
  //       const data = await Promise.all(drinksPromises);
  //       setScreeningData(data);
  //       // console.log(data); // Flyttar loggen här
  //     } catch (error) {
  //       console.error("An error occurred:", error);
  //     }
  //   };

  //   fetchScreeningData();
  // }, [bookingId]);

  // console.log(screeningData);

  // console.log(screeningData);
  // useEffect(() => {
  //   async function fetchScreenings() {
  //     screeningId.map(async (screeningId) => {
  //       const response = await fetch(`/api/search/screenings/${screeningId}`);
  //       if (!response.ok) {
  //         throw new Error("Error fetching screening data");
  //       }
  //       const screeningData = await response.json();
  //       const movieId = screeningData.movieId;

  //       setMovieId([movieId]);
  //       setScreeningData(screeningData);
  //       // console.log(screeningData);
  //     });
  //   }
  //   fetchScreenings();
  // }, [screeningId]);

  // useEffect(() => {
  //   async function fetchMovies() {
  //     movieId.map(async (movieId) => {
  //       const response = await fetch(`/api/search/movies/${movieId}`);
  //       if (!response.ok) {
  //         throw new Error("Error fetching movie data");
  //       }
  //       const movieData = await response.json();
  //       // const movieTitle = movieData.title;

  //       // console.log(movieData);
  //       setMovieInfo([movieData]);
  //       // console.log(movieData);
  //     });
  //   }
  //   fetchMovies();
  // }, [movieId]);

  // // fetchMovies();
  // console.log(movieInfo);

  // hämta information från screenings och bookings (time, seats etc) och movie (title, bild)

  // https://stackoverflow.com/questions/67223446/promise-all-inside-useeffect-in-react-returns-an-array-of-undefined-items

  // useEffect(() => {
  //   async function MapInfo() {
  //     Promise.all([screeningData, movieInfo]);
  //   }
  //   MapInfo();
  // }, []);

  return (
    <section className="profile-page-container">
      <h2 className="profile-h2">Profil</h2>
      <div className="profilepage-content">
        <table className="profile-table">
          <tbody className="profile-tbody">
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

        <div className="bookinghistory-container">
          <h3 className="profile-h3">Aktuella bokningar</h3>
          <ul className="profile-ul">
            <li>
              <button>Ta bort bokning</button>
            </li>
          </ul>
          <h3 className="profile-h3">Tidigare bokningar</h3>

          <ul className="profile-ul">
            {bookingData.map((booking, i) => (
              <li key={i}>
                {booking.screeningId}
                {/* {booking.age} */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
