import { useEffect, useState } from 'react';
import OptionsComponent from '../OptionsComponent/OptionsComponent.jsx'
import './HandleMovies.css';

export default function HandleMovies(props) {

  const [value, setValue] = useState();
  const [key, setKey] = useState();
  const [formBody, setFormBody] = useState({});


  useEffect(() => {
    setFormBody({ ...formBody, [key]: value });
  }, [key, value]);

  function handleInputChange(e) {
    setKey(e.target.name);
    setValue(e.target.value);
  }

  function addMovie(e) {
    e.preventDefault();

    for (let key in formBody) {
      if (formBody[key] === undefined) {
        delete formBody[key];
      }
    }

    formBody.prodCtry = formBody.prodCtry.split(",");
    formBody.actors = formBody.actors.split(",");
    formBody.img = formBody.img.split(",");
    formBody.trailer = formBody.trailer.split(",");
    formBody.review = formBody.review.split(",");

    console.log("FB: ",formBody)
  }

  return (
    <div>
      {props.optionState === 'non' && (
        <OptionsComponent optionState={props.optionState} setOptionState={props.setOptionState} topic={props.topic}/>
      )}
      {props.optionState === 'add' && (
        <div className='add-movie-container'>
          <form onSubmit={addMovie} className='add-movie-form'>
            <label className="lbl" htmlFor='title'>Titel:</label>
            <input value={formBody.title || ""} onChange={handleInputChange} className='title-input' name="title"></input>
            <label className="lbl" htmlFor='prodCtry'>Produktions land:</label>
            <input value={formBody.prodCtry || ""} onChange={handleInputChange} className='prod-ctry-input' name="prodCtry"></input>
            <label className="lbl" htmlFor='prodYear'>Produktions år:</label>
            <input type='number' value={formBody.prodYear || ""} onChange={handleInputChange} className='prod-year-input' name="prodYear"></input>
            <label className="lbl" htmlFor='length'>Längd (minuter):</label>
            <input type='number' value={formBody.length || ""} onChange={handleInputChange} className='length-input' name="length"></input>
            <label className="lbl" htmlFor='genre'>Genre:</label>
            <textarea value={formBody.genre || ""} onChange={handleInputChange} className='genre-textarea' name="genre"></textarea>
            <label className="lbl" htmlFor='dist'>Distributör:</label>
            <input value={formBody.dist || ""} onChange={handleInputChange} className='dist-input' name="dist"></input>
            <label className="lbl" htmlFor='lang'>Språk:</label>
            <input value={formBody.lang || ""} onChange={handleInputChange} className='lang-input' name="lang"></input>
            <label className="lbl" htmlFor='sub'>Undertext språk:</label>
            <input value={formBody.sub || ""} onChange={handleInputChange} className='sub-input' name="sub"></input>
            <label className="lbl" htmlFor='director'>Regissör:</label>
            <input value={formBody.director || ""} onChange={handleInputChange} className='director-input' name="director"></input>
            <label className="lbl" htmlFor='actors'>Skådespelerskor/Skådespelare:</label>
            <textarea value={formBody.actors || ""} onChange={handleInputChange} className='actors-textarea' name="actors"></textarea>
            <label className="lbl" htmlFor='desc'>Beskrivning:</label>
            <textarea value={formBody.desc || ""} onChange={handleInputChange} className='desc-textarea' name="desc"></textarea>
            <label className="lbl" htmlFor='img'>Bild url:</label>
            <input value={formBody.img || ""} onChange={handleInputChange} className='img-input' name="img"></input>
            <label className="lbl" htmlFor='trailer'>Trailer url:</label>
            <input value={formBody.trailer || ""} onChange={handleInputChange} className='trailer-input' name="trailer"></input>
            <label className="lbl" htmlFor='review'>Recensioner:</label>
            <input value={formBody.review || ""} onChange={handleInputChange} className='review-input' name="review"></input>
            <label className="lbl" htmlFor='age'>Ålder från:</label>
            <input type="number" value={formBody.age || ""} onChange={handleInputChange} className='age-input' name="age"></input>
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
