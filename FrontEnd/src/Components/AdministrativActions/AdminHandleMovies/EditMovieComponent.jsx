import { useEffect, useState } from "react"
import { get, patch } from '../../../hooksAndUtils/fetchUtil';

export default function EditMovieComponent(props) {

  const [formState, setFormState] = useState('search');
  const [value, setValue] = useState();
  const [key, setKey] = useState();
  const [changes, setChanges] = useState({});
  const [formBody, setFormBody] = useState({});

  useEffect(() => {

    for (let key in formBody) {
      if (formBody[key] === undefined) {
        delete formBody[key];
      }
    }

    for (let key in changes) {
      if (changes[key] === undefined) {
        delete changes[key];
      }
    }

    setFormBody({ ...formBody, [key]: value });
    setChanges({ ...changes, [key]: value });
  }, [key, value]);

  function handleInputChange(e) {
    setKey(e.target.name);
    setValue(e.target.value);
  }

  async function handleSubmits(e) {
    e.preventDefault();

    if(formState === 'search') {
      formBody.search = formBody.search.split(" ").join("");
      setFormBody(await get('/api/search/admin/getMovie/' + formBody.search));
      setFormState('edit');

    }else if(formState === 'edit') {
      console.log("CHANGES: ", changes);
      const result = await patch('/api/movies/auth/admin/editMovie', changes, props.token);
      console.log("RESULT: ", result);
      
    }
  }

  return (
    <div>
      {formState === 'search' && (
        <form className="search-form" onSubmit={handleSubmits}> 
          <label className='lbl' htmlFor="searchInput">Sök på titel:</label>
          <input autoFocus className="search-input" onChange={handleInputChange} name="search"></input>
          <button className="search-btn">Sök</button>
        </form>
      )}
      {formState === 'edit' && (
         <form onSubmit={handleSubmits} className='add-movie-form'>
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
            <label className="lbl" htmlFor='actors'>Skådespelare:</label>
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
            <button className='edit-movie-btn'>Spara ändringar</button>
          </form>
      )} 
    </div>
  )
}
