import "../FooterComponent/FooterComponent.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../service/authService";

const FooterComponent = () => {
  const [registerMessage, setRegisterMessage] = useState("");
  const navigate = useNavigate();
  const [confirmedPassword, setConfirmedPassword] = useState({
    password: "",
  });
  const [credentials, setCredentials] = useState({
    firstName: "",
    lastName: "",
    emailAdress: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !credentials.firstName ||
      !credentials.lastName ||
      !credentials.emailAdress ||
      !credentials.password ||
      !confirmedPassword.password
    ) {
      setRegisterMessage("Alla fält måste vara korrekt ifyllda");
    }

    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegEx.test(credentials.emailAdress)) {
      setRegisterMessage("Vad god ange en giltig e-postadress");
    }

    const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!passwordRegEx.test(credentials.password)) {
      setRegisterMessage(
        "Lösenordet måste innehålla minst 8 tecken, en bokstav, en siffra och en stor bokstav"
      );
    }

    if (confirmedPassword.password !== credentials.password) {
      setRegisterMessage(
        "De angivna lösenorden matchar inte, försök igen"
      );
    }

    const result = await authService.handleRegister(e, credentials);

    if (result === true) {
      setTimeout(() => navigate("/logga-in"), 1500);
      window.location.reload();
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
        <p className="footer-text">Som medlem får du exklusiva erbjudanden</p>
        <p className="footer-text-desktop">
          Fyll i formuläret för att bli medlem hos oss och få tillgång till dina
          exklusiva erbjudanden redan idag! Det tar bara några sekunder, och du
          kan vara lugn, vi kommer inte skicka några spam-mejl och dina
          användaruppgifter är säkra hos oss.
        </p>
      </div>
      <form action="" className="footer-form-style">
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
        <label>Lösenord</label>
        <input
          type="password"
          name="password"
          placeholder="Bekräfta lösenordet"
          className="footer-input"
          onChange={(e) =>
            setConfirmedPassword({
              ...confirmedPassword,
              password: e.target.value,
            })
          }
        />
        <p className="register-p">
          Redan medlem?{" "}
          <Link to={"/logga-in"} className="register-p-link">
            Klicka här
          </Link>
        </p>

        <button className="footer-btn" type="submit" onClick={handleSubmit}>
          Bli medlem
        </button>
      </form>
    </div>
  );
};

export default FooterComponent;
