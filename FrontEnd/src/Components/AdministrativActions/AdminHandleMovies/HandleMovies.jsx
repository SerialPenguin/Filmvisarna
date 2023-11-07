import OptionsComponent from '../OptionsComponent/OptionsComponent.jsx'
import './HandleMovies.css';

export default function HandleMovies(props) {
  return (
    <div>
      {props.optionState === 'non' && (
        <OptionsComponent optionState={props.optionState} setOptionState={props.setOptionState} topic={props.topic}/>
      )}
      {props.optionState === 'add' && (
        <div className='add-movie-container'>
          <form className='add-movie-form'>
            <label className="lbl" htmlFor='title'>Titel:</label>
            <input className='title-input' name="title"></input>
            <label className="lbl" htmlFor='prod-ctry'>Produktions land:</label>
            <input className='prod-ctry-input' name="prod-ctry"></input>
            <label className="lbl" htmlFor='prod-year'>Produktions år:</label>
            <input className='prod-year-input' name="prod-year"></input>
            <label className="lbl" htmlFor='length'>Längd:</label>
            <input className='length-input' name="length"></input>
            <label className="lbl" htmlFor='genre'>Genre:</label>
            <input className='genre-input' name="genre"></input>
            <label className="lbl" htmlFor='dist'>Distributör:</label>
            <input className='dist-input' name="dist"></input>
            <label className="lbl" htmlFor='lang'>Språk:</label>
            <input className='lang-input' name="lang"></input>
            <label className="lbl" htmlFor='sub'>Undertext språk:</label>
            <input className='sub-input' name="sub"></input>
            <label className="lbl" htmlFor='director'>Regissör:</label>
            <input className='director-input' name="director"></input>
            <label className="lbl" htmlFor='actors'>Skådespelerskor/Skådespelare:</label>
            <textarea className='actors-input' name="actors"></textarea>
            <label className="lbl" htmlFor='desc'>Beskrivning:</label>
            <textarea className='desc-textarea' name="desc"></textarea>
            <label className="lbl" htmlFor='img'>Bild url:</label>
            <input className='img-input' name="img"></input>
            <label className="lbl" htmlFor='trailer'>Trailer url:</label>
            <input className='trailer-input' name="trailer"></input>
            <label className="lbl" htmlFor='review'>Recensioner:</label>
            <input className='review-input' name="review"></input>
            <label className="lbl" htmlFor='age'>Ålder från:</label>
            <input className='age-input' name="age"></input>
            <button className='add-movie-btn'>Lägg till film</button>
          </form>
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
