import { useEffect, useState } from "react";
import { adminPost, authGet, get } from "../../../hooksAndUtils/fetchUtil";

export default function AddScreeningComponent(props) {
  const [movies, setMovies] = useState();
  const [salons, setSalons] = useState();
  const [formBody, setFormBody] = useState({});
  const [formState, setFormState] = useState("pick-movie");

  useEffect(() => {
    async function getMovies() {
      setMovies(await get("/api/movies"));
      setSalons(await authGet("/api/search/auth/admin/getSalon", props.token));
    }

    getMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function calcTime(e) {
    // console.log(e.target.value);
    setFormBody({ ...formBody, startTime: e.target.value });

    formBody.startTime = new Date().toISOString();

    let newTime = new Date(formBody.startTime);

    let movieLengthInHours = formBody.movieLength / 60;
    let hours = movieLengthInHours.toString().slice(0, 1) * 1;
    let minutes = (movieLengthInHours.toString().slice(2, 3) / 10) * 60;

    console.log("Before: ", newTime);

    newTime.setHours(newTime.getHours() + hours);
    newTime.setMinutes(newTime.getMinutes() + minutes);

    console.log("After: ", newTime);

    // let startTimeHour = formBody.startTime.slice(11, 13);
    // console.log(startTimeHour);
    // let endTime = console.log(endTime);
  }

  async function addScreening(e) {
    e.preventDefault();

    for (let key in formBody) {
      if (formBody[key] === undefined) {
        delete formBody[key];
      }
    }

    console.log("FB: ", formBody);

    const postMovie = await adminPost(
      "/api/screenings/auth/admin/addScreening",
      formBody,
      props.token
    );
    console.log("PM: ", postMovie);

    props.movieRef.close();
    props.setOptionState("non");
  }

  return (
    <div className="edit-movie-container">
      {formState === "pick-movie" && (
        <div className="movies-container">
          {movies?.map((movie) => (
            <p
              className="movie-para"
              onClick={() => {
                setFormBody({
                  ...formBody,
                  movieId: movie._id,
                  movieLength: movie.length,
                });
                setFormState("pick-salon");
              }}
              key={movie.title}
              id={movie.title}>
              {movie.title}
            </p>
          ))}
        </div>
      )}
      {formState === "pick-salon" && (
        <div className="movies-container">
          {salons?.map((salon) => (
            <p
              className="movie-para"
              onClick={() => {
                setFormBody({ ...formBody, salonId: salon._id });
                setFormState("add");
              }}
              key={salon.name}
              id={salon.name}>
              {salon.name === "Large salon"
                ? "Stora Salongen"
                : "Lilla Salongen"}
            </p>
          ))}
        </div>
      )}
      {formState === "add" && (
        <form onSubmit={addScreening} className="edit-movie-form">
          <label className="lbl" htmlFor="startTime">
            Starttid:
          </label>
          <input
            type="datetime-local"
            value={formBody.startTime || ""}
            onChange={calcTime}
            className="start-time-input"
            id="startTime"
            name="startTime"></input>
          <label className="lbl" htmlFor="endTime">
            Sluttid:
          </label>
          <input
            type="datetime-local"
            // value={}
            className="end-time-input"
            name="endTime"></input>
          <button className="add-screening-btn">Lägg till visning</button>
        </form>
      )}
    </div>
  );
}
