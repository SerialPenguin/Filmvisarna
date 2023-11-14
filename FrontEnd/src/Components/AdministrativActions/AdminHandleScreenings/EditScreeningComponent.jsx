import { useEffect, useState } from "react";
import { authGet, get } from "../../../hooksAndUtils/fetchUtil";

export default function EditScreeningComponent(props) {
  const [screenings, setScreenings] = useState([]);
  const [allMovies, setAllMovies] = useState();
  // const [salons, setSalons] = useState();
  const [formState, setFormState] = useState("pick-movie");

  useEffect(() => {
    async function setItems() {
      setAllMovies(await get("/api/movies"));
      // setSalons(await authGet("/api/search/auth/admin/getSalon", props.token));
    }

    setItems();
  }, []);

  async function getScreeningFromTitle(e) {
    e.preventDefault();

    setScreenings(
      await authGet(
        "/api/search/auth/admin/getScreening/" + e.target.id,
        props.token
      )
    );

    console.log(screenings);

    setFormState("pick-screening");
  }

  return (
    <div>
      {formState === "pick-movie" && (
        <div className="movies-container">
          {allMovies?.map((movie) => (
            <p
              className="movie-para"
              onClick={getScreeningFromTitle}
              key={movie.title}
              name={movie.title}
              id={movie.title}>
              {movie.title}
            </p>
          ))}
        </div>
      )}
      {formState === "pick-screening" && (
        <div className="screenings-container">
          {screenings?.map((screening) => (
            <p
              className="screening-para"
              // onClick={() => {
              //   setFormState("pick-salon");
              // }}
              key={screening._id}
              id={screening._id}>
              Visningsid: {screening._id}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
