import { useEffect, useState } from "react";
import { adminPost } from "../../../hooksAndUtils/fetchUtil";

export default function AddMovieComponent(props) {

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

  async function addMovie(e) {
    e.preventDefault();

    for (let key in formBody) {
      if (formBody[key] === undefined) {
        delete formBody[key];
      }
    }

    formBody.productionCountries = formBody.productionCountries.split(",");
    formBody.actors = formBody.actors.split(",");
    formBody.images = formBody.images.split(",");
    formBody.youtubeTrailers = formBody.youtubeTrailers.split(",");
    formBody.reviews = formBody.reviews.split(",");

    console.log("FB: ",formBody)

    const postMovie = await adminPost('/api/movies/auth/admin/addMovie', formBody, props.token);
    console.log("PM: ", postMovie);
  }

  return (
    <div className='add-movie-container'>
          <form onSubmit={addMovie} className='add-movie-form'>
            <label className="lbl" htmlFor='title'>Titel:</label>
            <input value={formBody.title || ""} onChange={handleInputChange} className='title-input' name="title"></input>
            <label className="lbl" htmlFor='productionCountries'>Produktions land:</label>
            <input value={formBody.productionCountries || ""} onChange={handleInputChange} className='prod-ctry-input' name="productionCountries"></input>
            <label className="lbl" htmlFor='productionYear'>Produktions år:</label>
            <input value={formBody.productionYear || ""} onChange={handleInputChange} className='prod-year-input' name="productionYear"></input>
            <label className="lbl" htmlFor='length'>Längd (minuter):</label>
            <input value={formBody.length || ""} onChange={handleInputChange} className='length-input' name="length"></input>
            <label className="lbl" htmlFor='genre'>Genre:</label>
            <textarea value={formBody.genre || ""} onChange={handleInputChange} className='genre-textarea' name="genre"></textarea>
            <label className="lbl" htmlFor='distributor'>Distributör:</label>
            <input value={formBody.distributor || ""} onChange={handleInputChange} className='dist-input' name="distributor"></input>
            <label className="lbl" htmlFor='language'>Språk:</label>
            <input value={formBody.language || ""} onChange={handleInputChange} className='lang-input' name="language"></input>
            <label className="lbl" htmlFor='subtitles'>Undertext språk:</label>
            <input value={formBody.subtitles || ""} onChange={handleInputChange} className='sub-input' name="subtitles"></input>
            <label className="lbl" htmlFor='director'>Regissör:</label>
            <input value={formBody.director || ""} onChange={handleInputChange} className='director-input' name="director"></input>
            <label className="lbl" htmlFor='actors'>Skådespelerskor/Skådespelare:</label>
            <textarea value={formBody.actors || ""} onChange={handleInputChange} className='actors-textarea' name="actors"></textarea>
            <label className="lbl" htmlFor='description'>Beskrivning:</label>
            <textarea value={formBody.description || ""} onChange={handleInputChange} className='desc-textarea' name="description"></textarea>
            <label className="lbl" htmlFor='images'>Bild url:</label>
            <input value={formBody.images || ""} onChange={handleInputChange} className='img-input' name="images"></input>
            <label className="lbl" htmlFor='youtubeTrailers'>Trailer url:</label>
            <input value={formBody.youtubeTrailers || ""} onChange={handleInputChange} className='trailer-input' name="youtubeTrailers"></input>
            <label className="lbl" htmlFor='reviews'>Recensioner:</label>
            <input value={formBody.reviews || ""} onChange={handleInputChange} className='review-input' name="reviews"></input>
            <label className="lbl" htmlFor='age'>Ålder från:</label>
            <input type="number" value={formBody.age || ""} onChange={handleInputChange} className='age-input' name="age"></input>
            <button className='add-movie-btn'>Lägg till film</button>
          </form>
        </div>
  )
}
