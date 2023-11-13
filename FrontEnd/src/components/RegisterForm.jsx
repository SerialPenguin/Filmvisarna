import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../service/authService";
import '../pages/Register.css'

function RegisterForm() {
  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    emailAdress: "",
    password: "",
  });

  const navigate = useNavigate();
  const [registerMessage, setRegisterMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await authService.handleRegister(e, credentials);
    
    if (result === true) {
      setTimeout(() => navigate("/"), 1500);
      setRegisterMessage("Du har blivit medlem!");
    } else {
      setRegisterMessage(
        "Den angivna e-postadressen finns redan, vänligen logga in eller försök med en annan e-postadress"
      );
    }
  };

  return (
    <>
       <form className="form-container">
        {registerMessage && <p className="register-msg">{registerMessage}</p>}
        <div className="input-container">
          <label className="login-lbl">Förnamn</label>
          <input
            required
            type="text"
            name="first-name"
            className="login-field first"
            onChange={(e) =>
              setCredentials({ ...credentials, firstName: e.target.value })
            }
          />
          <label className="login-lbl">Efternamn</label>
          <input
            required
            type="text"
            name="last-name"
            className="login-field first"
            onChange={(e) =>
              setCredentials({ ...credentials, lastName: e.target.value })
            }
          />
          <label className="login-lbl">E-postadress</label>
          <input
            required
            type="email"
            name="mail"
            className="login-field first"
            onChange={(e) =>
              setCredentials({ ...credentials, emailAdress: e.target.value })
            }
          />
          <label className="login-lbl">Lösenord</label>
          <input
            required
            type="password"
            name="password"
            className="login-field"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
        </div>
        <p className="register-p">
          Redan medlem? <Link to={"/login"} className="register-p-link">Klicka här</Link>
        </p>  
      </form>
      <div className="btn-container">
        <button className="main-btn" type="submit" onClick={handleSubmit}>
          Bli medlem
        </button>
        <Link to={"/"}>
          <button className="sec-btn">Avbryt</button>
        </Link>
      </div>
    </>
  );
}

export default RegisterForm;