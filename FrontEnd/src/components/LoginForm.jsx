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

  const handleLoginCallback = (errorMessage) => {
    if (errorMessage) {
      setLoginMessage(errorMessage);
    } else {
      navigate("/");
      location.reload();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.emailAdress || !credentials.password) {
      setLoginMessage("Alla fält måste vara ifyllda");
      return;
    }

    authService.handleLogin(e, credentials, handleLoginCallback);
    await authService.handleLogin(e, credentials, handleLoginCallback);
  };

  return (
    <>
      <form className="form-container">
        {loginMessage && <p className="login-msg">{loginMessage}</p>}
        <div className="input-container">
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
          <div className="links-container">
            <p className="change-pw">
              <Link to={"/byt-losen"} className="change-pw-link">
                Glömt lösenordet
              </Link>
              ?
            </p>
            <p className="register-p">
              Inte medlem ännu?{" "}
              <Link to={"/registrera"} className="register-p-link">
                Klicka här
              </Link>
            </p>
          </div>
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
