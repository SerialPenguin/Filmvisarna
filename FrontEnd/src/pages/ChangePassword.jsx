import { useState } from "react"
import { patchPw } from "../hooksAndUtils/fetchUtil";
import { useNavigate } from "react-router-dom";
import './ChangePassword.css';

export default function ChangePassword() {
  const [formBody, setFormBody] = useState();
  const [confPassword, setConfPassword] = useState();
  const [errMessage, setErrMessage] = useState();
  const [succMessage, setSuccMessage] = useState();
  
  const navigate = useNavigate();

  sessionStorage.removeItem("JWT_TOKEN");

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[A-Z]).{8,}$/;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!passwordRegex.test(formBody.password)) {
      setErrMessage(
        "Lösenordet måste innehålla minst 8 tecken, en bokstav, en siffra och en stor bokstav"
      );
      return;
    }

    if(confPassword === formBody.password) {

      const result =  await patchPw("/api/auth/changePassword", formBody);

      if(result.status === 200) {
        setSuccMessage(result.msg);
        setTimeout(() => {
          setSuccMessage();
          navigate("/logga-in");
        }, 3000);
      }else {
        setErrMessage(result.msg);
        setTimeout(() => {
          setErrMessage();
        }, 3000);
      }

    }else {
      setErrMessage("Kontrollera att du skrivit rätt lösenord båda fälten");
      setTimeout(() => {
        setErrMessage();
      }, 2000);
    }

  }

  return (
    <div className="change-pw-container">
      <h1 className="change-pw-header">Hejsan!</h1>
      <h2 className="change-pw-second_header">Här kan du byta ditt lösenord</h2>
      {errMessage && (
        <p className="err-message">{errMessage}</p>
      )}
      {succMessage && (
        <p className="succ-message">{succMessage}</p>
      )}
      <form className="change-pw-form" onSubmit={handleSubmit}>
        <label className="lbl" htmlFor="email">Email</label>
        <input required className="input" onChange={(e) => setFormBody({ ...formBody, emailAdress: e.target.value })} value={formBody?.emailAdress || ""} name="email"></input>
        <label className="lbl" htmlFor="password">Nytt lösenord</label>
        <input required className="input" type="password" onChange={(e) => setFormBody({ ...formBody, password: e.target.value })} value={formBody?.password || ""} name="password"></input>
        <label className="lbl" htmlFor="confPassword">Bekräfta lösenord</label>
        <input required className="input" type="password" onChange={(e) => setConfPassword(e.target.value)} value={confPassword || ""} name="confPassword"></input>
        <button className="change-pw-btn">Byt lösenord</button>
      </form>
    </div>
  )
}
