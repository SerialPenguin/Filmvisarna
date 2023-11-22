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

    // Check if any of the required fields are empty
    if (
      !credentials.firstName ||
      !credentials.lastName ||
      !credentials.emailAdress ||
      !credentials.password
    ) {
      setRegisterMessage("Alla fält måste vara korrekt ifyllda");
      return;
    }

    // Email address validation using a regular expression
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(credentials.emailAdress)) {
      setRegisterMessage("Var god ange en giltig e-postadress");
      return;
    }

    // Password complexity checks
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[A-Z]).{8,}$/;

    if (!passwordRegex.test(credentials.password)) {
      setRegisterMessage(
        "Lösenordet måste innehålla minst 8 tecken, en bokstav, en siffra och en stor bokstav"
      );
      return;
    }
    
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
          Redan medlem? <Link to={"/logga-in"} className="register-p-link">Klicka här</Link>
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
