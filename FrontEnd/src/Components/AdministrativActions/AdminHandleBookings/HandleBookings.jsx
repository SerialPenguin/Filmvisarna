import { useEffect, useState } from "react";


export default function HandleBookings() {

  const [query, setQuery] = useState();

  useEffect(() => {
    setFormBody({ ...query, [key]: value });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  function handleInputChange(e) {
    setKey(e.target.name);
    setValue(e.target.value);
  }

  return (
    <div>
        <div></div>
    </div>
  )
}
