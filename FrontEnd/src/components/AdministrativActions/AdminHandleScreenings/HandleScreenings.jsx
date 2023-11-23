import OptionsComponent from "../OptionsComponent/OptionsComponent";
import AddScreeningComponent from "./AddScreeningComponent";
import DeleteScreeningComponent from "./DeleteScreeningComponent";

export default function HandleScreenings(props) {
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
          <AddScreeningComponent
            token={props.token}
            screeningRef={props.screeningRef}
            setOptionState={props.setOptionState}
          />
        </div>
      )}
      {props.optionState === "delete" && (
        <div>
          <h4 className="option-title">Radera {props.topic}</h4>
          <DeleteScreeningComponent
            token={props.token}
            screeningRef={props.screeningRef}
            setOptionState={props.setOptionState}
          />
        </div>
      )}
    </div>
  );
}
