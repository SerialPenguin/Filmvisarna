import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../service/authService";

function LoginForm() {
  const [credentials, setCredentials] = useState({
    emailAdress: "",
    password: "",
  });

  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await authService.handleLogin(e, credentials);
    
    if (result === true) {
      navigate("/");
    } else {
      setLoginMessage(
        "Fel e-postadress eller lösenord, var god försök igen"
      );
    }
  };

  return (
    <>
      <form className="form-container">
        {loginMessage && <p className="login-msg">{loginMessage}</p>} 
        <div className="input-container">
          <label className="login-lbl">E-postadress</label>
          <input
            type="email"
            name="mail"
            className="login-field first"
            onChange={(e) =>
              setCredentials({ ...credentials, emailAdress: e.target.value })
            }
          />

          <label className="login-lbl">Lösenord</label>
          <input
            type="password"
            name="password"
            className="login-field"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <p className="register-p">
            Inte medlem ännu? <Link to={"/register"} className="register-p-link">Klicka här</Link>
          </p>
        </div>
      </form>
      <div className="btn-container">
        <button className="main-btn" type="submit" onClick={handleSubmit}>
          Logga in
        </button>
        <Link to={"/"}>
          <button className="sec-btn">Avbryt</button>
        </Link>
      </div>
    </>
    
  );
}

export default LoginForm;
