/*
const [products, setProducts] = useState([]);
useGet('/api/products', setProducts);
*/

// import { useGet } from "../hooksAndUtils/useFetch";
import { useEffect, useState } from "react";

export function Profile() {
  // const [user, setUser] = useState([]);
  // useGet("/auth/profile", setUser);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const bearerToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzBlNTAzMWRlMWViMGRmZWU1NmZjMCIsImlhdCI6MTY5ODIzNTUzNX0.hB_kZ4hcoEF-0GUESTHr2JtFxjGJroxpFPPbmNl1l38";

    // Skapa Fetch-förfrågan med Bearer-token
    fetch("/api/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        // "Content-Type": "application/json", // Ange rätt Content-Type om det krävs
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Något gick fel");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Fel:", error);
      });
  }, []);

  if (!userData) {
    return <p>Laddar användarinformation...</p>;
  }
  console.log(userData.bookingHistory);

  let bookings = userData.bookingHistory;
  return (
    <div>
      <h1>Profil</h1>
      <p>E-post: {userData.emailAdress}</p>

      <ul>
        {bookings.lenght === 0 ? (
          <p>Inga bokningar hittades</p>
        ) : (
          bookings.map((history) => (
            <div key={history._id}>
              <p>{history}</p>
            </div>
          ))
        )}
      </ul>
      {/* <p>Bokningshistorik: {userData.bookingHistory}</p> */}
    </div>
  );
}
