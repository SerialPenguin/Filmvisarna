import { useRef, useState } from "react";
import { del } from "../../../hooksAndUtils/fetchUtil";
import { useGet } from "../../../hooksAndUtils/useFetch";

export default function DeleteMovieComponent(props) {
  const [movies, setMovies] = useState();
  const [param, setParam] = useState();

  const dialogRef = useRef();

  useGet("/api/movies", (data) => {
    setMovies(data);
  });

  function openWarning(e) {
    setParam(e.target.id);
    dialogRef.current?.showModal();
  }

  async function deleteMovie() {
    await del(
      "/api/auth/admin/deleteMovie/" + param,
      props.token
    );
    
    dialogRef.current?.close();
    props.movieRef.close();
    props.setOptionState("non");
  }

  return (
    <div className="movies-container">
      {movies?.map((movie) => (
        <p
          className="movie-para"
          onClick={openWarning}
          key={movie.title}
          id={movie.title}>
          {movie.title}
        </p>
      ))}
      <dialog className="dialog" ref={dialogRef}>
        <h4 className="delete-title">Du är påväg att radera {param}</h4>
        <p className="warning-para">Är du säker?</p>
        <p className="warning-para">Det här valet går inte att ångra.</p>
        <button className="delete-btn" onClick={deleteMovie}>
          Ta bort
        </button>
        <button
          className="back-btn"
          onClick={() => {
            dialogRef.current?.close();
            setParam();
          }}>
          Backa
        </button>
      </dialog>
    </div>
  );
}
