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
        // console.log(setToken);
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

        // setMovieData(movieData);

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

        <ul className="booking-history-ul">
          <h3 className="profile-h3">Bokningshistorik</h3>
          {combinedData.length === 0 ? (
            <li>Inga aktuella bokningar hittades</li>
          ) : (
            combinedData
              .filter((item) => new Date(item.startTime) > currentDate)
              .map((item, i) => (
                <li className="booking-history-li" key={i}>
                  <div className="booking-history-card">
                    <div className="booking-history-card-img-container">
                      <img alt="movie-poster" src={item.image} />
                    </div>

                    <div className="booking-history-card-text">
                      <div className="history-card-title">
                        <p>{item.title}</p>
                        <p>{item.genre}</p>
                        <p>{item.productionYear}</p>
                      </div>

                      <div className="history-card-booking-number">
                        <p>Bokningsnummer</p>
                        <p>{item.bookingNumber}</p>
                      </div>

                      <div className="history-card-booking-info">
                        <p>{item.startTime.slice(11, -8)}</p>
                        <p>{item.startTime.slice(0, -14)}</p>
                        <div className="history-seat">
                          <p>Platser:</p>
                          {item.seats.map((seat, i) => (
                            <p className="history-seat-numbers" key={i}>
                              {seat.seatNumber}
                            </p>
                          ))}
                        </div>
                      </div>

                      <button
                        className="delete-current-booking-btn"
                        onClick={() => deleteBooking(item.bookingId)}
                      >
                        Ta bort bokning
                      </button>
                    </div>
                  </div>
                </li>
              ))
          )}
        </ul>
        <ul className="profile-ul"></ul>
        {/* <h3 className="profile-h3">Tidigare bokningar</h3> */}
        {combinedData.length === 0 ? (
          <li>Inga tidigare bokningar hittades</li>
        ) : (
          combinedData
            .filter((item) => new Date(item.startTime) < currentDate)
            .map((info, i) => (
              <li key={i}>
                <img alt="movie-poster" src={info.image} />
                <p>{info.title}</p>
                <p>{info.productionYear}</p>
                <p>{info.bookingNumber}</p>
                <p>{info.genre}</p>
                <p>{info.startTime}</p>
                {info.seats.map((seat, i) => (
                  <p key={i}>{seat.seatNumber}</p>
                ))}
              </li>
            ))
        )}
      </div>
    </section>
  );
}
