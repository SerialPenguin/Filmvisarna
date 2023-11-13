import { useEffect, useState } from "react";
import { adminPost, authGet, get } from "../../../hooksAndUtils/fetchUtil";
import "./HandleScreenings.css";

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
    let endTime = new Date(
      new Date(e.target.value).getTime() + formBody.movieLength * 60 * 1000
    );
    setFormBody({
      ...formBody,
      startTime: e.target.value,
      endTime: endTime.toLocaleString("sv-SE").slice(0, -3),
    });
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

    props.screeningRef.close();
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
            value={formBody.endTime || ""}
            onChange={calcTime}
            className="end-time-input"
            name="endTime"></input>
          <button className="add-screening-btn">Lägg till visning</button>
        </form>
      )}
    </div>
  );
}
