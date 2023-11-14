import OptionsComponent from "../OptionsComponent/OptionsComponent";
import AddScreeningComponent from "./AddScreeningComponent";
import EditScreeningComponent from "./EditScreeningComponent";

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
      {props.optionState === "edit" && (
        <div>
          <h4>Redigera {props.topic}</h4>
          <EditScreeningComponent
            token={props.token}
            screeningRef={props.screeningRef}
            setOptionState={props.setOptionState}
          />
        </div>
      )}
      {props.optionState === "delete" && <div>Delete</div>}
    </div>
  );
}
