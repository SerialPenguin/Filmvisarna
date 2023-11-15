import { useEffect, useRef, useState } from "react";
import { authGet, del, get } from "../../../hooksAndUtils/fetchUtil";

export default function DeleteMovieComponent(props) {
  const [formState, setFormState] = useState("pick-movie");
  const [movies, setMovies] = useState();
  const [screenings, setScreenings] = useState();
  const [param, setParam] = useState();
  const [status, setStatus] = useState();

  const dialogRef = useRef();

  useEffect(() => {
    async function getMovies() {
      setMovies(await get("/api/movies"));
    }

    getMovies();
  }, []);

  async function handleMoviePick(e) {
    e.preventDefault();
    setParam(e.target.id);
    setScreenings(
      await authGet(
        "/api/search/auth/admin/getScreening/" + e.target.id,
        props.token
      )
    );
    setFormState("pick-screening");
  }

  function openWarning(e) {
    setParam(e.target.id);
    dialogRef.current?.showModal();
  }

  async function deleteScreening() {
    console.log(param);
    const result = await del(
      "/api/screenings/auth/admin/deleteScreening/" + param,
      props.token
    );
    
    if(result.status === 200) {
      dialogRef.current?.close();
      props.screeningRef.close();
      props.setOptionState("non")
    }else if(result.status === 403) {
      setStatus(403)
      setTimeout(() => {
        setStatus();
      }, 4000);
    }
    
  }

  return (
    <div>
      {formState === "pick-movie" && (
        <div className="movies-container">
          {movies?.map((movie) => (
            <p
              className="movie-para"
              onClick={handleMoviePick}
              key={movie.title}
              id={movie.title}>
              {movie.title}
            </p>
          ))}
        </div>
      )}
      {screenings?.map((screening) => (
        <p
          className="screening-para"
          onClick={openWarning}
          key={screening._id}
          id={screening._id}>
          {`ID: ${screening._id}`}
          {`\nStarttid: ${screening.startTime
            .slice(0, -8)
            .replace("T", " : ")}`}
          {`\nSluttid: ${screening.endTime.slice(0, -8).replace("T", " : ")}`}
        </p>
      ))}
      {formState === "pick-screening" && (
        <dialog className="dialog" ref={dialogRef}>
          {status !== 403 && (
            <div>
              <h4 className="delete-title">
                Du är påväg att radera visning med id: {param}
              </h4>
              <p className="warning-para">Är du säker?</p>
              <p className="warning-para">Det här valet går inte att ångra.</p>
              <button className="delete-btn" onClick={deleteScreening}>
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
            </div>
          )}
          {status === 403 && (
            <h4 className="screening-para">Den här visningen innehåller bokningar och kan därför inte raderas.</h4>
          )}
        </dialog>
      )}
    </div>
  );
}
