import "./OptionsComponent.css";

export default function OptionsComponent(props) {
  return (
    <div className="top-container">
      {props.optionState === "non" && (
        <div>
          {props.topic !== "bokning" && (
            <div className="state-options">
              <p className="option" onClick={() => props.setOptionState("add")}>
                Lägg till {props.topic}
              </p>
              {props.topic !== "visning" && (
                <p
                  className="option"
                  onClick={() => props.setOptionState("edit")}>
                  Redigera {props.topic}
                </p>
              )}
              {props.topic !== "medlem" && (
                <p
                  className="option"
                  onClick={() => props.setOptionState("delete")}>
                  Ta bort {props.topic}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
