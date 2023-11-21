import { useState } from "react";
import { adminPost } from "../../../hooksAndUtils/fetchUtil";
import "./HandleScreenings.css";
import { useAuthGet, useGet } from "../../../hooksAndUtils/useFetch";

export default function AddScreeningComponent(props) {
  const [movies, setMovies] = useState();
  const [salons, setSalons] = useState();
  const [formBody, setFormBody] = useState({});
  const [formState, setFormState] = useState("pick-movie");
  const [status, setStatus] = useState();

  useGet("/api/movies", (data) => {
    setMovies(data)
  });
  
  useAuthGet("/api/auth/admin/getSalon", props.token, (data) => {
    setSalons(data);
  });
  

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
      "/api/auth/admin/addScreening",
      formBody,
      props.token
    );

    console.log("PM: ", postMovie);

    if(postMovie.status === 403){
      setStatus(403);
      setTimeout(() => {
        setStatus();
      }, 4000);
    }else {
      props.screeningRef.close();
      props.setOptionState("non");
    }
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
      {formState === "add" && status !== 403 && (
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
      {status === 403 && (
        <h4 className="screening-para">Det finns redan en visning på den här salongen detta datum, prova välja ett annat datum</h4>
      )}
    </div>
  );
}
