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
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioChecked, setRadioChecked] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const debounceSearch = useDebounce(search);

  useEffect(() => {
    async function getBooking() {
      const result = await authGet("/api/auth/admin/getUserByEmail/"
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
    if(formBody?.userRole === "ADMIN") setCheckboxChecked(true);
    else setCheckboxChecked(false);
  }, [formBody])

  function handleInputChange(e) {
    setKey(e.target.name);
    setValue(e.target.value);
  }

  function handleUserRole() {
    if(checkboxChecked) {
      setChanges({ ...changes, userRole: "USER"});
      setCheckboxChecked(false);
    }else {
      setChanges({ ...changes, userRole: "ADMIN"});  
      setCheckboxChecked(true);
    }
  }

  function handleRadioCheck() {
    if(radioChecked) {
      setDisabled(true);
      setRadioChecked(false);
    }else {
      setDisabled(false); 
      setRadioChecked(true);
    }
  }

  async function deleteMember() {
    
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
      "/api/auth/admin/editMember",
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
              <div className="custom-btns-container"> 
                <div className="custom-checkbox" onClick={handleUserRole}>
                  <input className="checkbox" name="checkbox" type="checkbox" checked={checkboxChecked} readOnly></input>
                  <label htmlFor="checkbox" className="checkbox-lbl"></label>
                </div>
                <div className="custom-radio"  onClick={handleRadioCheck}>
                  <input className="radio" name="radio" type="checkbox" checked={radioChecked} readOnly></input>
                  <label htmlFor="radio" className="radio-lbl"></label>
                  <button disabled={disabled} className="delete-member-btn" onClick={deleteMember}>Radera användare</button>
                </div>
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
