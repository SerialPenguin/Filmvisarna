/** @format */

import { useEffect, useState } from "react";
import "./profile.css";
// import { getProfile } from "../hooksAndUtils/fetchUtil.js";
const token = sessionStorage.getItem("JWT_TOKEN");

export default function Profile() {
  const [userData, setUserData] = useState("");
  const [bookingId, setBookingId] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [seats, setSeats] = useState([]);
  const [movieId, setMovieId] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [screeningId, setScreeningId] = useState([]);
  const [screeningData, setScreeningData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  // const [values, setValues] = useState([]);

  // const currentDate = new Date().getTime();

  useEffect(() => {
    const fetchUser = async () => {
      try {
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
      } catch (error) {
        console.error(error);
      }
    };

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
        const screeningData = allBookings.map(
          (screenings) => screenings.screeningId
        );
        const screeningId = [].concat(...screeningData);

        setBookingData(allBookings);
        setScreeningId(screeningId);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
  }, [bookingId]);

  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const screeningPromises = screeningId.map((id) =>
          fetch(`/api/search/screenings/${id}`).then((response) =>
            response.json()
          )
        );
        const screeningsData = await Promise.all(screeningPromises);
        const movies = screeningsData.map((movie) => movie.movieId);
        const movieId = [].concat(...movies);

        setScreeningData(screeningsData);
        setMovieId(movieId);
      } catch (error) {
        console.error(error);
      }
    };

    fetchScreenings();
  }, [screeningId]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesPromises = movieId.map((id) =>
          fetch(`/api/search/movies/${id}`).then((response) => response.json())
        );
        const movieData = await Promise.all(moviesPromises);

        setMovieData(movieData);

        // Combine values from different arrays into an object with relationships
        const combinedData = movieData.map((movie, index) => ({
          title: movie.title,
          startTime: screeningData[index].startTime,
          bookingNumber: bookingData[index].bookingNumber,
          // Add more properties if needed
        }));

        setCombinedData(combinedData);

        console.log("Combined Data:", combinedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, [movieId, screeningData, bookingData]);

  console.log(bookingData);
  // useEffect(() => {
  //   async function MapInfo() {
  //     Promise.all([screeningData, movieInfo]);
  //   }
  //   MapInfo();
  // }, []);

  // movieId i collections
  // screening.Id och movie.id
  // genom screening, movie:taggar
  // if sats, hämtar movies och screenings, om de överrensstämmer vill jag ha
  // om det här finns i den här så gör det här
  // movie. behöva
  // göra i DOM/returnen movie?. age får säga till att det är null

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
            {combinedData.map((info, i) => (
              <li key={i}>
                <p>{info.title}</p>
                <p>{info.bookingNumber}</p>
                <p>{info.bookingNumber}</p>
                {/* <p>{info.title}</p>
                <p>{info.bookingNumber}</p> */}
                {/* <p>{info.productionYear}</p>
                <p>{info.genre}</p>
                <img src={info.images} />
                <p>{info.bookingNumber}</p> */}
              </li>
            ))}
          </ul>
          <h3 className="profile-h3">Tidigare bokningar</h3>
          {/* <div>
            {.map((booking) => {
              <p>{booking.screeningId}</p>;
            })}
          </div> */}
          {/* <ul className="profile-ul">
            {allResponses.map((info, i) => (
              <li key={i}>
                <p>{info.title}</p>
                <p>{info.productionYear}</p>
                <p>{info.genre}</p>
                <img src={info.images} />
              </li>
            ))}
          </ul> */}
        </div>
      </div>
    </section>
  );
}

//  object values
