/** @format */

import { useEffect, useState } from "react";
import "./profile.css";
// import { getProfile } from "../hooksAndUtils/fetchUtil.js";
// const token = sessionStorage.getItem("JWT_TOKEN");

export default function Profile() {
  const [token] = useState(sessionStorage.getItem("JWT_TOKEN"));

  const [userData, setUserData] = useState("");
  const [bookingId, setBookingId] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [movieId, setMovieId] = useState([]);
  const [screeningId, setScreeningId] = useState([]);
  const [screeningData, setScreeningData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  const currentDate = new Date();

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
  }, [token]);

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
        // console.log(screeningId);
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

        // if (combinedData.length === 0) {
        //   setCombinedData("Inga bokningar hittades");
        // }

        setCombinedData(combinedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, [movieId, screeningData, bookingData]);

  const deleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`/api/auth/bookings/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: bookingId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error deleting booking data");
      }

      setCombinedData((prevData) =>
        prevData.filter((item) => item.bookingId !== bookingId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="profile-page-container">
      <h2 className="profile-h2">Profil</h2>
      <div className="profilepage-content">
        <table className="profile-table">
          <tbody className="profile-tbody">
            <tr>
              <td className="profile-first-row">Förnamn:</td>
              <td className="profile-second-row">{userData.firstName}</td>
            </tr>
            <tr>
              <td className="profile-first-row">Efternamn:</td>
              <td className="profile-second-row">{userData.lastName}</td>
            </tr>
            <tr>
              <td className="profile-first-row">E-post:</td>
              <td className="profile-second-row">{userData.emailAdress}</td>
            </tr>
          </tbody>
        </table>

        <ul className="booking-history-ul">
          <h3 className="profile-h3">Bokningshistorik</h3>
          {combinedData.length === 0 ? (
            <li className="no-bookings-found-text">
              Inga aktuella bokningar hittades
            </li>
          ) : (
            combinedData
              .filter((item) => new Date(item.startTime) > currentDate)
              .map((item, i) => (
                <li className="booking-history-li" key={i}>
                  <div className="booking-history-card">
                    <div className="booking-history-card-img-container">
                      <img alt="movie-poster" src={item.image[0]} />
                    </div>

                    <div className="booking-history-card-text">
                      <div className="history-card-title">
                        {/* <p className="card-title">
                          {item.title.length > 15
                            ? `${item.title.substring(0, 13)}...`
                            : item.title}
                        </p> */}
                        <p className="card-title">{item.title}</p>
                        <div className="genre-title-container">
                          <p className="card-genre">{item.genre}</p>
                          <p className="card-year">{item.productionYear}</p>
                        </div>
                      </div>

                      <div className="history-card-booking-number">
                        <p className="card-bookingnumber-title">
                          Bokningsnummer
                        </p>
                        <p className="card-bookingnumber">
                          {item.bookingNumber}
                        </p>
                      </div>

                      <div className="history-card-booking-info">
                        <div className="history-time">
                          <p>{item.startTime.slice(11, -8)}</p>
                          <p>{item.startTime.slice(0, -14)}</p>
                        </div>
                        <div className="history-seat">
                          <p>Platser:</p>
                          {item.seats.map((seat, i) => (
                            <p className="history-seat-numbers" key={i}>
                              {seat.seatNumber},
                            </p>
                          ))}
                        </div>
                      </div>

                      <button
                        className="delete-current-booking-btn"
                        onClick={() => deleteBooking(item.bookingId)}>
                        Ta bort bokning
                      </button>
                    </div>
                  </div>
                </li>
              ))
          )}

          {combinedData.length === 0 ? (
            <li className="booking-history-check">
              Inga tidigare bokningar hittades
            </li>
          ) : (
            combinedData
              .filter((item) => new Date(item.startTime) < currentDate)
              .map((item, i) => (
                <li className="booking-history-li" key={i}>
                  <div className="booking-history-card">
                    <div className="booking-history-card-img-container">
                      <img alt="movie-poster" src={item.image[0]} />
                    </div>

                    <div className="booking-history-card-text">
                      <div className="history-card-title">
                        <p className="card-title">
                          {item.title.length > 15
                            ? `${item.title.substring(0, 13)}...`
                            : item.title}
                        </p>
                        <div className="genre-title-container">
                          <p className="card-genre">{item.genre}</p>
                          <p className="card-year">{item.productionYear}</p>
                        </div>
                      </div>

                      <div className="history-card-booking-number">
                        <p className="card-bookingnumber-title">
                          Bokningsnummer
                        </p>
                        <p className="card-bookingnumber">
                          {item.bookingNumber}
                        </p>
                      </div>

                      <div className="history-card-booking-info">
                        <div className="history-time">
                          <p>{item.startTime.slice(11, -8)}</p>
                          <p>{item.startTime.slice(0, -14)}</p>
                        </div>
                        <div className="history-seat">
                          <p>Platser:</p>
                          {item.seats.map((seat, i) => (
                            <p className="history-seat-numbers" key={i}>
                              {seat.seatNumber},
                            </p>
                          ))}
                        </div>
                      </div>

                      <button
                        className="booking-history-btn"
                        onClick={() => deleteBooking(item.bookingId)}>
                        Ta bort bokning
                      </button>
                    </div>
                  </div>
                </li>
              ))
          )}
        </ul>
      </div>
    </section>
  );
}
