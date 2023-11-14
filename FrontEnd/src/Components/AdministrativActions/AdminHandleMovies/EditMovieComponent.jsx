import { useEffect, useState } from "react";
import { get, patch } from "../../../hooksAndUtils/fetchUtil";

export default function EditMovieComponent(props) {
  const [formState, setFormState] = useState("pick");
  const [value, setValue] = useState();
  const [key, setKey] = useState();
  const [movies, setMovies] = useState();
  const [changes, setChanges] = useState({});
  const [formBody, setFormBody] = useState({});

  useEffect(() => {
    for (let key in formBody) {
      if (formBody[key] === undefined) {
        delete formBody[key];
      }
    }

    setFormBody({ ...formBody, [key]: value });
    setChanges({ ...changes, [key]: value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  useEffect(() => {
    async function getMovies() {
      setMovies(await get("/api/movies"));
    }

    getMovies();
  }, []);

  function handleInputChange(e) {
    setKey(e.target.name);
    setValue(e.target.value);
  }

  async function handleMovieInfo(e) {
    e.preventDefault();
    setChanges({ ...changes, title: e.target.id });
    setFormBody(await get("/api/search/auth/admin/getMovie/" + e.target.id));

    setFormState("edit");
  }

  async function editMovie(e) {
    e.preventDefault();
    if (formState === "edit") {
      for (let key in changes) {
        if (changes[key] === undefined) {
          delete changes[key];
        }
      }

      const result = await patch(
        "/api/movies/auth/admin/editMovie",
        changes,
        props.token
      );
      console.log("Result: ", result);
      props.movieRef.close();
      props.setOptionState("non");
    }
  }

  return (
    <div className="edit-movie-container">
      {formState === "pick" && (
        <div className="movies-container">
          {movies?.map((movie) => (
            <p
              className="movie-para"
              onClick={handleMovieInfo}
              key={movie.title}
              id={movie.title}>
              {movie.title}
            </p>
          ))}
        </div>
      )}
      {formState === "edit" && (
        <form onSubmit={editMovie} className="edit-movie-form">
          <label className="lbl" htmlFor="title">
            Titel:
          </label>
          <input
            value={formBody.title || ""}
            onChange={handleInputChange}
            className="title-input"
            name="title"></input>
          <label className="lbl" htmlFor="productionCountries">
            Produktions land:
          </label>
          <input
            value={formBody.productionCountries || ""}
            onChange={handleInputChange}
            className="prod-ctry-input"
            name="productionCountries"></input>
          <label className="lbl" htmlFor="productionYear">
            Produktions år:
          </label>
          <input
            value={formBody.productionYear || ""}
            onChange={handleInputChange}
            className="prod-year-input"
            name="productionYear"></input>
          <label className="lbl" htmlFor="length">
            Längd (minuter):
          </label>
          <input
            value={formBody.length || ""}
            onChange={handleInputChange}
            className="length-input"
            name="length"></input>
          <label className="lbl" htmlFor="genre">
            Genre:
          </label>
          <textarea
            value={formBody.genre || ""}
            onChange={handleInputChange}
            className="genre-textarea"
            name="genre"></textarea>
          <label className="lbl" htmlFor="distributor">
            Distributör:
          </label>
          <input
            value={formBody.distributor || ""}
            onChange={handleInputChange}
            className="dist-input"
            name="distributor"></input>
          <label className="lbl" htmlFor="language">
            Språk:
          </label>
          <input
            value={formBody.language || ""}
            onChange={handleInputChange}
            className="lang-input"
            name="language"></input>
          <label className="lbl" htmlFor="subtitles">
            Undertext språk:
          </label>
          <input
            value={formBody.subtitles || ""}
            onChange={handleInputChange}
            className="sub-input"
            name="subtitles"></input>
          <label className="lbl" htmlFor="director">
            Regissör:
          </label>
          <input
            value={formBody.director || ""}
            onChange={handleInputChange}
            className="director-input"
            name="director"></input>
          <label className="lbl" htmlFor="actors">
            Skådespelare:
          </label>
          <textarea
            value={formBody.actors || ""}
            onChange={handleInputChange}
            className="actors-textarea"
            name="actors"></textarea>
          <label className="lbl" htmlFor="description">
            Beskrivning:
          </label>
          <textarea
            value={formBody.description || ""}
            onChange={handleInputChange}
            className="desc-textarea"
            name="description"></textarea>
          <label className="lbl" htmlFor="images">
            Bild url:
          </label>
          <input
            value={formBody.images || ""}
            onChange={handleInputChange}
            className="img-input"
            name="images"></input>
          <label className="lbl" htmlFor="youtubeTrailers">
            Trailer url:
          </label>
          <input
            value={formBody.youtubeTrailers || ""}
            onChange={handleInputChange}
            className="trailer-input"
            name="youtubeTrailers"></input>
          <label className="lbl" htmlFor="age">
            Ålder från:
          </label>
          <input
            type="number"
            value={formBody.age || ""}
            onChange={handleInputChange}
            className="age-input"
            name="age"></input>
          <button className="edit-movie-btn">Spara ändringar</button>
        </form>
      )}
    </div>
  );
}
