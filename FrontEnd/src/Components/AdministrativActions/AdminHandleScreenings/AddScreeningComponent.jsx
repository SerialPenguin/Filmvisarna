import { useEffect, useState } from "react";
import { adminPost, authGet, get } from "../../../hooksAndUtils/fetchUtil";

export default function AddScreeningComponent(props) {
  const [value, setValue] = useState();
  const [key, setKey] = useState();
  const [movies, setMovies] = useState();
  const [salons, setSalons] = useState();
  const [formBody, setFormBody] = useState({});
  const [formState, setFormState] = useState("pick-movie");

  useEffect(() => {
    for (let key in formBody) {
      if (formBody[key] === undefined) {
        delete formBody[key];
      }
    }

    setFormBody({ ...formBody, [key]: value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  useEffect(() => {
    async function getMovies() {
      setMovies(await get("/api/movies"));
      setSalons(await authGet("/api/search/auth/admin/getSalon", props.token));
    }

    getMovies();
  }, []);

  function handleInputChange(e) {
    setKey(e.target.name);
    setValue(e.target.value);
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
      "/api/movies/auth/admin/addMovie",
      formBody,
      props.token
    );
    console.log("PM: ", postMovie);

    props.movieRef.close();
    props.setOptionState("non");
  }

  console.log(formBody);

  return (
    <div className="edit-movie-container">
      {formState === "pick-movie" && (
        <div className="movies-container">
          {movies?.map((movie) => (
            <p
              className="movie-para"
              onClick={() => {
                setFormBody({ ...formBody, id: movie._id });
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
                setFormBody({ ...formBody, salon: salon._id });
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
            type="number"
            value={formBody.startTime || ""}
            onChange={handleInputChange}
            className="start-time-input"
            name="startTime"></input>
          <label className="lbl" htmlFor="endTime">
            Sluttid:
          </label>
          <input
            type="number"
            value={formBody.endTime || ""}
            onChange={handleInputChange}
            className="end-time-input"
            name="endTime"></input>
          <button className="add-screening-btn">Lägg till visning</button>
        </form>
      )}
    </div>
  );
}
