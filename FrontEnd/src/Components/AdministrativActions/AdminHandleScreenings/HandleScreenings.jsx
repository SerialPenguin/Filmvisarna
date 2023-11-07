import OptionsComponent from "../OptionsComponent/OptionsComponent"

export default function HandleScreenings(props) {
  return (
    <div>
      {props.optionState === 'non' && (
        <OptionsComponent optionState={props.optionState} setOptionState={props.setOptionState} topic={props.topic}/>
      )}
      {props.optionState === 'add' && (
        <div>Add</div>
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
