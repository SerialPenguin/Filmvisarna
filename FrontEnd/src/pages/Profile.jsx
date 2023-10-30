/*
const [products, setProducts] = useState([]);
useGet('/api/products', setProducts);
*/

// import { useGet } from "../hooksAndUtils/useFetch";
import { useEffect, useState } from "react";

export function Profile() {
  // const [user, setUser] = useState([]);
  // useGet("/auth/profile", setUser);
  const [userData, setUserData] = useState("");
  const [idList, setIdList] = useState([]);
  const [screeningList, setScreeingList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [bookingData, setBookingData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movie, setMovie] = useState("");
  const bearerToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzBlNTAzMWRlMWViMGRmZWU1NmZjMCIsImlhdCI6MTY5ODIzNTUzNX0.hB_kZ4hcoEF-0GUESTHr2JtFxjGJroxpFPPbmNl1l38";

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          // "Content-Type": "application/json", // Ange rätt Content-Type om det krävs
        },
      });

      if (!response.ok) throw new Error("Fel");
      const data = await response.json();
      setUserData(data);
      // setIdList(data.bookingHistory);
      // console.log(idList);
    } catch (error) {
      console.log("Error " + error);
    }

    setIdList(userData.bookingHistory);
    // console.log(idList);
  };

  const fetchBookings = async () => {
    const url = `/api/search/bookings/`;

    try {
      const dataPromise = idList.map(async (id) => {
        const response = await fetch(`${url}${id}`);
        if (!response.ok) {
          throw new Error("error");
        }
        return response.json();
      });

      const data = await Promise.all(dataPromise);

      setDataList(data);
      setLoading(false);
      // setScreeingList(data.screeningId);
    } catch (error) {
      setError(error);
      setLoading(false);
    }

    // console.table(dataList);
  };

  // if(idList.length > 0) {
  //   fetchDataForIds();
  // }

  useEffect(() => {
    fetchUser();
    fetchBookings();
    // fetchBookings();
    // fetchBookings();
  }, []);

  // console.log(idList);
  // console.table(userData.bookingHistory);
  console.table(dataList);
  // console.table(dataList.screeningId);
  // console.log(dataList.screeningId);
  // console.log(screeningList);

  return (
    <div>
      {/* <h1>Profil</h1>
      <p>Förnamn:</p>
      <p>Efternamn:</p>
      <p>E-post: {userData.emailAdress}</p>
      <h2>Bokningshistorik:</h2>
      <p>
        {bookings.map((history) => (
          <div key={history._id}>
            <p>{history}</p>
          </div>
        ))}
      </p> */}
      {/* <ul>
        {bookings.lenght === 0 ? (
          <p>Inga tidigare bokningar hittades</p>
        ) : (
          bookings.map((history) => (
            <div key={history._id}>
              <p>{history}</p>
            </div>
          ))
        )}
      </ul> */}

      {/* <ul>
        {bookings.length === 0 ? (
          <p>Inga bokningar hittades</p>
        ) : (
          bookings.map((history) => (
            <div key={history._id}>
              <p>{history}</p>
            </div>
          ))
        )}
      </ul> */}
      {/* <p>Bokningshistorik: {userData.bookingHistory}</p> */}
    </div>
  );
}
