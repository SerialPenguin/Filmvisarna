import '../FooterComponent/FooterComponent.css'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../service/authService";

const FooterComponent = () => {
  const [registerMessage, setRegisterMessage] = useState("");
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    emailAdress: "",
    password: "",
  });

  
  // const [registerMessage, setRegisterMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await authService.handleRegister(e, credentials);
    
    if (result === true) {
      setTimeout(() => navigate("/login"), 1500);
      console.log(result);
      setRegisterMessage("Du har blivit medlem!");
    } else {
      console.error();
      setRegisterMessage(
        "Den angivna e-postadressen finns redan, vänligen logga in eller försök med en annan e-postadress"
      );
    }
  };
  return (
    <div className="footer-container">
        <div className="footer-info-container">
      <h3 className="footer-title">VISSTE DU ATT</h3>
      <p className="footer-text">
        Som medlem får du exklusiva erbjudanden
      </p>
      <p className="footer-text-desktop">
      Fyll i formuläret för att bli medlem hos oss och få tillgång till dina exklusiva erbjudanden redan idag! Det tar bara några sekunder, och du kan vara lugn, vi kommer inte skicka några spam-mejl och dina användaruppgifter är säkra hos oss.
      </p>
      </div>
      <form
        action=""
        className="footer-form-style">
        <h3 style={{ textAlign: "center" }}>Bli Medlem</h3>
        {registerMessage && <p className="register-msg">{registerMessage}</p>}
        <label>Förnamn</label>
        <input
          type="text"
          name="first-name"
          placeholder="Fyll i förnamn"
          className="footer-input"
          onChange={(e) =>
            setCredentials({ ...credentials, firstName: e.target.value })
          }
        />
        <label>Efternamn</label>
        <input
          type="text"
          name="last-name"
          placeholder="Fyll i efternamn"
          className="footer-input"
          onChange={(e) =>
            setCredentials({ ...credentials, lastName: e.target.value })
          }
        />
        <label>E-postadress</label>
        <input
          type="email"
          name="mail"
          placeholder="Fyll i epost"
          className="footer-input"
          onChange={(e) =>
            setCredentials({ ...credentials, emailAdress: e.target.value })
          }
        />
        <label>Lösenord</label>
        <input
          type="password"
          name="password"
          placeholder="Välj ett bra lösenord"
          className="footer-input"
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <p className="register-p">
          Redan medlem? <Link to={"/login"} className="register-p-link">Klicka här</Link>
        </p>  

        <button className="footer-btn" type="submit" onClick={handleSubmit}>Bli medlem</button>
      </form>
    </div>
  );
};

export default FooterComponent;