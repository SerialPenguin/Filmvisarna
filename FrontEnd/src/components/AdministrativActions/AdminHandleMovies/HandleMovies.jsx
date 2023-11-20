import OptionsComponent from "../OptionsComponent/OptionsComponent.jsx";
import AddMovieComponent from "./AddMovieComponent.jsx";
import "./HandleMovies.css";
import EditMovieComponent from "./EditMovieComponent.jsx";
import DeleteMovieComponent from "./DeleteMovieComponent.jsx";

export default function HandleMovies(props) {
  return (
    <div>
      {props.optionState === "non" && (
        <OptionsComponent
          optionState={props.optionState}
          setOptionState={props.setOptionState}
          topic={props.topic}
        />
      )}
      {props.optionState === "add" && (
        <div>
          <h4 className="option-title">Lägg till {props.topic}</h4>
          <AddMovieComponent
            token={props.token}
            movieRef={props.movieRef}
            setOptionState={props.setOptionState}
          />
        </div>
      )}
      {props.optionState === "edit" && (
        <div>
          <h4 className="option-title">Redigera {props.topic}</h4>
          <EditMovieComponent
            token={props.token}
            movieRef={props.movieRef}
            setOptionState={props.setOptionState}
          />
        </div>
      )}
      {props.optionState === "delete" && (
        <div>
          <h4 className="option-title">Radera {props.topic}</h4>
          <DeleteMovieComponent
            token={props.token}
            movieRef={props.movieRef}
            setOptionState={props.setOptionState}
          />
        </div>
      )}
    </div>
  );
}
