import { useEffect, useState } from "react";

export function Profile() {
  const [userData, setUserData] = useState("");
  const [idList, setIdList] = useState([]);
  const [screeningList, setScreeningList] = useState([]);
  const [dataList, setDataList] = useState([]);
  // const [bookingData, setBookingData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [history, setHistory] = useState([]);
  const bearerToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzBlNTAzMWRlMWViMGRmZWU1NmZjMCIsImlhdCI6MTY5ODIzNTUzNX0.hB_kZ4hcoEF-0GUESTHr2JtFxjGJroxpFPPbmNl1l38";

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
      // await fetchUser();
      const dataPromise = idList.map(async (id) => {
        const response = await fetch(`${url}${id}`);
        if (!response.ok) {
          throw new Error("error");
        }
        return response.json();
      });

      const data = await Promise.all(dataPromise);
      const extract = data.map((item) => item.screeningId);
      setScreeningList(extract);

      setDataList(data);
      setLoading(false);
      // setScreeingList(data.screeningId);
    } catch (error) {
      setError(error);
      setLoading(false);
    }

    // console.table(dataList);
  };

  const fetchScreenings = async () => {
    const url = `/api/search/screenings/`;
    try {
      // await fetchBookings();
      const dataPromise = screeningList.map(async (id) => {
        const response = await fetch(`${url}${id}`);
        if (!response.ok) {
          throw new Error("error");
        }
        return response.json();
      });
      const data = await Promise.all(dataPromise);
      const extract = data.map((item) => item.movieId);
      setMovieList(extract);

      setScreeningList(data);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  //gör likadant som tidiagre, plocka ut movieId
  const fetchMovies = async () => {
    const url = `/api/search/movies/`;
    try {
      const dataPromise = movieList.map(async (id) => {
        const response = await fetch(`${url}${id}`);
        if (!response.ok) {
          throw new Error("error");
        }
        return response.json();
      });
      const data = await Promise.all(dataPromise);

      setHistory(data);

      // const data = await Promise.all(dataPromise)
      // const ext
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchBookings();
    fetchScreenings();
    fetchMovies();
  }, []);

  // console.log(idList);
  // console.table(userData);
  // console.table(dataList);
  console.table(screeningList);
  // console.table(history.title);
  // console.table(outPutArray);
  // console.log(dataList[0].screeningId);
  // console.table(dataList.screeningId);
  // console.log(dataList.screeningId);
  // console.log(screeningList);

  return (
    <div>
      <h1>Profil</h1>
    </div>
  );
}
