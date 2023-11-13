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
  const [movieData, setMovieData] = useState([]);
  const [screeningId, setScreeningId] = useState([]);
  const [screeningData, setScreeningData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [deleteId, setDeleteId] = useState("");

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

        const combinedData = movieData.map((movie, index) => ({
          title: movie.title,
          image: movie.images,
          productionYear: movie.productionYear,
          genre: movie.genre,
          startTime: screeningData[index].startTime,
          bookingNumber: bookingData[index].bookingNumber,
          bookingId: bookingData[index]._id,
          seats: bookingData[index].seats,
        }));

        setCombinedData(combinedData);

        // console.log("Combined Data:", combinedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, [movieId, screeningData, bookingData]);

  useEffect(() => {
    const deleteBooking = async () => {
      // console.log(deleteId);
      // setDeleteId(id);
      try {
        const response = await fetch(`/api/auth/bookings/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId: deleteId,
          }),
        });

        if (!response.ok) {
          throw new Error("Error deleting booking data");
        }
      } catch (error) {
        console.error(error);
      }

      // console.log(deleteId);
    };

    deleteBooking();
  }, [deleteId]);

  // console.log("moviedata:", movieData);
  // console.log("bookingData:", bookingData);
  // console.log("screeningData:", screeningData);
  // console.log("Combined data:", combinedData);
  // console.log(deleteId);

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
          {combinedData.map((item, i) => (
            <li key={i}>
              <img src={item.image} />
              <p>{item.title}</p>
              <button onClick={() => setDeleteId(item.bookingId)}>
                Ta bort bokning
              </button>
            </li>
          ))}
          <ul className="profile-ul"></ul>
          <h3 className="profile-h3">Tidigare bokningar</h3>
          {combinedData.map((info, i) => (
            <li key={i}>
              <img src={info.image} />
              <p>{info.title}</p>
              <p>{info.productionYear}</p>
              <p>{info.bookingNumber}</p>
              <p>{info.genre}</p>
              <p>{info.startTime}</p>
              {info.seats.map((seat, i) => (
                <p key={i}>{seat.seatNumber}</p>
              ))}
            </li>
          ))}
        </div>
      </div>
    </section>
  );
}
