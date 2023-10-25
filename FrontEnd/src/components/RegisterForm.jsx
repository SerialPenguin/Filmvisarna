import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../service/authService";

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
      setTimeout(() => navigate("/"), 1000);
      setRegisterMessage("Du har blivit medlem! Vänligen logga in");
    } else {
      setRegisterMessage(
        "Den angivna e-postadressen finns redan, vänligen logga in eller försök med en annan e-postadress"
      );
    }
  };

  return (
    <form>
      <label className="register-lbl">Förnamn</label>
      <input
        type="text"
        name="first-name"
        placeholder="John"
        className="register-field"
        onChange={(e) =>
          setCredentials({ ...credentials, firstName: e.target.value })
        }
      />

      <label className="register-lbl">Efternamn</label>
      <input
        type="text"
        name="last-name"
        placeholder="Andersson"
        className="register-field"
        onChange={(e) =>
          setCredentials({ ...credentials, lastName: e.target.value })
        }
      />

      <label className="register-lbl">E-postadress</label>
      <input
        type="email"
        name="mail"
        placeholder="namn@example.com"
        className="register-field"
        onChange={(e) =>
          setCredentials({ ...credentials, emailAdress: e.target.value })
        }
      />

      <label className="register-lbl">Lösenord</label>
      <input
        type="password"
        name="password"
        className="register-field"
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
      />

      {registerMessage && <p className="register-msg">{registerMessage}</p>}

      <p>
        Redan medlem? <Link to={"#"}>Klicka här</Link>
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

export default RegisterForm;
