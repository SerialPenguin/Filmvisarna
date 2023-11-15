import { useEffect, useState } from "react";


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
  }

  return (
    <div>
        <form>
          <h4>Sök på bokningsnummer</h4>
          <input></input>
        </form>
    </div>
  )
}
