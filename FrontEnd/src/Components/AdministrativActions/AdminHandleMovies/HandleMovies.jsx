import { useEffect, useState } from 'react';
import OptionsComponent from '../OptionsComponent/OptionsComponent.jsx'
import AddMovieComponent from './AddMovieComponent.jsx';
import './HandleMovies.css';
import EditMovieComponent from './EditMovieComponent.jsx';

export default function HandleMovies(props) {

  const [token, setToken] = useState();


  useEffect(() => {
    setToken(sessionStorage.getItem("JWT_TOKEN"));
  }, [])
  

  return (
    <div>
      {props.optionState === 'non' && (
        <OptionsComponent optionState={props.optionState} setOptionState={props.setOptionState} topic={props.topic}/>
      )}
      {props.optionState === 'add' && (
        <AddMovieComponent token={token}/>
      )}
      {props.optionState === 'edit' && (
        <EditMovieComponent token={token} />
      )}
      {props.optionState === 'delete' && (
        <div>Delete</div>
      )}
    </div>
  )
}
