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
        <div>
          <h4 className='option-title'>Lägg till film</h4>
          <AddMovieComponent token={token}/>
        </div>
      )}
      {props.optionState === 'edit' && (
        <div>
          <h4 className='option-title'>Redigera film</h4>
          <EditMovieComponent token={token} />
        </div>
      )}
      {props.optionState === 'delete' && (
        <div>Delete</div>
      )}
    </div>
  )
}
