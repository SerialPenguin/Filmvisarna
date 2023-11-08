import { useEffect, useState } from "react"
import { get } from '../../../hooksAndUtils/fetchUtil';

export default function EditMovieComponent() {

  const [formState, setFormState] = useState('search');
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

  async function handleSubmits(e) {
    e.preventDefault();
    if(formState === 'search') {
      console.log(formBody.search)
      formBody.search = formBody.search.split(" ").join("");
      console.log(formBody.search)
      const result = await get('/api/search/admin/getMovie/' + formBody.search);
      console.log("Result: ", result);
      console.log("Search");
    }else if(formState === 'edit') {
      console.log("Edit");
    }
  }

  return (
    <div>
      {formState === 'search' && (
        <form className="search-form" onSubmit={handleSubmits}> 
          <label className='lbl' htmlFor="searchInput">Sök på titel:</label>
          <input className="search-input" onChange={handleInputChange} name="search"></input>
          <button className="search-btn">Sök</button>
        </form>
      )}
    </div>
  )
}
