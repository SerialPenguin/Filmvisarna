import { useEffect, useState } from "react";
import { adminPost } from "../../../hooksAndUtils/fetchUtil";
import './HandleMembers.css';

export default function AddMemberComponent(props) {
  const [value, setValue] = useState();
  const [key, setKey] = useState();
  const [formBody, setFormBody] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormBody({ ...formBody, [key]: value });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  function handleInputChange(e) {
    setKey(e.target.name);
    setValue(e.target.value);
  }

  async function addMember(e) {
    e.preventDefault();

    for (let key in formBody) {
      if (formBody[key] === undefined) {
        delete formBody[key];
      }
    }

    const result = await adminPost(
      "/api/auth/admin/lagg-till-medlem",
      formBody,
      props.token
    );

    if(result.status === 200){
      props.memberRef.close();
      props.setOptionState("non");
    }else {
      setMessage(result.msg);

      setTimeout(() => {
        setMessage("");
      }, 4000)
    }
  }

  return (
    <div className="add-member-container">
      {!message && (
      <form className="member-form" onSubmit={addMember}>
        <label className="lbl" htmlFor="firstName">Förnamn:</label>
        <input className="input" onChange={handleInputChange} value={formBody.firstName || ""} name="firstName"/>
        <label className="lbl" htmlFor="lastName">Efternamn:</label>
        <input className="input" onChange={handleInputChange} value={formBody.lastName || ""} name="lastName"/>
        <label className="lbl" htmlFor="emailAdress">Email:</label>
        <input className="input" onChange={handleInputChange} value={formBody.emailAdress || ""} name="emailAdress"/>
        <button className="add-member-btn">Registrera medlem</button>
      </form>
      )}
      {message && (
        <p className="error-msg">{message}</p>
      )}
    </div>
  )
}
