import OptionsComponent from "../OptionsComponent/OptionsComponent"
import AddMemberComponent from '../AdminHandleMembers/AddMemberComponent';

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
        <div>Edit</div>
      )}
      {props.optionState === 'delete' && (
        <div>Delete</div>
      )}
    </div>
  )
}
