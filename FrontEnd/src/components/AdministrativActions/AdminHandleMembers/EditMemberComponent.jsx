import { useEffect, useState } from "react";
import { authGet, patch } from "../../../hooksAndUtils/fetchUtil";
import { useDebounce } from "../../../hooksAndUtils/debounce";

export default function EditMemberComponent(props) {
  const [value, setValue] = useState();
  const [key, setKey] = useState();
  const [search, setSearch] = useState();
  const [message, setMessage] = useState("");
  const [changes, setChanges] = useState({});
  const [formBody, setFormBody] = useState({});
  const [formState, setFormState] = useState("searching");
  const [checked, setChecked] = useState(false);

  const debounceSearch = useDebounce(search);

  useEffect(() => {
    async function getBooking() {
      const result = await authGet("/api/auth/admin/hamta-medlem/" 
        + debounceSearch,
        props.token
      )
      if(result.status === 200) {
        setFormBody(result.user);
        setFormState("found");
      }else{
        setMessage(result.msg);
        setTimeout(() => {
          setMessage("");
          setFormBody();
        }, 3000); 
      }
    }

    if(search) getBooking();
  }, [debounceSearch]);

  useEffect(() => {
    for (let key in formBody) {
      if (formBody[key] === undefined) {
        delete formBody[key];
      }
    }

    setFormBody({ ...formBody, [key]: value });
    setChanges({ ...changes, [key]: value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  useEffect(() => {
    if(formBody?.userRole === "ADMIN") setChecked(true);
    else setChecked(false);
  }, [formBody])

  function handleInputChange(e) {
    setKey(e.target.name);
    setValue(e.target.value);
  }

  function handleUserRole() {
    if(checked) {
      setChanges({ ...changes, userRole: "USER"});
      setChecked(false);
    }else {
      setChanges({ ...changes, userRole: "ADMIN"});  
      setChecked(true);
    }
  }

  async function editMember(e) {
    e.preventDefault();
    for (let key in changes) {
      if (changes[key] === undefined) {
        delete changes[key];
      }
    }

    setChanges({ ...changes, _id: formBody._id})

    const result = await patch(
      "/api/auth/admin/redigera-medlem",
      changes,
      props.token
    );
    
    if(result.status === 200) {
      props.memberRef.close();
      props.setOptionState("non");
    }else {
      setTimeout(() => {
        setMessage(result.msg);
      }, 2000)
    }
    
  }

  return (
    <div>
      {!message && (
        <div className="edit-member-container">
          {formState === "searching" && (
            <div className="find-member-container">
              <form className="search-form">
                <label className="lbl">Sök på email</label>
                <input autoFocus className="member-email-input" value={search || ""} name="emailAdress" onChange={(e) => setSearch(e.target.value)}></input>
              </form>
            </div>
          )}
          {formState === "found" && (
            <form className="edit-member-form" onSubmit={editMember}>
              <label className="lbl" htmlFor="firstName">Förnamn:</label>
              <input
                value={formBody.firstName || ""}
                onChange={handleInputChange}
                className="input"
                name="firstName"></input>
              <label className="lbl" htmlFor="lastName">Efternamn:</label>
              <input
                value={formBody.lastName || ""}
                onChange={handleInputChange}
                className="input"
                name="lastName"></input>
              <label className="lbl" htmlFor="emailAdress">Email:</label>
              <input
                type="email"
                value={formBody.emailAdress || ""}
                onChange={handleInputChange}
                className="input"
                name="emailAdress"></input>
                <div className="slider" onClick={handleUserRole}>
                  <input className="checkbox" name="checkbox" type="checkbox" checked={checked} readOnly></input>
                  <label htmlFor="checkbox" className="checkbox-lbl"></label>
                </div>
              <button className="edit-member-btn">Spara ändringar</button>
              <button className="member-back-btn" onClick={() => {setSearch(""); setFormState("searching")}}>Backa</button>
            </form>
          )}
        </div>
      )}
      {message && (
        <p>{message}</p>
      )}
    </div>
  )
}
