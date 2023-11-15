import { useEffect, useState } from "react";
import { authGet } from "../../../hooksAndUtils/fetchUtil";


export default function HandleBookings() {

  const [query, setQuery] = useState();
  const [key, setKey] = useState();
  const [value, setValue] = useState();

  useEffect(() => {
    setQuery({ ...query, [key]: value });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  function handleInputChange(e) {
    setKey(e.target.name);
    setValue(e.target.value);

    setTimeout(() => {
      authGet
    }, 2000)
  }

  return (
    <div>
      <h4 className="find-booking-header">Hitta bokning</h4>
        <form>
          <label className="find-booking-lbl">Sök på bokningsnummer</label>
          <input className="booking-num-input" value={query || ""} onChange={handleInputChange}></input>
        </form>
    </div>
  )
}
