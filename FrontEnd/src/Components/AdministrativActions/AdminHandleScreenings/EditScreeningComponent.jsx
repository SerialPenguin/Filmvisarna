import { useEffect, useState } from "react";
import { get } from "../../../hooksAndUtils/fetchUtil";

export default function EditScreeningComponent() {
  const [screenings, setScreenings] = useState([]);
  const [allMovies, setAllMovies] = useState();
  const [formState, setFormState] = useState("pick-movie");

  useEffect(() => {
    async function setItems() {
      setAllMovies(await get("/api/movies"));
    }

    setItems();
  }, []);

  async function getScreeningFromTitle() {
    setScreenings(await get);
  }

  return (
    <div>
      {formState === "pick-movie" && (
        <div className="movies-container">
          {allMovies?.map((movie) => (
            <p
              className="movie-para"
              onClick={() => {
                setFormState("pick-screening");
              }}
              key={movie.title}
              id={movie.title}>
              {movie.title}
            </p>
          ))}
        </div>
      )}
      {formState === "pick-screening" && (
        <div className="screenings-container">
          {allScreenings?.map((screening) => (
            <p
              className="screening-para"
              // onClick={() => {
              //   setFormState("pick-salon");
              // }}
              key={screening._id}
              id={screening._id}>
              {screening._id}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
