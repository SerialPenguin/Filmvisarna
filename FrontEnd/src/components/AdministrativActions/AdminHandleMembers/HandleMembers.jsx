import OptionsComponent from "../OptionsComponent/OptionsComponent"
import AddMemberComponent from '../AdminHandleMembers/AddMemberComponent';
import EditMemberComponent from "./EditMemberComponent";

export default function HandleMembers(props) {
  return (
    <div>
      {props.optionState === 'non' && (
        <OptionsComponent optionState={props.optionState} setOptionState={props.setOptionState} topic={props.topic}/>
      )}
      {props.optionState === 'add' && (
        <div>
          <h4 className="option-title">Lägg till {props.topic}</h4>
          <AddMemberComponent
           token={props.token}
           movieRef={props.movieRef}
           setOptionState={props.setOptionState}
           memberRef={props.memberRef}
          />
        </div>
      )}
      {props.optionState === 'edit' && (
        <div>
          <h4 className="option-title">Redigera {props.topic}</h4>
          <EditMemberComponent
            token={props.token}
            movieRef={props.movieRef}
            setOptionState={props.setOptionState}
            memberRef={props.memberRef}
          />
        </div>
      )}
    </div>
  )
}
