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
    const result = await authService.handleRegister(e, credentials);
    
    if (result === true) {
      navigate("/");
    } else {
      setLoginMessage(
        "fel e-postadresseller lösenord, försök igen"
      );
    }
  };

  return (
    <form>
      <label className="login-lbl">E-postadress</label>
      <input
        type="email"
        name="mail"
        placeholder="namn@example.com"
        className="login-field"
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

      {loginMessage && <p className="login-msg">{loginMessage}</p>}

      <p>
        Inte medlem ännu? <Link to={"/register"}>Klicka här</Link>
      </p>

      <button className="register-btn" type="submit" onClick={handleSubmit}>
        Bli medlem
      </button>
      <Link to={"/"}>
        <button>Avbryt</button>
      </Link>
    </form>
  );
}

export default LoginForm;
